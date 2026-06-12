// modules/subscription/subscription.service.ts
import UserSubscription from "../../models/userSubscription.model.js";
import PricingPlan      from "../../models/pricingPlan.model.js";
import User             from "../../models/user.model.js";
import crypto           from "crypto";
import type { ServiceResponse } from "../../types/serviceResponse.js";
import {
  razorpay,
  calculateEndDate,
  getBillingMonths,
  buildCycles,
  verifyRazorpaySignature,
  generateReceipt,
  createAllRazorpayPlans,
} from "../../utils/payment/payment.js";

const TOTAL_COUNT: Record<string, number> = {
  monthly:    120,
  threeMonth: 40,
  sixMonth:   20,
  yearly:     10,
};

const buildLimits = (source: any) => ({
  analysesPerMonth:             source?.analysesPerMonth             ?? null,
  aiRepliesPerMonth:            source?.aiRepliesPerMonth            ?? null,
  totalScansPerMonth:           source?.totalScansPerMonth           ?? null,
  aiReviewsPerMonth:            source?.aiReviewsPerMonth            ?? null,
  aiAutoRepliesPerMonth:        source?.aiAutoRepliesPerMonth        ?? null,
  reviewAnalysisVolume:         source?.reviewAnalysisVolume         ?? null,
  whatsappMessagesPerMonth:     source?.whatsappMessagesPerMonth     ?? null,
  aiCompetitorAnalysisPerMonth: source?.aiCompetitorAnalysisPerMonth ?? null,
});

const buildFeatures = (source: any) => ({
  magicQr:           source?.magicQr           ?? false,
  seoFriendlyReview: source?.seoFriendlyReview ?? false,
  healthScore:       source?.healthScore        ?? false,
  rbac:              source?.rbac               ?? false,
});

// ── build trial cycle (only for trial period) ─────────────────────────────────
const buildTrialCycle = (
  startDate:     Date,
  trialEndDate:  Date,
  limits:        ReturnType<typeof buildLimits>
) => [{
  startDate,
  endDate:              trialEndDate,
  analyses:             { creditsTotal: limits.analysesPerMonth,             creditsUsed: 0 },
  aiReplies:            { creditsTotal: limits.aiRepliesPerMonth,            creditsUsed: 0 },
  totalScans:           { creditsTotal: limits.totalScansPerMonth,           creditsUsed: 0 },
  aiReviews:            { creditsTotal: limits.aiReviewsPerMonth,            creditsUsed: 0 },
  aiAutoReplies:        { creditsTotal: limits.aiAutoRepliesPerMonth,        creditsUsed: 0 },
  whatsappMessages:     { creditsTotal: limits.whatsappMessagesPerMonth,     creditsUsed: 0 },
  aiCompetitorAnalysis: { creditsTotal: limits.aiCompetitorAnalysisPerMonth, creditsUsed: 0 },
}];

