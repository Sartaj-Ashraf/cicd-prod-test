import cron             from "node-cron";
import UserSubscription from "../models/userSubscription.model.js";
import User             from "../models/user.model.js";

export const startExpireSubscriptionsCron = () => {

  cron.schedule("0 0 * * *", async () => {
    console.log("Running subscription expiry check...");
    const now = new Date();

    const toExpire = await UserSubscription.find({
      status:  "active",
      endDate: { $lte: now },
    }).select("_id user");

    if (toExpire.length === 0) {
      console.log("No subscriptions to expire");
      return;
    }

    const expiredIds = toExpire.map(s => s._id);

    // bulk expire
    await UserSubscription.updateMany(
      { _id: { $in: expiredIds } },
      { $set: { status: "expired" } }
    );

    // handle each affected user individually
    for (const expiredSub of toExpire) {
      const user = await User.findById(expiredSub.user).select("activeSubscription");
      if (!user) continue;

      // only handle if this was their active subscription
      if (user.activeSubscription?.toString() !== expiredSub._id.toString()) continue;

      // check if user has any other active subscription
      const nextActiveSub = await UserSubscription.findOne({
        user:   expiredSub.user,
        status: "active",
        _id:    { $nin: expiredIds }, // exclude ones we just expired
      }).sort({ "snapshot.tier": -1 }); // pick highest tier

      await User.findByIdAndUpdate(expiredSub.user, {
        $set: {
          activeSubscription: nextActiveSub ? nextActiveSub._id : null,
        },
      });

      if (nextActiveSub) {
        console.log(`User ${expiredSub.user} → switched to subscription ${nextActiveSub._id}`);
      } else {
        console.log(`User ${expiredSub.user} → no active subscription remaining`);
      }
    }

    console.log(`Expired ${expiredIds.length} subscriptions`);
  });

};