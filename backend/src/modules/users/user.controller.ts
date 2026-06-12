// modules/user/user.controller.ts
import type { Request, Response } from "express";
import sendResponse from "../../utils/response.js";
import { getAllUsersService, updateProfileService, updateUserStatusService, getSubscriptionByIdService,getUserByIdService, analysisLeftService } from "./user.service.js";
import type { JwtPayload } from "../../types/authTypes.js";

export const getAllUsers = async (req: Request, res: Response) => {
  const result = await getAllUsersService(req.query);

 return sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Users fetched successfully",
    data: result.data,
    pagination: result.pagination
  });
};

export const updateProfile = async(req: Request, res: Response) => {
  const id = (req.user as JwtPayload)?.userId;

  const data = await updateProfileService(
    id,
    req.body
  );

  return sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Profile updated successfully",
    data
  });
};

export const updateUserStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id as string;
    const { action } = req.body as {
      action: "activate" | "deactivate";
    };

    // ✅ Validate action
    if (!action || !["activate", "deactivate"].includes(action)) {
      throw new Error("Invalid action. Use 'activate' or 'deactivate'");
    }

    const data = await updateUserStatusService(id, action);

    return sendResponse(res, {
      success: true,
      statusCode: 200,
      message:
        action === "deactivate"
          ? "User deactivated successfully"
          : "User activated successfully",
      data
    });
  } catch (error: any) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: error.message || "Something went wrong"
    });
  }
};

// controllers/subscription.controller.ts

export const getSubscriptionById = async (
  req: Request,
  res: Response
) => {
  try {
    const { subscriptionId } = req.params as { subscriptionId: string };

    const data = await getSubscriptionByIdService(
      subscriptionId
    );

    return res.status(200).json({
      success: true,
      message: "Subscription fetched successfully",
      data,
    });
  } catch (error: any) {
    console.error("Get Subscription By ID Error:", error);

    if (
      error.message === "Invalid subscription ID"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (
      error.message === "Subscription not found"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id as string;

    const profile = await getUserByIdService(userId);

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: profile,
    });
  } catch (error: any) {
    console.error("Get My Profile Controller Error:", error);

    if (error.message === "Invalid user id") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === "User not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};;

export const analysisLeft=async(req: Request, res:Response)=>{
  const result=await analysisLeftService(req?.user?.userId!);
  return sendResponse(res,result);
}