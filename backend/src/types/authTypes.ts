import type { SignOptions } from "jsonwebtoken";
import type { UserType } from "../models/user.model.js";

export type RegisterUser=Pick<UserType,"phoneNumber" | "email" | "name" | "role">;

export type LoginUser = {
  email: string;
  password: string;
  ip:string;
  userAgent:string
};
export type SuperAdmin = {
  email: string;
  password: string;
  ip:string;
  adminAgent:string
};

export type TokenCreationPayload={
    role: "user"|"manager"|"admin"|"super_admin",
    userId:string,
    provider?:"local"|"google",
    name?:string,
    phoneNumber?:string,
    email?:string,
    tokenSecret:string,
    expiry:SignOptions["expiresIn"]
}

export type JwtPayload={
  role:"user"|"manager"|"admin"|"super_admin",
  userId:string,
  provider:"local"|"google",
  phoneNumber?:string,
  email:string,
  name:string
}


export type ChangePassword={
   oldPassword:string,
   newPassword:string
}
