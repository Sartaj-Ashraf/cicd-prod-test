// modules/users/user.validation.ts
import { query, body } from "express-validator";

export const getAllUsersValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be a positive number"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit must be between 1 to 100"),

  query("search")
    .optional()
    .isString()
    .withMessage("search must be string"),

  query("role")
    .optional()
    .isIn(["user", "manager", "admin", "super_admin"])
    .withMessage("Invalid role"),
];

export const updateProfileValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),

  body("phoneNumber")
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Phone number must be valid Indian number"),
];