import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FeedbackPagination({
  pagination,
  onPageChange,
}: {
  pagination:   any;
  onPageChange: (page: number) => void;
}) {
  if (!pagination || pagination.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-xs text-muted-foreground">
        Page {pagination.currentPage} of {pagination.totalPages} —{" "}
        {pagination.totalDocs} total
      </p>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={!pagination.hasPrevPage}
          onClick={() => onPageChange(pagination.prevPage)}
        >
          <ChevronLeft size={14} />
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={!pagination.hasNextPage}
          onClick={() => onPageChange(pagination.nextPage)}
        >
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  );
}