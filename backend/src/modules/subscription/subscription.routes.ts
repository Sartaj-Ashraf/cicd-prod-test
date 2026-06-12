// modules/subscription/subscription.routes.ts
import { Router }                    from "express";
import { validate }                  from "../../middleware/validate.js";
import { accessTokenAuthMiddleware } from "../../middleware/authMiddleware.js";
import { authorize }                 from "../../middleware/authorizeMiddleware.js";
import {
  createSubscriptionValidator,
  verifyPaymentValidator,
  setActiveSubscriptionValidator,
  subscriptionIdValidator,
  verifyAutopayValidator,
} from "./subscription.validation.js";
import {
  createSubscriptionOrder,
  verifyPayment,
  setActiveSubscription,
  getMySubscriptions,
  getSubscriptionById,
  getAllSubscriptions,
  cancelSubscription,
  cancelAutopay,
  verifyAutopay,
} from "./subscription.controller.js";

const router = Router();

// user routes
router.post(
  "/order",
  accessTokenAuthMiddleware, authorize("user", "admin", "super_admin"),
  createSubscriptionValidator, validate,
  createSubscriptionOrder
);

router.post(
  "/verify",
  accessTokenAuthMiddleware, authorize("user", "admin", "super_admin"),
  verifyPaymentValidator, validate,
  verifyPayment
);

router.post(
  "/verify-autopay",
  accessTokenAuthMiddleware, authorize("user", "admin", "super_admin"),
  verifyAutopayValidator, validate,
  verifyAutopay
);

router.get(
  "/me",
  accessTokenAuthMiddleware, authorize("admin", "super_admin"),
  getMySubscriptions
);

router.patch(
  "/:id/set-active",
  accessTokenAuthMiddleware, authorize("admin"),
  setActiveSubscriptionValidator, validate,
  setActiveSubscription
);

router.patch(
  "/:id/cancel-autopay",
  accessTokenAuthMiddleware, authorize("admin", "super_admin"),
  subscriptionIdValidator, validate,
  cancelAutopay
);

router.patch(
  "/:id/cancel",
  accessTokenAuthMiddleware, authorize("super_admin"),
  subscriptionIdValidator, validate,
  cancelSubscription
);

// admin routes
router.get(
  "/",
  accessTokenAuthMiddleware, authorize("super_admin"),
  getAllSubscriptions
);

router.get(
  "/:id",
  accessTokenAuthMiddleware, authorize("super_admin", "admin"),
  subscriptionIdValidator, validate,
  getSubscriptionById
);

export default router;