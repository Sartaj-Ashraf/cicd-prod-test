// modules/manager/manager.routes.ts
import { Router }                    from "express";
import { validate }                  from "../../middleware/validate.js";
import { accessTokenAuthMiddleware } from "../../middleware/authMiddleware.js";
import {
  inviteManagerValidator,
  acceptInviteValidator,
  managerIdValidator,
  locationIdValidator,
} from "./manager.validation.js";
import {
  inviteManager,
  acceptInvite,
  resendInvite,
  getManagersForLocation,
  deleteManager,
} from "./manager.controller.js";
import { authorize } from "../../middleware/authorizeMiddleware.js";

const router = Router();

router.post("/accept/:token", acceptInviteValidator, validate, acceptInvite);

router.use(accessTokenAuthMiddleware);

router.post("/invite",                   authorize("admin"), inviteManagerValidator, validate, inviteManager);
router.post("/:id/resend",               authorize("admin"), managerIdValidator,     validate, resendInvite);
router.get("/location/:locationId",      authorize("admin"), locationIdValidator,    validate, getManagersForLocation);
router.delete("/:id",                    authorize("admin"), managerIdValidator,     validate, deleteManager);

export default router;