import { LucideIcon } from "lucide-react";

interface InsightItem {
  title: string;
  description: string;
  confidence?: number;
  severity?: string;
}

interface InsightListProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  dotColor: string;
  items: InsightItem[];
  type: "strength" | "weakness";
  severityColor?: Record<string, string>;
}

export default function InsightList({
  title,
  icon: Icon,
  iconColor,
  dotColor,
  items,
  type,
  severityColor,
}: InsightListProps) {
  if (!items?.length) return null;

  return (
   <div className="bg-card border border-border rounded-xl p-5">
  <div className="flex items-center gap-2 mb-4">
    <Icon size={15} className={iconColor} />

    <h2 className="text-lg! font-semibold text-foreground">
      {title}
    </h2>
  </div>

  <div className="space-y-3">
    {items.map((item, i) => (
      <div
        key={i}
        className="flex items-start gap-3"
      >
        <div
          className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`}
        />

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm! text-foreground font-medium">
              {item.title}
            </span>

            {type === "strength" &&
              item.confidence && (
                <span className="text-sm text-leaf-main font-mono">
                  {Math.round(item.confidence * 100)}%
                </span>
              )}

            {type === "weakness" &&
              item.severity && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full capitalize font-medium ${
                    severityColor?.[item.severity] ??
                    "text-muted-foreground bg-secondary"
                  }`}
                >
                  {item.severity}
                </span>
              )}
          </div>

          <p className="text-xs! text-muted-foreground mt-0.5 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>
  );
}