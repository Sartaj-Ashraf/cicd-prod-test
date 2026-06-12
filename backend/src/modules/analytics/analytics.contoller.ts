    import type { Request, Response } from "express";
    import { analyzeService } from "./analytics.service.js";
    import sendResponse from "../../utils/response.js";
    import { getAnalyticsService } from "./analytics.service.js";
    export const analyze=async (req:Request,res:Response)=>{
        const result=await analyzeService(req.user?.userId!,req.query.placeId as string,req.query.locationId as string)
        return sendResponse(res,result);
    }

    export const getAnalytics=async (req:Request,res:Response)=>{

        const result=await getAnalyticsService(req.params.locationId as string);
        return sendResponse(res,result)
    }