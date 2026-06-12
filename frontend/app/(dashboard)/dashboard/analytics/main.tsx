"use client";

import { TrendingUp, TrendingDown, RefreshCcw } from "lucide-react";
import { useEffect, useState }                  from "react";

import { useLocationContext }    from "@/context/selectedLocation.context";
import { useLocationAnalytics } from "@/hooks/analytics";
import { useCredits } from "@/hooks/useCredits.hooks";
import { queryClient }          from "@/utils/query-client";
import { queryKeys }            from "@/lib/query-keys";
import { getAnalyticsData }     from "@/services/analytics/analytics.service";
import { severityColor }        from "@/utils/dashboard/analytics-helper";

import KpiGrid               from "@/components/dashboard/Analytic/cards/KpiGrid";
import AnalyticsHeader       from "@/components/dashboard/Analytic/header/analytics.header";
import InsightList           from "@/components/dashboard/Analytic/cards/InsightList";
import AnalyticsSection      from "@/components/dashboard/Analytic/cards/AnalyticsSection";
import PriorityActions       from "@/components/dashboard/Analytic/cards/PriorityActions";
import RiskAlerts            from "@/components/dashboard/Analytic/cards/RiskAlerts";
import NoAnalyticsPage       from "@/components/dashboard/Analytic/NoAnalyticsPage";
import AnalyticsLoading      from "@/components/dashboard/Analytic/Analytics-loading";
import DownloadReport        from "@/components/dashboard/Analytic/Downloadreport";
import VelocityChart         from "@/components/dashboard/Analytic/charts/VelocityChart";
import ReviewSourcesChart    from "@/components/dashboard/Analytic/charts/ReviewSourcesChart";
import SentimentChart        from "@/components/dashboard/Analytic/charts/SentimentChart";
import ReviewAgeChart        from "@/components/dashboard/Analytic/charts/ReviewAgeChart";
import ResponseRateGauge     from "@/components/dashboard/Analytic/charts/ResponseRateGauge";
import PositiveNegativeCards from "@/components/dashboard/Analytic/charts/PositiveNegativeCards";
import PerformanceSection from "@/components/dashboard/Analytic/charts/PerformanceSection";
import WordFrequencyChart from "@/components/dashboard/Analytic/charts/WordFrequencyChart";
import { toast } from "sonner";


