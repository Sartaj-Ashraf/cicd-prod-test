import ReviewCard from "./ReviewCard";
import type { Review } from "@/types/dashboard/Review.types";

export default function ReviewList({ reviews }: { reviews: Review[] }) {
  console.log({reviews});
  return (
    <div className="mt-6">

      {reviews.length === 0 ? (
        <div className="text-center py-16 border border-border rounded-2xl bg-muted">
          <p className="text-muted-foreground text-sm">No reviews found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {reviews.map((review: any) => (
            <div
              key={review._id}
              className="transition-all duration-300 hover:scale-[1.02]"
            >
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      )}

    </div>
  );
}