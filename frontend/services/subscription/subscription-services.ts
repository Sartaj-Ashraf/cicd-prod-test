// services/subscription/subscription-services.ts
import customFetch    from "@/utils/customFetch";
import { handleError } from "@/utils/service/serviceUtil";

export const createSubscriptionOrder = async (data: {
  planId:       string;
  billingCycle: string;
  isAutoPay:    boolean;
}) => {
  try {
    const res = await customFetch.post("/subscriptions/order", data);
    return res.data.data;
  } catch (error) {
    handleError(error);
  }
};

export const verifySubscriptionPayment = async (data: {
  razorpayOrderId:   string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  subscriptionId:    string;
}) => {
  try {
    const res = await customFetch.post("/subscriptions/verify", data);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const verifyAutopayPayment = async (data: {
  razorpaySubscriptionId: string;
  razorpayPaymentId:      string;
  razorpaySignature:      string;
  subscriptionId:         string;
}) => {
  try {
    const res = await customFetch.post("/subscriptions/verify-autopay", data);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getMySubscriptions = async () => {
  try {
    const res = await customFetch.get("/subscriptions/me");
    return res.data.data;
  } catch (error) {
    handleError(error);
  }
};

export const setActiveSubscription = async (id: string) => {
  try {
    const res = await customFetch.patch(`/subscriptions/${id}/set-active`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const cancelAutopay = async (id: string) => {
  try {
    const res = await customFetch.patch(`/subscriptions/${id}/cancel-autopay`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};