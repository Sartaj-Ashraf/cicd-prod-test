// modules/user/user.routes.ts
import { Router } from "express";
import { getAllUsers ,updateProfile ,updateUserStatusController,getSubscriptionById,getUserById,analysisLeft } from "./user.controller.js";
import { getAllUsersValidator,updateProfileValidator } from "./user.validation.js";
import { validate } from "../../middleware/validate.js";
import { accessTokenAuthMiddleware } from "../../middleware/authMiddleware.js";
import { authorize } from "../../middleware/authorizeMiddleware.js";
const router = Router();

router.get(
  "/",
  accessTokenAuthMiddleware,
  authorize("super_admin"),
  getAllUsersValidator,
  validate,
  getAllUsers
);
router.patch(
  "/update-profile",
  accessTokenAuthMiddleware,
  updateProfileValidator,
  validate,
  updateProfile
);  

router.patch(
  "/status/:id",
  accessTokenAuthMiddleware,
  authorize("super_admin"),
  updateUserStatusController
);
router.get(
  "/subscription-history/:subscriptionId",
  accessTokenAuthMiddleware,
  authorize("super_admin"),
  getSubscriptionById
);

router.get("/user/:id", accessTokenAuthMiddleware,authorize("super_admin"), getUserById);
router.get("/analysis-left",accessTokenAuthMiddleware,analysisLeft)
export default router;