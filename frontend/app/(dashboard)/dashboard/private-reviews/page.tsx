// app/(dashboard)/dashboard/feedback/[locationId]/page.tsx
"use client";

import { useState }        from "react";
import { useGetFeedbackByLocation } from "@/hooks/feedback.hooks";

import { Card, CardContent }  from "@/components/ui/card";
import { Separator }          from "@/components/ui/separator";
import FeedbackCard           from "@/components/dashboard/feedback/FeedbackCard";
import FeedbackCardSkeleton   from "@/components/skeleton/FeedbackSkeleton";
import RatingFilter           from "@/components/dashboard/feedback/RatingFilter";
import FeedbackPagination     from "@/components/dashboard/feedback/FeedbackPagination";
import { MessageSquare }      from "lucide-react";
import { Button }             from "@/components/ui/button";
import SortFilter from "@/components/dashboard/feedback/SortFilter";
import DateRangeFilter from "@/components/dashboard/feedback/DateRangeFilter";
import { useLocationContext } from "@/context/selectedLocation.context";

export default function FeedbackPage() {

  const [page,       setPage]       = useState(1);
  const [rating,     setRating]     = useState(0);
  const [sort,       setSort]       = useState("newest");
  const [startDate,  setStartDate]  = useState("");
  const [endDate,    setEndDate]    = useState("");
  const {selectedLocation} = useLocationContext()

  const { data, isLoading } = useGetFeedbackByLocation(selectedLocation?._id || "", {
    page,
    limit:     40,
    rating:    rating   || undefined,
    startDate: startDate || undefined,
    endDate:   endDate   || undefined,
    sort,
  });

  const feedbacks  = data?.feedbacks  ?? [];
  const pagination = data?.pagination ?? null;

  const handleRatingChange = (r: number) => {
    setRating(r);
    setPage(1);
  };

  const handleSortChange = (s: string) => {
    setSort(s);
    setPage(1);
  };

  const handleClearDates = () => {
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const handleClearAll = () => {
    setRating(0);
    setSort("newest");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const hasActiveFilters = rating || startDate || endDate || sort !== "newest";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto bg-card p-4 md:p-8 gap-4 grid">

        {/* header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h4 className="font-bold">Feedback</h4>
            <p className="text-sm text-muted-foreground mt-2">
              Customer feedback for <span className="text-leaf-dark font-semibold">{selectedLocation?.name}</span> location
            </p>
          </div>

          {hasActiveFilters && (
            <Button
              size="sm"
              variant="outline"
              className="text-xs self-start md:self-auto"
              onClick={handleClearAll}
            >
              Clear all filters
            </Button>
          )}
        </div>

        {/* filters */}
        <Card>
          <CardContent className="p-4 grid gap-4">

            <div className="flex flex-col gap-3">

              {/* rating + sort row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-xs text-muted-foreground">Rating:</p>
                  <RatingFilter active={rating} onChange={handleRatingChange} />
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">Sort:</p>
                  <SortFilter value={sort} onChange={handleSortChange} />
                </div>
              </div>

              <Separator />

              {/* date range row */}
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs text-muted-foreground">Date range:</p>
                <DateRangeFilter
                  startDate={startDate}
                  endDate={endDate}
                  onStartChange={(v) => { setStartDate(v); setPage(1); }}
                  onEndChange={(v)   => { setEndDate(v);   setPage(1); }}
                  onClear={handleClearDates}
                />
              </div>

            </div>

          </CardContent>
        </Card>

        {/* content */}
        <Card>
          <CardContent className="md:p-4">

            {/* loading */}
            {isLoading && (
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <FeedbackCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* empty */}
            {!isLoading && !feedbacks.length && (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <MessageSquare size={32} className="text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  {rating
                    ? `No ${rating}-star feedback found`
                    : "No feedback received yet"
                  }
                </p>
              </div>
            )}

            {/* feedbacks */}
            {!isLoading && feedbacks.length > 0 && (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  {feedbacks.map((f: any) => (
                    <FeedbackCard key={f._id} feedback={f} />
                  ))}
                </div>
                <FeedbackPagination
                  pagination={pagination}
                  onPageChange={setPage}
                />
              </>
            )}

          </CardContent>
        </Card>

      </div>
    </div>
  );
}