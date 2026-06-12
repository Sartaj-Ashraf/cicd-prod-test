// modules/subscription/subscription.validation.ts
import { body, param } from "express-validator";

const billingCycleValidator = (field = "billingCycle") =>
  body(field)
    .notEmpty().withMessage("Billing cycle is required")
    .isIn(["monthly", "threeMonth", "sixMonth", "yearly"])
    .withMessage("Invalid billing cycle");

const planIdValidator = (field = "planId") =>
  body(field)
    .notEmpty().withMessage("Plan ID is required")
    .isMongoId().withMessage("Invalid plan ID");

const razorpayFieldsValidator = [
  body("razorpayOrderId").notEmpty().withMessage("Order ID is required"),
  body("razorpayPaymentId").notEmpty().withMessage("Payment ID is required"),
  body("razorpaySignature").notEmpty().withMessage("Signature is required"),
];

export const createSubscriptionValidator = [
  planIdValidator(),
  billingCycleValidator(),
  body("isAutoPay")
    .notEmpty().withMessage("isAutoPay is required")
    .isBoolean().withMessage("isAutoPay must be a boolean"),
];

export const verifyPaymentValidator = [
  ...razorpayFieldsValidator,
  body("subscriptionId")
    .notEmpty().withMessage("Subscription ID is required")
    .isMongoId().withMessage("Invalid subscription ID"),
];
export const verifyAutopayValidator = [
  body("razorpaySubscriptionId")
    .notEmpty().withMessage("Subscription ID is required"),
  body("razorpayPaymentId")
    .notEmpty().withMessage("Payment ID is required"),
  body("razorpaySignature")
    .notEmpty().withMessage("Signature is required"),
  body("subscriptionId")
    .notEmpty().withMessage("Subscription ID is required")
    .isMongoId().withMessage("Invalid subscription ID"),
];
export const setActiveSubscriptionValidator = [
  param("id").isMongoId().withMessage("Invalid subscription ID"),
];

export const subscriptionIdValidator = [
  param("id").isMongoId().withMessage("Invalid subscription ID"),
];