import type { Response } from "express"
import type { ServiceResponse } from "../types/serviceResponse.js"

export default function sendResponse<T=any>(res:Response,result:ServiceResponse<T>){
   if(result.token){
        res.cookie("accessToken",result.token,{
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15*60*1000,
        path:"/" // 15min
    })

   }

   if (result.refreshToken) {
        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path:"/" //7day
        });
   }

   if(result.clearCookie){
       res.clearCookie("accessToken", {
       httpOnly: true,
       secure: process.env.NODE_ENV === "production",
       sameSite: "lax",
       path:"/"
     });

      res.clearCookie("refreshToken", {
       httpOnly: true,
       secure: process.env.NODE_ENV === "production",
       sameSite: "lax",
       path:"/api/v1/auth/refresh"
     });
   }

   return res.status(result.statusCode).json({
      success:result.success,
      message:result.message,
      ...(result.data && {data:result.data}),
      ...(result.pagination && { pagination: result.pagination })
   })
}

