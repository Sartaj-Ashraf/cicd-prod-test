
interface NormalizedReview {
  time: Date;
}

export interface ReviewAge {
  last30d: number;
  last60d: number;
  last90d: number;
  older:   number;
}

export const calculateReviewAge = (reviews: NormalizedReview[]): ReviewAge => {
  const now = Date.now();
  const DAY = 86400000;

  return {
    last30d: reviews.filter((r) => now - new Date(r.time).getTime() <  30 * DAY).length,
    last60d: reviews.filter((r) => now - new Date(r.time).getTime() <  60 * DAY).length,
    last90d: reviews.filter((r) => now - new Date(r.time).getTime() <  90 * DAY).length,
    older:   reviews.filter((r) => now - new Date(r.time).getTime() >= 90 * DAY).length,
  };
};