export const createSubscriptionOrderService = async (
  userId:       string,
  planId:       string,
  billingCycle: "monthly" | "threeMonth" | "sixMonth" | "yearly",
  isAutoPay:    boolean
): Promise<ServiceResponse> => {

  const plan = await PricingPlan.findOne({ _id: planId, isDeleted: false });
  if (!plan) return { success: false, statusCode: 404, message: "Plan not found" };
  if (!plan.isActive) return { success: false, statusCode: 400, message: "This plan is no longer available" };

  const priceEntry = plan.price?.[billingCycle];
  if (!priceEntry) {
    return { success: false, statusCode: 400, message: `This plan does not offer ${billingCycle} billing` };
  }

  await UserSubscription.updateMany(
    { user: userId, status: "pending" },
    { $set: { status: "failed" } }
  );

  const finalPrice       = (priceEntry as any).discounted ?? (priceEntry as any).actual;
  const user             = await User.findById(userId).select("hasEverSubscribed");
  const isTrialEligible  = !user?.hasEverSubscribed && plan.trial?.enabled === true;
  const effectiveAutoPay = isTrialEligible ? true : isAutoPay;

  const startDate = new Date();
  const limits    = buildLimits(plan.limits);
  const features  = buildFeatures(plan.features);

  // ── trial → endDate = trialEndDate, cycles = trial cycle only ────────────
  // ── non-trial → endDate = full billing period, cycles = full cycles ──────
  const trialDays    = isTrialEligible ? (plan.trial?.trialDays ?? null) : null;
  const trialEndDate = isTrialEligible && trialDays
    ? new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000)
    : null;

  const endDate = isTrialEligible && trialEndDate
    ? trialEndDate
    : calculateEndDate(billingCycle, startDate);

  const cycles = isTrialEligible && trialEndDate
    ? buildTrialCycle(startDate, trialEndDate, limits)
    : buildCycles(startDate, getBillingMonths(billingCycle), limits);

  const snapshot = {
    planName:     plan.name,
    tier:         plan.tier,
    currency:     plan.currency,
    price:        finalPrice,
    billingCycle,
    limits,
    features,
  };

  // ── autopay flow ──────────────────────────────────────────────────────────
  if (effectiveAutoPay) {
    let razorpayPlanId = plan.razorpayPlanIds?.[billingCycle];
    if (!razorpayPlanId) {
      await createAllRazorpayPlans(planId);
      const refreshedPlan = await PricingPlan.findById(planId);
      razorpayPlanId      = refreshedPlan?.razorpayPlanIds?.[billingCycle] ?? null;
    }

    if (!razorpayPlanId) {
      return { success: false, statusCode: 500, message: "Failed to create Razorpay plan" };
    }

    const rzpSubOptions: any = {
      plan_id:         razorpayPlanId,
      total_count:     TOTAL_COUNT[billingCycle],
      quantity:        1,
      customer_notify: 1,
    };

    if (isTrialEligible && trialDays !== null) {
      rzpSubOptions.start_at = Math.floor(
        new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000).getTime() / 1000
      );
    }

    const rzpSub = await razorpay.subscriptions.create(rzpSubOptions);

    const subscription = await UserSubscription.create({
      user:     userId,
      plan:     plan._id,
      snapshot,
      payments: [{
        orderId:      rzpSub.id,
        amount:       finalPrice,
        billingCycle,
        status:       "pending",
      }],
      status:                 "pending",
      startDate,
      endDate,
      cycles,
      isAutoPay:              true,
      razorpaySubscriptionId: rzpSub.id,
      trial: {
        isTrial:      isTrialEligible,
        trialEndDate: trialEndDate ?? null,
        isConverted:  false,
      },
    });

    return {
      success:    true,
      statusCode: 201,
      message:    "Subscription created",
      data: {
        subscriptionId:         subscription._id,
        razorpaySubscriptionId: rzpSub.id,
        isAutoPay:              true,
        isTrial:                isTrialEligible,
        trialDays,
        amount:                 finalPrice,
        currency:               plan.currency,
        keyId:                  process.env.RAZORPAY_KEY_ID,
      },
    };
  }

  // ── manual order flow ─────────────────────────────────────────────────────
  const order = await razorpay.orders.create({
    amount:   finalPrice * 100,
    currency: plan.currency,
    receipt:  generateReceipt("sub", userId),
  });

  const subscription = await UserSubscription.create({
    user:     userId,
    plan:     plan._id,
    snapshot,
    payments: [{
      orderId:      order.id,
      amount:       finalPrice,
      billingCycle,
      status:       "pending",
    }],
    status:    "pending",
    startDate,
    endDate,
    cycles,
    isAutoPay: false,
  });

  return {
    success:    true,
    statusCode: 201,
    message:    "Order created successfully",
    data: {
      subscriptionId:  subscription._id,
      razorpayOrderId: order.id,
      isAutoPay:       false,
      isTrial:         false,
      amount:          finalPrice,
      currency:        plan.currency,
      keyId:           process.env.RAZORPAY_KEY_ID,
    },
  };
};

