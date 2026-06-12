"use client";

import { useEffect, useRef, useState } from "react";
import { Phone, Navigation, Search, ArrowRight } from "lucide-react";
import mapImg from "@/public/map.webp";

/* ─── Star row ─── */
const Stars = ({
  count = 5,
  color = "#f59e0b",
}: {
  count?: number;
  color?: string;
}) => (
  <span>
    {Array.from({ length: 5 }).map((_, i) => (
      <span
        key={i}
        style={{ color: i < count ? color : "#d1d5db" }}
        className="text-[10px]"
      >
        ★
      </span>
    ))}
  </span>
);

/* ─── Types ─── */
interface ResultItem {
  rank: number;
  name: string;
  rating: number;
  reviews: number;
  type: string | null;
  isYou?: boolean;
  keywords?: string[];
  invisible?: boolean;
}

const beforeResults: ResultItem[] = [
  {
    rank: 1,
    name: "Sunrise Hotel",
    rating: 3.9,
    reviews: 421,
    type: "Comfortable stay · Open now",
  },
  {
    rank: 2,
    name: "City Care Clinic",
    rating: 3.2,
    reviews: 198,
    type: "Helpful staff · Open now",
  },
  {
    rank: 3,
    name: "Spice Garden Restaurant",
    rating: 3.7,
    reviews: 276,
    type: "Good food · Open now",
  },
  {
    rank: 4,
    name: "Your Business",
    rating: 4.0,
    reviews: 143,
    type: "Service was average · Open now",
    invisible: true,
  },
];

const afterResults: ResultItem[] = [
  {
    rank: 1,
    name: "Sunrise Hotel",
    rating: 4.8,
    reviews: 890,
    type: "Excellent service and clean rooms · Open now",
  },
  {
    rank: 2,
    name: "YOUR BUSINESS",
    rating: 4.9,
    reviews: 356,
    type: "Trusted local business providing exceptional quality services with outstanding customer satisfaction · Open now",
    isYou: true,
    keywords: ["Top rated", "Most trusted", "Highly recommended"],
  },
  {
    rank: 3,
    name: "City Care Clinic",
    rating: 4.6,
    reviews: 512,
    type: "Professional doctors and quick service · Open now",
  },
  {
    rank: 4,
    name: "Spice Garden Restaurant",
    rating: 4.5,
    reviews: 603,
    type: null,
    invisible: true,
  },
];
/* ─── Map header ─── */
const MapHeader = () => (
  <div className="h-[80px] sm:h-[90px] lg:h-[100px] bg-linear-to-b from-green-dim to-transparent relative overflow-hidden shrink-0">
    {/* Grid lines */}
    <div
      className="absolute inset-0 opacity-35"
      style={{
        backgroundImage:`url(${mapImg.src})`,
        backgroundSize:"cover",
        backgroundPosition:"center",
        backgroundRepeat:"no-repeat"
      }}
    />
  
    {/* Search bar */}
    <div className="absolute bottom-2 sm:bottom-2.5 left-2 sm:left-3 right-2 sm:right-3 bg-card rounded-[16px] sm:rounded-[20px] px-2.5 sm:px-3 py-[5px] sm:py-[7px] flex items-center gap-[5px] sm:gap-[7px] shadow-[0_1px_6px_rgba(0,0,0,0.12)]">
      <Search
        size={11}
        className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-muted-foreground"
      />
      <span className="text-[11px] sm:text-[12px] text-muted-foreground font-[var(--font-body)]">
        best  <span className="underline">[service]</span> near me
      </span>
    </div>
  </div>
);

