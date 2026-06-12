import type { Request, Response, NextFunction } from "express";
import UserSubscription from "../models/userSubscription.model.js";
import User             from "../models/user.model.js";
import type { JwtPayload } from "../types/authTypes.js";

export const checkSubscriptionExpiry = async (
  req:  Request,
  res:  Response,
  next: NextFunction
) => {
  const userId = (req.user as JwtPayload).userId;
  if (!userId) return next();

  const now = new Date();

  const expired = await UserSubscription.find({
    user:    userId,
    status:  "active",
    endDate: { $lte: now },
  }).select("_id");

  if (expired.length > 0) {
    const expiredIds = expired.map(s => s._id);

    await UserSubscription.updateMany(
      { _id: { $in: expiredIds } },
      { $set: { status: "expired" } }
    );

    const nextActiveSub = await UserSubscription.findOne({
      user:   userId,
      status: "active",
    }).sort({ "snapshot.tier": -1 });

    await User.findByIdAndUpdate(userId, {
      $set: { activeSubscription: nextActiveSub?._id ?? null },
    });
  }

  next();
};