import User from "../../models/user.model.js"
import ManagerInvite from "../../models/managerInvite.model.js"
import LocationAccess from "../../models/locationAccess.model.js"
import type { RegisterUser, LoginUser, JwtPayload, ChangePassword, SuperAdmin } from "../../types/authTypes.js"
import {
  sendVerificationEmail,
  sendResetPasswordEmail
} from "../../utils/nodemailer.js"
import generateVerificatonToken from "../../utils/verificationToken.js"
import hashToken from "../../utils/hashToken.js"
import * as bcrypt from "bcrypt"
import { createToken } from "../../utils/jwt.js"
import { REFRESH_TOKEN_EXPIRES, ACCESS_TOKEN_EXPIRES, VERIFICATION_TOKEN_EXPIRES_MS, REFRESH_TOKEN_EXPIRES_MS } from "../../utils/constant/authConstant.js"
import Session from "../../models/session.model.js"
import parseDevice from "../../utils/parseDevice.js"


export const registerService = async ({ email, phoneNumber, name }: RegisterUser) => {
  const user = await User.findOne({ email });

  if (!phoneNumber) {
    return { success: false, message: "phoneNumber is required", statusCode: 400 }
  }

  if (user && !user.isVerified) {

    if (
        
        user.verificationTokenExpiry &&
        user.verificationTokenExpiry > new Date()
      ) {
        return {
          success: false,
          statusCode: 429,
          message: "Verification already sent. Check your email.",
        };
      }
    const { rawToken, hashedToken } = generateVerificatonToken();
    user.verificationToken = hashedToken;
    user.verificationTokenExpiry = new Date(
      Date.now() + VERIFICATION_TOKEN_EXPIRES_MS
    );
    await user.save();

    const verifyUrl = `${process.env.FRONTEND_DEV_URL}/auth/set-password?token=${rawToken}`

    await sendVerificationEmail(email, verifyUrl)
    return { success: true, message: "User not verified,verification email has been sent", statusCode: 200 }
  }
  if (user?.isVerified) {
    const providerMessages: Record<string, string> = {
      google: "User already exists. Please login with Google.",
      local: "User already exists. Please login with email and password.",
    };

    return {
      success: false,
      message: providerMessages[user.provider] || "User already exists. Please login.",
      statusCode: 409,
    };
  }


  const { rawToken, hashedToken } = generateVerificatonToken();

  await User.create({
    email,
    phoneNumber,
    name,
    role: "user",
    verificationToken: hashedToken,
    verificationTokenExpiry: new Date(
      Date.now() + VERIFICATION_TOKEN_EXPIRES_MS
    ),
    isVerified: false
  });


  const verifyUrl = `${process.env.FRONTEND_DEV_URL}/auth/set-password?token=${rawToken}`

  await sendVerificationEmail(email, verifyUrl)

  return { success: true, message: "verification email has been sent", statusCode: 201 }
}

