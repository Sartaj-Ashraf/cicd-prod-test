// utils/cron/autoReplyWorker.ts
import axios                             from "axios";
import User                              from "../models/user.model.js";
import UserSubscription                  from "../models/userSubscription.model.js";
import Location                          from "../models/location.model.js";
import { getValidAccessTokenService }    from "../modules/GBP/gbp.service.js";
import { generateText }                  from "../utils/gemini/gemini.js";
import { buildReplyPrompt, REPLY_SYSTEM_PROMPT } from "../utils/gemini/reviewReply.js";
import { withGBPRateLimit }              from "./gbpRateLimiter.js";
import { CRON_CONSTANTS } from "../utils/constant/cronConstants.js";

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const GBP_BASE_URL = "https://mybusiness.googleapis.com/v4";

const STAR_MAP: Record<string, number> = {
  ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5,
};

// ── fetch unreplied GBP reviews from last 24h ─────────────────────────────────
const fetchUnrepliedReviews = async (
  accessToken: string,
  accountId:   string,
  locationId:  string
): Promise<any[]> => {
  const res = await withGBPRateLimit(
    () => axios.get(
      `${GBP_BASE_URL}/accounts/${accountId}/locations/${locationId}/reviews`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params:  { pageSize: CRON_CONSTANTS.REVIEW_PAGE_SIZE },
      }
    ),
    `fetch reviews ${locationId}`
  );

  if (!res) return [];

  const reviews: any[] = res.data.reviews ?? [];
  const cutoff          = new Date(Date.now() - CRON_CONSTANTS.REVIEW_LOOKBACK_MS);

  return reviews.filter((r: any) => {
    const createdAt = new Date(r.createTime);
    const hasReply  = !!r.reviewReply;
    return createdAt >= cutoff && !hasReply;
  });
};

// ── post reply to GBP ─────────────────────────────────────────────────────────
const postReplyToGBP = async (
  accessToken: string,
  accountId:   string,
  locationId:  string,
  reviewId:    string,
  reply:       string
): Promise<boolean> => {
  const reviewName = `accounts/${accountId}/locations/${locationId}/reviews/${reviewId}`;

  const result = await withGBPRateLimit(
    () => axios.put(
      `${GBP_BASE_URL}/${reviewName}/reply`,
      { comment: reply },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    ),
    `post reply ${reviewId}`
  );

  return result !== null;
};

// ── decrement aiAutoReplies ───────────────────────────────────────────────────
const decrementAutoReplies = async (userId: string): Promise<void> => {
  const now = new Date();
  await UserSubscription.findOneAndUpdate(
    {
      user:   userId,
      status: "active",
      cycles: {
        $elemMatch: {
          startDate: { $lte: now },
          endDate:   { $gt:  now },
        },
      },
    },
    { $inc: { "cycles.$.aiAutoReplies.creditsUsed": 1 } }
  );
};

// ── check remaining aiAutoReplies ─────────────────────────────────────────────
const getAutoRepliesLeft = async (userId: string): Promise<number> => {
  const now          = new Date();
  const subscription = await UserSubscription.findOne({
    user:   userId,
    status: "active",
  }).lean();

  if (!subscription) return 0;

  const currentCycle = (subscription.cycles ?? []).find(
    (c: any) => new Date(c.startDate) <= now && new Date(c.endDate) > now
  );

  if (!currentCycle) return 0;

  const total = currentCycle.aiAutoReplies?.creditsTotal ?? null;
  const used  = currentCycle.aiAutoReplies?.creditsUsed  ?? 0;

  if (total === null) return Infinity;
  return Math.max(0, total - used);
};

// ── extract numeric id ────────────────────────────────────────────────────────
const extractNumericId = (id: string): string => {
  const match = id.match(/(\d+)$/);
  return match?.[1] ?? id;
};

// ── main per-user worker ──────────────────────────────────────────────────────
export const processUserAutoReply = async (userId: string): Promise<void> => {
  try {
    console.log(`[AUTO-REPLY] processing user: ${userId}`);

    const user = await User.findById(userId).lean();
    if (!user || user.isDeleted || (user as any).role !== "admin") {
      console.log(`[AUTO-REPLY] skipping user ${userId} — not admin or deleted`);
      return;
    }

    const creditsLeft = await getAutoRepliesLeft(userId);
    if (creditsLeft === 0) {
      console.log(`[AUTO-REPLY] skipping user ${userId} — 0 credits`);
      return;
    }

    const location = await Location.findOne({
      createdBy: userId,
      source:    "gbp",
      isDeleted: false,
    }).lean();

    if (!location) {
      console.log(`[AUTO-REPLY] skipping user ${userId} — no GBP location`);
      return;
    }

    const accountId  = extractNumericId((location as any).gbpAccountId  ?? "");
    const locationId = extractNumericId((location as any).gbpLocationId ?? "");

    if (!accountId || !locationId) {
      console.log(`[AUTO-REPLY] skipping user ${userId} — missing GBP IDs`);
      return;
    }

    const accessToken = await getValidAccessTokenService(userId);
    if (!accessToken) {
      console.log(`[AUTO-REPLY] skipping user ${userId} — GBP not connected`);
      return;
    }

    const reviews = await fetchUnrepliedReviews(accessToken, accountId, locationId);
    if (!reviews.length) {
      console.log(`[AUTO-REPLY] user ${userId} — no unreplied reviews`);
      return;
    }

    console.log(`[AUTO-REPLY] user ${userId} — ${reviews.length} reviews to process`);

    for (const review of reviews) {
      try {
        const remaining = await getAutoRepliesLeft(userId);
        if (remaining === 0) {
          console.log(`[AUTO-REPLY] user ${userId} — ran out of credits mid-processing`);
          break;
        }

        const rating     = STAR_MAP[review.starRating] ?? 0;
        const reviewText = review.comment                    ?? "";
        const authorName = review.reviewer?.displayName      ?? "Guest";
        const reviewId   = review.name?.split("/").pop()     ?? "";

        if (!reviewId) {
          console.warn(`[AUTO-REPLY] skipping review — no reviewId`);
          continue;
        }

        const prompt = buildReplyPrompt(
          reviewText,
          rating,
          authorName,
          (location as any).name              ?? "",
          (location as any).types?.join(", ") ?? "",
        );

        const reply = await generateText(prompt, REPLY_SYSTEM_PROMPT);
        if (!reply?.trim()) {
          console.warn(`[AUTO-REPLY] Gemini returned empty reply for review ${reviewId}`);
          continue;
        }

        const posted = await postReplyToGBP(
          accessToken,
          accountId,
          locationId,
          reviewId,
          reply.trim()
        );

        if (posted) {
          await decrementAutoReplies(userId);
          console.log(`[AUTO-REPLY] ✅ replied to review ${reviewId} for user ${userId}`);
        } else {
          console.warn(`[AUTO-REPLY] ❌ failed to post reply for review ${reviewId}`);
        }

        await sleep(CRON_CONSTANTS.REVIEW_DELAY_MS);

      } catch (reviewErr: any) {
        console.error(
          `[AUTO-REPLY] error processing review for user ${userId}:`,
          reviewErr?.message ?? reviewErr
        );
      }
    }

    console.log(`[AUTO-REPLY] ✅ done processing user: ${userId}`);

  } catch (err: any) {
    console.error(
      `[AUTO-REPLY] fatal error for user ${userId}:`,
      err?.message ?? err
    );
  }
};