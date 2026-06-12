import { cn } from "@/lib/utils";

interface SegmentedControlProps<T extends string> {
  options: T[];
  value: T;
  onChange: (v: T) => void;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div className="flex rounded-lg border border-border overflow-hidden">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            "flex-1 h-8 text-xs font-medium transition-colors border-r border-border last:border-r-0",
            value === opt
              ? "bg-foreground text-background"
              : "bg-transparent text-muted-foreground hover:bg-muted"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}