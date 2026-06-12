// components/dashboard/Analytic/charts/SearchVsMapsChart.tsx
"use client";

import { PieChart, Pie, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { MapPin } from "lucide-react";
import type { PerformanceData } from "@/types/dashboard/Analytics.types";

interface Props {
  totals: PerformanceData["totals"];
}

const chartConfig = {
  maps:   { label: "Maps",   color: "var(--leaf-main)"    },
  search: { label: "Search", color: "var(--mango-orange)" },
};

export default function SearchVsMapsChart({ totals }: Props) {
  if (!totals) return null;

  const chartData = [
    { name: "maps",   value: totals.impressionsMaps,   fill: "var(--leaf-main)"    },
    { name: "search", value: totals.impressionsSearch, fill: "var(--mango-orange)" },
  ].filter((d) => d.value > 0);

  if (!chartData.length) return null;

  const total = chartData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="bg-card border border-border rounded-xl p-5 h-full">
      <div className="flex items-center gap-2 mb-1">
        <MapPin size={15} className="text-leaf-main" />
        <h2 className="text-lg! font-semibold text-foreground">
          Discovery
        </h2>
      </div>
      <p className="text-xs text-muted-foreground mb-2">
        {total.toLocaleString()} total impressions
      </p>

      <ChartContainer config={chartConfig} className="h-[200px] w-full">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={75}
            dataKey="value"
            paddingAngle={3}
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.fill} strokeWidth={0} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
          <ChartLegend content={<ChartLegendContent nameKey="name" />} />
        </PieChart>
      </ChartContainer>
    </div>
  );
}