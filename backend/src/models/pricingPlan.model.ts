import mongoose, { type InferSchemaType } from "mongoose";

const priceEntrySchema = new mongoose.Schema(
  {
    actual:     { type: Number, required: [true, "Actual price is required"], min: [0, "Price cannot be negative"] },
    discounted: { type: Number, default: null, min: [0, "Discounted price cannot be negative"] },
  },
  { _id: false }
);

const pricingPlanSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, "Plan name is required"],
      trim:     true,
    },
    tier: {
      type:     Number,
      required: [true, "Tier is required"],
      min:      [1, "Tier must be at least 1"],
    },
    currency: {
      type:      String,
      default:   "INR",
      uppercase: true,
      minlength: [3, "Currency code must be 3 characters"],
      maxlength: [3, "Currency code must be 3 characters"],
    },
    price: {
      monthly:    { type: priceEntrySchema, default: null },
      threeMonth: { type: priceEntrySchema, default: null },
      sixMonth:   { type: priceEntrySchema, default: null },
      yearly:     { type: priceEntrySchema, default: null },
    },

    limits: {
      analysesPerMonth:             { type: Number, default: null, min: [0, "Cannot be negative"] },
      aiRepliesPerMonth:            { type: Number, default: null, min: [0, "Cannot be negative"] },
      totalScansPerMonth:           { type: Number, default: null, min: [0, "Cannot be negative"] },
      aiReviewsPerMonth:            { type: Number, default: null, min: [0, "Cannot be negative"] },
      aiAutoRepliesPerMonth:        { type: Number, default: null, min: [0, "Cannot be negative"] },
      reviewAnalysisVolume:         { type: Number, default: null, min: [0, "Cannot be negative"] },
      whatsappMessagesPerMonth:     { type: Number, default: null, min: [0, "Cannot be negative"] },
      aiCompetitorAnalysisPerMonth: { type: Number, default: null, min: [0, "Cannot be negative"] },
    },

    features: {
      magicQr:           { type: Boolean, default: false },
      seoFriendlyReview: { type: Boolean, default: false },
      healthScore:       { type: Boolean, default: false },
      rbac:              { type: Boolean, default: false },
    },

    notes: [{ type: String, trim: true }],

    trial: {
      enabled:   { type: Boolean, default: false },
      trialDays: { type: Number,  default: null  },
    },

    razorpayPlanIds: {
      monthly:    { type: String, default: null },
      threeMonth: { type: String, default: null },
      sixMonth:   { type: String, default: null },
      yearly:     { type: String, default: null },
    },

    isActive:  { type: Boolean, default: true  },
    isDeleted: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type PricingPlanType = InferSchemaType<typeof pricingPlanSchema>;

const PricingPlan = mongoose.model("PricingPlan", pricingPlanSchema);
export default PricingPlan;