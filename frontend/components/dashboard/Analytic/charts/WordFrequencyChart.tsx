"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { MessageSquare } from "lucide-react";
import type { WordFrequencyItem } from "@/types/dashboard/Analytics.types";

interface Props {
  data: WordFrequencyItem[];
}

const chartConfig = {
  count: { label: "almost", color: "var(--leaf-main)" },
};

const sentimentColor: Record<string, string> = {
  positive: "var(--leaf-main)",
  negative: "var(--destructive)",
  neutral:  "var(--muted-foreground)",
};

export default function WordFrequencyChart({ data }: Props) {
  if (!data?.length) return null;

  const sorted = [...data].sort((a, b) => (b.count ?? 0) - (a.count ?? 0));

  return (
    <div className="bg-card border border-border rounded-xl p-5">

      {/* header */}
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare size={15} className="text-mango-mid" />
        <h2 className="text-lg! font-semibold text-foreground">
          Most Mentioned
        </h2>
        <span className="ml-auto text-xs text-muted-foreground font-mono">
          from all reviews
        </span>
      </div>

      {/* legend */}
      <div className="flex items-center gap-4 mb-4">
        {(["positive", "negative", "neutral"] as const).map((s) => (
          <div key={s} className="flex items-center gap-1.5 text-xs text-muted-foreground capitalize">
            <div className={`w-2 h-2 rounded-full ${
              s === "positive" ? "bg-leaf-main"   :
              s === "negative" ? "bg-destructive" :
              "bg-muted-foreground"
            }`} />
            {s}
          </div>
        ))}
      </div>

      <ChartContainer
        config={chartConfig}
        className="w-full"
        style={{ height: `${Math.max(sorted.length * 28, 200)}px` }}
      >
        <BarChart
          data={sorted}
          layout="vertical"
          margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            horizontal={false}
          />
          <XAxis
            type="number"
            hide={true}
            domain={[0, "auto"]}
          />
          <YAxis
            type="category"
            dataKey="word"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            width={90}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={18}>
            {sorted.map((entry, i) => (
              <Cell
                key={i}
                fill={sentimentColor[entry.sentiment] ?? "var(--muted-foreground)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>

    </div>
  );
}