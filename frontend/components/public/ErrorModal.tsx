"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

type ErrorModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  message: string;
};

export default function ErrorModal({
  open,
  onOpenChange,
  title = "Something went wrong",
  message,
}: ErrorModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          overflow-hidden
          rounded-3xl
          border
          border-border-secondary
          bg-card
          text-foreground
          shadow-2xl
          sm:max-w-md
          p-0
        "
      >
        {/* Top Accent */}
        {/* <div className="h-1 w-full bg-mango-orange" /> */}

        <div className="p-6">
          <DialogHeader className="space-y-5">
            {/* Icon */}
            <div
              className="
                mx-auto
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                bg-mango-orange/10
                ring-8
                ring-mango-orange/5
              "
            >
              <AlertTriangle className="h-10 w-10 text-mango-orange" />
            </div>

            {/* Text */}
            <div className="text-center">
              <DialogTitle
                className="
                  text-2xl
                  font-bold
                  tracking-tight
                  text-heading
                "
              >
                {message}
              </DialogTitle>

            
            </div>
          </DialogHeader>

          {/* Actions */}
          <div className="mt-8">
            <Button
              onClick={() => onOpenChange(false)}
              className="
                h-11
                w-full
                rounded-xl
                bg-mango-orange
                text-white
                hover:bg-mango-deep
                transition-colors
              "
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}