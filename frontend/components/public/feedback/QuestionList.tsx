import { Loader2 }  from "lucide-react";
import StarRating   from "./StarRating";

type Question = { _id: string; text: string; type: string };

type Props = {
  questions:        Question[];
  isLoading:        boolean;
  answers:          Record<string, number>;
  getAnswerValue:   (id: string) => number;
  onAnswerChange:   (id: string, value: number) => void;
};

export default function QuestionList({
  questions,
  isLoading,
  getAnswerValue,
  onAnswerChange,
}: Props) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="animate-spin text-gray-300" size={20} />
      </div>
    );
  }

  if (!questions.length) return null;

  return (
    <>
      {questions.map((q) => (
        <div key={q._id} className="bg-gray-50 border border-gray-200  rounded-2xl p-4">
          <p className="text-sm! font-medium text-gray-700 mb-3">{q.text}</p>
          <StarRating
            value={getAnswerValue(q._id)}
            onChange={(v) => onAnswerChange(q._id, v)}
          />
        </div>
      ))}
    </>
  );
}