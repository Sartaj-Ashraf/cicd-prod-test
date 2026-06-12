import {
  Star,
  MessageSquare,
  Activity,
  Zap,
} from "lucide-react";

import { statusColor, statusDot } from "@/utils/dashboard/analytics-helper";

interface KpiGridProps {
  summary: any;
}

export default function KpiGrid({
  summary,
}: KpiGridProps) {
  const kpis = [
    {
      label: "Avg Rating",
      value: summary.overallRating,
      suffix: "/5",
      icon: <Star size={15} />,
      status: "good",
      sub: `${summary.totalReviews} total reviews`,
    },
    // {
    //   label: "Response Rate",
    //   value: `${summary.responseRate.value}%`,
    //   icon: <MessageSquare size={15} />,
    //   status: summary.responseRate.status,
    //   sub:
    //     summary.responseRate.insight.slice(0, 50) + "…",
    // },
    {
      label: "Review Velocity",
      value: summary.reviewVelocity.value,
      suffix: "/month",
      icon: <Activity size={15} />,
      status: summary.reviewVelocity.status,
      sub:
        summary.reviewVelocity.insight.slice(0, 50) + "…",
    },
    {
      label: "Sentiment Score",
      value: `${summary.customerSentiment.score}`,
      suffix: "/100",
      icon: <Zap size={15} />,
      status: "excellent",
      sub:
        summary.customerSentiment.summary.slice(0, 50) + "…",
    },
  ];

  return (
 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
  {kpis.map((kpi) => (
    <div
      key={kpi.label}
      className="bg-card border border-border rounded-xl p-4 flex flex-col gap-2 hover:border-leaf-main/30 transition-colors"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground uppercase tracking-widest font-mono">
          {kpi.label}
        </span>

        <span
          className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium capitalize ${
            statusColor[kpi.status] ?? statusColor.average
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              // Update statusDot object to use 'bg-leaf-main' or 'bg-mango-orange'
              statusDot[kpi.status] ?? "bg-muted-foreground"
            }`}
          />
          {kpi.status}
        </span>
      </div>

      <div className="flex items-end gap-1">
        <span className="text-xl font-bold text-foreground">
          {kpi.value}
        </span>

        {kpi.suffix && (
          <span className="text-xs text-muted-foreground mb-0.5">
            {kpi.suffix}
          </span>
        )}
      </div>

      <p className="text-[11px] text-muted-foreground/80 leading-snug">
        {kpi.sub}
      </p>
    </div>
  ))}
</div>
  );
}