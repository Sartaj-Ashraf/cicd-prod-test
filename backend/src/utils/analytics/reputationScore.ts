
interface NormalizedReview {
  rating: number;
  time:   Date;
  source: "google" | "gbp" | "private";
}

export const calculateReputationScore = (
  reviews:        NormalizedReview[],
  unrepliedCount: number | null
): number => {
  if (!reviews.length) return 0;

  // 1. average rating (40% weight)
  const avgRating   = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const ratingScore = (avgRating / 5) * 100 * 0.40;

  // 2. review volume (20% weight) — log scale so 500 reviews isn't 10x better than 50
  const volumeScore = Math.min(
    Math.log10(reviews.length + 1) / Math.log10(501), 1
  ) * 100 * 0.20;

  // 3. recency (20% weight) — % of reviews in last 90 days
  const now          = Date.now();
  const recent       = reviews.filter(
    (r) => now - new Date(r.time).getTime() < 90 * 24 * 60 * 60 * 1000
  ).length;
  const recencyScore = (recent / reviews.length) * 100 * 0.20;

  // 4. sentiment (15% weight) — % of 4-5 star reviews
  const positive      = reviews.filter((r) => r.rating >= 4).length;
  const sentimentScore = (positive / reviews.length) * 100 * 0.15;

  // 5. response rate (5% weight) — GBP only, neutral default if no data
  let responseScore = 50 * 0.05;
  if (unrepliedCount !== null) {
    const gbpReviews  = reviews.filter((r) => r.source === "gbp");
    const gbpTotal    = gbpReviews.length;
    const replied     = Math.max(gbpTotal - unrepliedCount, 0);
    responseScore     = gbpTotal > 0
      ? (replied / gbpTotal) * 100 * 0.05
      : 50 * 0.05;
  }

  const total = ratingScore + volumeScore + recencyScore + sentimentScore + responseScore;
  return Math.round(Math.min(total, 100));
};