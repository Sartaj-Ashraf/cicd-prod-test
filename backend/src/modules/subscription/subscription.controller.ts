// modules/subscription/subscription.controller.ts
import type { Request, Response } from "express";
import {
  createSubscriptionOrderService,
  verifyPaymentService,
  setActiveSubscriptionService,
  getMySubscriptionsService,
  getSubscriptionByIdService,
  getAllSubscriptionsService,
  cancelSubscriptionService,
  cancelAutopayService,
  verifyAutopayService,
} from "./subscription.service.js";
import sendResponse        from "../../utils/response.js";
import type { JwtPayload } from "../../types/authTypes.js";

export const createSubscriptionOrder = async (req: Request, res: Response) => {
  const result = await createSubscriptionOrderService(
    (req.user as JwtPayload).userId,
    req.body.planId,
    req.body.billingCycle,
    req.body.isAutoPay,
  );
  return sendResponse(res, result);
};

export const verifyPayment = async (req: Request, res: Response) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, subscriptionId } = req.body;
  const result = await verifyPaymentService(
    (req.user as JwtPayload).userId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    subscriptionId,
  );
  return sendResponse(res, result);
};

// subscription.controller.ts
export const verifyAutopay = async (req: Request, res: Response) => {
  const {
    razorpaySubscriptionId,
    razorpayPaymentId,
    razorpaySignature,
    subscriptionId,
  } = req.body;

  const result = await verifyAutopayService(
    (req.user as JwtPayload).userId,
    razorpaySubscriptionId,
    razorpayPaymentId,
    razorpaySignature,
    subscriptionId,
  );
  return sendResponse(res, result);
};

export const setActiveSubscription = async (req: Request, res: Response) => {
  const result = await setActiveSubscriptionService(
    (req.user as JwtPayload).userId,
    req.params.id as string 
  );
  return sendResponse(res, result);
};

export const getMySubscriptions = async (req: Request, res: Response) => {
  const result = await getMySubscriptionsService((req.user as JwtPayload).userId);
  return sendResponse(res, result);
};

export const getSubscriptionById = async (req: Request, res: Response) => {
  const result = await getSubscriptionByIdService(req.params.id as string);
  return sendResponse(res, result);
};

export const getAllSubscriptions = async (req: Request, res: Response) => {
  const result = await getAllSubscriptionsService();
  return sendResponse(res, result);
};

export const cancelSubscription = async (req: Request, res: Response) => {
  const result = await cancelSubscriptionService(
    (req.user as JwtPayload).userId,
    req.params.id as string
  );
  return sendResponse(res, result);
};

export const cancelAutopay = async (req: Request, res: Response) => {
  const result = await cancelAutopayService(
    (req.user as JwtPayload).userId,
    req.params.id as string
  );
  return sendResponse(res, result);
};