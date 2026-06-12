export default function RatingFilter({
  ratingFilter,
  setRatingFilter,
  total,
}: {
  ratingFilter: number | null;
  setRatingFilter: (value: number | null) => void;
  // countByRating: (star: number) => number;
  total: number;
}) {
  const ratings = [5, 4, 3, 2, 1];

  return (
    <div className="flex gap-2 flex-wrap items-center">
      <button
        onClick={() => setRatingFilter(null)}
        className={`relative px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-200 border ${
          ratingFilter === null
            ? "bg-mango-light border-mango-orange text-mango-deep shadow-sm scale-105"
            : "bg-card border-border text-muted-foreground hover:border-mango-orange/50 hover:text-mango-orange hover:bg-mango-light/30"
        }`}
      >
        All
        {/* <span className={`ml-1.5 text-[10px] font-semibold ${ratingFilter === null ? "text-mango-deep/70" : "text-muted-foreground/60"}`}>
          {total}
        </span> */}
      </button>

      {ratings.map((r) => (
        <button
          key={r}
          onClick={() => setRatingFilter(r)}
          className={`relative flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-200 border ${
            ratingFilter === r
              ? "bg-leaf-light border-leaf-main text-leaf-dark shadow-sm scale-105"
              : "bg-card border-border text-muted-foreground hover:border-leaf-main/50 hover:text-leaf-dark hover:bg-leaf-light/30"
          }`}
        >
          <span className="text-star-gold text-[11px]">★</span>
          {r}
          {/* <span className={`ml-0.5 text-[10px] font-semibold ${ratingFilter === r ? "text-leaf-dark/60" : "text-muted-foreground/60"}`}>
            ({countByRating(r)})
          </span> */}
        </button>
      ))}
    </div>
  );
}