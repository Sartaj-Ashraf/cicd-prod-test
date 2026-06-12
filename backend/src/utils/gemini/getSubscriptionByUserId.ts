import UserSubscription from "../../models/userSubscription.model.js";
import User             from "../../models/user.model.js";

export const getActiveSubscriptionAndCycleByUserId = async (userId: string) => {
  const user = await User.findById(userId).select("activeSubscription");
  if (!user?.activeSubscription) return null;

  const now = new Date();

  const subscription = await UserSubscription.findOne({
    _id:     user.activeSubscription,
    user:    userId,
    status:  "active",
    endDate: { $gt: now },
  });
  if (!subscription) return null;

  const currentCycle = subscription.cycles.find(
    (c) => c.startDate <= now && c.endDate > now
  );
  if (!currentCycle) return null;

  return { subscription, currentCycle };
};