// constants/pricing.ts
import {
  Brain, MessageSquare, QrCode, Star,
  Bot, BarChart2, MessageCircle, Sparkles,
  Search, Heart, Shield, TrendingUp,
} from "lucide-react";

export const DURATION_LABELS: Record<string, string> = {
  monthly:    "Monthly",
  threeMonth: "3 Months",
  sixMonth:   "6 Months",
  yearly:     "Yearly",
};

export const LIMITS_CONFIG: {
  key:      string;
  icon:     any;
  label:    (v: number) => string;
  isStatic?: boolean; // ← static capacity, not depletable
}[] = [
  { key: "analysesPerMonth",             icon: Brain,         label: (v) => `${v} AI Analyses / month`            },
  { key: "aiRepliesPerMonth",            icon: MessageSquare, label: (v) => `${v} AI Replies / month`              },
  { key: "totalScansPerMonth",           icon: QrCode,        label: (v) => `${v} QR Scans / month`               },
  { key: "aiReviewsPerMonth",            icon: Star,          label: (v) => `${v} AI Reviews / month`             },
  { key: "aiAutoRepliesPerMonth",        icon: Bot,           label: (v) => `${v} Auto Replies / month`           },
  { key: "whatsappMessagesPerMonth",     icon: MessageCircle, label: (v) => `${v} WhatsApp messages / month`      },
  { key: "aiCompetitorAnalysisPerMonth", icon: TrendingUp,    label: (v) => `${v} Competitor Analyses / month`    }, // ← new
  {
    key:      "reviewAnalysisVolume",
    icon:     BarChart2,
    label:    (v) => `Analyze up to ${v} reviews`,
    isStatic: true, // ← static capacity
  },
];

export const FEATURES_CONFIG: {
  key:   string;
  icon:  any;
  label: string;
}[] = [
  { key: "magicQr",           icon: Sparkles, label: "Magic QR Code"        },
  { key: "seoFriendlyReview", icon: Search,   label: "SEO Friendly Reviews" },
  { key: "healthScore",       icon: Heart,    label: "Health Score"         },
  { key: "rbac",              icon: Shield,   label: "Role Based Access"    },
  // multiBranch        ← removed
  // competitorAnalysis ← removed
];