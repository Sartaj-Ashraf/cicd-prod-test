// utils/payment/payment.ts
import Razorpay    from "razorpay";
import crypto      from "crypto";
import PricingPlan from "../../models/pricingPlan.model.js";

// ─── razorpay instance ────────────────────────────────────────────────────────

export const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// ─── helpers ──────────────────────────────────────────────────────────────────

export const calculateEndDate = (billingCycle: string, from: Date): Date => {
  const date = new Date(from);
  switch (billingCycle) {
    case "monthly":    date.setMonth(date.getMonth() + 1);       break;
    case "threeMonth": date.setMonth(date.getMonth() + 3);       break;
    case "sixMonth":   date.setMonth(date.getMonth() + 6);       break;
    case "yearly":     date.setFullYear(date.getFullYear() + 1); break;
  }
  return date;
};

export const getBillingMonths = (billingCycle: string): number => {
  switch (billingCycle) {
    case "monthly":    return 1;
    case "threeMonth": return 3;
    case "sixMonth":   return 6;
    case "yearly":     return 12;
    default:           return 1;
  }
};

export const buildCycles = (
  startDate:     Date,
  billingMonths: number,
  limits: {
    analysesPerMonth:             number | null;
    aiRepliesPerMonth:            number | null;
    totalScansPerMonth:           number | null;
    aiReviewsPerMonth:            number | null;
    aiAutoRepliesPerMonth:        number | null;
    whatsappMessagesPerMonth:     number | null;
    aiCompetitorAnalysisPerMonth: number | null;
    // reviewAnalysisVolume ← removed, static capacity not tracked in cycles
  }
) => {
  const cycles = [];
  let cycleStart = new Date(startDate);

  for (let i = 0; i < billingMonths; i++) {
    const cycleEnd = new Date(cycleStart);
    cycleEnd.setMonth(cycleEnd.getMonth() + 1);
    cycles.push({
      startDate:            new Date(cycleStart),
      endDate:              new Date(cycleEnd),
      analyses:             { creditsTotal: limits.analysesPerMonth,             creditsUsed: 0 },
      aiReplies:            { creditsTotal: limits.aiRepliesPerMonth,            creditsUsed: 0 },
      totalScans:           { creditsTotal: limits.totalScansPerMonth,           creditsUsed: 0 },
      aiReviews:            { creditsTotal: limits.aiReviewsPerMonth,            creditsUsed: 0 },
      aiAutoReplies:        { creditsTotal: limits.aiAutoRepliesPerMonth,        creditsUsed: 0 },
      whatsappMessages:     { creditsTotal: limits.whatsappMessagesPerMonth,     creditsUsed: 0 },
      aiCompetitorAnalysis: { creditsTotal: limits.aiCompetitorAnalysisPerMonth, creditsUsed: 0 },
      // reviewAnalysis ← removed
    });
    cycleStart = cycleEnd;
  }

  return cycles;
};

export const verifyRazorpaySignature = (
  orderId:   string,
  paymentId: string,
  signature: string
): boolean => {
  const body     = orderId + "|" + paymentId;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");
  return expected === signature;
};

export const generateReceipt = (prefix: string, userId: string): string => {
  const date     = new Date();
  const readable = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  return `${prefix}_${userId.slice(-8)}_${readable}`;
};

// ─── razorpay plan creation (for autopay) ────────────────────────────────────

const INTERVAL_MAP: Record<string, { period: string; interval: number }> = {
  monthly:    { period: "monthly", interval: 1 },
  threeMonth: { period: "monthly", interval: 3 },
  sixMonth:   { period: "monthly", interval: 6 },
  yearly:     { period: "yearly",  interval: 1 },
};

export const createRazorpayPlanForCycle = async (
  planId:       string,
  billingCycle: "monthly" | "threeMonth" | "sixMonth" | "yearly",
  amount:       number,
  currency:     string,
  planName:     string
): Promise<string> => {
  const intervalConfig = INTERVAL_MAP[billingCycle];
  if (!intervalConfig) throw new Error(`Invalid billing cycle: ${billingCycle}`);

  const { period, interval } = intervalConfig;

  const rzpPlan = await razorpay.plans.create({
    period: period as "daily" | "weekly" | "monthly" | "yearly",
    interval,
    item: {
      name:     `${planName} - ${billingCycle}`,
      amount:   amount * 100,
      currency,
    },
  });

  await PricingPlan.findByIdAndUpdate(planId, {
    $set: { [`razorpayPlanIds.${billingCycle}`]: rzpPlan.id },
  });

  return rzpPlan.id;
};

export const createAllRazorpayPlans = async (planId: string): Promise<void> => {
  const plan = await PricingPlan.findById(planId);
  if (!plan) throw new Error("Plan not found");

  const cycles = ["monthly", "threeMonth", "sixMonth", "yearly"] as const;

  for (const cycle of cycles) {
    const priceEntry = plan.price?.[cycle];
    if (!priceEntry) continue;

    const amount = (priceEntry as any).discounted ?? (priceEntry as any).actual;

    await createRazorpayPlanForCycle(
      planId,
      cycle,
      amount,
      plan.currency,
      plan.name
    );
  }
};