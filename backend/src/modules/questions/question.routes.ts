import { Router } from "express";
import { accessTokenAuthMiddleware } from "../../middleware/authMiddleware.js";
import { authorize } from "../../middleware/authorizeMiddleware.js";
import {
  createQuestion,
  getAllQuestions,
  getAdminQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  toggleActive,
  getPublicQuestions,
  getAllChips,
  createChip,
  deleteChip,
} from "./question.controller.js";

import {
  createQuestionValidator,
  updateQuestionValidator,
  idValidator,
  getPublicQuestionsValidator,
} from "./question.validation.js";

import { validate } from "../../middleware/validate.js";

const router = Router();

router.post(
  "/",
  accessTokenAuthMiddleware,
  authorize("admin"),
  createQuestionValidator,
  validate,
  createQuestion
);

router.post('/create-chip',accessTokenAuthMiddleware,authorize("admin"),createChip)

router.get("/", accessTokenAuthMiddleware, authorize("admin"), getAllQuestions);

router.get(
  "/admin",
  accessTokenAuthMiddleware,
  getAdminQuestions
);

router.get(
  "/admin/chips",
  accessTokenAuthMiddleware,
  getAllChips
);

router.get(
  "/public/:id",
  getPublicQuestionsValidator,
  validate,
  getPublicQuestions
);
router.get(
  "/:id",
  idValidator,
  validate,
  getQuestionById
);

router.put(
  "/:id",
  accessTokenAuthMiddleware,
  updateQuestionValidator,
  validate,
  updateQuestion
);

router.delete(
  "/delete-chip/:id",
  accessTokenAuthMiddleware,
  idValidator,
  validate,
  deleteChip
)

router.delete(
  "/:id",
  accessTokenAuthMiddleware,
  idValidator,
  validate,
  deleteQuestion
);

router.patch(
  "/:id/toggle",
  accessTokenAuthMiddleware,
  idValidator,
  validate,
  toggleActive
);

export default router;