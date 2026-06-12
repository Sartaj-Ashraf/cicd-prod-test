interface ReviewForVelocity {
  time: Date;
}

export const calculateReviewVelocity = (reviews: ReviewForVelocity[]): number => {
  if (!reviews.length) return 0;

  const monthCounts: Record<string, number> = {};

  for (const r of reviews) {
    const d   = new Date(r.time);
    const key = `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}`;
    monthCounts[key] = (monthCounts[key] ?? 0) + 1;
  }

  const months = Object.keys(monthCounts).length;
  if (!months) return 0;

  const total = Object.values(monthCounts).reduce((a, b) => a + b, 0);
  return Math.round(total / months);
};