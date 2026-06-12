import { Question } from "@/services/questions/question.service";
import { QuestionActions } from "./QuestionActions";

type Props = {
  q: Question;
  index: number;
  onToggle: (id: string) => void;
  onEdit: (q: Question) => void;
  onDelete: (id: string) => void;
};

export function QuestionItem({ q, index, onToggle, onEdit, onDelete }: Props) {
  return (
    <div   className="group relative flex flex-col justify-between gap-4 rounded-lg border bg-card p-5 transition-all duration-200 ">

          {/* Bottom: Status Badge */}


      {/* Middle: Content */}
      <div className="flex md:flex-row flex-col md:items-center space-y-2 gap-2">
        <span className="w-6 h-6 flex items-center justify-center rounded-lg bg-green-dim text-xs font-semibold text-heading shrink-0 border border-border-secondary m-0">
          {index + 1}
        </span>
        <h5 className="text-heading font-semibold leading-tight ">
          {q.text}
        </h5>
        
      </div>
        {/* Actions - Positioned top right */}
        <div >
          <QuestionActions
            isActive={q.isActive}
            onToggle={() => onToggle(q._id)}
            onEdit={() => onEdit(q)}
            onDelete={() => onDelete(q._id)}
          />
        </div>

  
    </div>
  );
}