/* ─── Single result card ─── */
const ResultCard = ({
  item,
  animDelay = 0,
  visible = true,
}: {
  item: ResultItem;
  animDelay?: number;
  visible?: boolean;
}) => {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setEntered(true), animDelay);
    return () => clearTimeout(t);
  }, [visible, animDelay]);

  const badgeBg = item.isYou
    ? "bg-green-500"
    : item.rank === 1
      ? "bg-blue-500"
      : "bg-secondary";
  const badgeColor =
    item.isYou || item.rank === 1 ? "text-white" : "text-secondary-foreground";

  return (
    <div
      className={[
        "rounded-[12px] sm:rounded-[14px] p-2 sm:p-2.5 flex items-start gap-2 sm:gap-2.5 relative transition-all duration-300",
        item.isYou
          ? "border border-green-300 bg-green-dim"
          : item.invisible
            ? "border border-[0.5px] border-red-200 bg-red-50"
            : "border border-[0.5px] border-border bg-card",
        item.invisible ? "opacity-35" : entered ? "opacity-100" : "opacity-0",
      ].join(" ")}
      style={{
        transform: entered
          ? "translateX(0) translateY(0)"
          : item.isYou
            ? "translateX(-12px) sm:translateX(-16px)"
            : "translateY(8px) sm:translateY(10px)",
        transition:
          "opacity 0.55s ease, transform 0.55s cubic-bezier(.4,0,.2,1)",
      }}
    >
      {/* Rank badge */}
      <div
        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[11px] sm:text-[12px] font-bold flex-shrink-0 ${badgeBg} ${badgeColor}`}
      >
        {item.rank}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div
          className={`text-[11px] sm:text-[12px] lg:text-[12.5px] font-bold leading-[1.25] ${
            item.isYou
              ? "text-green-700"
              : item.invisible
                ? "text-red-600"
                : "text-foreground"
          }`}
        >
          {item.name}
        </div>
        <div
          className={`text-[10px] sm:text-[11px] flex items-center gap-1 mt-0.5 ${
            item.invisible ? "text-muted-foreground" : "text-muted-foreground"
          }`}
        >
          <Stars
            count={Math.round(item.rating)}
            color={item.invisible ? "var(--muted-foreground)" : "#f59e0b"}
          />
          <span>
            {item.rating} ({item.reviews.toLocaleString()})
          </span>
        </div>
        <div
          className={`text-[9.5px] sm:text-[10px] lg:text-[10.5px] mt-0.5 ${
            item.invisible ? "text-muted-foreground" : "text-muted-foreground"
          }`}
        >
          {item.type}
        </div>

        {/* Keyword tags */}
        {item.keywords && item.keywords.length > 0 && (
          <div className="flex gap-1 mt-1 sm:mt-1.5 flex-wrap">
            {item.keywords.map((kw) => (
              <span
                key={kw}
                className="text-[8.5px] sm:text-[9px] lg:text-[9.5px] font-bold px-[5px] sm:px-[6px] lg:px-[7px] py-[1.5px] sm:py-[2px] rounded-[4px] sm:rounded-[5px] bg-green-100 text-green-700"
              >
                "{kw}"
              </span>
            ))}
          </div>
        )}

        {/* Invisible label */}
        {item.invisible && (
          <div className="text-[8.5px] sm:text-[9px] lg:text-[9.5px] text-muted-foreground mt-1">
            Practically invisible
          </div>
        )}
      </div>

      {/* Action buttons */}
      {!item.invisible && (
        <div className="flex flex-col gap-1 flex-shrink-0">
          {([Phone, Navigation] as const).map((Icon, i) => (
            <div
              key={i}
              className={`w-[22px] sm:w-[24px] lg:w-[26px] h-[22px] sm:h-[24px] lg:h-[26px] rounded-full flex items-center justify-center cursor-pointer border bg-card ${
                item.isYou ? "border-green-300" : "border-border"
              }`}
            >
              <Icon
                size={11}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.25 lg:h-3.25 ${
                  item.isYou ? "text-green-500" : "text-muted-foreground"
                }`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Phone mockup ─── */
const PhoneMockup = ({
  results,
  label,
  labelColor,
  visible,
}: {
  results: ResultItem[];
  label: string;
  labelColor: string;
  visible: boolean;
}) => (
  <div className="flex flex-col items-center gap-3 sm:gap-4 h-full w-full">
    {/* Device shell */}
    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:w-110 xl:w-120 rounded-2xl overflow-hidden border border-border bg-card/40 shadow-[0_4px_28px_rgba(0,0,0,0.09),0_1px_4px_rgba(0,0,0,0.06)] h-full flex flex-col">
      <MapHeader />
      <div className="p-3 sm:p-4 flex flex-col gap-2 flex-1">
        {results.map((item, i) => (
          <ResultCard
            key={`${item.rank}-${item.name}`}
            item={item}
            animDelay={visible ? i * 120 : 0}
            visible={visible}
          />
        ))}
      </div>
    </div>
  </div>
);

/* ─── Arrow connector ─── */
const ArrowConnector = () => (
  <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 pt-4 sm:pt-6 lg:pt-8 min-w-[60px] sm:min-w-[72px]">
    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-border bg-card flex items-center justify-center shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
      <ArrowRight
        size={14}
        className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground"
      />
    </div>
    <div className="text-[9px] sm:text-[10px] text-muted-foreground text-center max-w-[50px] sm:max-w-[60px] leading-[1.3] sm:leading-[1.4]">
      Customer feedback insights
    </div>
  </div>
);

/* ─── Main export ─── */
export const ThreePackageComparison = () => {
  const ref = useRef<HTMLDivElement>(null!);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        :root { --font-body: 'DM Sans', sans-serif; }
      `}</style>

      <section
        ref={ref}
        className="min-h-screen flex flex-col items-center gap-8 sm:gap-10 lg:gap-12 font-[var(--font-body)] "
      >
        {/* Header */}
        <div className="text-center container mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-1.5 bg-mango-mid/10 border border-mango-orange/50 rounded-[20px] px-3.5 py-1 text-[11px] sm:text-[12px] font-bold text-orange-700 uppercase mb-4 sm:mb-6">
            🥭 MangoReview
          </div>
          <h3 className="font-medium text-heading leading-[1.1] m-0 mb-3.5 sm:mb-4 tracking-[-0.02em] text-2xl sm:text-3xl lg:text-4xl">
            Help More Customers Discover Your Business
          </h3>
          <p className="text-[14px] sm:text-[15px] lg:text-[16px] text-gray-dark leading-[1.6] sm:leading-[1.65] m-0 max-w-2xl mx-auto">
            We help businesses strengthen their online presence through customer feedback management and engagement tools.
          </p>
        </div>

        {/* Phones comparison */}
        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-6 sm:gap-8 lg:gap-10 w-full max-w-6xl">
          <div className="flex flex-col items-center gap-4 sm:gap-10 w-full lg:w-auto lg:flex-1">
            <div className="text-center max-w-sm">
              <h5 className="text-lg sm:text-xl font-semibold text-mango-orange mb-2 sm:mb-3">
                Earlier Customer Activity
              </h5>
              <p className="text-[14px] sm:text-[15px] text-gray-dark leading-[1.6]">
                Limited customer engagement and feedback activity may reduce online visibility.
              </p>
            </div>
            <PhoneMockup
              results={beforeResults}
              label="Before"
              labelColor="red"
              visible={visible}
            />
          </div>

          <ArrowConnector />

          <div className="flex flex-col items-center gap-4 w-full lg:w-auto lg:flex-1">
            <div className="text-center max-w-sm">
              <h5 className="text-lg sm:text-xl font-semibold text-leaf-dark mb-2 sm:mb-3">
                Improved Customer Engagement
              </h5>
              <p className="text-[14px] sm:text-[15px] text-gray-dark leading-[1.6]">
                Businesses with stronger customer engagement and consistent feedback activity may improve their online presence over time.
              </p>
            </div>
            <PhoneMockup
              results={afterResults}
              label="After"
              labelColor="green"
              visible={visible}
            />
          </div>
        </div>
      </section>
    </>
  );
};