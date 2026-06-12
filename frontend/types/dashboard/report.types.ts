export interface Summary {
  overallRating: number;
  totalReviews: number;
  reputationScore: number;
  reviewVelocity: { value: number; status: string; insight: string };
  responseRate: { value: number; status: string; insight: string };
  customerSentiment: { score: number; summary: string };
}

export interface ReviewDistribution {
  fiveStar: number; fourStar: number; threeStar: number;
  twoStar: number;  oneStar: number; "avg reviews": number;
}
export interface Strength   { title: string; description: string; confidence?: number }
export interface Weakness   { title: string; description: string; severity?: string }
export interface AiInsight  { type: string; title: string; description: string; priority: string; action: string }
export interface PriorityAction { title: string; description: string; priority: string; recommendedAction: string; estimatedImpact: string }
export interface RiskAlert  { title: string; description: string; severity: string }
export interface CustomerExperienceAnalysis {
  positiveThemes: string[]; negativeThemes: string[];
  mostMentionedTopics: string[];
  sentimentBreakdown: { positive: number; neutral: number; negative: number };
}
export interface CompetitiveAnalysis {
  marketPosition?: string; competitiveAdvantages?: string[]; gaps?: string[];
}
export interface GrowthOpportunity { title: string; description: string; potential?: string }
export interface Analysis {
  summary: Summary;
  reviewDistribution: ReviewDistribution;
  strengths: Strength[];
  weaknesses: Weakness[];
  aiInsights: AiInsight[];
  priorityActions: PriorityAction[];
  riskAlerts: RiskAlert[];
  customerExperienceAnalysis?: CustomerExperienceAnalysis;
  competitiveAnalysis?: CompetitiveAnalysis;
  growthOpportunities?: GrowthOpportunity[];
}

export interface DownloadReportProps {
  analysis: Analysis;
  locationName?: string;
}

