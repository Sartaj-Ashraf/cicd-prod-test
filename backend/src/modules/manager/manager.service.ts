import User            from "../../models/user.model.js";
import LocationAccess  from "../../models/locationAccess.model.js";
import Location        from "../../models/location.model.js";
import ManagerInvite   from "../../models/managerInvite.model.js";
import generateVerificationToken from "../../utils/verificationToken.js";
import hashToken                 from "../../utils/hashToken.js";
import {
  sendManagerInviteEmail,
  sendExistingUserInviteEmail,
} from "../../utils/nodemailer.js";
import { VERIFICATION_TOKEN_EXPIRES_MS } from "../../utils/constant/authConstant.js";
import type { ServiceResponse } from "../../types/serviceResponse.js";


export const inviteManagerService = async (
  adminId:    string,
  email:      string,
  name:       string,
  locationId: string
): Promise<ServiceResponse> => {

  const location = await Location.findOne({
    _id:       locationId,
    createdBy: adminId,
    isDeleted: false,
  });
  if (!location) {
    return { success: false, statusCode: 404, message: "Location not found" };
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    // block if already has access to this location
    const existingAccess = await LocationAccess.findOne({
      userId:    existingUser._id,
      locationId,
      isDeleted: false,
    });
    if (existingAccess) {
      return { success: false, statusCode: 409, message: "User already has access to this location" };
    }

    // block if admin or super_admin
    if (existingUser.role === "admin" || existingUser.role === "super_admin") {
      return { success: false, statusCode: 400, message: "This user is an admin and cannot be added as a manager" };
    }

    if (existingUser.isVerified && existingUser.role === "manager") {
      await LocationAccess.create({
        userId:     existingUser._id,
        locationId,
        role:       "manager",
        addedBy:    adminId,
      });
      return {
        success:    true,
        statusCode: 201,
        message:    "Manager added to location successfully",
      };
    }
  }

  // block if pending invite already exists
  const existingInvite = await ManagerInvite.findOne({
    invitedEmail: email,
    locationId,
    status:       "pending",
  });
  if (existingInvite) {
    return { success: false, statusCode: 409, message: "Invite already sent to this email for this location" };
  }

  const { rawToken, hashedToken } = generateVerificationToken();
  const tokenExpiry               = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRES_MS);

  await ManagerInvite.create({
    invitedBy:     adminId,
    invitedEmail:  email,
    locationId,
    invitedUserId: existingUser?._id ?? null,
    token:         hashedToken,
    tokenExpiry,
    status:        "pending",
  });

  if (existingUser && existingUser.isVerified) {
    // verified existing user (role: user) → send accept link
    const acceptUrl = `${process.env.FRONTEND_DEV_URL}/auth/manager/accept?token=${rawToken}`;
    await sendExistingUserInviteEmail(email, location.name, acceptUrl);

  } else if (existingUser && !existingUser.isVerified) {
    // unverified existing user → resend set-password link
    const verifyUrl = `${process.env.FRONTEND_DEV_URL}/auth/set-password?token=${rawToken}`;
    await User.findByIdAndUpdate(existingUser._id, {
      $set: {
        verificationToken:       hashedToken,
        verificationTokenExpiry: tokenExpiry,
      },
    });
    await sendManagerInviteEmail(email, location.name, verifyUrl);

  } else {
    // new user → create account + set-password link
    const verifyUrl = `${process.env.FRONTEND_DEV_URL}/auth/set-password?token=${rawToken}`;
    await User.create({
      email,
      name,
      role:                    "manager",
      isVerified:              false,
      verificationToken:       hashedToken,
      verificationTokenExpiry: tokenExpiry,
    });
    await sendManagerInviteEmail(email, location.name, verifyUrl);
  }

  return {
    success:    true,
    statusCode: 201,
    message:    "Invite sent successfully",
  };
};


