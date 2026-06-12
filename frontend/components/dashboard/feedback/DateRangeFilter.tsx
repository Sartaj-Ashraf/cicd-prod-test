import { Button }   from "@/components/ui/button";
import { Input }    from "@/components/ui/input";
import { X }        from "lucide-react";

export default function DateRangeFilter({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  onClear,
}: {
  startDate:     string;
  endDate:       string;
  onStartChange: (v: string) => void;
  onEndChange:   (v: string) => void;
  onClear:       () => void;
}) {
  const hasFilter = startDate || endDate;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Input
        type="date"
        value={startDate}
        onChange={(e) => onStartChange(e.target.value)}
        className="h-8 text-xs w-36"
        placeholder="Start date"
      />
      <span className="text-xs text-muted-foreground">to</span>
      <Input
        type="date"
        value={endDate}
        onChange={(e) => onEndChange(e.target.value)}
        className="h-8 text-xs w-36"
        placeholder="End date"
      />
      {hasFilter && (
        <Button
          size="sm"
          variant="ghost"
          className="h-8 px-2 text-xs text-muted-foreground"
          onClick={onClear}
        >
          <X size={12} className="mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}