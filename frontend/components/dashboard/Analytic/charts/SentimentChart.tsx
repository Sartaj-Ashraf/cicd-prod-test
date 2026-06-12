// components/dashboard/Analytic/charts/SentimentChart.tsx
"use client";

import { PieChart, Pie, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Smile } from "lucide-react";

interface Props {
  data: { positive: number; neutral: number; negative: number };
}

const chartConfig = {
  positive: { label: "Positive", color: "var(--leaf-main)"       },
  neutral:  { label: "Neutral",  color: "var(--muted-foreground)" },
  negative: { label: "Negative", color: "var(--destructive)"     },
};

export default function SentimentChart({ data }: Props) {
  if (!data) return null;

  const chartData = [
    { name: "positive", value: data.positive, fill: "var(--leaf-main)"       },
    { name: "neutral",  value: data.neutral,  fill: "var(--muted-foreground)" },
    { name: "negative", value: data.negative, fill: "var(--destructive)"     },
  ].filter((d) => d.value > 0);

  return (
    <div className="bg-card border border-border rounded-xl p-5 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Smile size={15} className="text-mango-mid" />
        <h2 className="text-lg! font-semibold text-foreground">Sentiment</h2>
      </div>
      <ChartContainer config={chartConfig} className="h-[200px] w-full">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
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