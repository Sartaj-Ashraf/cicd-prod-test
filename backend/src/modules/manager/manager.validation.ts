import { body, param } from "express-validator";

export const inviteManagerValidator = [
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email"),
  body("locationId")
    .notEmpty().withMessage("Location ID is required")
    .isMongoId().withMessage("Invalid location ID"),
body("name")
  .notEmpty().withMessage("Name is required")
  .isString()
  .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
];

export const acceptInviteValidator = [
  param("token").notEmpty().withMessage("Token is required"),
];

export const managerIdValidator = [
  param("id").isMongoId().withMessage("Invalid manager ID"),
];

export const locationIdValidator = [
  param("locationId").isMongoId().withMessage("Invalid location ID"),
];