// modules/webhook/webhook.service.ts
import crypto           from "crypto";
import User             from "../../models/user.model.js";
import UserSubscription from "../../models/userSubscription.model.js";
import {
  calculateEndDate,
  getBillingMonths,
  buildCycles,
}                       from "../../utils/payment/payment.js";
import { activateSubscriptionByOrderIdService } from "../subscription/subscription.service.js";
import type { ServiceResponse }                 from "../../types/serviceResponse.js";

export const handleRazorpayWebhookService = async (
  rawBody:   Buffer,
  signature: string
): Promise<ServiceResponse> => {

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex");

  if (expected !== signature) {
    return { success: false, statusCode: 400, message: "Invalid webhook signature" };
  }

  const event = JSON.parse(rawBody.toString());
  console.log(`[WEBHOOK] event: ${event.event}`);

  // ── payment.captured → manual order only ─────────────────────────────────
  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    console.log("[WEBHOOK] payment.captured → orderId:", payment.order_id);
    await activateSubscriptionByOrderIdService(
      payment.order_id,
      payment.id,
      payment.signature ?? ""
    );
  }

  // ── payment.failed ────────────────────────────────────────────────────────
  if (event.event === "payment.failed") {
    const orderId = event.payload.payment.entity.order_id;
    await UserSubscription.findOneAndUpdate(
      { "payments.orderId": orderId, "payments.status": "pending" },
      {
        $set: {
          "payments.$.status": "failed",
          status:              "failed",
        },
      }
    );
  }
  // ── subscription.authenticated → trial card saved → activate ─────────────
