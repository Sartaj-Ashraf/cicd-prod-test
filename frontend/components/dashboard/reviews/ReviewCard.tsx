"use client";

import { Star } from "lucide-react";
import { Review } from "@/types/dashboard/Review.types";
import { useEffect, useRef, useState } from "react";
import { generateReply, postReply } from "@/services/review/review.services";
import { useLocationContext } from "@/context/selectedLocation.context";

import { useQueryClient } from "@tanstack/react-query";
import { queryKeys }      from "@/lib/query-keys";

import { toast } from "sonner";
import { useCredits } from "@/hooks/useCredits.hooks";

export default function ReviewCard({ review }: { review: Review }) {
const queryClient = useQueryClient();


  const initials = review.authorName?.[0]?.toUpperCase() ?? "?";
  const rating   = Math.round(review.rating);


  const [expanded,    setExpanded]    = useState(false);
  const [overflows,   setOverflows]   = useState(false);
  const [replyText,   setReplyText]   = useState(review.replyComment ?? "");
  const [isReplied,   setIsReplied]   = useState(!!review.replied);
  const [showReply,   setShowReply]   = useState(false);
  const [hint,        setHint]        = useState("");
  const [generating,  setGenerating]  = useState(false);
  const [posting,     setPosting]     = useState(false);
  const [cooldown,    setCooldown]    = useState(0);

      const { data: creditsData,  refetch } = useCredits();


const hasAiRepliesCredits =
  creditsData?.data?.aiReplies &&
  (creditsData.data.aiReplies.creditsTotal === null ||
    creditsData.data.aiReplies.creditsUsed < creditsData.data.aiReplies.creditsTotal);
  const textRef     = useRef<HTMLParagraphElement>(null);
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);

  const { selectedLocation } = useLocationContext();
  const isGBP = selectedLocation?.source === "gbp";

  useEffect(() => {
    const el = textRef.current;
    if (el) setOverflows(el.scrollHeight > el.clientHeight);
  }, [review.text]);

  // ── cooldown timer ────────────────────────────────────────────────────────
  const startCooldown = () => {
    setCooldown(30);
    const interval = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) { clearInterval(interval); return 0; }
        return c - 1;
      });
    }, 1000);
    cooldownRef.current = interval;
  };

  useEffect(() => () => {
    if (cooldownRef.current) clearInterval(cooldownRef.current);
  }, []);

  // ── generate ──────────────────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!selectedLocation?._id) return;
    if (!hasAiRepliesCredits) {
      toast.error("You have used all your AI replies credits");
      return;
    }
    setGenerating(true);
    try {
      const generated = await generateReply(
        selectedLocation._id,
        review.text,
        review.rating,
        review.authorName,
        hint || undefined
      );
      setReplyText(generated);
      setShowReply(true);
      startCooldown();
    } catch {
      toast.error("Failed to generate reply");
    } finally {
      setGenerating(false);
    }
  };

  // ── post ──────────────────────────────────────────────────────────────────
 const handlePost = async () => {
  if (!replyText.trim() || !review.reviewId) return;
  setPosting(true);
  try {
    await postReply(selectedLocation!._id, review.reviewId, replyText);
    setIsReplied(true);
    queryClient.invalidateQueries({ queryKey: queryKeys.credits.all }); // ← add
    toast.success("Reply posted successfully");
  } catch {
  } finally {
    setPosting(false);
  }
};
  return (
    <div className="group relative flex flex-col justify-between h-full bg-card border border-border rounded-xl p-5 hover:border-border/60 hover:shadow-md transition-all duration-200">

      {/* quote decoration */}
      <span className="absolute top-3 right-4 font-serif text-3xl text-border/40 select-none">"</span>

      {/* ── header ── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground">
            {initials}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground leading-none">
              {review.authorName || "Anonymous"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(review.reviewTime).toLocaleDateString("en-IN", {
                day: "numeric", month: "short", year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* rating + badge */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-[2px]">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < rating ? "fill-amber-500 text-amber-500" : "fill-border text-border"}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground">{rating}.0</span>
            {isReplied ? (
              <span className="rounded-full bg-green-500/10 text-green-600 px-2 py-0.5 text-[10px] font-medium">
                Replied
              </span>
            ) : (
              <span className="rounded-full bg-orange-500/10 text-orange-600 px-2 py-0.5 text-[10px] font-medium">
                Pending
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── review text ── */}
      <div className="mt-4 flex flex-col">
        <p
          ref={textRef}
          className={`text-[13.5px] text-muted-foreground leading-relaxed ${!expanded ? "line-clamp-4" : ""}`}
        >
          {review.text || "No review text provided."}
        </p>

        {overflows && (
          <button
            onClick={() => setExpanded((p) => !p)}
            className="mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>

      {/* ── existing reply ── */}
      {(isReplied && replyText) && (
        <div className="mt-4 ml-4 border-l-2 border-border pl-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-mango-orange/15 flex items-center justify-center text-[11px] font-semibold text-mango-orange">
              B
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">Business Reply</p>
              {review.replyUpdatedAt && (
                <p className="text-[11px] text-muted-foreground">
                  {new Date(review.replyUpdatedAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </p>
              )}
            </div>
          </div>
          <p className="text-[13px] leading-relaxed text-foreground/80">{replyText}</p>
        </div>
      )}

      {/* ── AI reply section — GBP only, pending only ── */}
      {isGBP && !isReplied && (
        <div className="mt-4 pt-4 border-t border-border space-y-3">

          {/* hint input */}
         {showReply && (
  <textarea
    value={hint}
    onChange={(e) => setHint(e.target.value)}
    placeholder="Optional: tell AI how to reply (e.g. apologetic, mention discount)"
    rows={3}
    className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-border resize-none"
  />
)}

          {/* generated reply textarea */}
          {showReply && replyText && (
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={4}
              className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-secondary/30 text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-border"
            />
          )}

          {/* action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* generate / regenerate */}
            <button
              onClick={handleGenerate}
              disabled={generating || cooldown > 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-border bg-card hover:bg-secondary/50 text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? (
                <>
                  <span className="w-3 h-3 border border-foreground/30 border-t-foreground rounded-full animate-spin" />
                  Generating…
                </>
              ) : cooldown > 0 ? (
                `Regenerate in ${cooldown}s`
              ) : showReply ? (
                "↺ Regenerate"
              ) : (
                "✦ Generate Reply"
              )}
            </button>

            {/* hint toggle — only before first generate */}
            {!showReply && (
              <button
                onClick={() => setShowReply(true)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                + Add hint
              </button>
            )}

            {/* post button */}
            {showReply && replyText && (
              <button
                onClick={handlePost}
                disabled={posting}
                className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-leaf-main text-white hover:bg-leaf-main/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {posting ? (
                  <>
                    <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                    Posting…
                  </>
                ) : (
                  "Post Reply"
                )}
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
}