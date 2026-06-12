// utils/analytics/responseRate.ts

interface ReviewForResponseRate {
  source:   "google" | "gbp" | "private";
  replied?: boolean;
}

export interface ResponseRateResult {
  value:  number;
  status: "excellent" | "good" | "average" | "poor" | "critical";
}

export const calculateResponseRate = (
  reviews: ReviewForResponseRate[],
): ResponseRateResult => {

  // only GBP reviews can have replies
  // google and private reviews are excluded entirely
  const gbpReviews = reviews.filter((r) => r.source === "gbp");

  if (!gbpReviews.length) {
    return { value: 0, status: "critical" };
  }

  // use replied field set during normalization — not unrepliedCount
  // unrepliedCount was from raw fetch (before cap) so could exceed merged length
  const repliedCount = gbpReviews.filter((r) => r.replied === true).length;
  const value        = Math.round((repliedCount / gbpReviews.length) * 100);

  const status =
    value >= 80 ? "excellent" :
    value >= 60 ? "good"      :
    value >= 40 ? "average"   :
    value >= 20 ? "poor"      : "critical";

  return { value, status };
};