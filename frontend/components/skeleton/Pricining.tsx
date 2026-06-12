export function PricingCardSkeleton({ isPopular = false }: { isPopular?: boolean }) {
  return (
    <div
      className={`
        relative bg-white rounded-2xl p-8 sm:p-10 flex flex-col h-full border
        ${isPopular ? "ring-2 ring-leaf-dark/20 shadow-xl md:scale-105 border-leaf-dark/30" : "border-gray-200"}
      `}
    >
      {isPopular && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-200 rounded-t-2xl animate-pulse" />
      )}

      {/* Plan name + badge row */}
      <div className="flex justify-between items-center mb-5">
        <div className="h-3 w-16 rounded bg-gray-200 animate-pulse" />
        {isPopular && <div className="h-6 w-24 rounded-full bg-gray-200 animate-pulse" />}
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-2 mb-3">
        {isPopular && <div className="h-4 w-12 rounded bg-gray-200 animate-pulse" />}
        <div className="h-10 w-28 rounded-lg bg-gray-200 animate-pulse" />
        <div className="h-4 w-16 rounded bg-gray-100 animate-pulse" />
      </div>

      {/* Tier label */}
      <div className="h-3 w-20 rounded bg-gray-100 animate-pulse mb-8" />

      {/* Features */}
      <ul className="space-y-4 mb-10 grow">
        {[100, 80, 90].map((w, i) => (
          <li key={i} className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
            <div
              className="h-3 rounded bg-gray-100 animate-pulse"
              style={{ width: `${w}%` }}
            />
          </li>
        ))}
      </ul>

      {/* CTA button */}
      <div className="h-12 w-full rounded-full bg-gray-200 animate-pulse" />
    </div>
  );
}

export default function PricingPageSkeleton() {
  return (
    <>

      {/* Badge */}
      <div className="flex justify-center mb-6">
        <div className="h-7 w-36 rounded-full bg-gray-200 animate-pulse" />
      </div>

      {/* Hero text */}
      <section className="flex flex-col items-center gap-3 mb-12 sm:mb-16">
        <div className="h-10 w-72 sm:w-96 rounded-lg bg-gray-200 animate-pulse" />
        <div className="h-8 w-52 sm:w-64 rounded-lg bg-gray-200 animate-pulse" />
        <div className="mt-2 h-5 w-64 sm:w-80 rounded bg-gray-100 animate-pulse" />
        <div className="h-5 w-52 rounded bg-gray-100 animate-pulse" />
      </section>

      {/* Duration toggle pills */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-12">
        {[90, 90, 90, 90].map((w, i) => (
          <div
            key={i}
            className="h-9 rounded-full bg-gray-200 animate-pulse"
            style={{ width: `${w}px` }}
          />
        ))}
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        <PricingCardSkeleton />
        <PricingCardSkeleton isPopular />
        <PricingCardSkeleton />
      </div>
    </>
  );
}