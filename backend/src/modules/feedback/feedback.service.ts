import Feedback       from "../../models/Feedback.model.js";
import Location       from "../../models/location.model.js";
import LocationAccess from "../../models/locationAccess.model.js";
import User           from "../../models/user.model.js";
import Reviews        from "../../models/reviews.model.js";
import {
  getPaginationParams,
  getPaginationInfo,
}                     from "../../utils/pagination.js";
import {
  BAD_REVIEW_THRESHOLD,
  BAD_REVIEW_MAX_RATING,
}                     from "../../utils/constant/feedbackConstant.js";
import {
  checkScanLimit,
  checkAiReviewLimit,
  decrementScan,
  decrementAiReview,
  type ScanCheckResult,
}                     from "../../utils/limits/subscriptionlimit.js";
import {
  buildReviewPrompt,
  getRandomWordCount,
  REVIEW_SYSTEM_PROMPT,
}                     from "../../utils/gemini/prompt.js";
import { generateText }         from "../../utils/gemini/gemini.js";
import type { ServiceResponse } from "../../types/serviceResponse.js";
import type { ParsedQs }        from "qs";

// ─── get location for feedback ────────────────────────────────────────────────

export const getLocationForFeedbackService = async (
  placeId:   string,
  createdBy: string
): Promise<ServiceResponse> => {
  try {
    const location = await Location.findOne({
      placeId,
      createdBy,
      isDeleted: false,
      isActive:  true,
    }).select("_id name address reviewLink createdBy isDeleted isActive badReviewRedirect");

    if (!location) {
      return { success: false, statusCode: 404, message: "Location not found" };
    }

    // ── subscription + scan limit check ──────────────────────────────────────
    const scanCheck = await checkScanLimit(createdBy);

    if (!scanCheck.allowed) {
      return {
        success:    false,
        statusCode: 403,
        message:    scanCheck.reason === "limit_reached"
          ? "Scan limit reached"
          : "No active subscription found",
      };
    }

    // ── bad review redirect check ─────────────────────────────────────────────
    const user = await User.findById(createdBy).select("badReviewRedirectEnabled");

    const globalEnabled    = user?.badReviewRedirectEnabled       ?? false;
    const locationEnabled  = location.badReviewRedirect?.enabled  ?? false;
    const isFeatureEnabled = globalEnabled && locationEnabled;
    const badReviewCount   = location.badReviewRedirect?.badReviewCount ?? 0;
    const shouldRedirect   = isFeatureEnabled && badReviewCount >= BAD_REVIEW_THRESHOLD;

    return {
      success:    true,
      statusCode: 200,
      message:    "OK",
      data: {
        location: {
          _id:        location._id,
          name:       location.name,
          address:    location.address,
          reviewLink: location.reviewLink,
        },
        shouldRedirect,
      },
    };

  } catch (err: any) {
    return {
      success:    false,
      statusCode: 500,
      message:    err?.message ?? "Something went wrong",
    };
  }
};

// ─── reset bad review count ───────────────────────────────────────────────────

export const resetBadReviewCountService = async (
  locationId: string
): Promise<ServiceResponse> => {
  try {
    await Location.findByIdAndUpdate(locationId, {
      $set: { "badReviewRedirect.badReviewCount": 0 },
    });
    return { success: true, statusCode: 200, message: "Reset successful" };
  } catch (err: any) {
    return {
      success:    false,
      statusCode: 500,
      message:    err?.message ?? "Failed to reset",
    };
  }
};

// ─── create feedback ──────────────────────────────────────────────────────────

export const createFeedbackService = async (
  locationId: string,
  data: {
    fullName?:   string;
    phoneNumber?: string;
    rating:      number;
    answers?:    { questionText: string; questionType: string; value: unknown }[];
    comment?:    string;
    createdBy:   string;
  }
): Promise<ServiceResponse> => {
  try {
    const location = await Location.findOne({
      _id:       locationId,
      isDeleted: false,
      isActive:  true,
    }).select("_id createdBy badReviewRedirect");

    if (!location) {
      return { success: false, statusCode: 404, message: "Location not found" };
    }

    const answers = [...(data.answers ?? [])];
    if (data.comment?.trim()) {
      answers.push({
        questionText: "Additional comments",
        questionType: "text",
        value:        data.comment.trim(),
      });
    }

    const isBadReview = data.rating <= BAD_REVIEW_MAX_RATING;

    if (isBadReview) {
      const admin = await User.findById(location.createdBy)
        .select("badReviewRedirectEnabled");

      const globalEnabled   = admin?.badReviewRedirectEnabled     ?? false;
      const locationEnabled = location.badReviewRedirect?.enabled ?? false;

      if (globalEnabled && locationEnabled) {
        await Location.findByIdAndUpdate(locationId, {
          $inc: { "badReviewRedirect.badReviewCount": 1 },
        });
      }
    }

    // ── decrement totalScans ──────────────────────────────────────────────────
    const scanCheck = await checkScanLimit(data.createdBy);
    if (scanCheck.allowed) {
      await decrementScan(scanCheck.subscription._id.toString());
    }

  const feedback = await Feedback.create({
  locationId,
  rating:  data.rating,
  answers,
  source:  "qr",
  status:  "new",
  ...(data.fullName?.trim()    && { fullName:    data.fullName.trim()    }),
  ...(data.phoneNumber?.trim() && { phoneNumber: data.phoneNumber.trim() }),
});

    return {
      success:    true,
      statusCode: 201,
      message:    "Feedback submitted successfully",
      data:       feedback,
    };
  } catch (err: any) {
    return {
      success:    false,
      statusCode: 500,
      message:    err?.message ?? "Failed to submit feedback",
    };
  }
};

