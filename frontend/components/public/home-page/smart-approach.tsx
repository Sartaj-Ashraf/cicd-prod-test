"use client";

import React from "react";

const features = [
  {
    id: "01",
    label: "Core",
    title: "Access feedback channel",
    description:
    "Customers scan a QR code or open a link to reach your feedback page instantly",
    wide: true,
    position: "left",
    extra: "stat",
  },
  {
    id: "02",
    label: null,
    title: "Submit experience",
    description:
        "Customers share their genuine experience through a simple and seamless interface.",
    wide: false,
    extra: "bars",
  },
  {
    id: "03",
    label: null,
    title: "Publish & track",
    description:
      "Feedback is shared on supported platforms and tracked through your dashboard.",
    wide: false,
    extra: "rating",
  },
  {
    id: "04",
    label: null,
    title: "Multi-location",
    description: "Manage 1 or 1,000 locations from one unified dashboard.",
    wide: false,
    extra: "locs",
  },
  {
    id: "05",
    label: null,
     title: "Review Management",
     description:
      "Manage customer feedback workflows and access review platform integrations from one place.",
    wide: false,
    extra: "post",
  },
  {
    id: "06",
    label: null,
    title: "Better Insights",
    description:
      "Get a clear view of how your business is performing and understand what’s working and what needs improvement.",
    wide: true,
    position: "right",
    extra: "insights",
  },
];

const BulbIcon = () => (
  <svg
    className="w-4 h-4 stroke-current"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const BoltIcon = () => (
  <svg
    className="w-4 h-4 stroke-current"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="w-[14px] h-[14px] ml-auto"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ stroke: "var(--green-500)" }}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const StatExtra = () => (
  <div className="mt-auto pt-4 border-t border-border">
    <div className="flex items-center gap-6">
      <div className="flex items-baseline gap-2">
        <span className="text-[2rem] leading-none text-card-foreground font-normal">
          3×
        </span>
        <span className="text-xs text-muted-foreground">
          longer reviews on average
        </span>
      </div>
      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400" />
        Live
      </span>
    </div>
  </div>
);

const BarsExtra = () => {
  const heights = [60, 80, 50, 90, 40, 70];
  return (
    <div className="flex items-end gap-1 h-8 mt-auto">
      {heights.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-colors"
          style={{
            height: `${h}%`,
            background: i < 3 ? "var(--foreground)" : "var(--muted-foreground)",
          }}
        />
      ))}
    </div>
  );
};

const RatingExtra = () => (
  <div className="flex items-baseline gap-2 mt-auto">
    <span className="text-[2rem] leading-none text-card-foreground font-normal">
      4.9
    </span>
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] text-muted-foreground">avg. rating</span>
      <span className="text-[11px] text-green-600 dark:text-green-400">
        Recent customer activity
      </span>
    </div>
  </div>
);

const LocsExtra = () => (
  <div className="flex flex-wrap gap-1.5 mt-auto">
    {["New York", "London", "Dubai"].map((loc) => (
      <span
        key={loc}
        className="text-[11px] px-2 py-1 rounded-full border border-border text-muted-foreground bg-muted"
      >
        {loc}
      </span>
    ))}
    <span className="text-[11px] px-2 py-1 rounded-full border border-dashed border-border text-muted-foreground">
      +20
    </span>
  </div>
);

const PostExtra = () => (
  <div className="flex items-center gap-2 mt-auto px-2.5 py-2 rounded-lg bg-muted text-[12px] text-card-foreground">
    <div
      className="w-3.5 h-3.5 rounded-full flex-shrink-0"
      style={{
        background:
          "conic-gradient(#4285F4 0% 25%, #34A853 25% 50%, #FBBC05 50% 75%, #EA4335 75% 100%)",
      }}
    />
    <span>Customer feedback submitted</span>
    <CheckIcon />
  </div>
);

const extraMap: Record<string, React.ReactNode> = {
  stat: <StatExtra />,
  bars: <BarsExtra />,
  rating: <RatingExtra />,
  locs: <LocsExtra />,
  post: <PostExtra />,
};

export const SmartApproach = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=Instrument+Serif:ital@0;1&display=swap');
        .smart-approach-section * { font-family: 'DM Sans', system-ui, sans-serif; }
        .smart-approach-section .serif-heading { font-family: 'Instrument Serif', Georgia, serif; }
      `}</style>

      <section className="smart-approach-section w-full ">
        <div className="mx-auto max-w-6xl ">
          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-mango-orange dark:text-mango-light mb-3">
              Platform capabilities
            </p>
            <h2 className=" text-[clamp(1.7rem,3vw,2.4rem)] font-medium text-foreground leading-tight">
              Improve customer engagement{" "}
              <span className="text-leaf-dark dark:text-leaf-main">
                AI-assisted tools
              </span>
            </h2>
          </div>

          {/* Grid */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-xl overflow-hidden"
            style={{ gap: "1px", background: "var(--border)" }}
          >
            {features.map((f) => (
              <div
                key={f.id}
                className={[
                  "bg-card p-5 flex flex-col gap-3 transition-colors duration-150 hover:bg-accent",
                  f.wide ? "sm:col-span-2" : "",
                ].join(" ")}
                style={{ minHeight: 200 }}
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-medium tracking-[0.08em] uppercase text-mango-mid">
                      {f.label ? `${f.id} — ${f.label}` : f.id}
                    </p>
                    <p
                      className="mt-1 font-medium text-foreground leading-snug"
                      style={{ fontSize: f.wide ? 17 : 15 }}
                    >
                      {f.title}
                    </p>
                  </div>
                  {f.wide && (
                    <div className="w-9 h-9 rounded-lg border border-border flex items-center justify-center flex-shrink-0 text-muted-foreground">
                      {f.id === "01" ? <BulbIcon /> : <BoltIcon />}
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.description}
                </p>

                {/* Extra content */}
                {extraMap[f.extra]}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default SmartApproach;
