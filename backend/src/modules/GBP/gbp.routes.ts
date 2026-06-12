import Router from "express";
import { accessTokenAuthMiddleware } from "../../middleware/authMiddleware.js";
import passport from "passport";
import type { AuthenticateOptionsGoogle } from "passport-google-oauth20";
import { checkGbpConnection, confirmGbpLocations, generateReviewReply, getLocations, getReviews, postReviewReply } from "./gbp.controller.js";
import oAuthGBPState from "../../models/oauthGBPSchema.js";
import { authorize } from "../../middleware/authorizeMiddleware.js";


const googleRouter=Router();

const options: AuthenticateOptionsGoogle = {
  scope: [
    "https://www.googleapis.com/auth/business.manage",
    "profile",
    "email"
  ],
  accessType: "offline",
  prompt: "consent",
};

googleRouter.get(
  "/connect",
  accessTokenAuthMiddleware,
  authorize("admin","manager"),
  async (req,res,next)=>{
    const state=crypto.randomUUID();
    
   await oAuthGBPState.create({
      userId:req?.user?.userId!,
      state,
      expiresAt:new Date(Date.now() + 60*1000*10),
      redirectTo: typeof req.query.redirectTo === "string"
    ? req.query.redirectTo
    : "/dashboard/locations",
      locationId:typeof req.query?.locationId === "string"
      ? req.query?.locationId : null
   })
    
    passport.authenticate(
        "google-business",
        {...options,state}
    )(req,res,next);
 },
);
  

googleRouter.get("/callback",
  (req, res, next) => {
    passport.authenticate("google-business", { session: false }, 
      (err: Error | null, user: any, info: any) => {
        if (err) {
          return res.redirect(`${process.env.FRONTEND_URL}/connect-failed?error=${err.message}`)
        }
        
        if (!info?.redirectTo) {
          return res.redirect(
            `${process.env.FRONTEND_URL}/dashboard/locations?connected=true`
          );
        }
        
        return res.redirect(`${process.env.FRONTEND_URL}/${info?.redirectTo}?connected=true&matchedLocation=${info.matchedLocation}`)
      }
    )(req, res, next)  
  }
)


// routes/reviews.route.ts

googleRouter.get("/reviews/:locationId",accessTokenAuthMiddleware, authorize("admin","manager"),getReviews);
googleRouter.get("/locations",accessTokenAuthMiddleware,authorize("admin","manager"),getLocations);
// googleRouter.post("/update-Gbp",accessTokenAuthMiddleware,updateGbpConnection)
googleRouter.get("/check-connection",accessTokenAuthMiddleware,checkGbpConnection)
googleRouter.post("/confirm-gbp-location",accessTokenAuthMiddleware,authorize("admin","manager"),confirmGbpLocations);

googleRouter.post(
  "/reviews/generate-reply",
  accessTokenAuthMiddleware,
  authorize("admin","manager"),
  generateReviewReply
);

googleRouter.put(
  "/reviews/reply",
  accessTokenAuthMiddleware,
  postReviewReply
);
export default googleRouter;