// ─── get feedback by location ─────────────────────────────────────────────────

export const getFeedbackByLocationService = async (
  userId:     string,
  locationId: string,
  query:      ParsedQs
): Promise<ServiceResponse> => {
  try {
    const location = await Location.findOne({
      _id:       locationId,
      isDeleted: false,
    });
    if (!location) {
      return { success: false, statusCode: 404, message: "Location not found" };
    }

    const access = await LocationAccess.findOne({
      userId,
      locationId,
      isDeleted: false,
    });
    if (!access) {
      return { success: false, statusCode: 403, message: "You do not have access to this location" };
    }

    const { page, limit, skip } = getPaginationParams(query);

    const filter: Record<string, unknown> = { locationId };

    if (query.rating) {
      filter.rating = parseInt(query.rating as string);
    }

    if (query.startDate || query.endDate) {
      filter.createdAt = {
        ...(query.startDate && { $gte: new Date(query.startDate as string) }),
        ...(query.endDate   && { $lte: new Date(new Date(query.endDate as string).setHours(23, 59, 59, 999)) }),
      };
    }

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      newest:         { createdAt: -1 },
      oldest:         { createdAt:  1 },
      highest_rating: { rating:    -1 },
      lowest_rating:  { rating:     1 },
    };

    const sortQuery = sortMap[query.sort as string] ?? { createdAt: -1 };

    const [feedbacks, total] = await Promise.all([
      Feedback.find(filter)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit),
      Feedback.countDocuments(filter),
    ]);

    return {
      success:    true,
      statusCode: 200,
      message:    "Feedbacks fetched",
      data: {
        feedbacks,
        pagination: getPaginationInfo(total, page, limit),
      },
    };
  } catch (err: any) {
    return {
      success:    false,
      statusCode: 500,
      message:    err?.message ?? "Failed to fetch feedbacks",
    };
  }
};

// ─── record scan ──────────────────────────────────────────────────────────────

export const recordScanService = async (
  locationId:   string,
  createdBy:    string,
  isRegenerate: boolean = false,
  chips:        string[]
): Promise<ServiceResponse> => {
  try {
    const [location, scanCheck, aiReviewCheck] = await Promise.all([
      Location.findOne({
        _id:       locationId,
        isDeleted: false,
        isActive:  true,
      }).select("name reviewLink types").lean(),

      isRegenerate
        ? Promise.resolve({ allowed: false, reason: "skip" } as const)
        : checkScanLimit(createdBy),

      checkAiReviewLimit(createdBy),
    ]);

    if (!location) {
      return { success: false, statusCode: 404, message: "Location not found" };
    }

    // ── decrement totalScans (first call only) ────────────────────────────────
    if (!isRegenerate && (scanCheck as ScanCheckResult).allowed) {
      decrementScan(
        (scanCheck as Extract<ScanCheckResult, { allowed: true }>).subscription._id.toString()
      ).catch(console.error);
    }

    // ── AI review generation ──────────────────────────────────────────────────
    let AiReply: string | null = null;

    const shouldGenerate =
      (aiReviewCheck as any).reason === "unlimited" ||
      aiReviewCheck.allowed;

    if (shouldGenerate) {
      const wordCount     = getRandomWordCount();
      const review_prompt = buildReviewPrompt(
        location.name,
        (location as any).types?.join(", ") ?? "",
        wordCount,
        chips
      );

      // decrement aiReviews only if has limit (not unlimited)
      if (aiReviewCheck.allowed) {
        decrementAiReview(
          (aiReviewCheck as any).subscription._id.toString()
        ).catch(console.error);
      }

      AiReply = await generateText(review_prompt, REVIEW_SYSTEM_PROMPT);
    }

    return {
      success:    true,
      statusCode: 200,
      message:    "Scan recorded",
      data: {
        reviewLink: (location as any).reviewLink,
        AiReply,
      },
    };

  } catch (err: any) {
    // 429 → AI quota exceeded → still return reviewLink so user can proceed
    if (err?.status === 429) {
      const loc = await Location.findById(locationId).select("reviewLink").lean();
      return {
        success:    true,
        statusCode: 200,
        message:    "Scan recorded",
        data: {
          reviewLink: (loc as any)?.reviewLink ?? null,
          AiReply:    null,
        },
      };
    }

    return {
      success:    false,
      statusCode: 500,
      message:    err?.message ?? "Failed to record scan",
    };
  }
};



