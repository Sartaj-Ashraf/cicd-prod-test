"use client";

import {
  Dialog,
  DialogContent,

} from "@/components/ui/dialog";

import { QuestionInput } from "./QuestionInput";

export default function CreateQuestionDialog({
  open,
  onOpenChange,
  text,
  setText,
  onCreate,
  loading,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  text: string;
  setText: (v: string) => void;
  onCreate: () => void;
  loading: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">

        <QuestionInput
          text={text}
          setText={setText}
          onCreate={onCreate}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
}