"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { MousePointerClick } from "lucide-react";
import type { PerformanceData } from "@/types/dashboard/Analytics.types";

interface Props {
  totals: PerformanceData["totals"];
}

const COLORS = [
  "var(--leaf-main)",
  "var(--mango-mid)",
  "var(--mango-orange)",
];

const chartConfig = {
  value: { label: "Count", color: "var(--leaf-main)" },
};

export default function ActionsFunnelChart({ totals }: Props) {
  if (!totals) return null;

  const data = [
    { action: "Directions", value: totals.directionRequests },
    { action: "Calls",      value: totals.callClicks        },
    { action: "Website",    value: totals.websiteClicks     },
  ].filter((d) => d.value > 0);

  if (!data.length) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-5 h-full">
      <div className="flex items-center gap-2 mb-1">
        <MousePointerClick size={15} className="text-mango-orange" />
        <h2 className="text-lg! font-semibold text-foreground">
          Customer Actions
        </h2>
      </div>
      <p className="text-xs text-muted-foreground mb-4">last 90 days</p>

      <ChartContainer config={chartConfig} className="h-[160px] w-full">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
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
            dataKey="action"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            width={60}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={20}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}