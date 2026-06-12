import PricingPlan        from "../../models/pricingPlan.model.js";
import UserSubscription   from "../../models/userSubscription.model.js";
import { createAllRazorpayPlans } from "../../utils/payment/payment.js";
import type { PricingPlanType }   from "../../models/pricingPlan.model.js";
import type { ServiceResponse }   from "../../types/serviceResponse.js";


export const createPricingService = async (
  data: Partial<PricingPlanType>
): Promise<ServiceResponse> => {
  try {
    const plan = await PricingPlan.create(data);
    await createAllRazorpayPlans(plan._id.toString());
    return { success: true, statusCode: 201, message: "Pricing plan created", data: plan };
  } catch (err: any) {
    return { success: false, statusCode: 500, message: err?.message ?? "Failed to create plan" };
  }
};


export const getAllPricingService = async (): Promise<ServiceResponse> => {
  const plans = await PricingPlan.find({ isDeleted: false });
  return { success: true, statusCode: 200, message: "All pricing plans", data: plans };
};


export const getActivePricingSortedByPriceService = async (): Promise<ServiceResponse> => {
  const plans = await PricingPlan.find({ isActive: true, isDeleted: false });

  const sorted = plans.sort((a, b) => {
    const aPrice = a.price?.monthly?.actual ?? a.price?.yearly?.actual ?? Infinity;
    const bPrice = b.price?.monthly?.actual ?? b.price?.yearly?.actual ?? Infinity;
    return aPrice - bPrice;
  });

  return { success: true, statusCode: 200, message: "Active pricing plans", data: sorted };
};


export const getPricingByIdService = async (id: string): Promise<ServiceResponse> => {
  const plan = await PricingPlan.findOne({ _id: id, isDeleted: false });
  if (!plan) {
    return { success: false, statusCode: 404, message: "Pricing plan not found" };
  }
  return { success: true, statusCode: 200, message: "Pricing plan found", data: plan };
};


export const updatePricingService = async (
  id:   string,
  data: Partial<PricingPlanType>
): Promise<ServiceResponse> => {
  try {
    // block tier change if active subscribers exist
    if (data.tier !== undefined) {
      const activeSubscribers = await UserSubscription.countDocuments({
        plan:   id,
        status: "active",
      });
      if (activeSubscribers > 0) {
        return {
          success:    false,
          statusCode: 400,
          message:    "Cannot change tier — active subscribers exist on this plan.",
        };
      }
    }

    const plan = await PricingPlan.findOneAndUpdate(
      { _id: id, isDeleted: false },
      data,
      { new: true, runValidators: true }
    );
    if (!plan) {
      return { success: false, statusCode: 404, message: "Pricing plan not found" };
    }

    // existing autopay subscribers completely unaffected
    // snapshot protects their limits, features and plan details

    return { success: true, statusCode: 200, message: "Pricing plan updated", data: plan };
  } catch (err: any) {
    return { success: false, statusCode: 500, message: err?.message ?? "Failed to update plan" };
  }
};


export const toggleIsActiveService = async (id: string): Promise<ServiceResponse> => {
  const plan = await PricingPlan.findOne({ _id: id, isDeleted: false });
  if (!plan) {
    return { success: false, statusCode: 404, message: "Pricing plan not found" };
  }

  plan.isActive = !plan.isActive;
  await plan.save();

  return {
    success:    true,
    statusCode: 200,
    message:    `Plan is now ${plan.isActive ? "active" : "inactive"}`,
    data:       plan,
  };
};


export const deletePricingService = async (id: string): Promise<ServiceResponse> => {
  const plan = await PricingPlan.findOne({ _id: id, isDeleted: false });
  if (!plan) {
    return { success: false, statusCode: 404, message: "Pricing plan not found" };
  }

  // existing autopay subscribers completely unaffected
  // their subscriptions keep running as normal via snapshot
  await PricingPlan.findByIdAndUpdate(id, {
    $set: { isDeleted: true, isActive: false },
  });

  return { success: true, statusCode: 200, message: "Pricing plan deleted" };
};


export const updateTrialSettingsService = async (
  id:   string,
  data: { enabled?: boolean; trialPrice?: number; trialDays?: number }
): Promise<ServiceResponse> => {
  try {
    const plan = await PricingPlan.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { trial: data } },
      { new: true }
    );
    if (!plan) {
      return { success: false, statusCode: 404, message: "Pricing plan not found" };
    }
    return { success: true, statusCode: 200, message: "Trial settings updated", data: plan };
  } catch (err: any) {
    return { success: false, statusCode: 500, message: err?.message ?? "Failed to update trial" };
  }
};