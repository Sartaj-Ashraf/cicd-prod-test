import { body, param } from "express-validator";
import PricingPlan      from "../../models/pricingPlan.model.js";

const priceObjectValidator = (field: string) => [
  body(`price.${field}`).optional({ nullable: true }),
  body(`price.${field}.actual`)
    .if(body(`price.${field}`).notEmpty())
    .isFloat({ min: 0 })
    .withMessage(`price.${field}.actual must be a positive number`),
  body(`price.${field}.discounted`)
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage(`price.${field}.discounted must be a positive number`),
];

const limitsValidator = [
  body("limits.analysesPerMonth")
    .optional({ nullable: true }).isInt({ min: 0 }),
  body("limits.aiRepliesPerMonth")
    .optional({ nullable: true }).isInt({ min: 0 }),
  body("limits.totalScansPerMonth")
    .optional({ nullable: true }).isInt({ min: 0 }),
  body("limits.aiReviewsPerMonth")
    .optional({ nullable: true }).isInt({ min: 0 }),
  body("limits.aiAutoRepliesPerMonth")
    .optional({ nullable: true }).isInt({ min: 0 }),
  body("limits.reviewAnalysisVolume")
    .optional({ nullable: true }).isInt({ min: 0 }),
  body("limits.whatsappMessagesPerMonth")
    .optional({ nullable: true }).isInt({ min: 0 }),
  body("limits.aiCompetitorAnalysisPerMonth")
    .optional({ nullable: true }).isInt({ min: 0 }),
];

const featuresValidator = [
  body("features.magicQr").optional().isBoolean(),
  body("features.seoFriendlyReview").optional().isBoolean(),
  body("features.healthScore").optional().isBoolean(),
  body("features.rbac").optional().isBoolean(),
];

const notesValidator = [
  body("notes")
    .optional().isArray().withMessage("Notes must be an array"),
  body("notes.*")
    .optional().isString().withMessage("Each note must be a string"),
];

const trialValidator = [
  body("trial.enabled")
    .optional().isBoolean(),
  body("trial.trialDays")
    .optional({ nullable: true })
    .isInt({ min: 1 }).withMessage("Trial days must be at least 1"),
  // trialPrice removed
];

export const createPricingValidator = [
  body("name")
    .notEmpty().withMessage("Name is required").isString(),
  body("currency")
    .optional().isString().isLength({ min: 3, max: 3 }),
  body("tier")
    .isInt({ min: 1 }).withMessage("Tier must be at least 1")
    .custom(async (value: number) => {
      const plan = await PricingPlan.findOne({ tier: value, isDeleted: false });
      if (plan) throw new Error("Tier already exists");
      return true;
    }),
  ...priceObjectValidator("monthly"),
  ...priceObjectValidator("threeMonth"),
  ...priceObjectValidator("sixMonth"),
  ...priceObjectValidator("yearly"),
  ...limitsValidator,
  ...featuresValidator,
  ...notesValidator,
  ...trialValidator,
  body("isActive").optional().isBoolean(),
  body("isPopular").optional().isBoolean(),
];

export const updatePricingValidator = [
  param("id").isMongoId().withMessage("Invalid pricing plan ID"),
  body("name").optional().isString(),
  body("currency").optional().isString(),
  body("tier")
    .optional().isInt({ min: 1 })
    .custom(async (value, { req }) => {
      const plan = await PricingPlan.findOne({ tier: value, isDeleted: false });
      if (plan && plan._id.toString() !== req?.params?.id) {
        throw new Error("Tier already exists");
      }
      return true;
    }),
  ...priceObjectValidator("monthly"),
  ...priceObjectValidator("threeMonth"),
  ...priceObjectValidator("sixMonth"),
  ...priceObjectValidator("yearly"),
  ...limitsValidator,
  ...featuresValidator,
  ...notesValidator,
  ...trialValidator,
  body("isActive").optional().isBoolean(),
  body("isPopular").optional().isBoolean(),
];

export const pricingIdValidator = [
  param("id").isMongoId().withMessage("Invalid pricing plan ID"),
];

export const trialSettingsValidator = [
  param("id").isMongoId().withMessage("Invalid pricing plan ID"),
  body("enabled").optional().isBoolean(),
  body("trialDays").optional({ nullable: true }).isInt({ min: 1 }),
];