// modules/analytics/analytics.service.ts
import mongoose                           from "mongoose";
import Location                           from "../../models/location.model.js";
import Analytics                          from "../../models/analytics.model.js";
import Reviews                            from "../../models/reviews.model.js";
import Feedback                           from "../../models/Feedback.model.js";
import User                               from "../../models/user.model.js";
import UserSubscription                   from "../../models/userSubscription.model.js";
import { generateText }                   from "../../utils/gemini/gemini.js";
import { ANALYSIS_SYSTEM_PROMPT, PROMPT } from "../../utils/gemini/prompt.js";
import { ANALYSIS_STALE_TIME }            from "../../utils/constant/analyticsConstants.js";
import { getGBPReviews }                  from "../../utils/Gbp/gbp.js";
import { calculateReputationScore }       from "../../utils/analytics/reputationScore.js";
import { calculateReviewAge }             from "../../utils/analytics/reviewAge.js";
import { calculateReviewVelocity }        from "../../utils/analytics/reviewVelocity.js";
import { calculateReviewDistribution }    from "../../utils/analytics/reviewDistribution.js";
import { calculateVelocityTrend }         from "../../utils/analytics/velocityTrend.js";
import { calculateResponseRate }          from "../../utils/analytics/responseRate.js";
import {
  calculateSentimentBreakdown,
  calculateSentimentScore,
  getVelocityStatus,
}                                         from "../../utils/analytics/sentimentBreakdown.js";
import { fetchPerformanceData }           from "../../utils/analytics/performance.js";
import { fetchSearchKeywords }            from "../../utils/analytics/gbp/searchKeywords.js";
import { fetchPhotoInsights }             from "../../utils/analytics/gbp/photos.js";
import { fetchPostInsights }              from "../../utils/analytics/gbp/posts.js";
import { getValidAccessTokenService }     from "../GBP/gbp.service.js";
import type { PopulatedUser }             from "../../types/userTypes.js";
import type { ServiceResponse }           from "../../types/serviceResponse.js";

// ─── types ────────────────────────────────────────────────────────────────────

interface NormalizedReview {
  text:     string;
  rating:   number;
  time:     Date;
  source:   "google" | "gbp" | "private";
  replied?: boolean;
}

// ─── normalizers ──────────────────────────────────────────────────────────────

const normalizeGoogleReview = (r: any): NormalizedReview => ({
  text:   r.text   ?? "",
  rating: r.rating ?? 0,
  time:   new Date(r.reviewTime ?? r.createdAt),
  source: "google",
});

const normalizeGBPReview = (r: any): NormalizedReview => {
  const starMap: Record<string, number> = {
    ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5,
  };
  return {
    text:    r.comment ?? "",
    rating:  starMap[r.starRating] ?? 0,
    time:    new Date(r.createTime),
    source:  "gbp",
    replied: !!r.reviewReply,
  };
};

const normalizePrivateFeedback = (r: any): NormalizedReview => {
  const answers = (r.answers ?? [])
    .map((a: any) => `${a.questionText}: ${a.value}`)
    .join(". ");
  return {
    text:    `Rating: ${r.rating}/5. Feedback: ${answers}`,
    rating:  r.rating ?? 0,
    time:    new Date(r.createdAt),
    source:  "private",
    replied: false,
  };
};

// ─── analyze service ──────────────────────────────────────────────────────────

