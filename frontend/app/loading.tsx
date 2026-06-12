"use client"
import logo from "@/public/MangoZero.png";
import Image from "next/image";

export default function Loading() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden bg-background">

      {/* ── Background blobs ── */}
      <div className="absolute w-96 h-96 rounded-full bg-leaf-main/5 -top-24 -left-24 pointer-events-none" />
      <div className="absolute w-72 h-72 rounded-full bg-mango-mid/8 -bottom-16 -right-16 pointer-events-none" style={{ animation: "orbFloat 7s ease-in-out infinite" }} />
      <div className="absolute w-48 h-48 rounded-full bg-mango-orange/5 top-1/3 left-[65%] pointer-events-none" style={{ animation: "orbFloat 9s ease-in-out infinite", animationDelay: "2s" }} />
      <div className="absolute w-32 h-32 rounded-full bg-leaf-light/10 bottom-1/4 left-[10%] pointer-events-none" style={{ animation: "orbFloat 11s ease-in-out infinite", animationDelay: "4s" }} />

      {/* ── Pulsing glow ring behind mango ── */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Outer glow ring */}
        <span
          className="absolute w-36 h-36 rounded-full bg-mango-orange/20 animate-ping"
          style={{ animationDuration: "1.8s" }}
        />
        {/* Mid ring */}
        <span
          className="absolute w-28 h-28 rounded-full bg-mango-mid/25 animate-ping"
          style={{ animationDuration: "1.4s", animationDelay: "0.3s" }}
        />
        {/* Inner ring */}
        <span className="absolute w-20 h-20 rounded-full bg-mango-orange/15 animate-pulse" />

        {/* ── Rotating dashed halo rings ── */}
        <span
          className="absolute w-32 h-32 rounded-full border border-dashed border-mango-orange/40"
          style={{ animation: "rotateHalo 8s linear infinite" }}
        />
        <span
          className="absolute w-24 h-24 rounded-full border border-dashed border-leaf-main/30"
          style={{ animation: "counterRotateHalo 6s linear infinite" }}
        />

        {/* ── Logo ── */}
        <div style={{ animation: "mangoBounce 2.2s ease-in-out infinite", position: "relative", zIndex: 2 }}>
          <Image src={logo} alt="Mango Logo" width={100} height={100} />
        </div>
      </div>

      {/* ── Badge ── */}
      <div
        className="mb-5 inline-flex items-center gap-2 rounded-full border border-mango-orange/30 bg-mango-mid/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-mango-deep"
        style={{ animation: "fadeUp 0.6s ease both", animationDelay: "0.1s" }}
      >
        <span className="inline-block w-2 h-2 rounded-full bg-mango-orange animate-pulse" />
        Loading...
      </div>

      {/* ── Subtitle ── */}
      {/* <p
        className="text-gray-medium text-sm max-w-xs mx-auto mb-8 leading-relaxed"
        style={{ animation: "fadeUp 0.6s ease both", animationDelay: "0.2s" }}
      >
        Hang tight, we&apos;re getting things ready
      </p> */}

      {/* ── Segmented progress bar ── */}
      <div
        className="w-48 h-1.5 rounded-full bg-gray-100 overflow-hidden mb-8"
        style={{ animation: "fadeUp 0.6s ease both", animationDelay: "0.3s" }}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-leaf-dark via-mango-mid to-mango-orange"
          style={{ animation: "loadBar 1.8s ease-in-out infinite" }}
        />
      </div>

      {/* ── Dot strip ── */}
      {/* <div
        className="flex gap-2 justify-center mb-8"
        style={{ animation: "fadeUp 0.6s ease both", animationDelay: "0.4s" }}
      >
        {[
          { cls: "bg-leaf-light", delay: "0ms" },
          { cls: "bg-leaf-main", delay: "120ms" },
          { cls: "bg-mango-mid", delay: "240ms" },
          { cls: "bg-mango-orange", delay: "360ms" },
          { cls: "bg-mango-mid", delay: "240ms" },
          { cls: "bg-leaf-main", delay: "120ms" },
          { cls: "bg-leaf-light", delay: "0ms" },
        ].map((dot, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full ${dot.cls} opacity-80`}
            style={{
              animation: "dotBounce 1.2s ease-in-out infinite",
              animationDelay: dot.delay,
            }}
          />
        ))}
      </div> */}

      {/* ── Rotating tips ── */}
      {/* <div
        className="h-7 overflow-hidden relative w-64 mb-6"
        style={{ animation: "fadeUp 0.6s ease both", animationDelay: "0.5s" }}
      >
        {[
          "Fetching fresh results for you…",
          "Crunching the numbers…",
          "Almost there, stay with us…",
        ].map((tip, i) => (
          <span
            key={i}
            className="absolute w-full text-center text-xs text-gray-400"
            style={{
              animation: "tipFade 12s ease-in-out infinite",
              animationDelay: `${i * 4}s`,
              opacity: 0,
            }}
          >
            {tip}
          </span>
        ))}
      </div> */}

      {/* ── Shimmer skeleton bar ── */}
      <div
        className="w-36 h-2 rounded-full overflow-hidden mb-6"
        style={{ animation: "fadeUp 0.6s ease both", animationDelay: "0.6s" }}
      >
        <div style={{ animation: "shimmer 1.6s linear infinite" }} className="h-full w-full bg-gradient-to-r from-gray-100 via-white to-gray-100 bg-[length:400px_100%]" />
      </div>

      {/* ── Step indicator ── */}
      <div
        className="flex items-center gap-2 text-[11px] text-gray-400 mt-2"
        style={{ animation: "fadeUp 0.6s ease both", animationDelay: "0.7s" }}
      >
        {/* Done */}
        <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
        <span className="text-gray-500">Initialised</span>
        <span className="text-gray-300">·</span>
        {/* Active */}
        <span
          className="w-2 h-2 rounded-full bg-mango-orange inline-block"
          style={{ animation: "dotBounce 1s ease-in-out infinite" }}
        />
        <span className="text-gray-500">Processing</span>
        <span className="text-gray-300">·</span>
        {/* Idle */}
        <span className="w-2 h-2 rounded-full bg-gray-200 inline-block" />
        <span className="text-gray-400">Ready</span>
      </div>

      {/* ── Keyframes ── */}
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
          0%   { width: 0%;   margin-left: 0; }
          50%  { width: 70%;  margin-left: 0; }
          100% { width: 0%;   margin-left: 100%; }
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
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        @keyframes tipFade {
          0%, 100%  { opacity: 0; transform: translateY(6px); }
          8%, 25%   { opacity: 1; transform: translateY(0); }
          33%       { opacity: 0; transform: translateY(-6px); }
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