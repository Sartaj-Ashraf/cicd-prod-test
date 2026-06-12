"use client";

import { ThumbsUp, ThumbsDown } from "lucide-react";

interface Props {
  sentimentBreakdown: { positive: number; neutral: number; negative: number };
  totalReviews:       number;
}

export default function PositiveNegativeCards({
  sentimentBreakdown,
  totalReviews,
}: Props) {
  if (!sentimentBreakdown) return null;

  const positivePct   = Math.round(sentimentBreakdown.positive);
  const negativePct   = Math.round(sentimentBreakdown.negative);
  const positiveCount = Math.round((positivePct / 100) * totalReviews);
  const negativeCount = Math.round((negativePct / 100) * totalReviews);

  return (
    <div className="grid grid-cols-2 gap-3 h-full">

      {/* positive */}
      <div className="bg-leaf-main/5 border border-leaf-main/20 rounded-xl p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <ThumbsUp size={14} className="text-leaf-main" />
          <span className="text-xs text-muted-foreground uppercase tracking-widest font-mono">
            Positive
          </span>
        </div>
        <p className="text-3xl font-bold text-leaf-main">{positivePct}%</p>
        <p className="text-xs text-muted-foreground">
          {positiveCount} of {totalReviews} reviews
        </p>
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-auto">
          <div
            className="h-full bg-leaf-main rounded-full transition-all duration-700"
            style={{ width: `${positivePct}%` }}
          />
        </div>
      </div>

      {/* negative */}
      <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <ThumbsDown size={14} className="text-destructive" />
          <span className="text-xs text-muted-foreground uppercase tracking-widest font-mono">
            Negative
          </span>
        </div>
        <p className="text-3xl font-bold text-destructive">{negativePct}%</p>
        <p className="text-xs text-muted-foreground">
          {negativeCount} of {totalReviews} reviews
        </p>
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-auto">
          <div
            className="h-full bg-destructive rounded-full transition-all duration-700"
            style={{ width: `${negativePct}%` }}
          />
        </div>
      </div>

    </div>
  );
}   