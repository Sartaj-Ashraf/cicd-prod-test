import type { Request, Response, NextFunction } from "express";
import UserSubscription from "../models/userSubscription.model.js";
import User             from "../models/user.model.js";
import type { JwtPayload } from "../types/authTypes.js";

const getActiveSubscriptionAndCycle = async (userId: string) => {
  const user = await User.findById(userId).select("activeSubscription");
  if (!user?.activeSubscription) return null;

  const now = new Date();

  // check expiry before anything else
  const expiredSubs = await UserSubscription.find({
    user:    userId,
    status:  "active",
    endDate: { $lte: now },
  }).select("_id");

  if (expiredSubs.length > 0) {
    const expiredIds = expiredSubs.map(s => s._id);

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

    if (expiredIds.map(id => id.toString()).includes(user.activeSubscription.toString())) {
      return null;
    }
  }

  const subscription = await UserSubscription.findOne({
    _id:    user.activeSubscription,
    user:   userId,
    status: "active",
  });
  if (!subscription) return null;

  const currentCycle = subscription.cycles.find(
    (c) => c.startDate <= now && c.endDate > now
  );
  if (!currentCycle) return null;

  return { subscription, currentCycle };
};

export const checkAnalysisLimit = async (req: Request, res: Response, next: NextFunction) => {
  const result = await getActiveSubscriptionAndCycle((req.user as JwtPayload).userId);
  if (!result) {
    return res.status(403).json({ success: false, message: "No active subscription found" });
  }

  const { subscription, currentCycle } = result;

  if (!currentCycle.analyses) {
    return res.status(403).json({ success: false, message: "No active subscription found" });
  }

  const { creditsTotal, creditsUsed } = currentCycle.analyses;

  if (creditsTotal != null && creditsUsed >= creditsTotal) {
    return res.status(403).json({
      success: false,
      message: `Monthly analysis limit of ${creditsTotal} reached.`,
    });
  }

  req.subscription = subscription;
  next();
};

export const checkAiReplyLimit = async (req: Request, res: Response, next: NextFunction) => {
  const result = await getActiveSubscriptionAndCycle((req.user as JwtPayload).userId);
  if (!result) {
    return res.status(403).json({ success: false, message: "No active subscription found" });
  }

  const { subscription, currentCycle } = result;

  if (!currentCycle.aiReplies) {
    return res.status(403).json({ success: false, message: "No active subscription found" });
  }

  const { creditsTotal, creditsUsed } = currentCycle.aiReplies;

  if (creditsTotal != null && creditsUsed >= creditsTotal) {
    return res.status(403).json({
      success: false,
      message: `Monthly AI reply limit of ${creditsTotal} reached.`,
    });
  }

  req.subscription = subscription;
  next();
};


export const checkScanLimit = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user
    ? (req.user as JwtPayload).userId
    : (req.body.createdBy ?? req.query.createdBy) as string;

  if (!userId) {
    return res.status(400).json({ success: false, message: "createdBy is required" });
  }

  const result = await getActiveSubscriptionAndCycle(userId);

  if (!result) {
    req.hasActiveScan = false;
    return next();
  }

  const { subscription, currentCycle } = result;

  if (!currentCycle.totalScans) {
    req.hasActiveScan = false;
    return next();
  }

  const { creditsTotal, creditsUsed } = currentCycle.totalScans;

  if (creditsTotal != null && creditsUsed >= creditsTotal) {
    req.hasActiveScan = false;
    return next();
  }

  req.hasActiveScan  = true;
  req.subscription   = subscription;
  next();
};