export default function ReputationDashboard() {
  const { selectedLocation } = useLocationContext();
    const { data: creditsData,  refetch } = useCredits();
    const analysesCredits = creditsData?.data?.analyses;

const hasAnalysisCredits =
  analysesCredits &&
  (analysesCredits.creditsTotal === null ||
    analysesCredits.creditsUsed < analysesCredits.creditsTotal);
  
  const locationId           = selectedLocation?._id || "";

  const [timeLeft, setTimeLeft] = useState("");
  const [loading,  setLoading]  = useState(false);

  const { data, isLoading, error, isFetching } = useLocationAnalytics(locationId);

  const analysis       = data && Object.keys(data).length > 0 ? data.analysis       : null;
  const reviewSources  = data?.reviewSources  ?? null;
  const reviewAge      = data?.reviewAge      ?? null;
  const unrepliedCount = data?.unrepliedCount ?? null;

  const staleTime = data?.staleTime
    ? new Date(data.staleTime).getTime()
    : null;

    const lastAnalysisAt = data?.createdAt;
  useEffect(() => {
    if (!staleTime) return;
    const interval = setInterval(() => {
      const diff    = staleTime - Date.now();
      if (diff <= 0) { setTimeLeft("Ready to refresh"); clearInterval(interval); return; }
      const hours   = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      if (hours > 0)        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      else if (minutes > 0) setTimeLeft(`${minutes}m ${seconds}s`);
      else                  setTimeLeft(`${seconds}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [staleTime]);

const fetchAnalyticsData = async () => {
  if (!hasAnalysisCredits) {
    toast.error("No analysis credits remaining");
    return;
  }

  try {
    setLoading(true);

    const res = await getAnalyticsData(
      selectedLocation?.placeId!,
      locationId
    );

    queryClient.setQueryData(
      queryKeys.analytics.location(locationId),
      res.data
    );

    // refresh credits after successful analysis
    await refetch();

  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

  if (isLoading)             return <AnalyticsLoading />;
  if (loading)   return <AnalyticsLoading />; 

  if (!isLoading && !analysis) return <NoAnalyticsPage />;
  if (error) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-destructive">Failed to load analysis data.</p>
    </div>
  );

  const {
    summary, reviewDistribution, velocityTrend, wordFrequency,
    strengths, weaknesses, aiInsights, priorityActions,
    customerExperienceAnalysis, riskAlerts,
  } = analysis!;

  const maxStars   = Math.max(
    reviewDistribution.fiveStar, reviewDistribution.fourStar,
    reviewDistribution.threeStar, reviewDistribution.twoStar,
    reviewDistribution.oneStar, 1
  );
  const isStale    = staleTime ? staleTime - Date.now() > 0 : false;
const totalAnalysed = data?.totalAnalysed ?? 0;

const performance    = data?.performance    ?? null;
const isGBP          = selectedLocation?.source === "gbp";  

const gbpInsights = data?.gbpInsights ?? null;


  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-leaf-light/30">
      <div className="relative mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── header ── */}
        <div className="flex items-start flex-col justify-between mb-2 pb-10 gap-2">
          <AnalyticsHeader reputationScore={summary.reputationScore} />
          <div className="flex gap-2 self-center lg:self-end">
            <DownloadReport analysis={analysis!} locationName={selectedLocation?.name ?? "Business"} />
            <button
              onClick={fetchAnalyticsData}
              disabled={isFetching || loading || isStale}
              className="group inline-flex items-center gap-2 rounded-lg cursor-pointer border border-border bg-card hover:bg-secondary/50 px-4 py-2.5 transition-all duration-200 disabled:opacity-60"
            >
              <RefreshCcw size={16} className={`text-leaf-main ${isFetching ? "animate-spin" : ""}`} />
              <span className="text-sm font-medium text-foreground">
                {isFetching || loading ? "Refreshing..." : timeLeft || "Refresh Analysis"}
              </span>
            </button>
            
          </div>
            <p className="text-sm text-muted-foreground self-center lg:self-end">
     Credits Left{" "}
    <span className="font-medium">
      {analysesCredits?.creditsUsed ?? 0}/
      {analysesCredits?.creditsTotal ?? 0}
    </span>
  </p>
           {lastAnalysisAt && (
    <p className="text-sm text-muted-foreground self-center lg:self-end">
      Last analysed on{" "}
      {new Date(lastAnalysisAt).toLocaleString()}
    </p>
  )}
        </div>
        

        {/* ── KPI cards ── */}
        <KpiGrid summary={summary} />

        {/* ── velocity full width ── */}
        <VelocityChart data={velocityTrend ?? []} />

        {/* ── distribution + sources + sentiment ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <AnalyticsSection
            summary={summary}
            reviewDistribution={reviewDistribution}
            maxStars={maxStars}
            customerExperienceAnalysis={customerExperienceAnalysis}
            aiInsights={[]}           // ← move AI insights below
          />
          <ReviewSourcesChart sources={reviewSources} 
          unrepliedCount={unrepliedCount}
           totalAnalysed={totalAnalysed}  
 />
          <SentimentChart data={customerExperienceAnalysis.sentimentBreakdown} />
        </div>

        {/* ── positive/negative + response rate ── */}
     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
  <div className="md:col-span-2 flex flex-col">
   <PositiveNegativeCards
  sentimentBreakdown={customerExperienceAnalysis.sentimentBreakdown}
  totalReviews={summary.totalReviews}  // ← add
/>
  </div>
  <ResponseRateGauge
    value={summary.responseRate.value}
    status={summary.responseRate.status}
  />
</div>

        {/* ── word frequency full width ── */}
        <WordFrequencyChart data={wordFrequency ?? []} />
<PerformanceSection
  performance={performance}
  gbpInsights={gbpInsights}
  isGBP={isGBP}
/>


        {/* ── review age full width ── */}
        <ReviewAgeChart data={reviewAge} />

        {/* ── AI insights full width ── */}
        <AnalyticsSection
          summary={summary}
          reviewDistribution={reviewDistribution}
          maxStars={maxStars}
          customerExperienceAnalysis={customerExperienceAnalysis}
          aiInsights={aiInsights}
          insightsOnly              // ← only show AI insights section
        />

        {/* ── strengths & weaknesses ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InsightList title="Strengths" icon={TrendingUp} iconColor="text-leaf-main"
            dotColor="bg-leaf-main" items={strengths} type="strength" />
          <InsightList title="Weaknesses" icon={TrendingDown} iconColor="text-mango-orange"
            dotColor="bg-mango-orange" items={weaknesses} type="weakness" severityColor={severityColor} />
        </div>

        {/* ── priority actions ── */}
        <PriorityActions priorityActions={priorityActions} />

        {/* ── risk alerts ── */}
        <RiskAlerts riskAlerts={riskAlerts} />

        {/* ── footer ── */}
        <footer className="text-center pt-6 border-t border-border mt-12">
          <p className="text-[10px] text-muted-foreground font-mono tracking-[0.3em] uppercase opacity-70">
            Mango Review by Oasis Ascend
          </p>
        </footer>

      </div>
    </div>
  );
}