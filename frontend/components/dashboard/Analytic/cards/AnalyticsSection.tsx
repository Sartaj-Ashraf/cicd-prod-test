// components/dashboard/Analytic/cards/AnalyticsSection.tsx
import {
  Star,
  Zap,
  ChevronRight,
} from "lucide-react";

import {
  insightBorder,
  insightIcon,
  priorityBadge,
} from "@/utils/dashboard/analytics-helper";

// ─── star bar ─────────────────────────────────────────────────────────────────

function StarBar({ label, count, max }: { label: string; count: number; max: number }) {
  const pct      = max > 0 ? (count / max) * 100 : 0;
  const barColor =
    label === "5★" ? "bg-leaf-dark"
    : label === "4★" ? "bg-leaf-dark/80"
    : label === "3★" ? "bg-amber-400"
    : label === "2★" ? "bg-orange-400"
    : "bg-red-400";

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-400 w-6 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-slate-300 w-4 text-right">{count}</span>
    </div>
  );
}

// ─── ai insights list ─────────────────────────────────────────────────────────

function AiInsightsList({ aiInsights }: {
  aiInsights: {
    type:        string;
    title:       string;
    description: string;
    priority:    string;
    action:      string;
  }[]
}) {
  if (!aiInsights?.length) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Zap size={15} className="text-mango-mid" />
        <h2 className="text-lg! font-semibold text-foreground">AI Insights</h2>
        <span className="ml-auto text-xs text-muted-foreground font-mono">
          {aiInsights.length} signals detected
        </span>
      </div>
      <div className="space-y-3">
        {aiInsights.map((ins, i) => (
          <div
            key={i}
            className={`border rounded-lg p-3.5 transition-colors ${
              insightBorder[ins.type] ?? "border-border bg-muted/20"
            }`}
          >
            <div className="flex items-start gap-2">
              {insightIcon[ins.type]}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm! font-medium text-foreground">
                    {ins.title}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                      priorityBadge[ins.priority] ?? "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {ins.priority}
                  </span>
                </div>
                <p className="text-xs! text-muted-foreground leading-relaxed">
                  {ins.description}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <ChevronRight size={11} className="text-muted-foreground/40" />
                  <span className="text-[11px]! text-muted-foreground/70 italic">
                    {ins.action}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── props ────────────────────────────────────────────────────────────────────

interface Props {
  summary: {
    overallRating:     number;
    totalReviews:      number;
    reviewVelocity:    { value: number; status: string; insight: string };
    responseRate:      { value: number; status: string; insight: string };
    customerSentiment: { score: number; summary: string };
    reputationScore:   number;
  };
  reviewDistribution: {
    fiveStar:   number;
    fourStar:   number;
    threeStar:  number;
    twoStar:    number;
    oneStar:    number;
    avgReviews: number;
  };
  maxStars:                  number;
  customerExperienceAnalysis: {
    positiveThemes:      string[];
    negativeThemes:      string[];
    mostMentionedTopics: string[];
    sentimentBreakdown:  { positive: number; neutral: number; negative: number };
  };
  aiInsights: {
    type:        string;
    title:       string;
    description: string;
    priority:    string;
    action:      string;
  }[];
  insightsOnly?: boolean; // ← only render AI insights
}

// ─── component ────────────────────────────────────────────────────────────────

export default function AnalyticsSection({
  summary,
  reviewDistribution,
  maxStars,
  customerExperienceAnalysis,
  aiInsights,
  insightsOnly = false,
}: Props) {

  // ── insights only mode (used below word frequency chart) ─────────────────
  if (insightsOnly) {
    return <AiInsightsList aiInsights={aiInsights} />;
  }

  // ── distribution only (no sentiment bar, no AI insights) ─────────────────
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col">

      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg! font-semibold text-foreground">
            Review Distribution
          </h2>
          <p className="text-xs! text-muted-foreground mt-0.5">
            Based on {summary.totalReviews} total reviews
          </p>
        </div>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              size={12}
              className={
                i <= Math.round(reviewDistribution.avgReviews)
                  ? "text-mango-mid fill-mango-mid"
                  : "text-muted-foreground/30"
              }
            />
          ))}
          <span className="text-xs text-foreground/80 ml-1 font-medium">
            {reviewDistribution.avgReviews}
          </span>
        </div>
      </div>

      {/* star bars */}
      <div className="space-y-3">
        {[
          { label: "5★", count: reviewDistribution.fiveStar   },
          { label: "4★", count: reviewDistribution.fourStar   },
          { label: "3★", count: reviewDistribution.threeStar  },
          { label: "2★", count: reviewDistribution.twoStar    },
          { label: "1★", count: reviewDistribution.oneStar    },
        ].map((s) => (
          <StarBar key={s.label} label={s.label} count={s.count} max={maxStars} />
        ))}
      </div>

    </div>
  );
}