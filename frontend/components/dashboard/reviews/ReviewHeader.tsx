import RatingFilter from "./RatingFilter";
import { ReviewListProps } from "@/types/dashboard/Review.types";
export default function ReviewHeader({
  ratingFilter,
  setRatingFilter,
  reviews,
  oldestFirst,
  setOldestFirst,
}: {
  ratingFilter: number | null;
  setRatingFilter: (value: number | null) => void;
  reviews: ReviewListProps;
  oldestFirst: boolean;
  setOldestFirst: (value: boolean) => void;
}) {
 

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4 select-none">

      {/* Top label row */}
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-2xl! text-foreground tracking-tight">
          Filter by rating
        </h4>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-leaf-main animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground">
            {reviews.length} total reviews
          </span>
        </div>
      </div>

      <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />

      {/* Filter + Sort row */}
      <div className="bg-muted rounded-xl p-3 border border-border">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">

          <RatingFilter
            ratingFilter={ratingFilter}
            setRatingFilter={setRatingFilter}

            total={reviews.length}
          />

          {/* Sort select */}
          <div className="shrink-0">
            <select
              value={oldestFirst ? "oldest" : "newest"}
              onChange={(e) => setOldestFirst(e.target.value === "oldest")}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold
                         border border-border bg-card
                         text-foreground
                         transition-all duration-200
                         focus:outline-none focus:ring-1 focus:ring-leaf-main/50
                         hover:border-leaf-main/40
                         cursor-pointer"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>

        </div>
      </div>
    </div>
  );
}