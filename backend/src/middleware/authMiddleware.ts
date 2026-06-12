import type { NextFunction,Request,Response } from "express";
import { decodeToken } from "../utils/jwt.js";
import type { JwtPayload } from "../types/authTypes.js";
import hashToken from "../utils/hashToken.js";
import Session from "../models/session.model.js";

export const accessTokenAuthMiddleware = (req:Request,res:Response,next:NextFunction)=>{
   const token=req.cookies.accessToken;

   if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthenticated",
      code:process.env.CODE
    });
  }

   const decoded=decodeToken(token,process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;

   if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid token or expired token",
        code:process.env.CODE
      });
    }
   
   req.user=decoded;
   next();
}

export const refreshTokenAuthMiddleware = async (req:Request,res:Response,next:NextFunction)=>{

    const refreshToken=req.cookies.refreshToken

    if (!refreshToken) {
            return res.status(400).json({
                success:false,
                message:"Not Authenticated"
            })
        }

        const decoded=decodeToken(refreshToken,process.env.REFRESH_TOKEN_SECRET!) as JwtPayload;
        if(!decoded){
            return res.status(401).json({
                success:false,
                message:"Invalid token",
            });
        }
       const hashedToken=hashToken(refreshToken);

       const session=await Session.findOne({
         refreshToken:hashedToken,
         isActive:true,
         expiresAt:{
            $gte:new Date()
         }
       });
         if(!session){
            return res.status(401).json({
                success:false,
                message:"Invalid Session"
            })
         }
        
        req.user=decoded;
        req.session=session
        next();
}
