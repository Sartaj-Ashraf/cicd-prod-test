import Link from "next/link";
import Image from "next/image";
import logo from "@/public/MangoZero.png";
import toplogo from "@/public/MangoLogo.png"
export default function NotFound() {
  const suggestions = [
    { label: "Home", href: "/" },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/contact-us" },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6  relative overflow-hidden bg-background">

      {/* ── Background blobs ── */}
      <div className="absolute w-96 h-96 rounded-full bg-leaf-main/5 -top-24 -left-24 pointer-events-none" />
      <div className="absolute w-72 h-72 rounded-full bg-mango-mid/8 -bottom-16 -right-16 pointer-events-none" />
      <div className="absolute w-48 h-48 rounded-full bg-mango-orange/5 top-1/3 left-[65%] pointer-events-none" />
      <div className="absolute w-32 h-32 rounded-full bg-leaf-light/10 bottom-1/4 left-[10%] pointer-events-none" />

      {/* ── Decorative top border ── */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-leaf-dark via-mango-mid to-mango-orange" />

      {/* ── Logo ── */}
      <div className="mb-8">
        <Image src={toplogo} alt="GrowUpReview Logo" width={100} height={100} className="mx-auto" />
      </div>

      {/* ── Badge ── */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-leaf-dark/20 bg-leaf-main/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-leaf-dark">
        <span className="inline-block w-2 h-2 rounded-full bg-leaf-main animate-pulse" />
        404 · Page Not Found
      </div>

      {/* ── 404 with mango ── */}
      <div className="flex items-center justify-center gap-5 leading-none select-none">
        <span className="text-[clamp(5rem,18vw,9rem)] font-extrabold text-mango-mid drop-shadow-sm">
          4
        </span>

     <Image src={logo} alt="Mango Logo" width={100} height={100} />


        <span className="text-[clamp(5rem,18vw,9rem)] font-extrabold text-mango-mid drop-shadow-sm">
          4
        </span>
      </div>

      {/* ── Headline ── */}
      <h3 className="font-bold text-base-black mt-2 mb-3 leading-tight">
        Oops! This page went missing
      </h3>
      <p className="text-gray-medium max-w-lg mx-auto mb-8 leading-relaxed">
        Looks like this page took a wrong turn. It might have moved, been
        removed, or never existed — but we&apos;ll help you find your way back.
      </p>

      {/* ── Primary actions ── */}
      <div className="flex flex-wrap gap-3 justify-center mb-10">
        <Link
          href="/"
          className="bg-gradient-to-br from-leaf-dark to-leaf-light text-white px-7 py-3 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
        >
          ← Go Back Home
        </Link>
        <Link
          href="/contact-us"
          className="border-2 border-mango-orange text-mango-orange px-7 py-3 rounded-md text-sm font-semibold hover:bg-mango-orange/5 transition-colors"
        >
          Contact Support
        </Link>
      </div>

      {/* ── Divider ── */}
      <div className="flex items-center gap-4 w-full max-w-xs mb-8">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-light uppercase tracking-widest">
          Or explore
        </span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* ── Quick links ── */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {suggestions.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="px-4 py-1.5 rounded-full border border-gray-200 text-xs font-medium text-gray-dark hover:border-leaf-main hover:text-leaf-dark transition-colors"
          >
            {s.label}
          </Link>
        ))}
      </div>

      {/* ── Fun fact card ──
      <div className="w-full max-w-sm rounded-2xl border border-mango-mid/30 bg-mango-light/10 px-6 py-4 mb-10 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-mango-mid/10 -mr-6 -mt-6 pointer-events-none" />
        <p className="text-[10px] uppercase tracking-widest text-mango-orange font-bold mb-1">
          🥭 Fun fact
        </p>
        <p className="text-xs text-gray-dark leading-relaxed">
          Did you know? India produces over{" "}
          <span className="font-semibold text-mango-deep">20 million tonnes</span>{" "}
          of mangoes every year — that&apos;s more than half the world&apos;s
          supply. Just like a great review, every mango counts! 🌿
        </p>
      </div> */}

      {/* ── Dot strip ── */}
      <div className="flex gap-2 justify-center">
        {[
          "bg-leaf-light",
          "bg-leaf-main",
          "bg-mango-mid",
          "bg-mango-orange",
          "bg-mango-mid",
          "bg-leaf-main",
          "bg-leaf-light",
        ].map((cls, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full ${cls} opacity-80`}
          />
        ))}
      </div>

      {/* ── Bottom brand line ── */}
      <p className="mt-8 text-xs text-gray-light">
        &copy; {new Date().getFullYear()} GrowUpReview · Growing your reputation, one review at a time 🌱
      </p>

      {/* ── Decorative bottom border ── */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-mango-orange via-mango-mid to-leaf-dark" />
    </main>
  );
}