export const setPasswordService = async ({ userAgent, ip, password, token }: { userAgent: string, ip: string, password: string, token: string }) => {
  if (!password || password.length < 6) {
    return { success: false, statusCode: 400, message: "Password must be at least 6 characters" };
  }

  const hashedToken = hashToken(token);

  const user = await User.findOne({
    verificationToken: hashedToken,
    verificationTokenExpiry: { $gte: new Date() },
  });

 if (!user || user.isDeleted) {
  return {
    success: false,
    statusCode: 400,
    message: "Invalid or expired token",
  };
}
  user.password = await bcrypt.hash(password, 10);
  user.isVerified = true;
  user.verificationToken = null;
  user.verificationTokenExpiry = null;
  user.provider = "local";

  await user.save();

  const accessToken = createToken({
    userId: user._id.toString(),
    role: user.role,
    provider: user.provider,
    name: user.name,
    email: user.email,
    ...(user.phoneNumber && { phoneNumber: user.phoneNumber }),
    tokenSecret: process.env.ACCESS_TOKEN_SECRET!,
    expiry: ACCESS_TOKEN_EXPIRES,
  });

  const refreshToken = createToken({
    userId: user._id.toString(),
    role: user.role,
    tokenSecret: process.env.REFRESH_TOKEN_SECRET!,
    expiry: REFRESH_TOKEN_EXPIRES,
  });


  //Save the refershToken and it's expiry in the Session model along with the device ip and name
  const hashedRefreshToken = hashToken(refreshToken)

  //use UAParser to make the the user-agent human-readable
  const parsedDevice = parseDevice(userAgent);

  await Session.create({
    userId: user._id,
    refreshToken: hashedRefreshToken,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS),
    device: parsedDevice,
    ip,
    isActive: true,
  })

  // check if this was a manager invite → create location access 
  const invite = await ManagerInvite.findOne({
    token: hashedToken,
    status: "pending",
  });

  if (invite) {
    await LocationAccess.create({
      userId: user._id,
      locationId: invite.locationId,
      role: "manager",
      addedBy: invite.invitedBy,
    });

    await ManagerInvite.findByIdAndUpdate(invite._id, {
      $set: { status: "accepted" },
    });
  }

  return {
    success: true,
    message: "Password set successfully",
    statusCode: 200,
    token: accessToken,
    refreshToken,
    data: {
      name: user.name,
      userId: user._id.toString(),
      phoneNumber: user.phoneNumber,
      email: user.email,
      role: user.role,
    },
  };
};


