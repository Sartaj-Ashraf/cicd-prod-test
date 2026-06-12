import jwt from "jsonwebtoken"
import type { TokenCreationPayload } from "../types/authTypes.js";

export const createToken=({role,userId,name,email,phoneNumber,provider,tokenSecret,expiry}:TokenCreationPayload)=>{
    return jwt.sign({
        role,userId,name,email,...(phoneNumber && {phoneNumber}),provider
    },tokenSecret as string,{expiresIn:expiry!})
}

export const decodeToken=(token:string,tokenSecret:string)=>{
    try{
      return jwt.verify(token, tokenSecret);
    }
    catch(err){
        return null
    }
}
