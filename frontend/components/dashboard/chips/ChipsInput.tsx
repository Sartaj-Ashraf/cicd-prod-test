type Props = {
  text: string;
  setText: (val: string) => void;
  onCreate: () => void;
  loading: boolean;
};

  import { Input } from "@/components/ui/input";
  import { Button } from "@/components/ui/button";
  import { Plus, Loader2 } from "lucide-react";

export function ChipsInput({ text, setText, onCreate, loading }: Props) {
  const isDisabled = loading || !text.trim();
  const charCount = text.length;

  return (
    <div className="rounded-2xl space-y-4">

      {/* Header */}
      <div>
        <h4 className="text-heading! ">
          Create Chip
        </h4>
        <p className="text-muted-foreground text-xs!">
          Add an intent that user can give to AI
        </p>
      </div>

      {/* Input + Button */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 space-y-1">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. Hospitality or food?"
            className="h-11 rounded-xl focus-visible:ring-2 focus-visible:ring-mango-orange"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isDisabled) {
                onCreate();
              }
            }}
            maxLength={120}
          />

          {/* helper row */}
          <div className="flex justify-between text-[10px] text-muted-foreground  ">
            <span>Press Enter to submit</span>
            <span className={charCount > 120 ? "text-red-500" : ""}>
              {charCount}/120
            </span>
          </div>
        </div>

        <Button
          onClick={onCreate}
          disabled={isDisabled}
          className="h-11 px-5 rounded-xl bg-mango-orange hover:bg-mango-deep text-white flex items-center gap-2 shrink-0"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Add
            </>
          )}
        </Button>
      </div>
    </div>
  );
}