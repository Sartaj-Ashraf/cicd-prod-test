// utils/analytics/velocityTrend.ts

interface ReviewForTrend {
  time: Date;
}

export interface VelocityTrendPoint {
  month: string;
  count: number;
}

export const calculateVelocityTrend = (
  reviews: ReviewForTrend[]
): VelocityTrendPoint[] => {
  if (!reviews.length) return [];

  const monthCounts: Record<string, number> = {};

  for (const r of reviews) {
    const d   = new Date(r.time);
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    monthCounts[key] = (monthCounts[key] ?? 0) + 1;
  }

  return Object.entries(monthCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));
};