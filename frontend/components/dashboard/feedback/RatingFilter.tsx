import { Button } from "@/components/ui/button";
import { Star }   from "lucide-react";

const ratings = [0, 1, 2, 3, ];

export default function RatingFilter({
  active,
  onChange,
}: {
  active:   number;
  onChange: (r: number) => void;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {ratings.map((r) => (
        <Button
          key={r}
          size="sm"
          variant={active === r ? "default" : "outline"}
          className={`text-xs gap-1 ${active === r ? "bg-mango-orange text-white border-mango-orange" : ""}`}
          onClick={() => onChange(r)}
        >
          {r === 0 ? (
            "All"
          ) : (
            <>
              {r}
              <Star size={11} className={active === r ? "fill-white text-white" : "fill-mango-mid text-mango-mid"} />
            </>
          )}
        </Button>
      ))}
    </div>
  );
}