// utils/analytics/reviewDistribution.ts

interface ReviewForDistribution {
  rating: number;
}

export interface ReviewDistributionResult {
  fiveStar:   number;
  fourStar:   number;
  threeStar:  number;
  twoStar:    number;
  oneStar:    number;
  avgReviews: number;
}

export const calculateReviewDistribution = (
  reviews: ReviewForDistribution[]
): ReviewDistributionResult => {
  if (!reviews.length) {
    return { fiveStar: 0, fourStar: 0, threeStar: 0, twoStar: 0, oneStar: 0, avgReviews: 0 };
  }

  return {
    fiveStar:   reviews.filter((r) => r.rating === 5).length,
    fourStar:   reviews.filter((r) => r.rating === 4).length,
    threeStar:  reviews.filter((r) => r.rating === 3).length,
    twoStar:    reviews.filter((r) => r.rating === 2).length,
    oneStar:    reviews.filter((r) => r.rating === 1).length,
    avgReviews: Math.round(
      (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10
    ) / 10,
  };
};