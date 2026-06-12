import { Router } from "express"
import { changePasswordValidator, forgetPasswordValidator, loginValidator, registerValidator, setPasswordValidator } from "./auth.validation.js";
import { validate } from "../../middleware/validate.js";
import { register,setPassword,logout,login, refreshToken, changePassword, googleCallback, me, forgetPassword,adminlogin } from "./auth.controller.js";
import { accessTokenAuthMiddleware, refreshTokenAuthMiddleware } from "../../middleware/authMiddleware.js";
import passport from "passport";
import type { JwtPayload } from "../../types/authTypes.js";

const router=Router();

router.post("/register",registerValidator,validate,register)
router.post("/set-password/:token",setPasswordValidator,validate,setPassword)
router.post("/logout",accessTokenAuthMiddleware,logout)
router.post("/login",loginValidator,validate,login)
router.post("/refresh",refreshTokenAuthMiddleware,refreshToken);
router.patch("/change-password",accessTokenAuthMiddleware,changePasswordValidator,validate,changePassword)
router.patch("/forget-password",forgetPasswordValidator,validate,forgetPassword)
router.get("/me",accessTokenAuthMiddleware,me)
router.post("/superAdmin-login",loginValidator,validate,adminlogin),

//Google OAUTh20 routes

router.get(
  "/google",
  passport.authenticate("google-login", {
    scope: ["profile", "email"]
  })
);

router.get("/google/callback", (req, res, next) => {
  passport.authenticate(
    "google-login",
    { session: false },
    async (err:Error | null, user:JwtPayload, info:{ message?: string } | undefined) => {
      if (err) {
        return res.redirect(`${process.env.FRONTEND_URL}/auth/login?error=${encodeURIComponent(err.message)}`);
      }

      if (!user) {
        return res.redirect(`${process.env.FRONTEND_URL}/auth/login?error=${encodeURIComponent(info?.message || "Login failed")}`);
      }

      req.user = user;
      return googleCallback(req, res);
    }
  )(req, res, next);
});
export default router;