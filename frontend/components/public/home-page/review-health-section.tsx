"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const metrics = [
  { label: "Rating", score: 100, color: "bg-emerald-500 dark:bg-emerald-600" },
  {
    label: "Review volume",
    score: 18,
    color: "bg-amber-400 dark:bg-amber-500",
  },
  {
    label: "Review recency",
    score: 55,
    color: "bg-amber-400 dark:bg-amber-500",
  },
  { label: "Response rate", score: 11, color: "bg-red-500 dark:bg-red-600" },
  { label: "Content quality", score: 16, color: "bg-red-500 dark:bg-red-600" },
];

const features = [
   "Request honest customer feedback after real experiences",
  "Customers write their experience clearly and effortlessly.",
  "Monitor customer sentiment and engagement in real time",
];

const tips = [
  {
    color: "bg-amber-400 dark:bg-amber-500",
    bg: "bg-amber-50 dark:bg-amber-950",
    text: "Send polite follow-up reminders after completed services to invite customers to share honest feedback.",
  },
  {
    color: "bg-red-500 dark:bg-red-600",
    bg: "bg-red-50 dark:bg-red-950",
    text: "Respond professionally to customer reviews to improve customer trust and engagement.",
  },
];

const starBreakdown = [
  { star: "5★", pct: 72 },
  { star: "4★", pct: 18 },
  { star: "3★", pct: 6 },
  { star: "2★", pct: 3 },
  { star: "1★", pct: 1 },
];

const starColors = [
  "bg-leaf-dark dark:bg-leaf-main",
  "bg-mango-mid dark:bg-mango-light",
  "bg-red-300 dark:bg-red-400",
  "bg-gray-300 dark:bg-gray-400",
  "bg-gray-200 dark:bg-gray-300",
];

export const ReviewHealthSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    if (ref.current) obs.observe(ref.current);
  }, []);

  return (
    <section
      ref={ref}
      className={`flex gap-10 items-center justify-center flex-col lg:flex-row transition-all duration-700 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      {/* LEFT */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-center gap-2 mb-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-leaf-dark dark:bg-leaf-main" />
          <div className="w-5 h-0.5 bg-leaf-dark dark:bg-leaf-main" />
          <span className="text-[11px] font-bold tracking-widest uppercase text-leaf-dark dark:text-leaf-main">
            Key Features
          </span>
        </div>

        <h3 className="font-medium leading-tight mb-3 text-center md:text-left text-foreground ">
          Customer Feedback Insights, Powered by <span className="text-mango-dark">AI</span>
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed mb-5 text-center md:text-left">
         Monitor customer feedback with actionable insights and response tools designed to help businesses engage with reviews in a professional and policy-compliant way.
        </p>

        <ul className="space-y-2.5 mb-5">
          {features.map((f, i) => (
            <li
              key={f}
              className={`flex items-center gap-3 text-sm font-medium text-foreground transition-all duration-500 ${
                show ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
              }`}
              style={{ transitionDelay: `${i * 120 + 200}ms` }}
            >
              <div className="w-3 h-3 rounded-full bg-leaf-dark dark:bg-leaf-main shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* RIGHT */}
      <div className="flex-1 relative min-h-[340px] flex flex-col gap-4 items-center w-full">
        {/* Card 1 */}
        <div
          className={`md:absolute -bottom-5 -left-20 bg-card rounded-2xl border border-border p-5 w-full md:w-60 shadow-sm z-10 transition-all duration-700 ${
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <p className="text-xl font-bold text-card-foreground">4.8 / 5.0</p>
          <p className="text-xs text-muted-foreground mb-4">
            Average Star Rating This Month
          </p>

          <div className="mb-3">
            <p className="text-[11px] text-muted-foreground mb-1">
              Response rate — 11%
            </p>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-muted-foreground/30 rounded-full w-[11%]" />
            </div>
          </div>

          <div>
            <p className="text-[11px] text-muted-foreground mb-1">
              Review volume — 18%
            </p>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-leaf-dark dark:bg-leaf-main rounded-full w-[18%]" />
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div
          className={`md:absolute -bottom-5 -right-5 bg-card rounded-2xl border border-border p-4 w-full md:w-48 shadow-sm z-20 transition-all duration-700 ${
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "350ms" }}
        >
          <p className="text-2xl font-bold text-card-foreground">247</p>
          <p className="text-[11px] text-muted-foreground mb-3">
            Total reviews
          </p>

          <div className="space-y-1.5">
            {starBreakdown.map((row, i) => (
              <div key={row.star} className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground w-5">
                  {row.star}
                </span>
                <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${starColors[i]}`}
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3 */}
        <div
          className={`mx-auto bg-card rounded-2xl border border-border p-5 w-full md:w-60 shadow-sm z-10 transition-all duration-700 ${
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-card-foreground">
              Review health
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Reviews collected</span>
                <span className="text-card-foreground font-medium">
                  50 of 100
                </span>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 dark:bg-yellow-600 rounded-full w-[50%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Responses sent</span>
                <span className="text-card-foreground font-medium">
                  6 of 50
                </span>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-muted-foreground/30 rounded-full w-[12%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Profile completeness</span>
                <span className="text-card-foreground font-medium">
                  60 of 100
                </span>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-leaf-dark dark:bg-leaf-main rounded-full w-[60%]" />
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-2 text-center">
            Looking to improve customer engagement?{" "}
            <Link href="pricing" className="text-mango-mid hover:underline">
              Choose your plan
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};
