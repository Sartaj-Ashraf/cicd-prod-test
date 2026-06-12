"use client";

import { Building2 }        from "lucide-react";
import ImpressionsChart     from "./ImpressionsChart";
import ActionsFunnelChart   from "./ActionsFunnelChart";
import SearchVsMapsChart    from "./SearchVsMapsChart";
import GBPInsightsPanel     from "./GBPInsightsPanel";
import type {
  PerformanceData,
  GBPInsights,
}                           from "@/types/dashboard/Analytics.types";

interface Props {
  performance: PerformanceData | null;
  gbpInsights: GBPInsights     | null;
  isGBP:       boolean;
}

export default function PerformanceSection({
  performance,
  gbpInsights,
  isGBP,
}: Props) {

  if (!isGBP) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center justify-center gap-3 min-h-[200px]">
        <Building2 size={32} className="text-muted-foreground/30" />
        <p className="text-sm font-medium text-foreground">
          Performance Data Unavailable
        </p>
        <p className="text-xs text-muted-foreground text-center max-w-xs leading-relaxed">
          Connect your Google Business Profile to see impressions,
          direction requests, calls, website clicks, search keywords,
          photos and posts.
        </p>
      </div>
    );
  }

  if (!performance && !gbpInsights) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center justify-center gap-3 min-h-[200px]">
        <Building2 size={32} className="text-muted-foreground/30" />
        <p className="text-sm font-medium text-foreground">No Performance Data</p>
        <p className="text-xs text-muted-foreground text-center max-w-xs">
          Refresh your analysis to load performance metrics.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* section header */}
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 rounded-full bg-leaf-main" />
        <h2 className="text-base font-semibold text-foreground">
          Business Performance
        </h2>
        {performance?.dateRange && (
          <span className="text-xs text-muted-foreground font-mono ml-1">
            {performance.dateRange.start} → {performance.dateRange.end}
          </span>
        )}
      </div>

      {/* impressions full width */}
      {performance && (
        <ImpressionsChart daily={performance.daily} />
      )}

      {/* actions + discovery side by side */}
      {performance && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ActionsFunnelChart totals={performance.totals} />
          <SearchVsMapsChart  totals={performance.totals} />
        </div>
      )}

      {/* search keywords + photos + posts */}
      {gbpInsights && (
        <GBPInsightsPanel gbpInsights={gbpInsights} />
      )}

    </div>
  );
}