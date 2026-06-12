"use client";

import { useEffect, useState } from "react";
import ReviewList from "@/components/dashboard/reviews/ReviewList";
import { useReviews } from "@/services/review/review.services";
import { useLocationContext } from "@/context/selectedLocation.context";
import { ArrowUpDown, SlidersHorizontal } from "lucide-react";
import ReviewsPageSkeleton from "@/components/skeleton/ReviewsPageSkeleton";
import { Review } from "@/types/dashboard/Review.types";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname,useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "sonner";

const RATING_FILTERS = [undefined, 5, 4, 3, 2, 1];

export default function ReviewsPage() {
  const [ratingFilter, setRatingFilter] = useState<number | undefined>(undefined);
  const [oldestFirst, setOldestFirst] = useState(false);
  const [unreplied,showUnreplied] = useState(false);
  const [positive,showPositive] = useState(false);
  const [negative,showNegative] = useState(false);
  const [pageToken, setPageToken] = useState<string | undefined>(undefined);
  const [tokenHistory, setTokenHistory] = useState<(string | undefined)[]>([]);

  const queryClient=useQueryClient();
  const { selectedLocation } = useLocationContext();

  const pathname=usePathname();
  const router=useRouter();
  const searchParams=useSearchParams();

  const { data, isLoading } = useReviews(selectedLocation?._id!, {
    rating:ratingFilter,
    oldestFirst,
    pageToken, 
  });

  const reviews = data?.reviews ?? [];
  const connected=searchParams.get("connected");
  const matchedLocation=searchParams.get("matchedLocation");

  const handleNext = () => {
    if (!data?.nextPageToken) return;
    setTokenHistory((prev) => [...prev, pageToken]);
    setPageToken(data.nextPageToken);
  };

  const handlePrev = () => {
    if (tokenHistory.length === 0) return;

    const history = [...tokenHistory];

    const prevToken = history.pop(); 

    setTokenHistory(history);
    setPageToken(prevToken);
  };

  const isFirstPage = tokenHistory.length === 0;
  const isLastPage = !data?.nextPageToken;

  useEffect(() => {
  if (!connected) return;
  if (matchedLocation === "true") {
    queryClient.invalidateQueries({
      queryKey: ["reviews", selectedLocation?._id, {
        rating:ratingFilter,
        oldestFirst,
      }],
    });

    queryClient.setQueryData(
      queryKeys.gbp.connection,
      { connected: true }
    );

    toast.success("GBP connected successfully");
  }

  if (matchedLocation === "false") {
    toast.error(
      "GBP connected, but this Google account does not manage the already added location."
    );
  }

  router.replace(pathname);
}, [connected, matchedLocation]);

  //Review filtering logic
  const filteredReviews = reviews
  .filter((review: Review) => {
    if (ratingFilter && review.rating !== ratingFilter) {
      return false;
    }

    if (unreplied && review.replied) {
      return false;
    }

    if (positive && review.rating < 4) {
      return false;
    }

    if (negative && review.rating > 3) {
      return false;
    }

    return true;
  })
  .sort((a: Review, b: Review) =>
    oldestFirst
      ? new Date(a.reviewTime).getTime() -
        new Date(b.reviewTime).getTime()
      : new Date(b.reviewTime).getTime() -
        new Date(a.reviewTime).getTime()
  );
  
  if (isLoading || !reviews) {
    return (
    <ReviewsPageSkeleton />
    );
  }

  const togglePositive = () => {
  showPositive(prev => !prev);
  showNegative(false);
};

const toggleNegative = () => {
  showNegative(prev => !prev);
  showPositive(false);
};

 function connectGBP(){
   window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/google/connect?redirectTo=/dashboard/reviews&locationId=${selectedLocation?._id}`;
}



  return (
    <div className="min-h-screen bg-background">
      <div className=" mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl! font-bold text-foreground">Reviews</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {selectedLocation?.name ?? "Your location"}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            {RATING_FILTERS.map((r) => (
              <button
                key={r ?? "all"}
                onClick={() => setRatingFilter(r)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-colors duration-150
                  ${ratingFilter === r
                    ? "border-border bg-mango-orange text-background"
                    : "border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
              >
                {r === undefined ? (
                  <><SlidersHorizontal size={11} /> All</>
                ) : (
                  <>{r}★</>
                )}
              </button>
            ))}

            <button
              onClick={() => setOldestFirst(!oldestFirst)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border border-border/50 text-muted-foreground hover:text-foreground hover:border-border transition-colors duration-150"
            >
              <ArrowUpDown size={11} />
              {oldestFirst ? "Oldest" : "Newest"}
            </button>
          </div>
        </div>

       {/*Review analytics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">
            Average Rating
          </p>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-2xl font-bold">
              {data?.averageRating ?? 0}
            </span>
            <span className="text-yellow-500">★</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">
            Total Reviews
          </p>
          <p className="mt-2 text-2xl font-bold">
            {data?.totalReviews ?? 0}
          </p>
        </div>
   
        {!(selectedLocation?.source ==="places") && <div
          onClick={() => showUnreplied(!unreplied)}
          className={`rounded-xl border p-4 cursor-pointer transition-all duration-200
            ${
              unreplied
                ? "border-orange-500 bg-orange-500/10 shadow-sm"
                : "border-border bg-card hover:border-orange-500/40"
            }
          `}
        >
          <p
            className={`text-xs ${
              unreplied
                ? "text-orange-500 font-medium"
                : "text-muted-foreground"
            }`}
          >
            Unreplied
          </p>

          <p className="mt-2 text-2xl font-bold">
            {data?.unrepliedCount ?? 0}
          </p>
        </div>}

         <div
              onClick={togglePositive}
              className={`rounded-xl border p-4 cursor-pointer transition-all duration-200
                ${
                  positive
                    ? "border-green-500 bg-green-500/10 shadow-sm"
                    : "border-border bg-card hover:border-green-500/40"
                }
              `}
            >
              <p
                className={`text-xs ${
                  positive
                    ? "text-green-500 font-medium"
                    : "text-muted-foreground"
                }`}
              >
                Positive
              </p>

              <p className="mt-2 text-2xl font-bold">
                {data?.positiveCount ?? 0}
              </p>
        </div>

        <div
          onClick={toggleNegative}
          className={`rounded-xl border p-4 cursor-pointer transition-all duration-200
            ${
              negative
                ? "border-red-500 bg-red-500/10 shadow-sm"
                : "border-border bg-card hover:border-red-500/40"
            }
          `}
        >
          <p
            className={`text-xs ${
              negative
                ? "text-red-500 font-medium"
                : "text-muted-foreground"
            }`}
          >
            Negative
          </p>

          <p className="mt-2 text-2xl font-bold">
            {data?.negativeCount ?? 0}
          </p>
        </div>
       </div>

        {/* Meta */}
        <div className="flex items-center justify-between pb-5 border-b border-border mb-6">
          <p className="text-sm text-muted-foreground">
            Showing <span className="text-foreground font-medium">{filteredReviews.length}</span> reviews
          </p>
        </div>

    {reviews.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-28 gap-2">
        <p className="text-sm font-medium text-foreground">
          No reviews found
        </p>
        <p className="text-xs text-muted-foreground">
          {ratingFilter
            ? `No ${ratingFilter}-star reviews. Try a different filter.`
            : "Reviews will appear here once available."}
        </p>
      </div>
    ) : (
    <>
    {selectedLocation?.source === "places" && (
      <div className="mb-6 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 via-background to-blue-500/5 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Unlock all Google Reviews
            </h3>

            <p className="mt-1 text-sm text-muted-foreground max-w-xl">
              You're currently viewing the limited public reviews available from
              Google Maps. Connect your Google Business Profile to access all
              customer reviews, reply directly from the dashboard, and track review
              performance over time.
            </p>
         </div>

          <button
            onClick={connectGBP}
            className="shrink-0 rounded-lg bg-mango-orange px-5 py-2.5 text-sm font-medium text-white transition-all hover:scale-[1.02] hover:opacity-90"
          >
            Connect GBP
          </button>
        </div>
      </div>
    )}

    <ReviewList reviews={filteredReviews} />
  </>
)}

      </div>
        {/* Pagination */}
        {(selectedLocation?.source ==="gbp") && (
         <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-border">
  <button
    onClick={handlePrev}
    disabled={isFirstPage}
    className="h-10 px-4 rounded-full border border-border hover:bg-muted transition disabled:opacity-40"
  >
    ← Previous
  </button>

  <div className="px-4 py-2 rounded-full bg-muted text-sm font-medium">
    Page {tokenHistory.length + 1}
  </div>

  <button
    onClick={handleNext}
    disabled={isLastPage}
    className="h-10 px-4 rounded-full border border-border hover:bg-muted transition disabled:opacity-40"
  >
    Next →
  </button>
</div>
        )}
    </div>
  );
}