export const analyzeService = async (
  userId:     string,
  placeId:    string,
  locationId: string
): Promise<ServiceResponse> => {

  if (!locationId) return { success: false, statusCode: 400, message: "No locationId provided" };
  if (!placeId)    return { success: false, statusCode: 400, message: "No placeId provided"    };

  // ── subscription + credits check ─────────────────────────────────────────
  const user = await User.findById(userId)
    .populate("activeSubscription") as PopulatedUser | null;

  if (!user?.activeSubscription) {
    return { success: false, statusCode: 404, message: "No active subscription" };
  }

  const now          = new Date();
  const currentCycle = user.activeSubscription.cycles.find(
    (c) => now >= c.startDate && now <= c.endDate
  );

  if (!currentCycle) {
    return { success: false, statusCode: 404, message: "No active billing cycle found" };
  }

  const creditsUsed  = currentCycle.analyses?.creditsUsed  ?? 0;
  const creditsTotal = currentCycle.analyses?.creditsTotal ?? null;

  if (creditsTotal !== null && creditsUsed >= creditsTotal) {
    return { success: false, statusCode: 403, message: "Analysis credits exhausted. Upgrade your plan." };
  }

  // ── stale check ───────────────────────────────────────────────────────────
  const existing = await Analytics.findOne({
    locationId: new mongoose.Types.ObjectId(locationId),
  });

  if (existing && existing.stale > now) {
    return {
      success:    true,
      statusCode: 200,
      message:    "Analysis returned from cache",
      data: {
        staleTime:       existing.stale,
        analysis:        existing.analysis,
        reviewSources:   existing.reviewSources,
        reviewAge:       existing.reviewAge,
        unrepliedCount:  existing.unrepliedCount,
        reputationScore: existing.reputationScore,
        totalAnalysed:   existing.totalAnalysed,
        performance:     existing.performance,
        gbpInsights:     existing.gbpInsights,
      },
    };
  }

  // ── get location ──────────────────────────────────────────────────────────
  const location = await Location.findById(locationId).lean();
  if (!location) {
    return { success: false, statusCode: 404, message: "Location not found" };
  }

  const isGBP     = (location as any).source === "gbp";
  const accountId = (location as any).gbpAccountId;
  const gbpLocId  = (location as any).gbpLocationId;

  // ── review volume from subscription snapshot ──────────────────────────────
  const reviewVolume = user.activeSubscription.snapshot?.limits?.reviewAnalysisVolume ?? 500;
  const maxReviews   = Math.min(reviewVolume ?? 500, 500);

  // ── fetch reviews ─────────────────────────────────────────────────────────
  let normalized:  NormalizedReview[] = [];
  let accessToken: string | null      = null;

  if (isGBP) {
    try {
      const token = await getValidAccessTokenService(userId);
      accessToken = token ?? null;

      if (accessToken && accountId && gbpLocId) {
        let allGBP: any[]                 = [];
        let pageToken: string | undefined = undefined;

        do {
          const res: any = await getGBPReviews(
            accessToken,
            gbpLocId,
            accountId,
            pageToken
          );
          const batch = res.reviews ?? [];
          allGBP.push(...batch);
          pageToken = res.nextPageToken ?? undefined;
          if (allGBP.length >= maxReviews) break;
        } while (pageToken);

        allGBP = allGBP
          .sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
          .slice(0, maxReviews);

        normalized = allGBP.map(normalizeGBPReview);

      } else {
        throw new Error("GBP not connected");
      }
    } catch {
      accessToken     = null;
      const dbReviews = await Reviews.find({ locationId })
        .sort({ reviewTime: -1 })
        .limit(5)
        .lean();
      normalized = dbReviews.map(normalizeGoogleReview);
    }
  } else {
    const dbReviews = await Reviews.find({ locationId })
      .sort({ reviewTime: -1 })
      .limit(5)
      .lean();
    normalized = dbReviews.map(normalizeGoogleReview);
  }

  // ── private feedback ──────────────────────────────────────────────────────
  const feedbacks = await Feedback.find({ locationId })
    .sort({ createdAt: -1 })
    .limit(maxReviews)
    .lean();

  const privateReviews = feedbacks.map(normalizePrivateFeedback);

  // ── merge + sort + cap ────────────────────────────────────────────────────
  const merged = [...normalized, ...privateReviews]
    .sort((a, b) => b.time.getTime() - a.time.getTime())
    .slice(0, maxReviews);

  // ── unrepliedCount — from merged GBP reviews only ────────────────────────
  const mergedGBP      = merged.filter((r) => r.source === "gbp");
  const unrepliedCount = mergedGBP.filter((r) => !r.replied).length;

  // ── compute ALL deterministic fields ─────────────────────────────────────
  const reputationScore    = calculateReputationScore(merged, unrepliedCount);
  const reviewAge          = calculateReviewAge(merged);
  const reviewVelocity     = calculateReviewVelocity(merged);
  const reviewDistribution = calculateReviewDistribution(merged);
  const velocityTrend      = calculateVelocityTrend(merged);
  const sentimentBreakdown = calculateSentimentBreakdown(merged);
  const sentimentScore     = calculateSentimentScore(merged);
  const velocityStatus     = getVelocityStatus(reviewVelocity);
  const responseRate       = calculateResponseRate(merged);

  // ── build response rate insight deterministically ─────────────────────────
  const responseRateInsight =
    responseRate.value === 0
      ? "No owner responses detected — replying to reviews significantly improves customer trust."
      : responseRate.value < 40
        ? `Only ${responseRate.value}% of reviews have been replied to — aim for at least 80%.`
        : responseRate.value < 80
          ? `${responseRate.value}% of reviews have received a response — good progress, keep going.`
          : `${responseRate.value}% response rate — excellent engagement with customer feedback.`;

  // ── count sources from merged ─────────────────────────────────────────────
  const reviewSources = {
    google:  merged.filter((r) => r.source === "google").length,
    gbp:     merged.filter((r) => r.source === "gbp").length,
    private: merged.filter((r) => r.source === "private").length,
  };

  // ── fetch all GBP data in parallel ───────────────────────────────────────
  const canFetchGBP = isGBP && !!accessToken && !!accountId && !!gbpLocId;

  const [performance, searchKeywords, photos, posts] = await Promise.all([
    canFetchGBP
      ? fetchPerformanceData(accessToken!, accountId, gbpLocId)
      : Promise.resolve(null),
    canFetchGBP
      ? fetchSearchKeywords(accessToken!, gbpLocId)
      : Promise.resolve(null),
    canFetchGBP
      ? fetchPhotoInsights(accessToken!, accountId, gbpLocId)
      : Promise.resolve(null),
    canFetchGBP
      ? fetchPostInsights(accessToken!, accountId, gbpLocId)
      : Promise.resolve(null),
  ]);

  // ── build prompt ──────────────────────────────────────────────────────────
  const sourceSummary = `Google/Places: ${reviewSources.google}, GBP: ${reviewSources.gbp}, Private: ${reviewSources.private}. Total sent: ${merged.length} (capped at ${maxReviews}). Base ALL text analysis ONLY on these ${merged.length} reviews.`;

  const prompt = PROMPT
    .replace("{{location}}",        JSON.stringify({
      name:    (location as any).name,
      address: (location as any).address,
      types:   (location as any).types,
    }))
    .replace("{{totalReviews}}",    String(merged.length))
    .replace("{{reviews}}",         JSON.stringify(merged, null, 2))
    .replace("{{sources}}",         sourceSummary)
    .replace("{{reputationScore}}", String(reputationScore))
    .replace("{{searchKeywords}}",  JSON.stringify(
      searchKeywords?.map((k) => ({ keyword: k.keyword, impressions: k.impressions })) ?? []
    ));

  // ── call Gemini ───────────────────────────────────────────────────────────
  const raw = await generateText(prompt, ANALYSIS_SYSTEM_PROMPT);

  const cleaned = raw
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  const parsedAnalysis = JSON.parse(cleaned);

  // ── force ALL deterministic values ───────────────────────────────────────
  parsedAnalysis.summary.reputationScore                       = reputationScore;
  parsedAnalysis.summary.totalReviews                          = merged.length;
  parsedAnalysis.summary.overallRating                         = reviewDistribution.avgReviews;
  parsedAnalysis.summary.reviewVelocity.value                  = reviewVelocity;
  parsedAnalysis.summary.reviewVelocity.status                 = velocityStatus;
  parsedAnalysis.summary.responseRate.value                    = responseRate.value;
  parsedAnalysis.summary.responseRate.status                   = responseRate.status;
  parsedAnalysis.summary.responseRate.insight                  = responseRateInsight;
  parsedAnalysis.summary.customerSentiment.score               = sentimentScore;
  parsedAnalysis.reviewDistribution                            = reviewDistribution;
  parsedAnalysis.velocityTrend                                 = velocityTrend;
  parsedAnalysis.customerExperienceAnalysis.sentimentBreakdown = sentimentBreakdown;

  // ── force searchKeywords impressions — keep Gemini's type classification ──
  if (parsedAnalysis.searchKeywords && searchKeywords?.length) {
    parsedAnalysis.searchKeywords = parsedAnalysis.searchKeywords.map(
      (k: any, i: number) => ({
        keyword:     searchKeywords[i]?.keyword     ?? k.keyword,
        impressions: searchKeywords[i]?.impressions ?? k.impressions,
        type:        k.type ?? "generic",
      })
    );
  }

  // ── build gbpInsights — searchKeywords from parsedAnalysis (has type) ────
  const gbpInsights = canFetchGBP
    ? {
        searchKeywords: parsedAnalysis.searchKeywords ?? searchKeywords ?? null,
        photos,
        posts,
      }
    : null;

  // ── remove searchKeywords from analysis (stored separately in gbpInsights) ─
  delete parsedAnalysis.searchKeywords;

  // ── save everything in one update ─────────────────────────────────────────
  const savedAnalytics = await Analytics.findOneAndUpdate(
    { locationId },
    {
      $set: {
        analysis:        parsedAnalysis,
        reputationScore,
        totalAnalysed:   merged.length,
        reviewSources,
        reviewAge,
        unrepliedCount,
        performance,
        gbpInsights,
        stale:           new Date(Date.now() + ANALYSIS_STALE_TIME),
      },
      $setOnInsert: { locationId },
    },
    { upsert: true, new: true }
  );

  // ── decrement credits ─────────────────────────────────────────────────────
  await UserSubscription.findOneAndUpdate(
    {
      _id:    user.activeSubscription._id,
      cycles: {
        $elemMatch: {
          startDate: { $lte: now },
          endDate:   { $gt:  now },
        },
      },
    },
    { $inc: { "cycles.$.analyses.creditsUsed": 1 } }
  );

  return {
    success:    true,
    statusCode: 200,
    message:    "Analysis completed successfully",
    data: {
      staleTime:       savedAnalytics.stale,
      analysis:        parsedAnalysis,
      reviewSources,
      reviewAge,
      unrepliedCount,
      reputationScore,
      totalAnalysed:   merged.length,
      performance,
      gbpInsights,
    },
  };
};

// ─── get analytics service ────────────────────────────────────────────────────

export const getAnalyticsService = async (
  locationId: string
): Promise<ServiceResponse> => {

  const analytics = await Analytics.findOne({
    locationId: new mongoose.Types.ObjectId(locationId),
  }).select("analysis stale reviewSources reviewAge unrepliedCount reputationScore totalAnalysed performance gbpInsights createdAt updatedAt");

  if (!analytics) {
    return { success: true, statusCode: 200, message: "No analytics found for this location" };
  }

  return {
    success:    true,
    statusCode: 200,
    message:    "Analytics returned successfully",
    data: {
      staleTime:       analytics.stale,
      analysis:        analytics.analysis,
      reviewSources:   analytics.reviewSources,
      reviewAge:       analytics.reviewAge,
      unrepliedCount:  analytics.unrepliedCount,
      reputationScore: analytics.reputationScore,
      totalAnalysed:   analytics.totalAnalysed,
      performance:     analytics.performance,
      gbpInsights:     analytics.gbpInsights,
      createdAt:       analytics.createdAt,
      updatedAt:       analytics.updatedAt,
    },
  };
};