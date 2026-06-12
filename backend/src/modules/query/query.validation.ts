import { body, param } from "express-validator";

/* =========================
   Mongo ID Validator
========================= */
export const mongoIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid ID")
];

/* =========================
   Create Contact Validator
========================= */
export const createContactValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email")
    .normalizeEmail(),

  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("en-IN")
    .withMessage("Invalid phone number"),

  body("subject")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Subject must be maximum 100 characters"),

  body("message")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Message must be maximum 1000 characters"),

  body("businessName") // fixed case issue
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Business name must be maximum 100 characters")
];

/* =========================
   Update Status Validator
========================= */
export const updateContactStatusValidator = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["pending", "in-progress", "resolved"])
    .withMessage("Invalid status")
];

/* =========================
   Add Note Validator
========================= */
export const addContactNoteValidator = [
  body("note")
    .trim()
    .notEmpty()
    .withMessage("Note is required")
    .isLength({ max: 1000 })
    .withMessage("Note must be maximum 1000 characters")
];
// validators/query.validator.ts

import { query } from "express-validator";

export const getAllContactsValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a number greater than 0"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("status")
    .optional()
    .isIn(["pending", "resolved", "closed"])
    .withMessage(
      "Status must be pending, resolved or closed"
    ),

  query("isRead")
    .optional()
    .isBoolean()
    .withMessage("isRead must be true or false"),

  query("search")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage(
      "Search must be between 1 and 100 characters"
    )
];