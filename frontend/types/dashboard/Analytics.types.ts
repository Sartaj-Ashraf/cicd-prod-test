// types/dashboard/Analytics.types.ts

export interface VelocityTrendPoint {
  month: string;
  count: number;
}

export interface WordFrequencyItem {
  word:      string;
  sentiment: "positive" | "negative" | "neutral";
  count:     number;
}

export interface ReviewSources {
  google:  number;
  gbp:     number;
  private: number;
}

export interface ReviewAge {
  last30d: number;
  last60d: number;
  last90d: number;
  older:   number;
}

export interface DailyPerformance {
  date:              string;
  impressionsMaps:   number;
  impressionsSearch: number;
  directionRequests: number;
  callClicks:        number;
  websiteClicks:     number;
}

export interface PerformanceData {
  dateRange: { start: string; end: string };
  daily:     DailyPerformance[];
  totals: {
    impressionsMaps:   number;
    impressionsSearch: number;
    directionRequests: number;
    callClicks:        number;
    websiteClicks:     number;
  };
}

export interface SearchKeyword {
  keyword:     string;
  impressions: number;
  type:        "direct" | "high_intent" | "generic" | "competitor"; // ← added
}

export interface PhotoInsights {
  total:         number;
  owner:         number;
  customer:      number;
  lastPhotoDate: string | null;
}

export interface PostInsights {
  totalPosts:        number;
  lastPostDate:      string | null;
  lastPostType:      string | null;
  lastPostSummary:   string | null;
  daysSinceLastPost: number | null;
}

export interface GBPInsights {
  searchKeywords: SearchKeyword[] | null;
  photos:         PhotoInsights  | null;
  posts:          PostInsights   | null;
}

export interface AnalysisData {
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
  velocityTrend:   VelocityTrendPoint[];
  wordFrequency:   WordFrequencyItem[];
  strengths: {
    title:       string;
    description: string;
    confidence:  number;
  }[];
  weaknesses: {
    title:       string;
    description: string;
    severity:    "low" | "medium" | "high" | "critical";
  }[];
  aiInsights: {
    type:        "success" | "warning" | "danger" | "info";
    title:       string;
    description: string;
    priority:    "low" | "medium" | "high" | "critical";
    action:      string;
  }[];
  priorityActions: {
    title:             string;
    description:       string;
    priority:          "low" | "medium" | "high";
    estimatedImpact:   string;
    recommendedAction: string;
  }[];
  customerExperienceAnalysis: {
    positiveThemes:      string[];
    negativeThemes:      string[];
    mostMentionedTopics: string[];
    sentimentBreakdown: {
      positive: number;
      neutral:  number;
      negative: number;
    };
  };
  competitiveAnalysis: {
    marketPosition:       string;
    competitiveAdvantage: string;
    competitiveRisks:     string[];
  };
  growthOpportunities: {
    title:       string;
    description: string;
    impact:      "low" | "medium" | "high";
  }[];
  riskAlerts: {
    title:       string;
    description: string;
    severity:    "low" | "medium" | "high" | "critical";
  }[];
}

export interface LocationAnalyticsResponse {
  staleTime:       string;
  analysis:        AnalysisData;
  reviewSources:   ReviewSources;
  reviewAge:       ReviewAge;
  unrepliedCount:  number | null;
  reputationScore: number;
  totalAnalysed:   number;
  performance:     PerformanceData | null;
  gbpInsights:     GBPInsights     | null;
}