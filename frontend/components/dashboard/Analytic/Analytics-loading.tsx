// components/dashboard/Analytic/Analytics-loading.tsx
"use client";

import logo    from "@/public/MangoZero.png";
import Image   from "next/image";
import { useEffect, useState } from "react";

const TIPS = [
  "Fetching your Google reviews…",
  "Analysing customer sentiment…",
  "Calculating reputation score…",
  "Detecting review patterns…",
  "Building AI insights…",
  "Almost there — generating your report…",
];

export default function AnalyticsLoading() {
  const [tipIndex, setTipIndex] = useState(0);
  const [elapsed,  setElapsed]  = useState(0);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIndex((i) => (i + 1) % TIPS.length);
    }, 5000);
    return () => clearInterval(tipInterval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatElapsed = () => {
    if (elapsed < 60) return `${elapsed}s`;
    return `${Math.floor(elapsed / 60)}m ${elapsed % 60}s`;
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden bg-background">

      {/* ── background blobs ── */}
      <div className="absolute w-96 h-96 rounded-full bg-leaf-main/5 -top-24 -left-24 pointer-events-none" />
      <div className="absolute w-72 h-72 rounded-full bg-mango-mid/8 -bottom-16 -right-16 pointer-events-none" style={{ animation: "orbFloat 7s ease-in-out infinite" }} />
      <div className="absolute w-48 h-48 rounded-full bg-mango-orange/5 top-1/3 left-[65%] pointer-events-none" style={{ animation: "orbFloat 9s ease-in-out infinite", animationDelay: "2s" }} />
      <div className="absolute w-32 h-32 rounded-full bg-leaf-light/10 bottom-1/4 left-[10%] pointer-events-none" style={{ animation: "orbFloat 11s ease-in-out infinite", animationDelay: "4s" }} />

      {/* ── pulsing ring + logo ── */}
      <div className="relative flex items-center justify-center mb-8">
        <span className="absolute w-36 h-36 rounded-full bg-mango-orange/20 animate-ping" style={{ animationDuration: "1.8s" }} />
        <span className="absolute w-28 h-28 rounded-full bg-mango-mid/25 animate-ping"   style={{ animationDuration: "1.4s", animationDelay: "0.3s" }} />
        <span className="absolute w-20 h-20 rounded-full bg-mango-orange/15 animate-pulse" />
        <span className="absolute w-32 h-32 rounded-full border border-dashed border-mango-orange/40" style={{ animation: "rotateHalo 8s linear infinite" }} />
        <span className="absolute w-24 h-24 rounded-full border border-dashed border-leaf-main/30"    style={{ animation: "counterRotateHalo 6s linear infinite" }} />
        <div style={{ animation: "mangoBounce 2.2s ease-in-out infinite", position: "relative", zIndex: 2 }}>
          <Image src={logo} alt="Mango Logo" width={100} height={100} />
        </div>
      </div>

      {/* ── badge ── */}
      <div
        className="mb-3 inline-flex items-center gap-2 rounded-full border border-mango-orange/30 bg-mango-mid/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-mango-deep"
        style={{ animation: "fadeUp 0.6s ease both" }}
      >
        <span className="inline-block w-2 h-2 rounded-full bg-mango-orange animate-pulse" />
        Analysing your business
      </div>

      {/* ── rotating tip ── */}
      <p
        className="text-sm text-muted-foreground mb-6 h-5 transition-all duration-500"
        key={tipIndex}
        style={{ animation: "fadeUp 0.4s ease both" }}
      >
        {TIPS[tipIndex]}
      </p>

      {/* ── progress bar ── */}
      <div className="w-56 h-1.5 rounded-full bg-gray-100 overflow-hidden mb-4">
        <div
          className="h-full rounded-full bg-gradient-to-r from-leaf-dark via-mango-mid to-mango-orange"
          style={{ animation: "loadBar 1.8s ease-in-out infinite" }}
        />
      </div>

      {/* ── elapsed time ── */}
      <p className="text-xs text-muted-foreground/60 font-mono mb-6">
        {formatElapsed()} elapsed
      </p>

      {/* ── warning — don't navigate ── */}
      <div
        className="max-w-sm rounded-xl border border-mango-orange/20 bg-mango-orange/5 px-5 py-4 text-sm text-muted-foreground"
        style={{ animation: "fadeUp 0.6s ease both", animationDelay: "0.4s" }}
      >
        <p className="font-semibold text-foreground mb-1">
          ⏳ This may take 30 seconds to 1 minute
        </p>
        <p className="text-xs leading-relaxed">
          Our AI is deeply analysing your reviews and building insights.
          Please <span className="text-mango-orange font-medium">do not navigate away</span> or
          close this tab — your analysis will be lost.
        </p>
      </div>

      {/* ── step indicator ── */}
      <div
        className="flex items-center gap-2 text-[11px] text-gray-400 mt-6"
        style={{ animation: "fadeUp 0.6s ease both", animationDelay: "0.7s" }}
      >
        <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
        <span className="text-gray-500">Initialised</span>
        <span className="text-gray-300">·</span>
        <span className="w-2 h-2 rounded-full bg-mango-orange inline-block" style={{ animation: "dotBounce 1s ease-in-out infinite" }} />
        <span className="text-gray-500">Processing</span>
        <span className="text-gray-300">·</span>
        <span className="w-2 h-2 rounded-full bg-gray-200 inline-block" />
        <span className="text-gray-400">Ready</span>
      </div>

      {/* ── keyframes ── */}
      <style>{`
        @keyframes mangoBounce {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50%       { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40%            { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes loadBar {
          0%   { width: 0%;  margin-left: 0; }
          50%  { width: 70%; margin-left: 0; }
          100% { width: 0%;  margin-left: 100%; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes rotateHalo {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes counterRotateHalo {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(6px, -8px) scale(1.04); }
          66%       { transform: translate(-4px, 4px) scale(0.97); }
        }
      `}</style>
    </main>
  );
}