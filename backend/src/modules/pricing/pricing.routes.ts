// modules/pricing/pricing.routes.ts
import { Router }                    from "express";
import { validate }                  from "../../middleware/validate.js";
import { accessTokenAuthMiddleware } from "../../middleware/authMiddleware.js";
import { authorize }                 from "../../middleware/authorizeMiddleware.js";
import {
  createPricingValidator,
  updatePricingValidator,
  pricingIdValidator,
  trialSettingsValidator,
} from "./pricing.validation.js";
import {
  createPricing,
  getAllPricing,
  getActivePricingSortedByPrice,
  getPricingById,
  updatePricing,
  toggleIsActive,
  deletePricing,
  updateTrialSettings,
} from "./pricing.controller.js";

const router = Router();

router.post(
  "/",
  // accessTokenAuthMiddleware, authorize("super_admin"),
  createPricingValidator, validate,
  createPricing
);

router.get("/",       getAllPricing);
router.get("/active", getActivePricingSortedByPrice);

router.get(
  "/:id",
  pricingIdValidator, validate,
  getPricingById
);

router.put(
  "/:id",
  accessTokenAuthMiddleware, authorize("super_admin"),
  updatePricingValidator, validate,
  updatePricing
);

router.patch(
  "/:id/toggle",
  accessTokenAuthMiddleware, authorize("super_admin"),
  pricingIdValidator, validate,
  toggleIsActive
);

router.patch(
  "/:id/trial",
  accessTokenAuthMiddleware, authorize("super_admin"),
  trialSettingsValidator, validate,
  updateTrialSettings
);

router.delete(
  "/:id",
  accessTokenAuthMiddleware, authorize("super_admin"),
  pricingIdValidator, validate,
  deletePricing
);

export default router;