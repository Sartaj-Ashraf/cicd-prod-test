import type { Request, Response } from "express";
import {
  inviteManagerService,
  acceptInviteService,
  resendInviteService,
  getManagersForLocationService,
  deleteManagerService,
} from "./manager.service.js";
import sendResponse        from "../../utils/response.js";
import type { JwtPayload } from "../../types/authTypes.js";

export const inviteManager = async (req: Request, res: Response) => {
  const result = await inviteManagerService(
    (req.user as JwtPayload).userId,
    req.body.email,
    req.body.name,
    req.body.locationId
  );
  return sendResponse(res, result);
};

export const acceptInvite = async (req: Request, res: Response) => {
  const result = await acceptInviteService(req.params.token as string);
  return sendResponse(res, result);
};

export const resendInvite = async (req: Request, res: Response) => {
  const result = await resendInviteService(
    (req.user as JwtPayload).userId,
    req.params.id as string
  );
  return sendResponse(res, result);
};

export const getManagersForLocation = async (req: Request, res: Response) => {
  const result = await getManagersForLocationService(
    (req.user as JwtPayload).userId,
    req.params.locationId as string
  );
  return sendResponse(res, result);
};

export const deleteManager = async (req: Request, res: Response) => {
  const result = await deleteManagerService(
    (req.user as JwtPayload).userId,
    req.params.id as string
  );
  return sendResponse(res, result);
};