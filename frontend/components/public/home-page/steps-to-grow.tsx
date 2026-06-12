"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    badge: "STEP–01",
    title: "Scan or Open Link",
    description:
      "Customers scan your QR or tap a link to leave feedback instantly.",
  },
  {
    badge: "STEP–02",
    title: "Write your feedback",
description:
  "Customers can quickly share honest feedback about their experience.",
  },
  {
    badge: "STEP–03",
    title: "Share feedback ",
    description:
      "Customers can choose to submit their feedback on supported review platforms.",
  },
  // You can enable these later if needed
  // {
  //   badge: "STEP–04",
  //   title: "AI replies for you",
  //   description:
  //     "Get smart reply suggestions and respond in seconds.",
  // },
  // {
  //   badge: "STEP–05",
  //   title: "Track & grow",
  //   description:
  //     "Monitor performance and improve with AI-driven insights.",
  // },
];

export const StepsToGrow = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          observer.disconnect(); // run once only
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
  }, []);

  return (
    <section
      ref={ref}
      className="w-full bg-linear-to-br from-leaf-light/10 via-transparent to-leaf-light/10 rounded-[20px] px-8 py-14 text-center overflow-hidden"
    >
      {/* Eyebrow */}
      <div
        className={`flex items-center justify-center gap-3 mb-4 transition-all duration-700 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <span className="w-8 h-[1.5px] bg-mango-orange rounded-full" />
        <span className="w-[7px] h-[7px] rounded-full bg-mango-orange" />
        <span className="text-[11px] font-medium tracking-[0.12em] text-gray-medium uppercase">
          Steps to
        </span>
        <span className="w-[7px] h-[7px] rounded-full bg-mango-orange" />
        <span className="w-8 h-[1.5px] bg-mango-orange rounded-full" />
      </div>

      {/* Title */}
      <h3
        className={`text-dark text-3xl font-medium leading-snug mb-14 transition-all duration-700 delay-100 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        Customer feedback made simple
      </h3>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <StepCard
            key={step.badge}
            step={step}
            index={index}
            show={show}
          />
        ))}
      </div>
    </section>
  );
};

const StepCard = ({
  step,
  index,
  show,
}: {
  step: { badge: string; title: string; description: string };
  index: number;
  show: boolean;
}) => {
  return (
    <div
      className={`flex flex-col items-center text-center px-4 py-4 rounded-xl transition-all duration-700 transform ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } hover:-translate-y-1 hover:scale-[1.02]`}
      style={{ transitionDelay: `${index * 120 + 200}ms` }}
    >
      {/* Badge */}
      <span className="inline-block bg-leaf-main text-white text-[11px] font-medium tracking-[0.08em] px-3 py-[5px] rounded-full border border-leaf-dark mb-4">
        {step.badge}
      </span>

      {/* Title */}
      <p className="text-gray-dark text-sm font-medium leading-snug mb-2">
        {step.title}
      </p>

      {/* Description */}
      <p className="text-gray-medium text-xs leading-relaxed max-w-[220px]">
        {step.description}
      </p>
    </div>
  );
};