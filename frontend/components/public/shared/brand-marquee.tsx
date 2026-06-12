"use client";

import { useEffect, useRef } from "react";
import Splide from "@splidejs/splide";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import "@splidejs/splide/css";
import Image from "next/image";
 
import logo1 from "@/public/logos/02.png";
import logo2 from "@/public/logos/03.png";
import logo3 from "@/public/logos/04.png";
import logo4 from "@/public/logos/05.png";

export function BrandMarquee() {
  const splideRef = useRef<HTMLDivElement | null>(null);

  const logos = [logo1, logo2, logo3, logo4];

  useEffect(() => {
    if (!splideRef.current) return;

    const splide = new Splide(splideRef.current, {
      type: "loop",
      drag: false,
      arrows: false,
      pagination: false,
      autoWidth: true,
      gap: "40px",

      speed: 0, // removes slide animation
      autoScroll: {
        speed: 1, // smooth continuous scroll
        pauseOnHover: false,
        pauseOnFocus: false,
      },
    });

    splide.mount({ AutoScroll });

    return () => {
      splide.destroy();
    };
  }, []);

  return (
    <div className="w-full overflow-hidden relative  ">
      
      {/* LEFT FADE */}
      <div className="hidden lg:block pointer-events-none absolute left-0 top-0 h-full w-24 z-10 bg-linear-to-r from-background to-transparent" />

      {/* RIGHT FADE */}
      <div className="hidden lg:block pointer-events-none absolute right-0 top-0 h-full w-24 z-10 bg-linear-to-l from-background to-transparent" />

      {/* SPLIDE */}
      <div className="splide" ref={splideRef}>
        <div className="splide__track">
          <ul className="splide__list items-center">
            {logos.map((logo, i) => (
              <li key={i} className="splide__slide flex items-center">
                <Image
                  src={logo}
                  alt={`Client ${i + 1}`}
                  width={100}
                  height={40}
                  className="w-48  object-contain opacity-100 transition duration-300 "
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}