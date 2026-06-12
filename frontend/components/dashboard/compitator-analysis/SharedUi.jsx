"use client";

import React, { useState, useEffect } from "react";

export const SectionHead = ({ title, sub }) => (
  <div className="mb-6 flex flex-col gap-1">
    <h2 className="text-xl! font-extrabold tracking-tight text-foreground">{title}</h2>
    {sub && (
      <p className="text-sm! text-muted-foreground font-mono leading-relaxed">{sub}</p>
    )}
  </div>
);

export const ScoreRing = ({ value, max = 10, color, size = 80, stroke = 6, label }) => {
  const [animated, setAnimated] = useState(false);
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = value / max;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 120);
    return () => clearTimeout(t);
  }, []);

  const glowMap = {
    "rgb(16 185 129)": "rgba(16,185,129,0.25)",
    "rgb(59 130 246)": "rgba(59,130,246,0.22)",
    "rgb(139 92 246)": "rgba(139,92,246,0.22)",
    "rgb(236 72 153)": "rgba(236,72,153,0.22)",
  };
  const glow = glowMap[color] ?? "rgba(255,255,255,0.1)";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <div
          className="absolute inset-0 rounded-full"
          style={{ boxShadow: `0 0 ${size * 0.22}px ${glow}`, borderRadius: "50%" }}
        />
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--muted)" strokeWidth={stroke} opacity={0.35} />
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={animated ? circ * (1 - pct) : circ}
            style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.4,0,0.2,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono font-black text-foreground leading-none" style={{ fontSize: size * 0.26 }}>{value}</span>
          <span className="font-mono text-muted-foreground" style={{ fontSize: size * 0.13 }}>/{max}</span>
        </div>
      </div>
      {label && <span className="text-[9px] font-bold font-mono text-muted-foreground uppercase tracking-wider text-center">{label}</span>}
    </div>
  );
};

export const AnimatedBar = ({ pct, isHighImpact, delay = 0 }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 180 + delay);
    return () => clearTimeout(t);
  }, [pct, delay]);

  return (
    <div className="w-full h-3 rounded-full overflow-hidden relative" style={{ background: "var(--muted)", opacity: 0.9 }}>
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: isHighImpact
            ? "linear-gradient(90deg, rgba(239,68,68,0.08) 0%, rgba(245,158,11,0.06) 100%)"
            : "linear-gradient(90deg, rgba(99,102,241,0.08) 0%, rgba(59,130,246,0.06) 100%)",
        }}
      />
      <div
        className="h-full rounded-full relative overflow-hidden"
        style={{
          width: `${width}%`,
          transition: "width 1.1s cubic-bezier(0.4,0,0.2,1)",
          background: isHighImpact ? "linear-gradient(90deg, #ef4444 0%, #f59e0b 100%)" : "linear-gradient(90deg, #6366f1 0%, #3b82f6 100%)",
          boxShadow: isHighImpact ? "0 0 10px rgba(239,68,68,0.35)" : "0 0 10px rgba(99,102,241,0.35)",
        }}
      >
        <div className="absolute top-0 left-0 h-full w-1/3 rounded-full" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)" }} />
      </div>
      <div
        className="absolute top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
        style={{
          left: `${width}%`, background: isHighImpact ? "#f59e0b" : "#6366f1", opacity: width > 0 ? 0.9 : 0,
          transition: "left 1.1s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease", boxShadow: isHighImpact ? "0 0 4px #f59e0b" : "0 0 4px #6366f1",
        }}
      />
    </div>
  );
};