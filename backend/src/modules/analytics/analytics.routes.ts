import { Router } from "express";
import { analyze } from "./analytics.contoller.js";
import { accessTokenAuthMiddleware } from "../../middleware/authMiddleware.js";
import { getAnalytics } from "./analytics.contoller.js";
const router=Router();

router.get("/analyze",accessTokenAuthMiddleware,analyze);
router.get("/:locationId",accessTokenAuthMiddleware,getAnalytics)
export default router;