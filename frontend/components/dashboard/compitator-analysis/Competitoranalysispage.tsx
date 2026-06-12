"use client";

import { useEffect } from "react";
import { Sparkles } from "lucide-react";

// Components
import { ScoreRing } from "./SharedUi"; 
import CompetitorMatrix from "./CompetitorMatrix";
import ImprovementGraph from "./ImprovementGraph";

// Types
import { CompetitiveAnalysisProps, AnalysisDataRoot } from "@/types/dashboard/competitor.types"; 

export default function CompetitiveAnalysis({ analysisData }: CompetitiveAnalysisProps) {
  console.log(analysisData,"single page data")
  // Safely extract the root data
  const rawData = 'data' in analysisData && analysisData.data 
    ? analysisData.data 
    : analysisData as AnalysisDataRoot;
  
const payload = rawData?.analysis;
const myBusiness = payload?.myBusiness;
// console.log(myBusiness,"my")
console.log(rawData.analysis.competitors,"analysis")
const myScores = myBusiness?.scores;
const competitors = rawData.competitors || [];
// console.log(rawData.competitors,"competitors")
  useEffect(() => {
    if (!document.getElementById("font-sora")) {
      const link = document.createElement("link");
      link.id = "font-sora";
      link.href = "https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;800&family=Manrope:wght@400;600;800&display=swap";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
  }, []);

  if (!payload?.summary) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-card border border-border rounded-2xl">
        <div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm! font-bold tracking-wider uppercase font-mono text-muted-foreground animate-pulse">
          Parsing competitive matrix datasets…
        </p>
      </div>
    );
  }

const myBusinessName = myBusiness?.name || "My Business";
  return (
    <div className="w-full bg-background font-sans antialiased text-foreground px-4 py-6">
      <div className="max-w-310 mx-auto space-y-10">
        
        {/* ─── HEADER BLOCK ─── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-border gap-4">
          <div>
            <span className="text-[9px] font-extrabold text-emerald-500 uppercase tracking-widest font-mono block mb-1">
              your business performance matrix
            </span>
            <h1 className="text-2xl! font-black tracking-tight text-foreground flex items-center flex-wrap gap-2">
              <span>{myBusinessName}</span>
              <span className="text-xs! font-light text-muted-foreground px-2 py-0.5 bg-muted rounded font-mono">Market Density Overview</span>
            </h1>
          </div>
        </div>

        {/* ─── YOUR SCORE OVERVIEW ─── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-center p-6 bg-card border border-border rounded-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)" }} />
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-emerald-500/5 rounded-full pointer-events-none" />
          <div className="md:col-span-1 flex flex-col justify-center border-b md:border-b-0 md:border-r border-border pb-4 md:pb-0">
            <span className="text-xs font-bold text-muted-foreground font-mono uppercase tracking-wider mb-1">Your Business Overview</span>
            <h3 className="text-lg! font-bold text-emerald-500 leading-snug">{myBusinessName}</h3>
 <p className="text-xs!">
  Website: {myBusiness?.website ? "Available" : "Not Available"}
  </p>          </div>
          <div className="md:col-span-3 flex flex-wrap justify-around items-center gap-6 pt-2 md:pt-0">
            <ScoreRing value={myScores?.overallScore ?? 0} max={10} color="rgb(16 185 129)" size={86} label="Overall Rating" />
            <ScoreRing value={myScores?.ratingScore ?? 0} max={10} color="rgb(59 130 246)" size={76} label="Rating Score" />
            <ScoreRing value={myScores?.reviewScore ?? 0} max={10} color="rgb(139 92 246)" size={76} label="Review Score" />
            <ScoreRing value={myScores?.onlinePresenceScore ?? 0} max={10} color="rgb(236 72 153)" size={76} label="Online Presence" />
          </div>
        </div>

        {/* ─── COMPETITOR MATRIX ─── */}
      <CompetitorMatrix
  myBusiness={myBusiness}
  competitors={competitors}
  advantages={payload.advantages}
  missingGaps={payload.missingComparedToCompetitors}
/>

        {/* ─── SUMMARY DISPATCH MARKET INSIGHT ─── */}
        <div className="bg-linear-to-r from-amber-500/5 to-secondary border border-border rounded-xl p-5 flex gap-3 items-start">
          <div className="w-6 h-6 bg-amber-500 text-white rounded-lg flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-extrabold text-foreground text-xs! font-mono uppercase block mb-1">Operational Strategic Standing</span>
            <p className="text-xs! text-muted-foreground font-sans leading-relaxed">
              {payload.summary?.overallPosition} Market parameters flag <span className="font-semibold text-amber-500">{payload.summary?.strongestCompetitor || "the market leader"}</span> as your immediate baseline benchmark for tactical review optimizations.
            </p>
          </div>
        </div>

        {/* ─── PROFILE IMPROVEMENTS GRAPH ─── */}
        <ImprovementGraph improvements={payload.profileImprovements} />

      </div>
    </div>
  );
}