import { Star } from "lucide-react";
import { useState } from "react";

const LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

type Props = {
  value:    number;
  onChange: (v: number) => void;
};

export default function OverallRating({ value, onChange }: Props) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-4 text-center">
      <p className="text-sm! font-medium text-gray-700 mb-3">
        How was your overall experience?
      </p>
      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              size={36}
              className={`transition-colors ${
                star <= (hovered || value)
                  ? "fill-mango-mid text-mango-mid"
                  : "fill-gray-400 text-gray-400"
              }`}
            />
          </button>
        ))}
      </div>
      {value > 0 && (
        <p className="text-xs text-gray-400 mt-2">{LABELS[value]}</p>
      )}
    </div>
  );
}