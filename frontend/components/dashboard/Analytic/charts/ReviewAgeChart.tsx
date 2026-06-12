// components/dashboard/Analytic/charts/ReviewAgeChart.tsx
"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Clock } from "lucide-react";
import type { ReviewAge } from "@/types/dashboard/Analytics.types";

interface Props {
  data: ReviewAge | null;
}

const chartConfig = {
  count: { label: "Reviews", color: "var(--leaf-main)" },
};

const COLORS = [
  "var(--leaf-main)",
  "var(--leaf-dark)",
  "var(--mango-mid)",
  "var(--muted-foreground)",
];

export default function ReviewAgeChart({ data }: Props) {
  if (!data) return null;

  const chartData = [
    { label: "Last 30d", count: data.last30d },
    { label: "Last 60d", count: data.last60d },
    { label: "Last 90d", count: data.last90d },
    { label: "Older",    count: data.older   },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={15} className="text-mango-mid" />
        <h2 className="text-lg! font-semibold text-foreground">Review Age</h2>
        <span className="ml-auto text-xs text-muted-foreground font-mono">
          recency distribution
        </span>
      </div>
      <ChartContainer config={chartConfig} className="h-[160px] w-full">
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}