if (event.event === "subscription.authenticated") {
  const rzpSubId = event.payload.subscription.entity.id;
  console.log("[WEBHOOK] subscription.authenticated → subId:", rzpSubId);

  const subscription = await UserSubscription.findOne({
    razorpaySubscriptionId: rzpSubId,
    status:                 "pending",
  });

  if (subscription && subscription.trial?.isTrial) {
    await UserSubscription.findByIdAndUpdate(subscription._id, {
      $set: { status: "active" },
    });

    const currentUser = await User.findById(subscription.user).select("role");
    await User.findByIdAndUpdate(subscription.user, {
      $set: {
        activeSubscription: subscription._id,
        hasEverSubscribed:  true,
        role: currentUser?.role === "user" ? "admin" : currentUser?.role,
      },
    });

    console.log("[WEBHOOK] trial activated via authentication:", subscription._id);
  }
}

  // ── subscription.charged ──────────────────────────────────────────────────
  if (event.event === "subscription.charged") {
    const rzpSub  = event.payload.subscription.entity;
    const payment = event.payload.payment.entity;

    console.log("[WEBHOOK] subscription.charged → subId:", rzpSub.id);

    const subscription = await UserSubscription.findOne({
      razorpaySubscriptionId: rzpSub.id,
    });

    if (!subscription) {
      console.log("[WEBHOOK] no subscription found for subId:", rzpSub.id);
      return { success: true, statusCode: 200, message: "Webhook processed" };
    }

    // ── non-trial autopay first charge → activate ─────────────────────────
    if (subscription.status === "pending" && !subscription.trial?.isTrial) {
      console.log("[WEBHOOK] activating pending non-trial subscription:", subscription._id);

      await UserSubscription.findOneAndUpdate(
        {
          _id:                subscription._id,
          "payments.orderId": rzpSub.id,
        },
        {
          $set: {
            status:                 "active",
            "payments.$.status":    "captured",
            "payments.$.paymentId": payment.id,
            "payments.$.paidAt":    new Date(),
          },
        }
      );

      const currentUser = await User.findById(subscription.user).select("role");
      await User.findByIdAndUpdate(subscription.user, {
        $set: {
          activeSubscription: subscription._id,
          hasEverSubscribed:  true,
          role: currentUser?.role === "user" ? "admin" : currentUser?.role,
        },
      });

      console.log("[WEBHOOK] subscription activated:", subscription._id);
      return { success: true, statusCode: 200, message: "Webhook processed" };
    }

    // ── active → trial conversion OR renewal ─────────────────────────────
    if (subscription.status === "active") {
      const billingCycle = subscription.payments?.[0]?.billingCycle as
        "monthly" | "threeMonth" | "sixMonth" | "yearly";

      const isTrialConversion = subscription.trial?.isTrial && !subscription.trial?.isConverted;

      if (isTrialConversion) {
        // ── trial → first real charge → build full cycles from now ─────────
        console.log("[WEBHOOK] trial conversion for:", subscription._id);

        const now        = new Date();
        const newEndDate = calculateEndDate(billingCycle, now);
        const months     = getBillingMonths(billingCycle);

        const newCycles = buildCycles(now, months, {
          analysesPerMonth:             subscription.snapshot?.limits?.analysesPerMonth             ?? null,
          aiRepliesPerMonth:            subscription.snapshot?.limits?.aiRepliesPerMonth            ?? null,
          totalScansPerMonth:           subscription.snapshot?.limits?.totalScansPerMonth           ?? null,
          aiReviewsPerMonth:            subscription.snapshot?.limits?.aiReviewsPerMonth            ?? null,
          aiAutoRepliesPerMonth:        subscription.snapshot?.limits?.aiAutoRepliesPerMonth        ?? null,
          whatsappMessagesPerMonth:     subscription.snapshot?.limits?.whatsappMessagesPerMonth     ?? null,
          aiCompetitorAnalysisPerMonth: subscription.snapshot?.limits?.aiCompetitorAnalysisPerMonth ?? null,
        });

        await UserSubscription.findByIdAndUpdate(subscription._id, {
          $set:  {
            endDate:             newEndDate,
            "trial.isConverted": true,
          },
          $push: {
            cycles:   { $each: newCycles },
            payments: {
              orderId:      payment.id,
              paymentId:    payment.id,
              amount:       payment.amount / 100,
              billingCycle,
              status:       "captured",
              paidAt:       new Date(),
            },
          },
        });

        console.log("[WEBHOOK] trial converted → full subscription:", subscription._id);

      } else {
        // ── regular renewal ────────────────────────────────────────────────
        console.log("[WEBHOOK] processing renewal for:", subscription._id);

        const newEndDate = calculateEndDate(billingCycle, new Date(subscription.endDate));
        const months     = getBillingMonths(billingCycle);

        const newCycles = buildCycles(new Date(subscription.endDate), months, {
          analysesPerMonth:             subscription.snapshot?.limits?.analysesPerMonth             ?? null,
          aiRepliesPerMonth:            subscription.snapshot?.limits?.aiRepliesPerMonth            ?? null,
          totalScansPerMonth:           subscription.snapshot?.limits?.totalScansPerMonth           ?? null,
          aiReviewsPerMonth:            subscription.snapshot?.limits?.aiReviewsPerMonth            ?? null,
          aiAutoRepliesPerMonth:        subscription.snapshot?.limits?.aiAutoRepliesPerMonth        ?? null,
          whatsappMessagesPerMonth:     subscription.snapshot?.limits?.whatsappMessagesPerMonth     ?? null,
          aiCompetitorAnalysisPerMonth: subscription.snapshot?.limits?.aiCompetitorAnalysisPerMonth ?? null,
        });

        await UserSubscription.findByIdAndUpdate(subscription._id, {
          $set:  { endDate: newEndDate },
          $push: {
            cycles:   { $each: newCycles },
            payments: {
              orderId:      payment.id,
              paymentId:    payment.id,
              amount:       payment.amount / 100,
              billingCycle,
              status:       "captured",
              paidAt:       new Date(),
            },
          },
        });

        console.log("[WEBHOOK] renewal processed:", subscription._id);
      }
    }
  }

  // ── subscription.halted ───────────────────────────────────────────────────
  if (event.event === "subscription.halted") {
    const rzpSubId = event.payload.subscription.entity.id;
    await UserSubscription.findOneAndUpdate(
      { razorpaySubscriptionId: rzpSubId },
      { $set: { isAutoPay: false, razorpaySubscriptionId: null } }
    );
  }

  // ── subscription.cancelled ────────────────────────────────────────────────
  if (event.event === "subscription.cancelled") {
    const rzpSubId = event.payload.subscription.entity.id;
    await UserSubscription.findOneAndUpdate(
      { razorpaySubscriptionId: rzpSubId },
      { $set: { isAutoPay: false, razorpaySubscriptionId: null } }
    );
  }

  // ── subscription.completed ────────────────────────────────────────────────
  if (event.event === "subscription.completed") {
    const rzpSubId = event.payload.subscription.entity.id;
    await UserSubscription.findOneAndUpdate(
      { razorpaySubscriptionId: rzpSubId },
      { $set: { isAutoPay: false, razorpaySubscriptionId: null } }
    );
  }

  return { success: true, statusCode: 200, message: "Webhook processed" };
};