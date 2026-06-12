// models/userSubscription.model.ts
import mongoose, { type InferSchemaType } from "mongoose";

const creditSchema = new mongoose.Schema(
  {
    creditsTotal: { type: Number, default: null },
    creditsUsed:  { type: Number, default: 0    },
  },
  { _id: false }
);

const cycleSchema = new mongoose.Schema(
  {
    startDate:            { type: Date, required: true },
    endDate:              { type: Date, required: true },
    analyses:             { type: creditSchema, default: () => ({}) },
    aiReplies:            { type: creditSchema, default: () => ({}) },
    totalScans:           { type: creditSchema, default: () => ({}) },
    aiReviews:            { type: creditSchema, default: () => ({}) },
    aiAutoReplies:        { type: creditSchema, default: () => ({}) },
    whatsappMessages:     { type: creditSchema, default: () => ({}) },
    aiCompetitorAnalysis: { type: creditSchema, default: () => ({}) }, // ← new
    // reviewAnalysis removed ← static capacity, not tracked in cycles
  },
  { _id: false }
);

const paymentEntrySchema = new mongoose.Schema(
  {
    orderId:      { type: String, required: true },
    paymentId:    { type: String, default: null  },
    signature:    { type: String, default: null  },
    amount:       { type: Number, required: true },
    billingCycle: { type: String, enum: ["monthly", "threeMonth", "sixMonth", "yearly"] },
    status:       { type: String, enum: ["pending", "captured", "failed"], default: "pending" },
    paidAt:       { type: Date,   default: Date.now },
  },
  { _id: false }
);

const snapshotLimitsSchema = new mongoose.Schema(
  {
    analysesPerMonth:             { type: Number, default: null },
    aiRepliesPerMonth:            { type: Number, default: null },
    totalScansPerMonth:           { type: Number, default: null },
    aiReviewsPerMonth:            { type: Number, default: null },
    aiAutoRepliesPerMonth:        { type: Number, default: null },
    reviewAnalysisVolume:         { type: Number, default: null }, // ← static capacity, kept in snapshot
    whatsappMessagesPerMonth:     { type: Number, default: null },
    aiCompetitorAnalysisPerMonth: { type: Number, default: null }, // ← new
  },
  { _id: false }
);

const snapshotFeaturesSchema = new mongoose.Schema(
  {
    magicQr:           { type: Boolean, default: false },
    seoFriendlyReview: { type: Boolean, default: false },
    healthScore:       { type: Boolean, default: false },
    rbac:              { type: Boolean, default: false },
    // multiBranch        ← removed
    // competitorAnalysis ← removed
  },
  { _id: false }
);

const userSubscriptionSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: [true, "User is required"],
    },
    plan: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "PricingPlan",
      required: [true, "Plan is required"],
    },

    // ── snapshot ──────────────────────────────────────────────────────────────
    snapshot: {
      planName:     { type: String, required: true },
      tier:         { type: Number, required: true },
      currency:     { type: String, default: "INR" },
      price:        { type: Number, default: null  },
      billingCycle: { type: String, default: null  },
      limits:       { type: snapshotLimitsSchema,   default: () => ({}) },
      features:     { type: snapshotFeaturesSchema, default: () => ({}) },
    },

    payments: { type: [paymentEntrySchema], default: [] },

    status: {
      type:    String,
      enum:    ["active", "expired", "cancelled", "pending", "failed"],
      default: "pending",
    },

    startDate: { type: Date, required: true },
    endDate:   { type: Date, required: true },
    cycles:    { type: [cycleSchema], default: [] },

    // ── autopay ───────────────────────────────────────────────────────────────
    isAutoPay:              { type: Boolean, default: false },
    razorpaySubscriptionId: { type: String,  default: null  },

    // ── trial ─────────────────────────────────────────────────────────────────
    trial: {
      isTrial:      { type: Boolean, default: false },
      trialEndDate: { type: Date,    default: null  },
      isConverted:  { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

userSubscriptionSchema.index({ user: 1, status: 1 });
userSubscriptionSchema.index({ user: 1, "snapshot.tier": 1, status: 1 });
userSubscriptionSchema.index({ "payments.orderId": 1 });
userSubscriptionSchema.index({ razorpaySubscriptionId: 1 });

export type UserSubscriptionType = InferSchemaType<typeof userSubscriptionSchema>;

const UserSubscription = mongoose.model("UserSubscription", userSubscriptionSchema);

export default UserSubscription;