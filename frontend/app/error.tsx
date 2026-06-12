"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-16 relative overflow-hidden bg-background">
      {/* Background blobs */}
      <div className="absolute w-80 h-80 rounded-full bg-mango-orange/7 -top-10 -right-16 pointer-events-none" />
      <div className="absolute w-52 h-52 rounded-full bg-mango-light/10 -bottom-8 -left-12 pointer-events-none" />

      {/* Badge */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-mango-burnt/20 bg-mango-burnt/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-mango-burnt">
        <span className="inline-block w-2 h-2 rounded-full bg-mango-orange" />
        Something went wrong
      </div>

      {/* Icon */}
      <div className="w-24 h-24 rounded-full bg-mango-orange/10 flex items-center justify-center mb-6">
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-12 h-12"
        >
          <path
            d="M24 6L44 40H4L24 6Z"
            fill="#FEB709"
            stroke="#EE6104"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <rect x="22" y="20" width="4" height="11" rx="2" fill="#C2410C" />
          <circle cx="24" cy="35" r="2" fill="#C2410C" />
        </svg>
      </div>

      {/* Text */}
      <h3 className="text-[clamp(1.4rem,3vw,2rem)] font-bold text-base-black mb-2 leading-tight">
        Something went wrong
      </h3>
      <span className="text-[clamp(0.8rem,1.5vw,0.95rem)] text-gray-medium max-w-md mx-auto mb-6 leading-relaxed">
        An unexpected error occurred. Our team has been notified. You can try
        again or head back to the homepage.
      </span>

      {/* Error detail box */}
      {error?.message && (
        <div className="w-full max-w-sm mx-auto mb-8 text-left bg-[#fafafa] border border-gray-200 border-l-[3px] border-l-mango-orange rounded-r-md px-4 py-3">
          <p className="text-[10px] uppercase tracking-widest text-gray-light mb-1">
            Error details
          </p>
          <p className="font-mono text-sm text-mango-deep break-all">
            {error.message}
          </p>
          {error.digest && (
            <p className="font-mono text-xs text-gray-light mt-1">
              ID: {error.digest}
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={reset}
          className="bg-gradient-to-br from-mango-deep to-mango-orange text-white px-6 py-2.5 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="border-2 border-leaf-dark text-leaf-dark px-6 py-2.5 rounded-md text-sm font-semibold hover:bg-leaf-main/5 transition-colors"
        >
          Go Back Home
        </Link>
      </div>

      {/* Dot strip */}
      <div className="mt-10 flex gap-2 justify-center">
        {["bg-mango-orange", "bg-mango-mid", "bg-mango-light", "bg-mango-mid", "bg-mango-orange"].map(
          (cls, i) => (
            <span key={i} className={`w-2 h-2 rounded-full ${cls}`} />
          )
        )}
      </div>
    </main>
  );
}