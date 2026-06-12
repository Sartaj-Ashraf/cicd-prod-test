// components/public/shared/pricing/AutoPayModal.tsx
"use client";

import {
  Dialog, DialogContent,
  DialogHeader, DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Zap, RefreshCw } from "lucide-react";

interface Props {
  open:         boolean;
  isTrial:      boolean;
  trialDays?:   number | null;
  planName:     string;
  amount:       number;
  currency:     string;
  billingCycle: string;
  onAutoPay:    () => void;
  onManual:     () => void;
  onClose:      () => void;
}

const CYCLE_LABELS: Record<string, string> = {
  monthly:    "month",
  threeMonth: "3 months",
  sixMonth:   "6 months",
  yearly:     "year",
};

export default function AutoPayModal({
  open, isTrial, trialDays,
  planName, amount, currency, billingCycle,
  onAutoPay, onManual, onClose,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            {isTrial
              ? `Try ${planName} free for ${trialDays} days!`
              : "Enable Auto Pay?"
            }
          </DialogTitle>
          <DialogDescription className="text-center text-xs text-muted-foreground">
            {isTrial
              ? `Free ${trialDays}-day trial, then ${currency} ${amount}/${CYCLE_LABELS[billingCycle]} auto charged. Card saved now, no charge today.`
              : `Auto pay ${currency} ${amount} every ${CYCLE_LABELS[billingCycle]}. Cancel anytime.`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-2">
          <button
            onClick={onAutoPay}
            className="w-full py-3 bg-leaf-dark cursor-pointer rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-leaf-dark/90 transition-colors"
          >
            <Zap size={15} />
            {isTrial
              ? `Start Free Trial`
              : "Yes, Enable Auto Pay"
            }
          </button>

          {!isTrial && (
            <button
              onClick={onManual}
              className="w-full h-11 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={15} />
              No, Pay Manually
            </button>
          )}
        </div>

        {isTrial && (
          <p className="text-xs text-center text-muted-foreground">
            Card saved for auto pay after trial. Cancel anytime from dashboard.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}