import { body, param } from "express-validator";

export const createQuestionValidator = [
  body("text")
    .trim()
    .notEmpty()
    .withMessage("Question text is required")
    .isLength({ min: 3, max: 120 })
    .withMessage("Question must be 3 to 120 chars"),
];

export const updateQuestionValidator = [
  param("id").isMongoId().withMessage("Invalid id"),

  body("text")
    .optional()
    .trim()
    .isLength({ min: 3, max: 120 })
    .withMessage("Question must be 3 to 120 chars"),
];

export const idValidator = [
  param("id").isMongoId().withMessage("Invalid id"),
];
export const getPublicQuestionsValidator = [
  param("id")
    .notEmpty()
    .withMessage("Business id is required")
    .isMongoId()
    .withMessage("Invalid business id"),
];