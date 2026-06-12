import type { Request, Response } from "express";
import { superAdminLoginService,registerService,loginService, setPasswordService,logoutService, refreshTokenService, changePasswordService, forgetPasswordService, googleCallbackService } from "./auth.services.js";
import sendResponse from "../../utils/response.js";
import type { JwtPayload } from "../../types/authTypes.js";
import Session from "../../models/session.model.js";
import hashToken from "../../utils/hashToken.js";
import User from "../../models/user.model.js";
export const register = async (req: Request, res: Response) => {
  const result = await registerService(req.body);
  
     return sendResponse(res,result)

};

export const setPassword=async(req:Request,res:Response)=>{
   const result = await setPasswordService({userAgent:req.headers["user-agent"]! as string,ip:req.ip!,password:req.body.password,token:req.params.token as string});

   return sendResponse(res,result)
  }



export const login = async (req:Request,res:Response)=>{
    const result = await loginService({
    email: req.body.email,
    password: req.body.password,
    userAgent: req.headers["user-agent"] as string,
    ip: req.ip!,
  });


   return sendResponse(res,result)
}
  export const adminlogin = async (req:Request,res:Response)=>{
   const result =await superAdminLoginService({
      email:req.body.email,
      password:req.body.password,
      adminAgent:req.headers["admin-agent"] as string,
      ip:req.ip!,
   })
   
   return sendResponse(res,result)
}

export const logout = async (req:Request,res:Response)=>{
   const result= await logoutService(req.cookies.refreshToken)
   return sendResponse(res,result)
}

export const refreshToken= async (req:Request,res:Response)=>{
      const result= await refreshTokenService({ip:req.ip!,userAgent:req.headers["user-agent"]!,session:req.session})
      return sendResponse(res,result);
}

export const changePassword = async (req:Request,res:Response)=>{
    const refreshToken=req.cookies.refreshToken;
    const session=await Session.findOne({refreshToken:hashToken(refreshToken)})

    if (!session) {
        return { success: false, statusCode: 403, message: "session not found" }
      }
      
    const result=await changePasswordService({userId:req.user?.userId!,oldPassword:req.body.oldPassword,newPassword:req.body.newPassword,session})

    return sendResponse(res,result)
}

export const forgetPassword= async (req:Request,res:Response)=>{
    const result=await forgetPasswordService(req.body)
    return sendResponse(res,result)
}

export const googleCallback = async (req: Request, res: Response) => {
      if (!req.user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login`);
   }
   const user=req.user as JwtPayload

   const result = await googleCallbackService({
    userId:user.userId,
    role: user.role,
    name: user.name,
    email:user.email,
    provider:user.provider,
    userAgent: req.headers["user-agent"]! as string,
    ip: req.ip!,
  });

   if (!result.success) {
      return res.redirect(`${process.env.FRONTEND_URL}/login`);
   }

   // set cookies
   res.cookie("accessToken", result.token, {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
      maxAge: 15*60* 1000,
      path:"/"
   });

   res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path:"/"
   });

   // redirect 
   return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
};

export const me = async (req:Request,res:Response)=>{
 
   const userId =  (req.user as JwtPayload).userId;
   const user = await User.findById(userId);
   if(!user){
    return res.status(404).json({ message: "User not found" });
   }

    res.json({ user:{
      _id:user._id,
      name:user.name,
      email:user.email,
      role:user.role,
      phoneNumber:user.phoneNumber,
      provider:user.provider,
      createdAt:user.createdAt,
      updatedAt:user.updatedAt,
      badReviewRedirectEnabled:user.badReviewRedirectEnabled,
      hasEverSubscribed:user.hasEverSubscribed,
      activeSubscription:user.activeSubscription,

    } });
}
