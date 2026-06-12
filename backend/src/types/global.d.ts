import { type jwtPayload } from "./authTypes.ts";
import { UserSubscriptionType } from "../models/userSubscription.model.ts";

declare global{
    namespace Express{
        interface Request{
            user?:jwtPayload
            subscription?: UserSubscriptionType;
            session?:any
            hasActiveScan?: boolean;
        }
        interface User {
            userId: string;
            role: string;
            name: string;
            email: string;
            provider: string;
         }
    }
} 