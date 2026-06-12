"use client";

import React from "react";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";

interface ActionFooterProps {
  totalExtractedCount: number;
  totalSlots: number;
  canGenerate: boolean;
  isAnalyzing: boolean;
  onConfirm: () => void;
}

export default function ActionFooter({
  totalExtractedCount,
  totalSlots,
  canGenerate,
  isAnalyzing,
  onConfirm,
}: ActionFooterProps) {
  return (
    <div className="space-y-6">
      {/* Extracted Summary Pill */}
      {totalExtractedCount > 0 && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/8 border border-emerald-500/20 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
            <span className="font-bold">{totalExtractedCount}</span> competitor{totalExtractedCount > 1 ? "s" : ""} ready for analysis
            {totalSlots < 5 && (
              <span className="text-emerald-600/70 dark:text-emerald-500/70 font-normal">
                {" "}— you can still add {5 - totalSlots} more
              </span>
            )}
          </p>
        </div>
      )}

      {/* Primary CTA */}
      <button
        type="button"
        disabled={!canGenerate}
        onClick={onConfirm}
        className="w-full rounded-2xl p-4 flex items-center justify-center gap-2.5 font-semibold text-sm transition-all duration-200 disabled:cursor-not-allowed relative overflow-hidden group"
        style={{
          background: canGenerate ? "linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #4f46e5 100%)" : undefined,
        }}
        {...(!canGenerate && {
          className: "w-full rounded-2xl p-4 flex items-center justify-center gap-2.5 font-semibold text-sm transition-all duration-200 disabled:cursor-not-allowed bg-muted text-muted-foreground/50",
        })}
      >
        {canGenerate && (
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-200 pointer-events-none" />
        )}
        
        {isAnalyzing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span className="text-white">
              Generating report for {totalExtractedCount} competitor{totalExtractedCount > 1 ? "s" : ""}…
            </span>
          </>
        ) : (
          <>
            <Sparkles className={`w-4 h-4 ${canGenerate ? "text-white" : ""}`} />
            <span className={canGenerate ? "text-white" : ""}>
              {totalExtractedCount === 0
                ? "Extract at least 1 competitor to continue"
                : `Generate report · ${totalExtractedCount} competitor${totalExtractedCount > 1 ? "s" : ""}`}
            </span>
          </>
        )}
      </button>
    </div>
  );
}