export const loginService = async ({ userAgent, ip, email, password }: LoginUser) => {
  const user = await User.findOne({ email }).select("+password");

  // Prevent user enumeration
  if (!user) {
    return { success: false, statusCode: 401, message: "Invalid email or password" };
  }

  // Role restriction
if (user.role === "super_admin") {
  return {
    success: false,
    statusCode: 403,
    message: "Operation not allowed For super admin"
  };
}

if (user.isDeleted) {
  return {
    success: false,
    statusCode: 400,
    message: "User account is deactivated. Please contact support!",
  };
}

  // Verification check (before anything expensive)
  if (!user.isVerified) {
    // Prevent spam
    if (user.verificationTokenExpiry && user.verificationTokenExpiry > new Date()) {
      return {
        success: false,
        statusCode: 429,
        message: "Verification already sent. Check your email.",
      };
    }

    const { rawToken, hashedToken } = generateVerificatonToken();

    user.verificationToken = hashedToken;
    user.verificationTokenExpiry = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRES_MS);
    await user.save();

    const verifyUrl = `${process.env.FRONTEND_DEV_URL}/auth/set-password?token=${rawToken}`;
    await sendVerificationEmail(email, verifyUrl);

    return {
      success: false,
      statusCode: 403,
      message: "Account not verified. Verification email sent.",
    };
  }

  // 🔑 Provider check (scalable)
  if (user.provider !== "local") {
    return {
      success: false,
      statusCode: 400,
      message: `Use ${user.provider} login`,
    };
  }

  // 🔐 Password check (expensive → last)
  const isPasswordValid = await bcrypt.compare(password, user.password as string);

  if (!isPasswordValid) {
    return { success: false, statusCode: 401, message: "Invalid email or password" };
  }

  // ✅ Tokens
  const accessToken = createToken({
    userId: user._id.toString(),
    role: user.role,
    provider: user.provider,
    name: user.name,
    email: user.email,
    ...(user.phoneNumber && { phoneNumber: user.phoneNumber }),
    tokenSecret: process.env.ACCESS_TOKEN_SECRET!,
    expiry: ACCESS_TOKEN_EXPIRES,
  });

  const refreshToken = createToken({
    userId: user._id.toString(),
    role: user.role,
    tokenSecret: process.env.REFRESH_TOKEN_SECRET!,
    expiry: REFRESH_TOKEN_EXPIRES,
  });

  const hashedRefreshToken = hashToken(refreshToken);
  const parsedDevice = parseDevice(userAgent);


  // await Session.deleteMany({ userId: user._id, device: parsedDevice });

  await Session.create({
    userId: user._id,
    refreshToken: hashedRefreshToken,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS),
    device: parsedDevice,
    ip,
    isActive: true,
  });

  return {
    success: true,
    statusCode: 200,
    message: "User logged in successfully",
    token: accessToken,
    refreshToken,
    data: {
      userId: user._id.toString(),
      role: user.role,
      provider: user.provider,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    },
  };
};
export const superAdminLoginService = async ({
  adminAgent,
  ip,
  email,
  password,
}: SuperAdmin) => {

  const user = await User.findOne({ email }).select("+password");

  // 🔒 Generic failure
  if (!user || user.role !== "super_admin") {
    return {
      success: false,
      statusCode: 401,
      message: "Invalid email or password",
    };
  }

  // 📧 Verification (only AFTER role confirmed)
  if (!user.isVerified) {
    if (user.verificationTokenExpiry && user.verificationTokenExpiry > new Date()) {
      return {
        success: false,
        statusCode: 429,
        message: "Verification already sent. Check your email.",
      };
    }

    const { rawToken, hashedToken } = generateVerificatonToken();

    user.verificationToken = hashedToken;
    user.verificationTokenExpiry = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRES_MS);
    await user.save();

    const verifyUrl = `${process.env.FRONTEND_DEV_URL}/auth/set-password?token=${rawToken}`;
    await sendVerificationEmail(email, verifyUrl);

    return {
      success: false,
      statusCode: 403,
      message: "Account not verified. Verification email sent.",
    };
  }

  // 🔑 Provider consistency
  if (user.provider !== "local") {
    return {
      success: false,
      statusCode: 400,
      message: `Use ${user.provider} login`,
    };
  }

  // 🔐 Password check
  const isPasswordValid = await bcrypt.compare(password, user.password as string);

  if (!isPasswordValid) {
    return {
      success: false,
      statusCode: 401,
      message: "Invalid email or password",
    };
  }

  // ✅ Tokens
  const accessToken = createToken({ 
    userId: user._id.toString(),
    role: user.role,
    provider: user.provider,
    name: user.name,
    email: user.email,
    ...(user.phoneNumber && {
      phoneNumber: user.phoneNumber
    }),
    tokenSecret: process.env.ACCESS_TOKEN_SECRET!,
    expiry: ACCESS_TOKEN_EXPIRES
  });
  const refreshToken = createToken({ 
    userId: user._id.toString(),
    role: user.role,
    tokenSecret: process.env.REFRESH_TOKEN_SECRET!,
    expiry: REFRESH_TOKEN_EXPIRES
  });

  const hashedRefreshToken = hashToken(refreshToken);
  const parsedDevice = parseDevice(adminAgent);

  // ⚠️ Restrict sessions (important for admins)
  // await Session.deleteMany({ userId: user._id });

  await Session.create({
    userId: user._id,
    refreshToken: hashedRefreshToken,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS),
    device: parsedDevice,
    ip,
    isActive: true,
  });

  return {
    success: true,
    statusCode: 200,
    message: "Login successful",
    token: accessToken,
    refreshToken,
    data: {
      userId: user._id.toString(),
      role: user.role,
      provider: user.provider,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    },
  };
};
export const refreshTokenService = async (
  {
    session,
    ip,
    userAgent
  }: {
    ip: string,
    userAgent: string,
    session: any
  }
) => {
  const dbUser = await User.findById(session.userId);

 if (!dbUser || dbUser.isDeleted) {
  return {
    success: false,
    message: "User not found or deactivated",
    statusCode: 403
  };
}

  const newAccessToken = createToken({
    userId: dbUser._id.toString(),
    role: dbUser.role,
    provider: dbUser.provider,
    name: dbUser.name,
    email: dbUser.email,
    ...(dbUser.phoneNumber && {
      phoneNumber: dbUser.phoneNumber
    }),
    tokenSecret: process.env.ACCESS_TOKEN_SECRET!,
    expiry: ACCESS_TOKEN_EXPIRES
  });

  const newRefreshToken = createToken({
    userId: dbUser._id.toString(),
    role: dbUser.role,
    tokenSecret: process.env.REFRESH_TOKEN_SECRET!,
    expiry: REFRESH_TOKEN_EXPIRES
  });


  //rotate using SAME session document
  const parsedDevice = parseDevice(userAgent);
  const hashedToken = hashToken(newRefreshToken);
  session.refreshToken = hashedToken
  session.ip = ip;
  session.userAgent = parsedDevice;
  session.expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS);

  await session.save();

  return {
    success: true,
    message: "Token refreshed",
    statusCode: 200,
    token: newAccessToken,
    refreshToken: newRefreshToken
  };
};


