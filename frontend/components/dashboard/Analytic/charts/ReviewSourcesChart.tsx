// components/dashboard/Analytic/charts/ReviewSourcesChart.tsx
"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Database } from "lucide-react";
import type { ReviewSources } from "@/types/dashboard/Analytics.types";

interface Props {
  sources:        ReviewSources | null;
  unrepliedCount: number | null;
  totalAnalysed:  number;
}

const COLORS = ["var(--leaf-main)", "var(--mango-orange)", "var(--mango-mid)"];

const chartConfig = {
  count: { label: "Reviews", color: "var(--leaf-main)" },
};

export default function ReviewSourcesChart({ sources, unrepliedCount, totalAnalysed }: Props) {
  if (!sources) return null;

  const data = [
    { source: "Google",  count: sources.google  },
    { source: "GBP",     count: sources.gbp     },
    { source: "Private", count: sources.private },
  ].filter((d) => d.count > 0);

  if (!data.length) return null;


  return (
    <div className="bg-card border border-border rounded-xl p-5 h-full">
      <div className="flex items-center gap-2 mb-1">
        <Database size={15} className="text-mango-orange" />
        <h2 className="text-lg! font-semibold text-foreground">Review Sources</h2>
        {unrepliedCount !== null && unrepliedCount > 0 && (
          <span className="ml-auto text-xs text-destructive font-mono font-medium">
            {unrepliedCount} unreplied
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        {totalAnalysed} reviews analysed
      </p>
      <ChartContainer config={chartConfig} className="h-[160px] w-full">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="source"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            width={50}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={20}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}