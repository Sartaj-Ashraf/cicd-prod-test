"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import { SectionHead, AnimatedBar } from "./SharedUi";

export default function ImprovementGraph({ improvements }) {
  if (!improvements || improvements.length === 0) return null;

  return (
    <div className="p-6 border border-border rounded-xl bg-card">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-4 h-4 text-indigo-500" />
        <SectionHead 
          title="Target Profile Improvement Impact" 
          sub="Actionable priorities mapped out relative to their ultimate execution weight score." 
        />
      </div>

      <div className="flex items-center gap-5 mb-6 pb-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ background: "linear-gradient(90deg,#ef4444,#f59e0b)" }} />
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wide">High Priority</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ background: "linear-gradient(90deg,#6366f1,#3b82f6)" }} />
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wide">Medium / Low</span>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1 h-4 rounded-full bg-indigo-500/50" />
          <span className="text-[10px] font-mono text-muted-foreground">Score marker</span>
        </div>
      </div>

      <div className="space-y-7">
        {improvements.map((item, i) => {
          const isHighImpact = item.impact === "high";
          const percentWidth = item.impactScore * 10; 

          return (
            <div key={i} className="space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <h4 className="text-sm! font-bold text-foreground flex items-center gap-2">
                    {item.title}
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded uppercase tracking-tight ${isHighImpact ? "bg-red-500/10 text-red-500" : "bg-indigo-500/10 text-indigo-500"}`}>
                      {item.impact} Priority
                    </span>
                  </h4>
                  <p className="text-sm! text-muted-foreground leading-relaxed mt-0.5">{item.benefit}</p>
                </div>
                <div className="flex flex-col items-end shrink-0 self-start sm:self-auto gap-0.5">
                  <span className="text-base font-mono font-black leading-none" style={{ color: isHighImpact ? "#f59e0b" : "#6366f1" }}>
                    {item.impactScore}<span className="text-[11px] font-normal text-muted-foreground">/10</span>
                  </span>
                  <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wide">impact</span>
                </div>
              </div>

              <div className="space-y-1">
                <AnimatedBar pct={percentWidth} isHighImpact={isHighImpact} delay={i * 90} />
                <div className="flex justify-between px-0.5">
                  {[0, 2, 4, 6, 8, 10].map((tick) => (
                    <span key={tick} className="text-[9px] font-mono text-muted-foreground/50">{tick}</span>
                  ))}
                </div>
              </div>
              <p className="text-xs font-mono text-muted-foreground italic">Current: {item.currentState}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}