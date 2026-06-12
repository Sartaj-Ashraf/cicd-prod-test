import {
  Target,
  ChevronRight,
} from "lucide-react";

import { priorityBadge } from "@/utils/dashboard/analytics-helper";

interface Props {
  priorityActions: any[];
}

export default function PriorityActions({
  priorityActions,
}: Props) {
  if (!priorityActions?.length) return null;

  return (
  <div className="bg-card border border-border rounded-xl p-5">
  <div className="flex items-center gap-2 mb-4">
    <Target
      size={15}
      className="text-mango-orange" // Updated to match your 'Mango Depth' theme
    />

    <h2 className="text-lg! font-semibold text-foreground">
      Priority Actions
    </h2>

    <span className="ml-auto text-[10px] text-muted-foreground/60 font-mono">
      {priorityActions.length} tasks
    </span>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
    {priorityActions.map((action, i) => (
      <div
        key={i}
        className="bg-background border border-border rounded-lg p-4 hover:border-leaf-main/40 transition-colors group"
      >
        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${
              priorityBadge[action.priority] ??
              "bg-secondary text-muted-foreground"
            }`}
          >
            {action.priority} priority
          </span>

          <ChevronRight
            size={14}
            className="text-muted-foreground/40 group-hover:text-foreground transition-colors"
          />
        </div>

        <h3 className="text-lg! font-semibold text-foreground mb-1">
          {action.title}
        </h3>

        <p className="text-xs! text-muted-foreground leading-relaxed mb-3">
          {action.description}
        </p>

        <div className="border-t border-border pt-3">
          <p className="text-sm! text-muted-foreground/60 uppercase tracking-widest font-mono mb-1">
            Recommended Action
          </p>

          <p className="text-xs! text-foreground/80 leading-relaxed">
            {action.recommendedAction}
          </p>
        </div>

        <div className="mt-2">
          <span className="text-xs! text-muted-foreground">
            Impact:
          </span>

          <span className="text-xs! text-leaf-main font-medium ml-1">
            {action.estimatedImpact}
          </span>
        </div>
      </div>
    ))}
  </div>
</div>
  );
}