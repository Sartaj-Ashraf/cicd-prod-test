"use client";

import React from "react";
import { Link2, Loader2, Sparkles, Trash2, CheckCircle2 } from "lucide-react";

interface CompetitorSlotProps {
  item: any;
  index: number;
  activeIndex: number;
  isPending: boolean;
  onUrlChange: (index: number, val: string) => void;
  onExtract: (index: number) => void;
  onRemove: (index: number) => void;
}

export default function CompetitorSlot({
  item,
  index,
  activeIndex,
  isPending,
  onUrlChange,
  onExtract,
  onRemove,
}: CompetitorSlotProps) {
  const isCurrentlyExtracting = isPending && activeIndex === index;

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        item.isExtracted
          ? "border-emerald-500/30 bg-emerald-500/3 shadow-sm shadow-emerald-500/10"
          : item.error 
          ? "border-red-500/40 bg-red-500/5" 
          : "border-border bg-card"
      }`}
    >
      {/* Slot header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <div className="flex items-center gap-2">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
              item.isExtracted
                ? "bg-emerald-500 text-white"
                : item.error
                ? "bg-red-500 text-white"
                : "bg-muted text-muted-foreground border border-border"
            }`}
          >
            {item.isExtracted ? <CheckCircle2 className="w-3 h-3" /> : index + 1}
          </div>
          <span className={`text-xs font-bold font-mono ${item.isExtracted ? "text-emerald-600 dark:text-emerald-400" : item.error ? "text-red-500" : "text-muted-foreground"}`}>
            {item.isExtracted ? "Extracted" : `Competitor ${index + 1}`}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/8 transition-all"
          title="Remove"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Input row */}
      <div className="flex gap-2 px-4 pb-4 pt-2">
        <div className="relative flex-1">
          <Link2 className={`absolute left-3.5 top-3 w-4 h-4 ${item.error ? "text-red-400" : "text-muted-foreground/60"}`} />
          <input
            type="url"
            value={item.url}
            disabled={item.isExtracted || isCurrentlyExtracting}
            onChange={(e) => onUrlChange(index, e.target.value)}
            placeholder="Paste Google Maps share link…"
            className={`w-full pl-10 pr-4 py-2.5 bg-background border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed ${
              item.error 
                ? "border-red-500/50 text-red-500 focus:ring-red-500/20" 
                : "border-border placeholder:text-muted-foreground/50 focus:ring-violet-500/40 focus:border-violet-500/40"
            }`}
          />
          {/* Validation Error Message */}
          {item.error && (
            <p className="absolute -bottom-5 left-1 text-[10px] font-bold text-red-500 font-mono tracking-wide">
              {item.error}
            </p>
          )}
        </div>

        {!item.isExtracted ? (
          <button
            type="button"
            disabled={!item.url || isPending || !!item.error}
            onClick={() => onExtract(index)}
            className="shrink-0 h-10.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shadow-amber-500/20"
          >
            {isCurrentlyExtracting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span className="hidden sm:inline">{isCurrentlyExtracting ? "Extracting…" : "Extract"}</span>
          </button>
        ) : (
          <div className="shrink-0 h-10.5 px-3 rounded-xl bg-emerald-500/12 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span className="hidden sm:inline">Done</span>
          </div>
        )}
      </div>

      {/* Extracted result preview */}
      {item.isExtracted && item.data && (
        <div className="mx-4 mb-4 flex gap-3 items-start p-3 bg-background border border-emerald-500/15 rounded-xl animate-fade-in">
          {item.data.image && (
            <img
              src={item.data.image}
              alt={item.data.name}
              className="w-14 h-14 object-cover rounded-lg border border-border shrink-0"
            />
          )}
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-sm text-foreground truncate max-w-[240px]">{item.data.name}</h4>
              {item.data.rating && (
                <span className="px-1.5 py-0.5 bg-amber-500/10 rounded-md text-amber-600 dark:text-amber-400 text-[11px] font-bold font-mono">
                  ★ {item.data.rating}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{item.data.address}</p>
          </div>
        </div>
      )}
    </div>
  );
}