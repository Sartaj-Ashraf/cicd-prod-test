"use client";

import { useState }             from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
}                               from "@/components/ui/dropdown-menu";
import { Skeleton }             from "@/components/ui/skeleton";
import {
  Brain, MessageSquare, QrCode, Star,
  Bot, MessageCircle, TrendingUp,
  BarChart2, Coins, RefreshCw, Infinity,
}                               from "lucide-react";
import { useCredits }           from "@/hooks/useCredits.hooks";

// ─── depletable categories ────────────────────────────────────────────────────

const CATEGORIES = [
  {
    key:      "analyses",
    label:    "Analyses",
    icon:     Brain,
    bar:      "bg-mango-mid",
    iconBg:   "bg-mango-mid/10",
    iconText: "text-mango-mid",
  },
  {
    key:      "aiReplies",
    label:    "AI Replies",
    icon:     MessageSquare,
    bar:      "bg-blue-500",
    iconBg:   "bg-blue-500/10",
    iconText: "text-blue-500",
  },
  {
    key:      "totalScans",
    label:    "QR Scans",
    icon:     QrCode,
    bar:      "bg-mango-orange",
    iconBg:   "bg-mango-orange/10",
    iconText: "text-mango-orange",
  },
  {
    key:      "aiReviews",
    label:    "AI Reviews",
    icon:     Star,
    bar:      "bg-yellow-500",
    iconBg:   "bg-yellow-500/10",
    iconText: "text-yellow-500",
  },
  {
    key:      "aiAutoReplies",
    label:    "Auto Replies",
    icon:     Bot,
    bar:      "bg-purple-500",
    iconBg:   "bg-purple-500/10",
    iconText: "text-purple-500",
  },
  {
    key:      "whatsappMessages",
    label:    "WhatsApp",
    icon:     MessageCircle,
    bar:      "bg-green-500",
    iconBg:   "bg-green-500/10",
    iconText: "text-green-500",
  },
  {
    key:      "aiCompetitorAnalysis",
    label:    "Competitor Analysis",
    icon:     TrendingUp,
    bar:      "bg-rose-500",
    iconBg:   "bg-rose-500/10",
    iconText: "text-rose-500",
  },
] as const;

// ─── component ────────────────────────────────────────────────────────────────

export const CreditsLeft = () => {
  const { data, isLoading, refetch } = useCredits();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const activeCategories = CATEGORIES.filter(
    (cat) => data?.data?.[cat.key] !== undefined && data?.data?.[cat.key] !== null
  );

  // static capacity
  const reviewAnalysisVolume = data?.data?.reviewAnalysisVolume ?? null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <Coins size={14} className="shrink-0 text-star-gold" />
          <span className="text-xs">Credits</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72 p-0 overflow-hidden">

        {/* header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <p className="text-sm font-medium text-foreground">Credit usage</p>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading || isRefreshing}
            className="flex items-center justify-center size-7 rounded-md border border-border hover:bg-accent transition-all focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
            title="Refresh credits"
          >
            <RefreshCw
              size={13}
              className={`text-muted-foreground ${
                isLoading || isRefreshing ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>

        {/* content */}
        <div className="px-4 py-3 space-y-4 overflow-y-auto">

          {/* loading */}
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="size-7 rounded-md" />
                      <Skeleton className="h-3.5 w-20" />
                    </div>
                    <Skeleton className="h-3.5 w-14" />
                  </div>
                  <Skeleton className="h-1.5 w-full rounded-full" />
                </div>
              ))}
            </div>
          )}

          {/* depletable categories */}
          {!isLoading && data && activeCategories.map((cat) => {
            const item         = data.data[cat.key as keyof typeof data.data] as any;
            const isUnlimited  = item?.creditsTotal === null || item?.creditsTotal === undefined;
            const creditsUsed  = item?.creditsUsed  ?? 0;
            const creditsTotal = item?.creditsTotal ?? 0;
            const pct          = isUnlimited
              ? 0
              : creditsTotal > 0
                ? Math.min(Math.round((creditsUsed / creditsTotal) * 100), 100)
                : 0;

            const isWarning = !isUnlimited && pct >= 80;
            const isDanger  = !isUnlimited && pct >= 95;

            return (
              <div key={cat.key} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center justify-center size-7 rounded-md ${cat.iconBg}`}>
                      <cat.icon size={13} className={cat.iconText} />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {cat.label}
                    </span>
                  </div>

                  <div className="text-right">
                    {isUnlimited ? (
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Infinity size={11} />
                        <span>Unlimited</span>
                      </div>
                    ) : (
                      <p className={`text-[11px] ${
                        isDanger  ? "text-red-500"   :
                        isWarning ? "text-amber-500" :
                        "text-muted-foreground"
                      }`}>
                        {creditsUsed} / {creditsTotal}
                      </p>
                    )}
                  </div>
                </div>

                {/* progress bar */}
                {!isUnlimited && (
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isDanger  ? "bg-red-500"   :
                        isWarning ? "bg-amber-500" :
                        cat.bar
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                )}

                {/* unlimited shimmer */}
                {isUnlimited && (
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div className={`h-full w-full rounded-full ${cat.bar} opacity-30`} />
                  </div>
                )}
              </div>
            );
          })}

          {/* static capacity — reviewAnalysisVolume */}
          {!isLoading && reviewAnalysisVolume !== null && reviewAnalysisVolume !== undefined && (
            <div className="flex items-center justify-between pt-1 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center size-7 rounded-md bg-teal-500/10">
                  <BarChart2 size={13} className="text-teal-500" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  Review Analysis
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Up to {reviewAnalysisVolume} reviews
              </p>
            </div>
          )}

          {/* empty */}
          {!isLoading && !data && (
            <p className="py-4 text-center text-xs text-muted-foreground">
              Unable to load credits.
            </p>
          )}

        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};