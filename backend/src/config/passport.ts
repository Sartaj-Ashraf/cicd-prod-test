import passport from "passport"
import { Strategy as GoogleStrategy, type VerifyCallback, type Profile } from "passport-google-oauth20";
import User from "../models/user.model.js";
import Gbp from "../models/gbp.model.js";
import type { Request } from "express";
import oAuthGbpState from "../models/oauthGBPSchema.js";

import { linkLocationWithGBPService } from "../modules/GBP/gbp.service.js";

passport.use(
    "google-login",
    new GoogleStrategy(
        {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_LOGIN_CALLBACK_URL!
      },
        async (accessToken:string,refreshToken:string,profile:Profile, done:VerifyCallback)=>{
            const email=profile.emails?.[0]?.value;

            if (!email) {
             return done(new Error("No email found"));
            }
            
            let user = await User.findOne({ email });

            if(user && user.isDeleted){
                 return done(null, false,{ message: "Account has been deleted" });
            }
            if(user && user.role=== "super_admin"){
                return done(null, false,{ message: "Operation not allowed for super admin" });
            }
            
            if (!user) {    
            user = await User.create({
                email,
                name: profile.displayName,
                role: "user",
                provider:"google",
                isVerified: true
            });
           }
            return done(null, {userId:user._id.toString(),role:user.role,provider:user.provider,name:user.name,email:user.email});
        }
    )
)

passport.use(
  "google-business",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_MYBUISNESS_CALLBACK_URL!,
      passReqToCallback: true,
    },
    async (
      req: Request,
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const state = req.query.state as string;

        const oAuthState = await oAuthGbpState.findOne({
          state,
          expiresAt: { $gte: new Date() },
        });

        if (!oAuthState) {
          return done(new Error("Invalid or expired state"));
        }

        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("No email found"));
        }

        const updateData: any = {
          email,
          accessToken,
          connected: true,
        };

        if (refreshToken) {
          updateData.refreshToken = refreshToken;
        }

        await Gbp.findOneAndUpdate(
          {
            userId: oAuthState.userId,
            googleAccountId: profile.id,
          },
          updateData,
          {
            upsert: true,
            new: true,
          }
        );

        let matchedLocation = false;
        if (oAuthState.locationId) {
          matchedLocation = await linkLocationWithGBPService(
            accessToken,
            oAuthState.locationId
          );
        }

        await oAuthGbpState.deleteOne({
          _id: oAuthState._id,
        });

        return done(
          null,
          {} as any,
          {
            redirectTo: oAuthState.redirectTo,
            connected: true,
            matchedLocation,
          }
        );
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);


export default passport;