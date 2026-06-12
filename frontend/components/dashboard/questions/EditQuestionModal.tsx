"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type Props = {
  open: boolean;
  text: string;
  setText: (val: string) => void;
  onClose: () => void;
  onSave: () => void;
  loading: boolean;
};

export function EditQuestionModal({
  open,
  text,
  setText,
  onClose,
  onSave,
  loading,
}: Props) {
  const isDisabled = loading || !text.trim();

  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isDisabled) onSave();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, isDisabled, onSave]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-heading">Edit Question</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update your feedback question
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Update question..."
            className="h-11 rounded-xl focus-visible:ring-1 "
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isDisabled) onSave();
            }}
          />
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-lg"
          >
            Cancel
          </Button>

          <Button
            onClick={onSave}
            disabled={isDisabled}
            className="bg-leaf-dark hover:bg-leaf-dark/90 text-white rounded-lg flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}