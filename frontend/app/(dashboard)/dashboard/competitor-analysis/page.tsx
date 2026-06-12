"use client";

import { useState, useEffect, useRef } from "react";
import { Plus } from "lucide-react";

// Track Components
import CompetitiveAnalysis from "@/components/dashboard/compitator-analysis/Competitoranalysispage";
import HowItWorks from "@/components/dashboard/compitator-analysis/HowItWorks";
import CompetitorSlot from "@/components/dashboard/compitator-analysis/CompetitorSlot";
import ActionFooter from "@/components/dashboard/compitator-analysis/ActionFooter";

// Hooks & Utils
import { useExtractLocation } from "@/hooks/location.hooks";
import { useLocationContext } from "@/context/selectedLocation.context";
import customFetch from "@/utils/customFetch";

export interface CompetitorTarget {
  url: string;
  data: any | null;
  isExtracted: boolean;
  error?: string; // <-- Added error state for validation
}

export default function CompetitorAnalysis() {
  const { selectedLocation } = useLocationContext();
// console.log(selectedLocation,"helo ")
  const [competitors, setCompetitors] = useState<CompetitorTarget[]>([
    { url: "", data: null, isExtracted: false },
  ]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [confirmed, setConfirmed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const isProgrammaticChange = useRef(false);
  
  const { mutate, data: extractedData, isPending, reset } = useExtractLocation();

 useEffect(() => {
  if (extractedData && !isPending) {

    // Prevent analyzing own business
    if (extractedData.placeId === selectedLocation?.placeId) {
      setCompetitors(prev =>
        prev.map((item, idx) =>
          idx === activeIndex
            ? {
                ...item,
                data: null,
                isExtracted: false,
                error: "You cannot analyze your own business as a competitor."
              }
            : item
        )
      );

      reset?.();
      return;
    }

    setCompetitors(prev =>
      prev.map((item, idx) =>
        idx === activeIndex
          ? {
              ...item,
              data: extractedData,
              isExtracted: true,
              error: undefined
            }
          : item
      )
    );

    reset?.();
  }
}, [extractedData, isPending, activeIndex, reset, selectedLocation]);
  // ─── VALIDATION LOGIC ADDED HERE ───
  const handleUrlChange = (index: number, val: string) => {
    if (isProgrammaticChange.current) {
      isProgrammaticChange.current = false;
      return;
    }
    setCompetitors((prev) => {
      // 1. Update the specific input
      const newArray = prev.map((item, idx) =>
        idx === index ? { ...item, url: val, data: null, isExtracted: false } : item
      );
      
      // 2. Re-validate all rows for duplicates dynamically
      return newArray.map((item, i) => {
        const isDuplicate = newArray.some(
          (other, j) => i !== j && other.url.trim() !== "" && other.url === item.url
        );
        return { 
          ...item, 
          error: isDuplicate ? "Duplicate URL. Please use a unique competitor link." : undefined 
        };
      });
    });

    if (confirmed) {
      setConfirmed(false);
      setAnalysisResult(null);
    }
  };

  const handleExtract = (index: number) => {
    setActiveIndex(index);
    mutate(competitors[index].url);
  };

  const addCompetitorSlot = () => {
    if (competitors.length < 5) {
      setCompetitors((prev) => [...prev, { url: "", data: null, isExtracted: false }]);
      setActiveIndex(competitors.length);
    }
  };

  const removeCompetitorSlot = (index: number) => {
    if (competitors.length === 1) {
      setCompetitors([{ url: "", data: null, isExtracted: false }]);
      setActiveIndex(0);
      return;
    }
    const updated = competitors.filter((_, idx) => idx !== index);
    
    // Re-validate remaining slots after deletion
    const reValidated = updated.map((item, i) => {
      const isDuplicate = updated.some(
        (other, j) => i !== j && other.url.trim() !== "" && other.url === item.url
      );
      return { ...item, error: isDuplicate ? "Duplicate URL" : undefined };
    });

    setCompetitors(reValidated);
    setActiveIndex(Math.max(0, index - 1));
  };

  const confirmHandler = async () => {
    try {
      setIsAnalyzing(true);
      // Grabs ALL extracted competitor data and sends them in one batch array
      const validCompetitorsData = competitors
        .filter((c) => c.isExtracted && c.data)
        .map((c) => c.data);

      const response = await customFetch.post(
        "/location/get-competitor-analysis",
        {
          myPlaceId: selectedLocation?.placeId,
          competitorsData: validCompetitorsData, // Analyzes all at once
        }
      );

      setAnalysisResult(response.data);
      setConfirmed(true);

      isProgrammaticChange.current = true;
      setCompetitors([{ url: "", data: null, isExtracted: false }]);
      setActiveIndex(0);
    } catch (error) {
      console.error("Analysis sequence failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (analysisResult) {
    return (
      <div className="min-h-screen bg-background animate-fade-in space-y-4">
        <div className="p-4 md:p-8">
          <CompetitiveAnalysis analysisData={analysisResult} />
        </div>
      </div>
    );
  }

  const hasErrors = competitors.some((c) => !!c.error);
  const totalExtractedCount = competitors.filter((c) => c.isExtracted).length;
  // Block generation if there are un-resolved duplicate errors
  const canGenerate = totalExtractedCount > 0 && !isAnalyzing && !hasErrors;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 mb-1">
          <span className="text-xs font-bold font-mono text-amber-500 uppercase tracking-widest">
            AI-Powered Analysis
          </span>
        </div>
        <h1 className="text-2xl! font-bold tracking-tight text-foreground">
          Competitor Analysis
        </h1>
        <p className="text-sm! text-muted-foreground leading-relaxed">
          Add up to 5 competitor Google Maps links to get a detailed side-by-side breakdown.
        </p>
      </div>

      <HowItWorks />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-foreground">Competitor links</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
              {competitors.length} / 5
            </span>
          </div>
          {competitors.length < 5 && (
            <button
              type="button"
              onClick={addCompetitorSlot}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 px-3 py-1.5 rounded-lg bg-amber-500/8 hover:bg-amber-500/15 border border-amber-500/20 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Add competitor
            </button>
          )}
        </div>

        {competitors.map((item, index) => (
          <CompetitorSlot
            key={index}
            item={item}
            index={index}
            activeIndex={activeIndex}
            isPending={isPending}
            onUrlChange={handleUrlChange}
            onExtract={handleExtract}
            onRemove={removeCompetitorSlot}
          />
        ))}
      </div>

      <ActionFooter
        totalExtractedCount={totalExtractedCount}
        totalSlots={competitors.length}
        canGenerate={canGenerate}
        isAnalyzing={isAnalyzing}
        onConfirm={confirmHandler}
      />
    </div>
  );
}