// types/public/pricing.types.ts

export interface PriceEntry {
  actual:     number;
  discounted: number | null;
}

export interface PlanLimits {
  analysesPerMonth?:             number | null;
  aiRepliesPerMonth?:            number | null;
  totalScansPerMonth?:           number | null;
  aiReviewsPerMonth?:            number | null;
  aiAutoRepliesPerMonth?:        number | null;
  reviewAnalysisVolume?:         number | null; // ← static capacity
  whatsappMessagesPerMonth?:     number | null;
  aiCompetitorAnalysisPerMonth?: number | null; // ← new
}

export interface PlanFeatures {
  magicQr?:           boolean;
  seoFriendlyReview?: boolean;
  healthScore?:       boolean;
  rbac?:              boolean;
  // multiBranch        ← removed
  // competitorAnalysis ← removed
}

export interface PlanTrial {
  enabled:    boolean;
  trialPrice: number | null;
  trialDays:  number | null;
}

export interface Plan {
  _id:        string;
  name:       string;
  currency:   string;
  tier:       number;
  isPopular?: boolean;
  limits?:    PlanLimits;
  features?:  PlanFeatures;
  price:      Record<string, PriceEntry>;
  notes?:     string[];
  trial?:     PlanTrial;
}

export interface PricingCardProps {
  plan:             Plan;
  activeDuration:   string;
  durationLabel:    string;
  isLoading:        boolean;
  isTrialEligible?: boolean;
  onClick:          (plan: Plan) => void;
}

export interface DurationToggleProps {
  durations: string[];
  active:    string;
  labels:    Record<string, string>;
  onChange:  (duration: string) => void;
}

export interface PaymentStatusModalProps {
  status:   "pending" | "success" | "failed" | null;
  message?: string;
  onClose:  () => void;
  onRetry?: () => void;
}

export interface PricingPlanPayload {
  name:      string;
  tier:      number;
  currency?: string;
  price: {
    monthly?:    PriceEntry | null;
    threeMonth?: PriceEntry | null;
    sixMonth?:   PriceEntry | null;
    yearly?:     PriceEntry | null;
  };
  limits?:   PlanLimits;
  features?: PlanFeatures;
  isActive?:  boolean;
  isPopular?: boolean;
}