// components/dashboard/Analytic/charts/ResponseRateGauge.tsx
"use client";

import { MessageSquare } from "lucide-react";

interface Props {
  value:  number | null;
  status: string;
}

const statusColor = (s: string) => {
  if (s === "excellent") return "var(--leaf-main)";
  if (s === "good")      return "var(--mango-mid)";
  if (s === "average")   return "var(--star-gold)";
  if (s === "poor")      return "var(--mango-orange)";
  return "var(--destructive)";
};

export default function ResponseRateGauge({ value, status }: Props) {
  if (value === null || value === undefined) return null;

  const size   = 160;
  const cx     = size / 2;
  const cy     = size / 2;
  const r      = 55;
  const stroke = 10;

  const pct      = Math.min(Math.max(value, 0), 100) / 100;
  const angle    = pct * 180 - 180;
  const toRad    = (deg: number) => (deg * Math.PI) / 180;
  const fillX    = cx + r * Math.cos(toRad(angle));
  const fillY    = cy + r * Math.sin(toRad(angle));
  const largeArc = pct > 0.5 ? 1 : 0;
  const color    = statusColor(status);

  const startX = cx - r;
  const startY = cy;
  const endX   = cx + r;
  const endY   = cy;

  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare size={15} className="text-mango-mid" />
        <h2 className="text-lg! font-semibold text-foreground">Response Rate</h2>
        <span className="ml-auto text-[10px] font-medium capitalize px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
          {status}
        </span>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 gap-3">
        {/* gauge */}
        <svg width={size} height={size / 2 + 10} viewBox={`0 0 ${size} ${size / 2 + 10}`}>
          {/* background arc */}
          <path
            d={`M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`}
            fill="none"
            stroke="var(--border)"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          {/* fill arc */}
          {value > 0 && (
            <path
              d={`M ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${fillX} ${fillY}`}
              fill="none"
              stroke={color}
              strokeWidth={stroke}
              strokeLinecap="round"
              style={{ transition: "all 1s ease" }}
            />
          )}
          {/* value */}
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            fontSize="24"
            fontWeight="bold"
            fill={color}
          >
            {value}%
          </text>
        </svg>

        {/* label below SVG — not clipped */}
        <p className="text-xs text-muted-foreground text-center">
          of reviews replied
        </p>
      </div>
    </div>
  );
}