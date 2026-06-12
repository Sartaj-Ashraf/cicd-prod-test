import type { Request, Response } from "express";
import {
  getLocationForFeedbackService,
  createFeedbackService,
  getFeedbackByLocationService,
  resetBadReviewCountService,
  recordScanService,
} from "./feedback.service.js";
import sendResponse        from "../../utils/response.js";
import type { JwtPayload } from "../../types/authTypes.js";

export const getLocationForFeedback = async (req: Request, res: Response) => {
  const result = await getLocationForFeedbackService(
    req.query.placeId   as string,
    req.query.createdBy as string,
  );
  return sendResponse(res, result);
};

export const createFeedback = async (req: Request, res: Response) => {
  const result = await createFeedbackService(
    req.params.locationId as string,
    req.body
  );
  return sendResponse(res, result);
};

export const getFeedbackByLocation = async (req: Request, res: Response) => {
  const result = await getFeedbackByLocationService(
    (req.user as JwtPayload).userId,
    req.params.locationId as string,
    req.query
  );
  return sendResponse(res, result);
};

export const resetBadReviewCount = async (req: Request, res: Response) => {
  const result = await resetBadReviewCountService(req.params.locationId as string);
  return sendResponse(res, result);
};

export const recordScan = async (req: Request, res: Response) => {
  const result = await recordScanService(
    req.params.locationId as string,
    req.body.createdBy as string,
    req.body.isRegenerate ?? false,
    req.body.chips
  );
  return sendResponse(res, result);
};  