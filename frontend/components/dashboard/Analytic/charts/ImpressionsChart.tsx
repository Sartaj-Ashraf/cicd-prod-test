"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Eye } from "lucide-react";
import type { DailyPerformance } from "@/types/dashboard/Analytics.types";

interface Props {
  daily: DailyPerformance[];
}

const chartConfig = {
  impressionsMaps:   { label: "Maps",   color: "var(--leaf-main)"    },
  impressionsSearch: { label: "Search", color: "var(--mango-orange)" },
};

// group daily → weekly to reduce density
const groupByWeek = (daily: DailyPerformance[]) => {
  const weeks: Record<string, { maps: number; search: number }> = {};

  for (const d of daily) {
    const date  = new Date(d.date);
    const week  = `W${Math.ceil(date.getDate() / 7)} ${date.toLocaleString("en-US", { month: "short", year: "2-digit" })}`;
    if (!weeks[week]) weeks[week] = { maps: 0, search: 0 };
    weeks[week].maps   += d.impressionsMaps;
    weeks[week].search += d.impressionsSearch;
  }

  return Object.entries(weeks).map(([week, v]) => ({
    week,
    impressionsMaps:   v.maps,
    impressionsSearch: v.search,
  }));
};

export default function ImpressionsChart({ daily }: Props) {
  if (!daily?.length) return null;

  const data = groupByWeek(daily);

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Eye size={15} className="text-leaf-main" />
        <h2 className="text-lg! font-semibold text-foreground">
          Impressions
        </h2>
        <span className="ml-auto text-xs text-muted-foreground font-mono">
          last 90 days
        </span>
      </div>

      <ChartContainer config={chartConfig} className="h-[220px] w-full">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            interval={Math.floor(data.length / 5)}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line
            type="monotone"
            dataKey="impressionsMaps"
            stroke="var(--leaf-main)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="impressionsSearch"
            stroke="var(--mango-orange)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}