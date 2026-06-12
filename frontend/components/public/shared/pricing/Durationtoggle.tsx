"use client";

import { DurationToggleProps } from "@/types/public/pricing.types";



export default function DurationToggle({
  durations,
  active,
  labels,
  onChange,
}: DurationToggleProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-12 px-4">
      {durations.map((duration) => (
        <button
          key={duration}
          onClick={() => onChange(duration)}
          className={`
            px-4 sm:px-5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 
            ${
              active === duration
                ? "bg-leaf-dark text-white shadow-md"
                : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900"
            }
          `}
        >
          {labels[duration]}
        </button>
      ))}
    </div>
  );
}