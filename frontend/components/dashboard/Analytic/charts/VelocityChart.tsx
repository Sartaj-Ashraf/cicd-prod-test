// components/dashboard/Analytic/charts/VelocityChart.tsx
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import type { VelocityTrendPoint } from "@/types/dashboard/Analytics.types";

interface Props {
  data: VelocityTrendPoint[];
}

const chartConfig = {
  count: { label: "Reviews", color: "var(--leaf-main)" },
};

// "2025-02-01T00:00:00.000Z" or "2025-02" → "Feb 2025"
const formatMonth = (raw: string): string => {
  try {
    const date = new Date(raw);
    if (!isNaN(date.getTime())) {
      return date.toLocaleString("en-US", { month: "short", year: "numeric" });
    }
    return raw;
  } catch {
    return raw;
  }
};

export default function VelocityChart({ data }: Props) {
  if (!data?.length) return null;

  const formatted = data.map((d) => ({
    ...d,
    month: formatMonth(d.month),
  }));

  // ── responsive tick interval based on data length ─────────────────────────
  const tickInterval =
    formatted.length > 36 ? Math.floor(formatted.length / 6)  // ~6 ticks
    : formatted.length > 24 ? Math.floor(formatted.length / 5) // ~5 ticks
    : formatted.length > 12 ? 2                                 // every 3rd
    : 0;                                                        // every month

  // ── chart height based on data length ─────────────────────────────────────
  const chartHeight =
    formatted.length > 24 ? "h-[250px]" : "h-[200px]";

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={15} className="text-leaf-main" />
        <h2 className="text-lg! font-semibold text-foreground">
          Review Velocity
        </h2>
        <div className="ml-auto flex items-center gap-2">
          {formatted.length > 12 && (
            <span className="text-[10px] text-muted-foreground/60 font-mono">
              {formatted.length} months
            </span>
          )}
          <span className="text-xs text-muted-foreground font-mono">
            reviews / month
          </span>
        </div>
      </div>

      <ChartContainer config={chartConfig} className={`w-full ${chartHeight}`}>
        <LineChart
          data={formatted}
          margin={{ top: 5, right: 10, left: -20, bottom: formatted.length > 12 ? 20 : 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{
              fontSize:  formatted.length > 24 ? 9 : 11,
              fill:      "var(--muted-foreground)",
            }}
            tickLine={false}
            axisLine={false}
            interval={tickInterval}
            angle={formatted.length > 24 ? -35 : 0}
            textAnchor={formatted.length > 24 ? "end" : "middle"}
            height={formatted.length > 24 ? 40 : 20}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="count"
            stroke="var(--leaf-main)"
            strokeWidth={2}
            dot={formatted.length > 24
              ? false                                    // ← no dots for dense data
              : { fill: "var(--leaf-main)", r: 4 }
            }
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}