export const verifyPaymentService = async (
  userId:            string,
  razorpayOrderId:   string,
  razorpayPaymentId: string,
  razorpaySignature: string,
  subscriptionId:    string,
): Promise<ServiceResponse> => {

  const isValid = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
  if (!isValid) {
    return { success: false, statusCode: 400, message: "Payment verification failed" };
  }

  const subscription = await UserSubscription.findOne({ _id: subscriptionId, user: userId });
  if (!subscription) {
    return { success: false, statusCode: 404, message: "Subscription not found" };
  }

  const activated = await UserSubscription.findOneAndUpdate(
    {
      _id:                subscriptionId,
      user:               userId,
      status:             "pending",
      "payments.orderId": razorpayOrderId,
    },
    {
      $set: {
        status:                   "active",
        "payments.$.paymentId":   razorpayPaymentId,
        "payments.$.signature":   razorpaySignature,
        "payments.$.status":      "captured",
        "payments.$.paidAt":      new Date(),
      },
    },
    { new: true }
  );

  if (!activated) {
    const existing = await UserSubscription.findOne({ _id: subscriptionId, user: userId });
    if (existing?.status === "active") {
      return { success: true, statusCode: 200, message: "Subscription already active", data: existing };
    }
    return { success: false, statusCode: 400, message: "Subscription cannot be activated" };
  }

  const currentUser = await User.findById(userId).select("role");
  await User.findByIdAndUpdate(userId, {
    $set: {
      activeSubscription: subscriptionId,
      hasEverSubscribed:  true,
      role: currentUser?.role === "user" ? "admin" : currentUser?.role,
    },
  });

  return {
    success:    true,
    statusCode: 200,
    message:    "Payment verified, subscription activated",
    data:       activated,
  };
};

export const verifyAutopayService = async (
  userId:                 string,
  razorpaySubscriptionId: string,
  razorpayPaymentId:      string,
  razorpaySignature:      string,
  subscriptionId:         string,
): Promise<ServiceResponse> => {

  const body     = razorpayPaymentId + "|" + razorpaySubscriptionId;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  if (expected !== razorpaySignature) {
    return { success: false, statusCode: 400, message: "Payment verification failed" };
  }

  const subscription = await UserSubscription.findOne({ _id: subscriptionId, user: userId });
  if (!subscription) {
    return { success: false, statusCode: 404, message: "Subscription not found" };
  }

  // ── trial → card saved → activate ────────────────────────────────────────
  if (subscription.trial?.isTrial && subscription.status === "pending") {
    await UserSubscription.findByIdAndUpdate(subscriptionId, {
      $set: { status: "active" },
    });

    const currentUser = await User.findById(userId).select("role");
    await User.findByIdAndUpdate(userId, {
      $set: {
        activeSubscription: subscriptionId,
        hasEverSubscribed:  true,
        role: currentUser?.role === "user" ? "admin" : currentUser?.role,
      },
    });

    return {
      success:    true,
      statusCode: 200,
      message:    "Trial activated",
      data:       subscription,
    };
  }

  // ── non-trial autopay → activate ──────────────────────────────────────────
  const activated = await UserSubscription.findOneAndUpdate(
    {
      _id:                    subscriptionId,
      user:                   userId,
      status:                 "pending",
      razorpaySubscriptionId,
    },
    { $set: { status: "active" } },
    { new: true }
  );

  if (!activated) {
    const existing = await UserSubscription.findOne({ _id: subscriptionId, user: userId });
    if (existing?.status === "active") {
      return { success: true, statusCode: 200, message: "Subscription already active", data: existing };
    }
    return { success: false, statusCode: 400, message: "Subscription cannot be activated" };
  }

  await UserSubscription.findOneAndUpdate(
    {
      _id:                subscriptionId,
      "payments.orderId": razorpaySubscriptionId,
    },
    {
      $set: {
        "payments.$.paymentId": razorpayPaymentId,
        "payments.$.signature": razorpaySignature,
        "payments.$.status":    "captured",
        "payments.$.paidAt":    new Date(),
      },
    }
  );

  const currentUser = await User.findById(userId).select("role");
  await User.findByIdAndUpdate(userId, {
    $set: {
      activeSubscription: activated._id,
      hasEverSubscribed:  true,
      role: currentUser?.role === "user" ? "admin" : currentUser?.role,
    },
  });

  return {
    success:    true,
    statusCode: 200,
    message:    "Autopay subscription activated",
    data:       activated,
  };
};