export const logoutService = async (token: string) => {
  const hashedToken = hashToken(token)
  await Session.findOneAndUpdate({
    refreshToken: hashedToken
  }, {
    isActive: false
  })

  return {
    success: true,
    message: "Logged out Successfully",
    clearCookie: true,
    statusCode: 200
  }
}

export const changePasswordService = async ({ userId, oldPassword, newPassword, session }: { userId: string, oldPassword: string, newPassword: string, session: any }) => {
  const user = await User.findById(userId).select("+password")
  if (!user) {
    return { success: false, statusCode: 403, message: "user not found" }
  }
 
  const isPassword = await bcrypt.compare(oldPassword, user.password as string);

  if (!isPassword) {
    return { success: false, statusCode: 401, message: "Invalid current password" }
  }


  user.password = await bcrypt.hash(newPassword, 10);

  await user.save();

  session.isActive = false;
  await session.save();

  return { success: true, statusCode: 200, message: "Password Changed Successfully", clearCookie: true }
}


export const forgetPasswordService = async ({ email }: { email: string }) => {
  if (!email) {
    return { success: false, statusCode: 400, message: "Email is required" }
  }

  const user = await User.findOne({ email });

  if (user) {


     if (user.verificationTokenExpiry && user.verificationTokenExpiry > new Date()) {
      return {
        success: false,
        statusCode: 429,
        message: "Verification already sent. Check your email.",
      };
    }
      if (
     
      user.verificationTokenExpiry &&
      user.verificationTokenExpiry > new Date()
    ) {
      return {
        success: false,
        statusCode: 429,
        message: "Reset link already sent. Please check your email."
      };
    }

    
    const { rawToken, hashedToken } = generateVerificatonToken();

    user.verificationToken = hashedToken;
    user.verificationTokenExpiry = new Date(
      Date.now() + VERIFICATION_TOKEN_EXPIRES_MS
    );

    await user.save();

    const verifyUrl = `${process.env.FRONTEND_DEV_URL}/auth/set-password?token=${rawToken}`;

    await sendResetPasswordEmail(email, verifyUrl);
  }

  // 🔒 SAME response always
  return {
    success: true,
    message: "If an account with this email exists, a reset link has been sent.",
    statusCode: 200
  };
};


//Google callback

export const googleCallbackService = async ({ userId, role, name, email, provider, userAgent, ip }: JwtPayload & { userAgent: string, ip: string }) => {

    const accessToken = createToken(
        {
            userId,
            role,
            provider,
            name,
            email,
            tokenSecret: process.env.ACCESS_TOKEN_SECRET!,
            expiry: ACCESS_TOKEN_EXPIRES
        })

    const refreshToken = createToken({ userId, role, tokenSecret: process.env.REFRESH_TOKEN_SECRET!, expiry: REFRESH_TOKEN_EXPIRES })
    
    const hashedRefreshToken = hashToken(refreshToken);
    const parsedDevice=parseDevice(userAgent);

    await Session.create({
       userId,
       refreshToken: hashedRefreshToken,
       expiresAt:new Date(Date.now()+REFRESH_TOKEN_EXPIRES_MS),
       isActive:true,
       device:parsedDevice,
       ip
    })


  return {
    success: true,
    statusCode: 200,
    token: accessToken,
    refreshToken,
  };
}