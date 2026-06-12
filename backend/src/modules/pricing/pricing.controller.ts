import type { Request, Response } from "express";
import {
  createPricingService,
  getAllPricingService,
  getActivePricingSortedByPriceService,
  getPricingByIdService,
  updatePricingService,
  toggleIsActiveService,
  deletePricingService,
  updateTrialSettingsService,
} from "./pricing.service.js";
import sendResponse from "../../utils/response.js";

export const createPricing = async (req: Request, res: Response) => {
  const result = await createPricingService(req.body);
  return sendResponse(res, result);
};

export const getAllPricing = async (req: Request, res: Response) => {
  const result = await getAllPricingService();
  return sendResponse(res, result);
};

export const getActivePricingSortedByPrice = async (req: Request, res: Response) => {
  const result = await getActivePricingSortedByPriceService();
  return sendResponse(res, result);
};

export const getPricingById = async (req: Request, res: Response) => {
  const result = await getPricingByIdService(req.params.id as string);
  return sendResponse(res, result);
};

export const updatePricing = async (req: Request, res: Response) => {
  const result = await updatePricingService(req.params.id as string, req.body);
  return sendResponse(res, result);
};

export const toggleIsActive = async (req: Request, res: Response) => {
  const result = await toggleIsActiveService(req.params.id as string);
  return sendResponse(res, result);
};

export const deletePricing = async (req: Request, res: Response) => {
  const result = await deletePricingService(req.params.id as string);
  return sendResponse(res, result);
};

export const updateTrialSettings = async (req: Request, res: Response) => {
  const result = await updateTrialSettingsService(req.params.id as string, req.body);
  return sendResponse(res, result);
};