export const activateSubscriptionByOrderIdService = async (
  orderId:   string,
  paymentId: string,
  signature: string
): Promise<ServiceResponse> => {

  console.log("[ACTIVATE] searching for orderId:", orderId);

  let activated = await UserSubscription.findOneAndUpdate(
    {
      "payments.orderId": orderId,
      "payments.status":  "pending",
      status:             "pending",
    },
    {
      $set: {
        status:                   "active",
        "payments.$.paymentId":   paymentId,
        "payments.$.signature":   signature,
        "payments.$.status":      "captured",
        "payments.$.paidAt":      new Date(),
      },
    },
    { new: true }
  );

  console.log("[ACTIVATE] by orderId:", activated ? activated._id : "NOT FOUND");

  if (!activated) {
    try {
      const payment = await razorpay.payments.fetch(paymentId);
      const subId   = (payment as any)?.subscription_id ?? null;
      console.log("[ACTIVATE] subscription_id from payment:", subId);

      if (subId) {
        activated = await UserSubscription.findOneAndUpdate(
          {
            razorpaySubscriptionId: subId,
            status:                 "pending",
          },
          {
            $set: {
              status:                 "active",
              "payments.$.paymentId": paymentId,
              "payments.$.status":    "captured",
              "payments.$.paidAt":    new Date(),
            },
          },
          { new: true }
        );
        console.log("[ACTIVATE] by subscriptionId:", activated ? activated._id : "NOT FOUND");
      }
    } catch (err) {
      console.error("[ACTIVATE] failed to fetch payment:", err);
    }
  }

  if (!activated) {
    console.log("[ACTIVATE] could not activate for orderId:", orderId);
    return { success: true, statusCode: 200, message: "Already processed or not found" };
  }

  const currentUser = await User.findById(activated.user).select("role");
  await User.findByIdAndUpdate(activated.user, {
    $set: {
      activeSubscription: activated._id,
      hasEverSubscribed:  true,
      role: currentUser?.role === "user" ? "admin" : currentUser?.role,
    },
  });

  console.log("[ACTIVATE] subscription activated:", activated._id);

  return {
    success:    true,
    statusCode: 200,
    message:    "Subscription activated via webhook",
    data:       activated,
  };
};

export const cancelAutopayService = async (
  userId:         string,
  subscriptionId: string
): Promise<ServiceResponse> => {
  try {
    const subscription = await UserSubscription.findOne({
      _id:    subscriptionId,
      user:   userId,
      status: "active",
    });

    if (!subscription) {
      return { success: false, statusCode: 404, message: "Subscription not found" };
    }
    if (!subscription.isAutoPay) {
      return { success: false, statusCode: 400, message: "Autopay is not enabled" };
    }

    if (subscription.razorpaySubscriptionId) {
      const isActiveTrial = subscription.trial?.isTrial && !subscription.trial?.isConverted;
      try {
        await razorpay.subscriptions.cancel(
          subscription.razorpaySubscriptionId,
          isActiveTrial ? false : true
        );
      } catch (rzpErr: any) {
        const description = rzpErr?.error?.description ?? "";
        if (!description.includes("no billing cycle is going on")) {
          throw rzpErr;
        }
        console.log("Razorpay cancel skipped — trial not yet billed");
      }
    }

    await UserSubscription.findByIdAndUpdate(subscriptionId, {
      $set: {
        isAutoPay:              false,
        razorpaySubscriptionId: null,
      },
    });

    return {
      success:    true,
      statusCode: 200,
      message:    `Auto pay cancelled. Subscription remains active until ${new Date(subscription.endDate).toDateString()}`,
    };
  } catch (err: any) {
    return { success: false, statusCode: 500, message: err?.message ?? "Failed to cancel autopay" };
  }
};

export const setActiveSubscriptionService = async (
  userId:         string,
  subscriptionId: string
): Promise<ServiceResponse> => {

  const subscription = await UserSubscription.findOne({
    _id:    subscriptionId,
    user:   userId,
    status: "active",
  });
  if (!subscription) {
    return { success: false, statusCode: 404, message: "Active subscription not found" };
  }

  await User.findByIdAndUpdate(userId, {
    $set: { activeSubscription: subscriptionId },
  });

  return {
    success:    true,
    statusCode: 200,
    message:    "Active subscription updated",
    data:       subscription,
  };
};

