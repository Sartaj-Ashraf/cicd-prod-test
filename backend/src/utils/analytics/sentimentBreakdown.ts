// utils/analytics/sentimentBreakdown.ts

interface ReviewForSentiment {
  rating: number;
}

export interface SentimentBreakdownResult {
  positive: number;
  neutral:  number;
  negative: number;
}

export const calculateSentimentBreakdown = (
  reviews: ReviewForSentiment[]
): SentimentBreakdownResult => {
  if (!reviews.length) return { positive: 0, neutral: 0, negative: 0 };

  const total    = reviews.length;
  const positive = reviews.filter((r) => r.rating >= 4).length;
  const negative = reviews.filter((r) => r.rating <= 2).length;
  const neutral  = total - positive - negative;

  return {
    positive: Math.round((positive / total) * 100),
    neutral:  Math.round((neutral  / total) * 100),
    negative: Math.round((negative / total) * 100),
  };
};

export const calculateSentimentScore = (
  reviews: ReviewForSentiment[]
): number => {
  if (!reviews.length) return 0;
  const positive = reviews.filter((r) => r.rating >= 4).length;
  return Math.round((positive / reviews.length) * 100);
};

export const getVelocityStatus = (
  velocity: number
): "excellent" | "good" | "average" | "poor" | "critical" => {
  if (velocity >= 20) return "excellent";
  if (velocity >= 10) return "good";
  if (velocity >= 5)  return "average";
  if (velocity >= 2)  return "poor";
  return "critical";
};