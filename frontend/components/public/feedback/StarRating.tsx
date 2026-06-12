import { useState } from "react";
import { Star }     from "lucide-react";

export default function StarRating({
  value,
  onChange,
  size = 24,
}: {
  value:    number;
  onChange: (v: number) => void;
  size?:    number;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={size}
            className={`transition-colors ${
              s <= (hovered || value)
                ? "fill-mango-mid text-mango-mid"
                : "fill-gray-300 text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}