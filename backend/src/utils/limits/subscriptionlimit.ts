

import User             from "../../models/user.model.js";
import UserSubscription from "../../models/userSubscription.model.js";

export type ScanCheckResult =
  | { allowed: true;  subscription: any; cycleIndex: number }
  | { allowed: false; reason: "no_subscription" | "limit_reached" };

  export type AiReviewCheckResult =
  | { allowed: true;  subscription: any }
  | { allowed: false; reason: "no_subscription" | "limit_reached" | "unlimited" };



export const checkScanLimit = async (createdBy: string): Promise<ScanCheckResult> => {
  const now = new Date();

  const user = await User.findById(createdBy).select("activeSubscription");
  if (!user) return { allowed: false, reason: "no_subscription" };

  let subscription = null;

  if (user.activeSubscription) {
    subscription = await UserSubscription.findOne({
      _id:     user.activeSubscription,
      user:    createdBy,
      status:  "active",
      endDate: { $gt: now },
    });
  }

  if (!subscription) {
    subscription = await UserSubscription.findOne({
      user:    createdBy,
      status:  "active",
      endDate: { $gt: now },
    });
  }

  if (!subscription) return { allowed: false, reason: "no_subscription" };

  const cycleIndex = subscription.cycles.findIndex(
    (c: any) => c.startDate <= now && c.endDate > now
  );

  if (cycleIndex === -1) return { allowed: false, reason: "no_subscription" };

  const cycle = subscription.cycles[cycleIndex];
  const { creditsTotal, creditsUsed } = cycle?.totalScans ?? {};

  if (creditsTotal === null || creditsTotal === undefined) {
    return { allowed: true, subscription, cycleIndex };
  }

  if ((creditsUsed ?? 0) >= creditsTotal) {
    return { allowed: false, reason: "limit_reached" };
  }

  return { allowed: true, subscription, cycleIndex };
};


export const decrementScan = async (subscriptionId: string) => {
  const now = new Date();
  await UserSubscription.findOneAndUpdate(
    {
      _id:    subscriptionId,
      cycles: {
        $elemMatch: {
          startDate: { $lte: now },
          endDate:   { $gt:  now },
        },
      },
    },
    { $inc: { "cycles.$.totalScans.creditsUsed": 1 } }
  );
};


export const checkAiReviewLimit = async (createdBy: string): Promise<AiReviewCheckResult> => {
  const now = new Date();

  const user = await User.findById(createdBy).select("activeSubscription");
  if (!user) return { allowed: false, reason: "no_subscription" };

  let subscription = null;

  if (user.activeSubscription) {
    subscription = await UserSubscription.findOne({
      _id:     user.activeSubscription,
      user:    createdBy,
      status:  "active",
      endDate: { $gt: now },
    });
  }

  if (!subscription) {
    subscription = await UserSubscription.findOne({
      user:    createdBy,
      status:  "active",
      endDate: { $gt: now },
    });
  }

  if (!subscription) return { allowed: false, reason: "no_subscription" };

  const cycleIndex = subscription.cycles.findIndex(
    (c: any) => c.startDate <= now && c.endDate > now
  );

  if (cycleIndex === -1) return { allowed: false, reason: "no_subscription" };

  const cycle = subscription.cycles[cycleIndex];
  const { creditsTotal, creditsUsed } = cycle?.aiReviews ?? {};

  if (creditsTotal === null || creditsTotal === undefined) {
    return { allowed: false, reason: "unlimited" };
  }

  if ((creditsUsed ?? 0) >= creditsTotal) {
    return { allowed: false, reason: "limit_reached" };
  }

  return { allowed: true, subscription };
};

export const decrementAiReview = async (subscriptionId: string) => {
  const now = new Date();
  await UserSubscription.findOneAndUpdate(
    {
      _id:    subscriptionId,
      cycles: {
        $elemMatch: {
          startDate: { $lte: now },
          endDate:   { $gt:  now },
        },
      },
    },
    { $inc: { "cycles.$.aiReviews.creditsUsed": 1 } }
  );
};