import User from "../../models/user.model.js";
import mongoose from "mongoose";
import UserSubscription from "../../models/userSubscription.model.js";
import { mapSubscriptionDetails } from "../../utils/subscription/mapSubscriptionDetails.js";
type GetSubscriptionQuery = {
  status?: "active" | "expired" | "cancelled" | "pending" | "failed";
  startDate?: string;
  endDate?: string;
  page?: string;
  limit?: string;
};

import {
  getPaginationParams,
  getPaginationInfo
} from "../../utils/pagination.js";
import type {
  GetAllUsersQuery, UserFilter,
  GetAllUsersResponse,
  UpdateProfileInput
} from "../../types/userTypes.js";
export const getAllUsersService = async (
  query: GetAllUsersQuery
) => {
  const { page, limit, skip } = getPaginationParams(query);

  const filter: UserFilter = {
    role: { $ne: "super_admin" }
  };

  if (query.isDeleted !== undefined) {
    filter.isDeleted = query.isDeleted === "true";
  } else {
    filter.isDeleted = false; // default active users
  }

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
      { phoneNumber: { $regex: query.search, $options: "i" } }
    ];
  }

  const [data, totalDocs] = await Promise.all([
    User.find(filter)
      .select(" name email phoneNumber role createdAt  updatedAt isDeleted provider")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    User.countDocuments(filter)
  ]);
  const pagination = getPaginationInfo(
    totalDocs,
    page,
    limit
  );

  return {
    success: true,
    statusCode: 200,
    message: "Users fetched successfully",
    data,
    pagination
  } as GetAllUsersResponse;
};
export const updateProfileService = async (
  userId: string,
  payload: UpdateProfileInput
) => {
  // ✅ Step 1: Validate ObjectId
  if (!mongoose.isValidObjectId(userId)) {
    throw new Error("Invalid user ID");
  }

  // ❌ Step 2: Avoid setting undefined values (your current bug)
  const updateData: Partial<UpdateProfileInput> = {};

  if (payload.name !== undefined) {
    updateData.name = payload.name;
  }

  if (payload.phoneNumber !== undefined) {
    updateData.phoneNumber = payload.phoneNumber;
  }

  // ⚠️ If nothing to update, don't hit DB
  if (Object.keys(updateData).length === 0) {
    throw new Error("No valid fields to update");
  }

  const data = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    {
      returnDocument: "after",
      runValidators: true
    }
  ).select("name email phoneNumber role");

  // ✅ Step 3: Handle not found
  if (!data) {
    throw new Error("User not found");
  }

  return data;
};
export const updateUserStatusService = async (
  userId: string,
  action: "activate" | "deactivate"
) => {
  // ✅ Validate ID
  if (!mongoose.isValidObjectId(userId)) {
    throw new Error("Invalid user ID");
  }

  // ✅ Map action → DB value
  const isDeleted = action === "deactivate";

  const data = await User.findByIdAndUpdate(
    userId,
    { $set: { isDeleted } },
    {
      returnDocument: "after",
      runValidators: true
    }
  ).select("name email phoneNumber role isDeleted");

  if (!data) {
    throw new Error("User not found");
  }

  return data;
};
// services/subscription/getSubscriptionById.service.ts

export const getSubscriptionByIdService = async (
  subscriptionId: string,

) => {
  if (!mongoose.isValidObjectId(subscriptionId)) {
    throw new Error("Invalid subscription ID");
  }

  const filter: any = {
    _id: subscriptionId,
  };


  const subscription = await UserSubscription.findOne(filter)
    .populate({
      path: "plan",
      select: `
        name
        tier
        currency
        price
        limits
        isPopular
      `,
    })
    .lean();

  if (!subscription) {
    throw new Error("Subscription not found");
  }

  return mapSubscriptionDetails(subscription);
};
export const getUserByIdService = async (userId: string) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user id");
  }

  const user = await User.findById(userId)
    .select("name role provider activeSubscription")
  // .populate({
  //   path: "activeSubscription",
  //   select: `
  //     snapshot
  //     status
  //     startDate
  //     endDate
  //     payments
  //     cycles
  //   `,
  // });

  if (!user) {
    throw new Error("User not found");
  }

  const subscriptionHistory = await UserSubscription.find({
    user: userId,
  })
    .select(`
      snapshot
      status
      startDate
      endDate
    `)
    .sort({ createdAt: -1 });

  return {
    _id: user._id,
    name: user.name,
    role: user.role,
    provider: user.provider,

    activeSubscription: user.activeSubscription,

    subscriptionHistory,
  };
};
export const analysisLeftService = async (userId: string) => {
  const user = await User.findById(userId).select("activeSubscription");

  if (!user?.activeSubscription) {
    return {
      success:    false,
      message:    "No active subscription",
      statusCode: 404,
    };
  }

  const subscription = await UserSubscription.findById(user.activeSubscription);

  if (!subscription) {
    return {
      success:    false,
      message:    "Subscription not found",
      statusCode: 404,
    };
  }

  const now = new Date();

  const currentCycle = subscription.cycles.find(
    (cycle) => now >= cycle.startDate && now <= cycle.endDate
  );

  if (!currentCycle) {
    return {
      success:    false,
      message:    "No active billing cycle found",
      statusCode: 404,
    };
  }

  return {
    success:    true,
    statusCode: 200,
    data: {
      // ── tracked usage (depletable) ──────────────────────────────────────
      analyses:             currentCycle.analyses,
      aiReplies:            currentCycle.aiReplies,
      totalScans:           currentCycle.totalScans,
      aiReviews:            currentCycle.aiReviews,
      aiAutoReplies:        currentCycle.aiAutoReplies,
      whatsappMessages:     currentCycle.whatsappMessages,
      aiCompetitorAnalysis: currentCycle.aiCompetitorAnalysis, // ← new

      // ── static capacity (read from snapshot) ───────────────────────────
      reviewAnalysisVolume: subscription.snapshot?.limits?.reviewAnalysisVolume ?? null,
    },
  };
};