import { Question } from "@/services/questions/question.service";
import { QuestionItem } from "./QuestionItem";

import { MessageSquare, ListFilter } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have a Skeleton component in UI folder

type Props = {
  questions: Question[];
  loading: boolean;
  onToggle: (id: string) => void;
  onEdit: (q: Question) => void;
  onDelete: (id: string) => void;
};

export function QuestionList({
  questions,
  loading,
  onToggle,
  onEdit,
  onDelete,
}: Props) {
  // sort active first
  const sortedQuestions = [...questions].sort(
    (a, b) => Number(b.isActive) - Number(a.isActive)
  );

  const activeCount = questions.filter((q) => q.isActive).length;

  return (
    <Card className="border-border-secondary shadow-sm rounded-2xl overflow-hidden">
      {/* Header - Made responsive with flex-col on mobile */}
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        

       
      </CardHeader>

      <CardContent className="px-4 sm:px-6 pb-6">
        {/* Skeleton Loading State */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border border-border-secondary rounded-xl">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[60%]" />
                  <Skeleton className="h-4 w-[40%]" />
                </div>
                <Skeleton className="h-8 w-20 rounded-lg" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && questions.length === 0 && (
          <div className="py-16 text-center animate-in fade-in zoom-in duration-300">
            <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-muted-foreground/60" />
            </div>
            <p className="text-base font-medium text-heading">
              No questions yet
            </p>
            <p className="text-sm text-muted-foreground mt-1 max-w-[250px] mx-auto">
              Start by creating your first feedback question to gather insights.
            </p>
          </div>
        )}

        {/* List - Added responsive spacing */}
        {!loading && questions.length > 0 && (
         <div className="space-y-6">
         <h6 className="text-lg font-semibold text-heading mb-4">Active Questions</h6>         
         <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {sortedQuestions.filter((q) => q.isActive).map((q, i) => (
              <QuestionItem
                key={q._id}
                q={q}
                index={i}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
          <h6 className="text-lg font-semibold text-heading mb-4">Inactive Questions</h6>         
         <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {sortedQuestions.filter((q) =>! q.isActive).map((q, i) => (
              <QuestionItem
                key={q._id}
                q={q}
                index={i}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
          </div>

        )}
      </CardContent>
      
<CardFooter>
      
         {/* Status badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-dim border border-border-secondary text-xs font-medium text-heading whitespace-nowrap">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-leaf-dark "></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-leaf-light"></span>
          </span>
          {activeCount} Active / {questions.length} Total
        </div>
      </CardFooter>
    </Card>
  );
}