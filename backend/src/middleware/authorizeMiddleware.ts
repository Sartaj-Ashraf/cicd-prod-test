import type { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "../types/authTypes.js";
import { getUserById } from "../modules/users/user.controller.js";
import User from "../models/user.model.js";

export const authorize = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as JwtPayload | undefined)?.userId;
    const user=await User.findById(userId).select("role");
    
    if(!user){
      return res.status(404).json({
        message:"User not found"
      })
    }

    if (!user.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    next();
  };
};