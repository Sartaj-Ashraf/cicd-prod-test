import { Star, User, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const StarDisplay = ({
  value,
  total = 5,
}: {
  value: number;
  total?: number;
}) => (
  <div className="flex gap-0.5">
    {Array.from({ length: total }, (_, i) => {
      const star = i + 1;
      return (
        <Star
          key={star}
          size={14}
          className={
            star <= value
              ? "fill-mango-mid text-mango-mid"
              : "fill-gray-300 text-gray-300"
          }
        />
      );
    })}
  </div>
);

export default function FeedbackCard({ feedback }: { feedback: any }) {
  const date = new Date(feedback.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const comment = feedback.answers?.find(
    (a: any) => a.questionText === "Additional comments"
  );

  const questionAnswers = feedback.answers?.filter(
    (a: any) => a.questionText !== "Additional comments"
  );

  const hasContact = feedback.fullName || feedback.phoneNumber;

  return (
    <Card className="border border-border">
      <CardContent className="p-4 grid gap-3">

        {/* header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <StarDisplay value={feedback.rating} total={3} />
            <p className="text-xs text-muted-foreground">{date}</p>
          </div>
        </div>

        {/* contact info */}
        {hasContact && (
          <div className="flex flex-wrap gap-2">
            {feedback.fullName && (
              <div className="flex items-center gap-1.5 bg-muted/50 rounded-lg px-2.5 py-1.5">
                <User size={12} className="text-muted-foreground shrink-0" />
                <span className="text-xs font-medium">{feedback.fullName}</span>
              </div>
            )}
           {feedback.phoneNumber && (
            <a
  
    href={`tel:${feedback.phoneNumber}`}
    className="flex items-center gap-1.5 bg-muted/50 rounded-lg px-2.5 py-1.5"
  >
    <Phone size={12} className="text-muted-foreground shrink-0" />
    <span className="text-xs font-medium">{feedback.phoneNumber}</span>
  </a>
)}
          </div>
        )}

        {/* question answers */}
        {questionAnswers?.length > 0 && (
          <div className="grid gap-2">
            {questionAnswers.map((a: any, i: number) => (
              <div key={i} className="flex items-center justify-between border-b">
                <p className="text-xs text-muted-foreground">{a.questionText}</p>
                {a.questionType === "stars" ? (
                  <StarDisplay value={Number(a.value)} />
                ) : (
                  <p className="text-xs font-medium">{String(a.value)}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* comment */}
        {comment && (
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              "{comment.value}"
            </p>
          </div>
        )}

      </CardContent>
    </Card>
  );
}