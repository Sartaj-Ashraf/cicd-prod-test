"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, Building2 } from "lucide-react";
import { SectionHead } from "./SharedUi";

export default function CompetitorMatrix({ myBusiness, competitors, advantages, missingGaps }) {
  return (
    <div className="space-y-6">
      {/* Table */}
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="p-4 border-b border-border bg-secondary/20">
          <SectionHead 
            title="All-Competitor Unified Matrix" 
            sub="Complete real-time alignment across all identified market rivals compiled onto a single visual landscape."
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="border-b border-border bg-secondary/40 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                <th className="p-4 font-bold min-w-60">Market Business Entity</th>
                <th className="p-4 font-bold text-center">Overall Score</th>
                <th className="p-4 font-bold text-center">Rating Score</th>
                <th className="p-4 font-bold text-center">Total Reviews</th>
                <th className="p-4 font-bold text-center">Online Presence</th>
                <th className="p-4 font-bold min-w-70">Direct Actionable Insight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-xs font-medium">
              <tr className="bg-emerald-500/2 border-b border-emerald-500/10">
                <td className="p-4 font-bold text-emerald-500 flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5" />
                  {myBusiness?.name} <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/10 rounded uppercase tracking-tight font-mono">You</span>
                </td>
                <td className="p-4 text-center font-black font-mono text-emerald-500">{myBusiness?.scores?.overallScore}/10</td>
                <td className="p-4 text-center font-mono">{myBusiness?.scores?.ratingScore}/10</td>
                <td className="p-4 text-center font-mono">
                  {myBusiness?.totalReviews} total
                </td>
                <td className="p-4 text-center font-mono">{myBusiness?.scores?.onlinePresenceScore}/10</td>
                <td className="p-4 text-muted-foreground italic font-sans text-[11px]">  Performance benchmark for your business used to compare against competitors and identify areas for improvement.
  </td>
              </tr>
              {competitors.map((comp, i) => {
                const ratingWinner = comp.comparisons?.rating?.winner === "myBusiness";
                const reviewWinner = comp.comparisons?.reviews?.winner === "myBusiness";
                const overallWinner = comp.comparisons?.overall?.winner === "myBusiness";

                return (
                  <tr key={i} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-4 font-bold text-foreground">{comp.name}</td>
                    <td className="p-4 text-center font-mono font-bold">
                      <span className={overallWinner ? "text-emerald-500" : "text-amber-500"}>{comp.scores?.overallScore}/10</span>
                    </td>
                    <td className="p-4 text-center font-mono">
                      <span className={`px-1.5 py-0.5 rounded text-[11px] ${ratingWinner ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}>
                        {comp.scores?.ratingScore}/10
                      </span>
                    </td>
                    <td className="p-4 text-center font-mono">
                      <span className={`px-1.5 py-0.5 rounded text-[11px] ${reviewWinner ? "bg-emerald-500/10 text-emerald-500" : "text-muted-foreground"}`}>
                       {comp.totalReviews} total 
                      </span>
                    </td>
                    <td className="p-4 text-center font-mono font-bold text-foreground/80">{comp.scores?.onlinePresenceScore}/10</td>
                    <td className="p-4 text-[11px] font-sans text-muted-foreground leading-normal">
                      <div className="space-y-1">
                        <div className="space-y-1">
  {comp.comparisons?.overall?.insight && (
    <p>{comp.comparisons.overall.insight}</p>
  )}

  {comp.comparisons?.rating?.insight && (
    <p className="text-[10px] text-amber-500/90 font-medium font-mono">
      {comp.comparisons.rating.insight}
    </p>
  )}
</div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}