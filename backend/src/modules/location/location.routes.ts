import { Router }                     from "express";
import { validate }                   from "../../middleware/validate.js";
import { accessTokenAuthMiddleware }  from "../../middleware/authMiddleware.js";
import {
  extractLocationValidator,
  confirmLocationValidator,
  updateLocationValidator,
  locationIdValidator,
  toggleBadReviewValidator,
} from "./location.validation.js";
import {
  extractLocation,
  confirmLocation,
  getMyLocations,
  getLocationById,
  updateLocation,
  deleteLocation,
  toggleBadReviewRedirectGlobal,
  toggleBadReviewRedirectLocation,
  getCompetitorAnalysis,
} from "./location.controller.js";
import { authorize } from "../../middleware/authorizeMiddleware.js";

const router = Router();

router.use(accessTokenAuthMiddleware);
router.patch("/bad-review-redirect/global",accessTokenAuthMiddleware,authorize("admin"),toggleBadReviewValidator,validate,toggleBadReviewRedirectGlobal);
router.patch("/:id/bad-review-redirect",accessTokenAuthMiddleware,authorize("admin"),locationIdValidator,toggleBadReviewValidator,validate,toggleBadReviewRedirectLocation);
router.post("/extract",    extractLocationValidator,  validate, extractLocation);
router.post("/confirm",accessTokenAuthMiddleware,authorize("admin"), confirmLocationValidator,   validate, confirmLocation);
router.get("/",    authorize("admin", "manager"),         getMyLocations);
router.get("/:id",      authorize("admin", "manager","super_admin"),   locationIdValidator,       validate, getLocationById);
router.patch("/:id",       authorize("admin"), updateLocationValidator,    validate, updateLocation);
router.delete("/:id",      authorize("admin"), locationIdValidator,        validate, deleteLocation);
router.post("/get-competitor-analysis", accessTokenAuthMiddleware, authorize("admin", "manager","super_admin"), getCompetitorAnalysis);
export default router;