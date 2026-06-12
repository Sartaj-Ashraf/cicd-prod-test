// competitor.types.ts

export interface Scores {
  ratingScore: number;
  reviewScore: number;
  onlinePresenceScore: number;
  overallScore: number;
}

export interface ComparisonMetric {
  winner?: string;
  difference?: number;
  insight?: string;
  myScore?: number;
  competitorScore?: number;
}

export interface OnlinePresenceComparison {
  advantages: string[];
  missing: string[];
  myScore: number;
  competitorScore: number;
}

export interface Competitor {
  name: string;
  scores: Scores;
  comparisons: {
    rating: ComparisonMetric;
    reviews: ComparisonMetric;
    onlinePresence: OnlinePresenceComparison;
    overall: ComparisonMetric;
  };
}

export interface Advantage {
  title: string;
  reason: string;
}

export interface MissingGap {
  title: string;
  reason: string;
}

export interface ProfileImprovement {
  title: string;
  currentState: string;
  benefit?: string;
  impact?: "high" | "medium" | "low";
  impactScore?: number;
}

export interface AnalysisSummary {
  overallPosition: string;
  strongestCompetitor?: string;
  confidence?: number;
}

export interface AnalysisPayload {
  summary: AnalysisSummary;
  advantages: Advantage[];
  missingComparedToCompetitors: MissingGap[];
  profileImprovements: ProfileImprovement[];
  myBusiness?:any,
  competitors?: any[]; 
}

export interface AnalysisDataRoot {
  myPlaceId: string;
  scores: Scores;
  competitors: Competitor[];
  analysis: AnalysisPayload;
}

export interface CompetitiveAnalysisProps {
  analysisData: {
    success?: boolean;
    message?: string;
    data: AnalysisDataRoot;
  } | AnalysisDataRoot; 
}