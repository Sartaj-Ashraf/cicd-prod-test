"use client";

import React from "react";
import { ExternalLink } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    { label: "Open Google Maps", detail: "Find your competitor's business profile", color: "bg-blue-500" },
    { label: "Copy the share link", detail: 'Tap Share → "Copy link"', color: "bg-violet-500" },
    { label: "Paste & extract", detail: "Add the link below and hit Extract", color: "bg-emerald-500" },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
        <span className="text-xs font-bold font-mono text-muted-foreground uppercase tracking-widest">
          How it works
        </span>
      </div>
      <div className="px-5 py-4 space-y-3">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`w-6 h-6 ${step.color} rounded-full flex items-center justify-center shrink-0`}>
              <span className="text-[10px] font-black text-white">{i + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold text-foreground">{step.label}</span>
              <span className="text-muted-foreground text-sm"> — {step.detail}</span>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="mt-1 text-xs font-semibold text-blue-500 hover:text-blue-600 flex items-center gap-1.5 transition-colors"
          onClick={() => window.open("https://maps.google.com", "_blank")}
        >
          <ExternalLink className="w-3 h-3" />
          Open Google Maps
        </button>
      </div>
    </div>
  );
}