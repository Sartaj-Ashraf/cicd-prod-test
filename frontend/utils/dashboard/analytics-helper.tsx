import {
    AlertTriangle,
    CheckCircle,
    Info,
    XCircle,
  
} from "lucide-react";
export const statusColor: Record<string, string> = {
    excellent: "text-leaf-main bg-leaf-main/10 border-leaf-main/20",
    good: "text-mango-mid bg-mango-mid/10 border-mango-mid/20",
    average: "text-star-gold bg-star-gold/10 border-star-gold/20",
    poor: "text-mango-orange bg-mango-orange/10 border-mango-orange/20",
    critical: "text-mango-deep bg-mango-deep/10 border-mango-deep/20",
};

export const statusDot: Record<string, string> = {
    excellent: "bg-leaf-main",
    good: "bg-mango-mid",
    average: "bg-star-gold",
    poor: "bg-mango-orange",
    critical: "bg-mango-deep",
};

export const severityColor: Record<string, string> = {
    low: "text-mango-mid bg-mango-mid/10",
    medium: "text-star-gold bg-star-gold/10",
    high: "text-mango-orange bg-mango-orange/10",
    critical: "text-mango-deep bg-mango-deep/10",
};

export const impactColor: Record<string, string> = {
    low: "text-gray-light",
    medium: "text-star-gold",
    high: "text-leaf-main",
};

export const insightIcon: Record<string, React.ReactNode> = {
    success: <CheckCircle size={16} className="text-leaf-main shrink-0 mt-0.5" />,
    warning: <AlertTriangle size={16} className="text-star-gold shrink-0 mt-0.5" />,
    danger: <XCircle size={16} className="text-mango-deep shrink-0 mt-0.5" />,
    info: <Info size={16} className="text-mango-mid shrink-0 mt-0.5" />,
};

export const insightBorder: Record<string, string> = {
    success: "border-leaf-main/20 bg-leaf-main/5",
    warning: "border-star-gold/20 bg-star-gold/5",
    danger: "border-mango-deep/20 bg-mango-deep/5",
    info: "border-mango-mid/20 bg-mango-mid/5",
};

export const priorityBadge: Record<string, string> = {
    low: "bg-gray-dark/20 text-gray-light",
    medium: "bg-star-gold/20 text-star-gold",
    high: "bg-mango-orange/20 text-mango-orange",
    critical: "bg-mango-deep/20 text-mango-deep",
};