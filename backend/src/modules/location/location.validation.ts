import { body, param } from "express-validator";

export const extractLocationValidator = [
  body("url")
    .notEmpty().withMessage("URL is required")
    .isURL().withMessage("Invalid URL"),
];

export const confirmLocationValidator = [
  body("placeId")
    .notEmpty().withMessage("Place ID is required"),
  body("name")
    .notEmpty().withMessage("Business name is required"),
  body("address")
    .optional().isString(),
 body("coordinates.lat")
  .optional({ nullable: true })
  .isFloat(),
body("coordinates.lng")
  .optional({ nullable: true })
  .isFloat(),
  body("rating")
    .optional({ nullable: true })
    .isFloat({ min: 0, max: 5 }),
  body("totalReviews")
    .optional({ nullable: true })
    .isInt({ min: 0 }),
  body("nickname")
    .optional().isString(),
];  

export const updateLocationValidator = [
  param("id").isMongoId().withMessage("Invalid location ID"),
  body("nickname").optional().isString(),
];

export const toggleBadReviewValidator = [
  body("enabled")
    .notEmpty().withMessage("enabled is required")
    .isBoolean().withMessage("enabled must be a boolean"),
];

export const locationIdValidator = [
  param("id").isMongoId().withMessage("Invalid location ID"),
];

