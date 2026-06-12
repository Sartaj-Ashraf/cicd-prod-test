"use client";

import { Chip, getAdminChips } from "@/services/questions/question.service";
import { RefreshCw, ExternalLink, Zap, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  review: string;
  reviewLink: string;
  isLoading: boolean;
  regenCount: number;
  maxRegen: number;
  onRegenerate: (chips: string[]) => void;
};

export default function AiReviewBox({
  review,
  reviewLink,
  isLoading,
  regenCount,
  maxRegen,
  onRegenerate,
}: Props) {
  const remaining = maxRegen - regenCount;
  const canRegenerate = remaining > 0 && !isLoading;

  const [chips, setChips] = useState<string[]>([]);
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [showChips, setShowChips] = useState(true);

  const handleOpenReview = async () => {
    if (review) {
      await navigator.clipboard.writeText(review);
      toast.success("Review copied!");
    }
    
    setTimeout(() => {
      window.location.href = reviewLink;
    }, 400);
  };

  useEffect(() => {
    async function fetchAdminChips() {
      try {
        const res = await getAdminChips();
        setChips(res.data.map((c:Chip)=>c.text));
      } catch {
        toast.error("Failed to load review preferences");
      }
    }

    fetchAdminChips();
  }, []);

  const toggleChip = (chip: string) => {
    setSelectedChips((prev) =>
      prev.includes(chip)
        ? prev.filter((c) => c !== chip)
        : [...prev, chip]
    );
  };

  const handleGenerate = () => {
    if(selectedChips.length===0){
      toast.error("Can't generate review please first select your intent");
      return
    }
    setShowChips(false);
    onRegenerate(selectedChips);
  };

  return (
    <div className="space-y-4">

      {/* Chips Section */}
      {chips.length>0 && <div className="rounded-2xl border border-gray-200 bg-white    overflow-hidden">
        <button
          type="button"
          onClick={() => setShowChips((prev) => !prev)}
          className="w-full flex items-center justify-between px-4 py-3"
        >
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-700">
              Review Preferences
            </p>

            {selectedChips.length > 0 && (
              <p className="text-xs text-gray-500">
                {selectedChips.length} selected
              </p>
            )}
          </div>

          <ChevronDown
            size={20}
            color="black"
            className={`transition-transform duration-300 text-black ${
              showChips ? "rotate-180" : ""
            }`}
          />
        </button>

        {!showChips && selectedChips.length > 0 && (
          <div className="px-4 pb-3 flex flex-wrap gap-2">
            {selectedChips.slice(0, 4).map((chip) => (
              <span
                key={chip}
                className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] text-gray-600"
              >
                {chip}
              </span>
            ))}

            {selectedChips.length > 4 && (
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] text-gray-600">
                +{selectedChips.length - 4}
              </span>
            )}
          </div>
        )}

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showChips ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-4 pt-0">
            <div className="flex flex-wrap gap-2">
              {chips.map((chip) => {
                const selected = selectedChips.includes(chip);

                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => toggleChip(chip)}
                    className={`
                      rounded-full px-3 py-1.5 text-xs cursor-pointer font-medium
                      transition-all duration-200
                      ${
                        selected
                          ? "bg-leaf-dark text-white shadow-sm scale-105"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }
                    `}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>}

      {/* Review */}
      <div className="bg-gray-50 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Zap size={12} className="text-leaf-dark" />

            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              AI Generated Review
            </p>
          </div>

          <span className="text-xs text-gray-400">
            {remaining} regeneration
            {remaining !== 1 ? "s" : ""} left
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-3 bg-gray-200 rounded-lg w-full" />
            <div className="h-3 bg-gray-200 rounded-lg w-5/6" />
            <div className="h-3 bg-gray-200 rounded-lg w-4/6" />
            <div className="h-3 bg-gray-200 rounded-lg w-full" />
            <div className="h-3 bg-gray-200 rounded-lg w-3/4" />
          </div>
        ) : (
          <p className="text-sm text-gray-700 leading-relaxed">
            {review}
          </p>
        )}
      </div>

      {/* Generate / Regenerate */}
      <button
        type="button"
        onClick={handleGenerate}
        disabled={!canRegenerate}
        className="w-full h-11 rounded-2xl border border-gray-200 text-gray-700 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-all duration-200 disabled:opacity-40"
      >
        <RefreshCw
          size={15}
          className={isLoading ? "animate-spin" : ""}
        />

        {regenCount === 0 ? "Generate" : "Regenerate"}
      </button>

      {/* Open Google */}
      <button
        type="button"
        onClick={handleOpenReview}
        disabled={isLoading}
        className="w-full h-12 rounded-2xl bg-leaf-dark text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-90 transition-all duration-200"
      >
        <ExternalLink size={15} />
        {selectedChips.length>0?"Copy & Open Google Review":"Post your own review"}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Review copied to clipboard before opening Google.
      </p>
    </div>
  );
}