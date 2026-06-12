    // modules/location/location.controller.ts
    import type { Request, Response } from "express";
    import {
    extractLocationService,
    confirmLocationService,
    getMyLocationsService,
    getLocationByIdService,
    updateLocationService,
    deleteLocationService,
    toggleBadReviewRedirectLocationService,
    toggleBadReviewRedirectGlobalService,
    getCompetitorAnalysisService
    } from "./location.service.js";
    import sendResponse           from "../../utils/response.js";
    import type { JwtPayload }    from "../../types/authTypes.js";

    export const extractLocation = async (req: Request, res: Response) => {
    const result = await extractLocationService(req.body.url);
    return sendResponse(res, result);
    };

    export const confirmLocation = async (req: Request, res: Response) => {
    const result = await confirmLocationService(
        (req.user as JwtPayload).userId,
        req.body,
    );
    return sendResponse(res, result);
    };

    export const getMyLocations = async (req: Request, res: Response) => {
    const result = await getMyLocationsService((req.user as JwtPayload).userId);
    return sendResponse(res, result);
    };

    export const getLocationById = async (req: Request, res: Response) => {
    const result = await getLocationByIdService(
        (req.user as JwtPayload).userId,
        req.params.id as string
    );
    return sendResponse(res, result);
    };

    export const updateLocation = async (req: Request, res: Response) => {
    const result = await updateLocationService(
        (req.user as JwtPayload).userId,
        req.params.id as string,
        req.body
    );
    return sendResponse(res, result);
    };

    export const deleteLocation = async (req: Request, res: Response) => {
    const result = await deleteLocationService(
        (req.user as JwtPayload).userId,
        req.params.id as string
    );
    return sendResponse(res, result);
    };

    export const toggleBadReviewRedirectGlobal = async (req: Request, res: Response) => {
  const result = await toggleBadReviewRedirectGlobalService(
    (req.user as JwtPayload).userId,
    req.body.enabled
  );
  return sendResponse(res, result);
};

export const toggleBadReviewRedirectLocation = async (req: Request, res: Response) => {
  const result = await toggleBadReviewRedirectLocationService(
    (req.user as JwtPayload).userId,
    req.params.id as string,
    req.body.enabled
  );
  return sendResponse(res, result);
};
export const getCompetitorAnalysis = async (req: Request, res: Response) => {
  const { myPlaceId,competitorsData  } = req.body;
  const result = await getCompetitorAnalysisService(
    myPlaceId,
    competitorsData
  );  
  return sendResponse(res, result);
};