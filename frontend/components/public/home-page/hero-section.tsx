
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

export const HeroSection = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // split text into words
      const words = titleRef.current?.querySelectorAll(".word");

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // headline animation
      if (words) {
        tl.from(words, {
          y: 60,
          opacity: 0,
          filter: "blur(10px)",
          stagger: 0.08,
          duration: 0.8,
        });
      }

      // subtitle
      tl.from(
        subtitleRef.current,
        {
          y: 30,
          opacity: 0,
          duration: 0.6,
        },
        "-=0.4",
      );

      // buttons
      tl.from(
        ctaRef.current,
        {
          y: 20,
          opacity: 0,
          duration: 2,
        },
        "-=0.4",
      );
    });

    return () => ctx.revert();
  }, []);

  // helper to split words
  const splitWords = (text: string) => {
    return text.split(" ").map((word, i) => (
      <span key={i} className="word inline-block mr-2">
        {word}
      </span>
    ));
  };

  return (
    <section className="mx-4 md:mx-8 relative flex flex-col items-center md:justify-center text-center overflow-hidden rounded-2xl px-4 md:px-6 py-10 md:py-20 bg-linear-to-br from-green-500/10 via-transparent to-green-500/10 my-10 select-none">
      {/* Badge */}
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-green-dim px-4 py-1.5 text-[8px] md:text-[10sm] font-semibold uppercase tracking-widest">
        <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-sm bg-black text-[8px] text-white">
          ✦
        </span>
        AI-Assisted Review Management
      </div>

      {/* Headline */}
      <h1
        ref={titleRef}
        className="font-semibold leading-tight  text-subheading max-w-5xl"
      >
        {splitWords("Build Customer Trust With")}
        
     
        <span className="text-leaf-light">{splitWords("Smarter Review Management")}</span>
      </h1>

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        className="mt-4 mb-7 max-w-3xl text-sm leading-relaxed text-gray-light"
      >
        Use AI-assisted tools to draft professional review responses, monitor customer feedback, and support meaningful customer engagement across your online presence.
      </p>

      {/* Buttons */}
      <div ref={ctaRef} className="flex items-center gap-4 relative z-10">
        <Link
          href="/pricing"
          className="border border-mango-orange text-mango-orange text-xs md:text-sm px-2 py-1.5 md:px-4 md:py-2 rounded-sm"
        >
          Get Started
        </Link>

        <Link href="/contact-us">
          <button className=" bg-linear-to-br from-leaf-dark to-leaf-light text-white text-xs md:text-sm p-2 md:px-4 md:py-2.5 rounded-sm">
            Request for Demo
          </button>
        </Link>
      </div>
    </section>
  );
};
