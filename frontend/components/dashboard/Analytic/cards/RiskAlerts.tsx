import {
  Shield,
  AlertTriangle,
} from "lucide-react";

import { severityColor } from "@/utils/dashboard/analytics-helper";

interface Props {
  riskAlerts: any[];
}

export default function RiskAlerts({
  riskAlerts,
}: Props) {
  if (!riskAlerts?.length) return null;

  return (
  <div className="bg-card border border-border rounded-xl p-5">
  <div className="flex items-center gap-2 mb-4">
    <Shield
      size={15}
      className="text-destructive" 
    />

    <h2 className="text-lg! font-semibold text-foreground">
      Risk Alerts
    </h2>

    <span className="ml-auto text-xs! text-destructive font-mono font-medium">
      {riskAlerts.length} active
    </span>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
    {riskAlerts.map((risk, i) => (
      <div
        key={i}
        className={`border rounded-lg p-4 transition-colors ${
          risk.severity === "critical"
            ? "border-destructive/30 bg-destructive/5"
            : risk.severity === "high"
            ? "border-mango-orange/30 bg-mango-orange/5"
            : risk.severity === "medium"
            ? "border-mango-mid/30 bg-mango-mid/5"
            : "border-border bg-muted/30"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle
            size={13}
            className={
              risk.severity === "critical"
                ? "text-destructive"
                : risk.severity === "high"
                ? "text-mango-orange"
                : risk.severity === "medium"
                ? "text-mango-mid"
                : "text-muted-foreground"
            }
          />

          <span className="text-sm font-semibold text-foreground">
            {risk.title}
          </span>

          <span
            className={`ml-auto text-xs! px-2 py-0.5 rounded-full capitalize font-medium ${
              severityColor[risk.severity] ??
              "text-muted-foreground bg-secondary"
            }`}
          >
            {risk.severity}
          </span>
        </div>

        <p className="text-xs! text-muted-foreground leading-relaxed">
          {risk.description}
        </p>
      </div>
    ))}
  </div>
</div>
  );
}