export const acceptInviteService = async (token: string): Promise<ServiceResponse> => {
  const hashedToken = hashToken(token);

  const invite = await ManagerInvite.findOne({
    token:       hashedToken,
    status:      "pending",
    tokenExpiry: { $gte: new Date() },
  });
  if (!invite) {
    return { success: false, statusCode: 400, message: "Invalid or expired invitation link" };
  }

  const user = await User.findOne({ email: invite.invitedEmail });
  if (!user) {
    return { success: false, statusCode: 404, message: "User not found" };
  }

  if (!user.isVerified) {
    return { success: false, statusCode: 400, message: "Please set your password first before accepting the invite" };
  }

  if (user.role === "user") {
    await User.findByIdAndUpdate(user._id, { $set: { role: "manager" } });
  }

  await LocationAccess.create({
    userId:     user._id,
    locationId: invite.locationId,
    role:       "manager",
    addedBy:    invite.invitedBy,
  });

  await ManagerInvite.findByIdAndUpdate(invite._id, {
    $set: { status: "accepted" },
  });

  return {
    success:    true,
    statusCode: 200,
    message:    "Invite accepted successfully",
  };
};


export const resendInviteService = async (
  adminId:  string,
  inviteId: string
): Promise<ServiceResponse> => {

  const invite = await ManagerInvite.findOne({
    _id:       inviteId,
    invitedBy: adminId,
    status:    "pending",
  }).populate("locationId");
  if (!invite) {
    return { success: false, statusCode: 404, message: "Invite not found" };
  }

  const { rawToken, hashedToken } = generateVerificationToken();
  const tokenExpiry               = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRES_MS);
  const location                  = invite.locationId as any;

  // update invite token
  await ManagerInvite.findByIdAndUpdate(invite._id, {
    $set: { token: hashedToken, tokenExpiry },
  });

  const existingUser = await User.findOne({ email: invite.invitedEmail });

  if (existingUser?.isVerified) {
    // verified user → accept link
    const acceptUrl = `${process.env.FRONTEND_DEV_URL}/auth/manager/accept?token=${rawToken}`;
    await sendExistingUserInviteEmail(invite.invitedEmail, location.name, acceptUrl);
  } else {
    // unverified/new user → set-password link
    const verifyUrl = `${process.env.FRONTEND_DEV_URL}/auth/set-password?token=${rawToken}`;
    await User.findOneAndUpdate(
      { email: invite.invitedEmail, isVerified: false },
      { $set: { verificationToken: hashedToken, verificationTokenExpiry: tokenExpiry } }
    );
    await sendManagerInviteEmail(invite.invitedEmail, location.name, verifyUrl);
  }

  return { success: true, statusCode: 200, message: "Invite resent successfully" };
};


export const getManagersForLocationService = async (
  adminId:    string,
  locationId: string
): Promise<ServiceResponse> => {

  const location = await Location.findOne({
    _id:       locationId,
    createdBy: adminId,
    isDeleted: false,
  });
  if (!location) {
    return { success: false, statusCode: 404, message: "Location not found" };
  }

  const managers = await LocationAccess.find({
    locationId,
    role:      "manager",
    isDeleted: false,
  }).populate("userId", "name email phoneNumber isVerified");

  const pendingInvites = await ManagerInvite.find({
    locationId,
    invitedBy: adminId,
    status:    "pending",
  });

  return {
    success:    true,
    statusCode: 200,
    message:    "Managers fetched",
    data: {
      managers,
      pendingInvites,
    },
  };
};


export const deleteManagerService = async (
  adminId:  string,
  accessId: string
): Promise<ServiceResponse> => {

  const access = await LocationAccess.findOne({
    _id:       accessId,
    addedBy:   adminId,
    role:      "manager",
    isDeleted: false,
  });
  if (!access) {
    return { success: false, statusCode: 404, message: "Manager not found" };
  }

  await LocationAccess.findByIdAndUpdate(accessId, {
    $set: { isDeleted: true, deletedAt: new Date() },
  });

  return { success: true, statusCode: 200, message: "Manager removed successfully" };
};