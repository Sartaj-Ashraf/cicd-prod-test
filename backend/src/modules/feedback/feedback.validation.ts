import { body, param, query } from "express-validator";

export const createFeedbackValidator = [

  param("locationId")
    .isMongoId().withMessage("Invalid location ID"),
    body("fullName")
    .notEmpty().withMessage("Full name is required")
    .isString(),
  body("phoneNumber")
    .optional()
    .isString(),
  body("rating")
    .notEmpty().withMessage("Rating is required")
    .isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
  body("answers")
    .optional()
    .isArray(),
  body("answers.*.questionText")
    .notEmpty().withMessage("Question text is required"),
  body("answers.*.questionType")
    .isIn(["stars", "text", "yes_no"]).withMessage("Invalid question type"),
  body("answers.*.value")
    .notEmpty().withMessage("Answer value is required"),
  body("comment")
    .optional()
    .isString()
    .isLength({ max: 500 }).withMessage("Comment must be under 500 characters"),
  body("createdBy")
    .notEmpty().withMessage("createdBy is required")
    .isMongoId().withMessage("Invalid createdBy"),
];
export const getFeedbackByLocationValidator = [
  param("locationId")
    .isMongoId().withMessage("Invalid location ID"),
  query("rating")
    .optional()
    .isInt({ min: 1, max: 5 }).withMessage("Rating filter must be between 1 and 5"),
  query("page")
    .optional()
    .isInt({ min: 1 }).withMessage("Page must be a positive number"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
];
// in feedback.validation.ts
export const getLocationForFeedbackValidator = [
  query("placeId")
    .notEmpty().withMessage("Place ID is required")
    .isString(),
  query("createdBy")
    .notEmpty().withMessage("Created by is required")
    .isMongoId().withMessage("Invalid createdBy ID"),
];

export const toggleBadReviewValidator = [
  body("enabled")
    .notEmpty().withMessage("enabled is required")
    .isBoolean().withMessage("enabled must be a boolean"),
];

export const recordScanValidator = [
  param("locationId")
    .isMongoId().withMessage("Invalid location ID"),
  body("createdBy")
    .notEmpty().withMessage("createdBy is required")
    .isMongoId().withMessage("Invalid createdBy"),
  body("isRegenerate")
    .optional()
    .isBoolean().withMessage("isRegenerate must be a boolean"),
];