export const getMySubscriptionsService = async (
  userId: string
): Promise<ServiceResponse> => {

  const subscriptions = await UserSubscription.find({
    user:   userId,
    status: "active",
  }).sort({ "snapshot.tier": -1 });

  if (subscriptions.length === 0) {
    return {
      success:    true,
      statusCode: 200,
      message:    "No active subscriptions",
      data: {
        activeSubscriptionId: null,
        subscriptions:        [],
      },
    };
  }

  const user = await User.findById(userId).select("activeSubscription");

  const formatted = subscriptions.map((sub) => {
    const currentCycle = sub.cycles?.length
      ? sub.cycles[sub.cycles.length - 1]
      : null;

    const latestPayment = sub.payments?.length
      ? [...sub.payments].reverse().find((p) => p.status === "captured") ||
        sub.payments[sub.payments.length - 1]
      : null;

    const isActiveTrial = sub.trial?.isTrial && !sub.trial?.isConverted;

    return {
      id:          String(sub._id),
      planName:    sub.snapshot?.planName ?? null,
      tier:        sub.snapshot?.tier     ?? null,
      currency:    sub.snapshot?.currency ?? null,
      status:      sub.status,
      startDate:   sub.startDate,
      endDate:     sub.endDate,
      nextBilling: isActiveTrial ? sub.trial?.trialEndDate : sub.endDate,
      isAutoPay:   sub.isAutoPay,

      trial: {
        isTrial:      sub.trial?.isTrial      ?? false,
        trialEndDate: sub.trial?.trialEndDate ?? null,
        isConverted:  sub.trial?.isConverted  ?? false,
      },

      snapshot: {
        limits:   sub.snapshot?.limits   ?? {},
        features: sub.snapshot?.features ?? {},
      },

      billing: {
        amount:       sub.snapshot?.price ?? latestPayment?.amount ?? 0,
        cycle:        sub.snapshot?.billingCycle ?? latestPayment?.billingCycle ?? null,
        lastCharged:  latestPayment?.paidAt  ?? null,
        status:       latestPayment?.status  ?? null,
        isActiveTrial,
      },

      usage: {
        analyses: {
          used:  currentCycle?.analyses?.creditsUsed  ?? 0,
          total: currentCycle?.analyses?.creditsTotal ?? null,
        },
        aiReplies: {
          used:  currentCycle?.aiReplies?.creditsUsed  ?? 0,
          total: currentCycle?.aiReplies?.creditsTotal ?? null,
        },
        scans: {
          used:  currentCycle?.totalScans?.creditsUsed  ?? 0,
          total: currentCycle?.totalScans?.creditsTotal ?? null,
        },
        aiReviews: {
          used:  currentCycle?.aiReviews?.creditsUsed  ?? 0,
          total: currentCycle?.aiReviews?.creditsTotal ?? null,
        },
        aiAutoReplies: {
          used:  currentCycle?.aiAutoReplies?.creditsUsed  ?? 0,
          total: currentCycle?.aiAutoReplies?.creditsTotal ?? null,
        },
        whatsappMessages: {
          used:  currentCycle?.whatsappMessages?.creditsUsed  ?? 0,
          total: currentCycle?.whatsappMessages?.creditsTotal ?? null,
        },
        aiCompetitorAnalysis: {
          used:  currentCycle?.aiCompetitorAnalysis?.creditsUsed  ?? 0,
          total: currentCycle?.aiCompetitorAnalysis?.creditsTotal ?? null,
        },
      },

      cycle: {
        startDate: currentCycle?.startDate ?? sub.startDate,
        endDate:   currentCycle?.endDate   ?? sub.endDate,
      },

      isActive: String(sub._id) === String(user?.activeSubscription),

      history: {
        payments: [...(sub.payments || [])].sort(
          (a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime()
        ),
        cycles: currentCycle ? [currentCycle] : [],
      },
    };
  });

  return {
    success:    true,
    statusCode: 200,
    message:    "Active subscriptions",
    data: {
      activeSubscriptionId: user?.activeSubscription,
      subscriptions:        formatted,
    },
  };
};

export const getSubscriptionByIdService = async (id: string): Promise<ServiceResponse> => {
  const subscription = await UserSubscription.findById(id)
    .populate("user", "name email phoneNumber")
    .populate("plan", "name currency tier");

  if (!subscription) {
    return { success: false, statusCode: 404, message: "Subscription not found" };
  }
  return { success: true, statusCode: 200, message: "Subscription found", data: subscription };
};

export const getAllSubscriptionsService = async (): Promise<ServiceResponse> => {
  const subscriptions = await UserSubscription.find()
    .populate("user", "name email phoneNumber")
    .populate("plan", "name currency tier")
    .sort({ createdAt: -1 });

  return { success: true, statusCode: 200, message: "All subscriptions", data: subscriptions };
};

export const cancelSubscriptionService = async (
  userId:         string,
  subscriptionId: string
): Promise<ServiceResponse> => {

  const subscription = await UserSubscription.findOne({ _id: subscriptionId, user: userId });
  if (!subscription) {
    return { success: false, statusCode: 404, message: "Subscription not found" };
  }
  if (subscription.status !== "active") {
    return { success: false, statusCode: 400, message: "Only active subscriptions can be cancelled" };
  }

  if (subscription.isAutoPay && subscription.razorpaySubscriptionId) {
    await razorpay.subscriptions.cancel(subscription.razorpaySubscriptionId, true);
  }

  await UserSubscription.findByIdAndUpdate(subscriptionId, {
    $set: {
      status:                 "cancelled",
      isAutoPay:              false,
      razorpaySubscriptionId: null,
    },
  });

  const user = await User.findById(userId);
  if (user?.activeSubscription?.toString() === subscriptionId) {
    await User.findByIdAndUpdate(userId, { $set: { activeSubscription: null } });
  }

  return { success: true, statusCode: 200, message: "Subscription cancelled successfully" };
};

export const incrementAnalysisUsageService = async (userId: string): Promise<void> => {
  const now = new Date();
  await UserSubscription.findOneAndUpdate(
    { user: userId, status: "active", cycles: { $elemMatch: { startDate: { $lte: now }, endDate: { $gt: now } } } },
    { $inc: { "cycles.$.analyses.creditsUsed": 1 } }
  );
};

export const incrementAiReplyUsageService = async (userId: string): Promise<void> => {
  const now = new Date();
  await UserSubscription.findOneAndUpdate(
    { user: userId, status: "active", cycles: { $elemMatch: { startDate: { $lte: now }, endDate: { $gt: now } } } },
    { $inc: { "cycles.$.aiReplies.creditsUsed": 1 } }
  );
};

export const incrementScanUsageService = async (userId: string): Promise<void> => {
  const now = new Date();
  await UserSubscription.findOneAndUpdate(
    { user: userId, status: "active", cycles: { $elemMatch: { startDate: { $lte: now }, endDate: { $gt: now } } } },
    { $inc: { "cycles.$.totalScans.creditsUsed": 1 } }
  );
};

export const incrementAiReviewUsageService = async (userId: string): Promise<void> => {
  const now = new Date();
  await UserSubscription.findOneAndUpdate(
    { user: userId, status: "active", cycles: { $elemMatch: { startDate: { $lte: now }, endDate: { $gt: now } } } },
    { $inc: { "cycles.$.aiReviews.creditsUsed": 1 } }
  );
};

export const incrementAiAutoReplyUsageService = async (userId: string): Promise<void> => {
  const now = new Date();
  await UserSubscription.findOneAndUpdate(
    { user: userId, status: "active", cycles: { $elemMatch: { startDate: { $lte: now }, endDate: { $gt: now } } } },
    { $inc: { "cycles.$.aiAutoReplies.creditsUsed": 1 } }
  );
};

export const incrementWhatsappMessageUsageService = async (userId: string): Promise<void> => {
  const now = new Date();
  await UserSubscription.findOneAndUpdate(
    { user: userId, status: "active", cycles: { $elemMatch: { startDate: { $lte: now }, endDate: { $gt: now } } } },
    { $inc: { "cycles.$.whatsappMessages.creditsUsed": 1 } }
  );
};

export const incrementAiCompetitorAnalysisUsageService = async (userId: string): Promise<void> => {
  const now = new Date();
  await UserSubscription.findOneAndUpdate(
    { user: userId, status: "active", cycles: { $elemMatch: { startDate: { $lte: now }, endDate: { $gt: now } } } },
    { $inc: { "cycles.$.aiCompetitorAnalysis.creditsUsed": 1 } }
  );
};