import { Router }                    from "express";
import { validate }                  from "../../middleware/validate.js";
import { accessTokenAuthMiddleware } from "../../middleware/authMiddleware.js";
import {
  createFeedbackValidator,
  getFeedbackByLocationValidator,
  getLocationForFeedbackValidator,
  recordScanValidator
} from "./feedback.validation.js";
import {
  getLocationForFeedback,
  createFeedback,
  getFeedbackByLocation,
  resetBadReviewCount,
  recordScan
} from "./feedback.controller.js";

const router = Router();

// public
router.get(
  "/location",
  getLocationForFeedbackValidator,
  validate,
  getLocationForFeedback
);

router.post(
  "/:locationId",
  createFeedbackValidator,
  validate,
  createFeedback
);

router.post(
  "/:locationId/reset-bad-review",
  resetBadReviewCount
);

// protected
router.get(
  "/:locationId",
  accessTokenAuthMiddleware,
  getFeedbackByLocationValidator,
  validate,
  getFeedbackByLocation
);

router.post(
  "/:locationId/record-scan",
  recordScanValidator,
  validate,
  recordScan
);

export default router;