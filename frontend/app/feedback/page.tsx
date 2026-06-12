// app/(public)/feedback/page.tsx
"use client";

import { useState, useRef }    from "react";
import Image                   from "next/image";
import { useSearchParams }     from "next/navigation";
import { useForm }             from "react-hook-form";
import { zodResolver }         from "@hookform/resolvers/zod";
import { toast }               from "sonner";

import LogoImage               from "@/public/MangoLogo.png";

import {
  useLocationForFeedback,
  usePublicQuestions,
  useSubmitFeedback,
  useResetBadReviewCount,
  useRecordScan,
}                              from "@/hooks/feedback.hooks";

import FeedbackSkeleton        from "@/components/skeleton/FeedbackSkeleton";
import FeedbackSuccess         from "@/components/public/feedback/FeedbackSuccess";
import FeedbackError           from "@/components/public/feedback/FeedbackError";
import BusinessInfo            from "@/components/public/feedback/BusinessInfo";
import OverallRating           from "@/components/public/feedback/OverallRating";
import QuestionList            from "@/components/public/feedback/QuestionList";
import AiReviewBox             from "@/components/dashboard/feedback/AiReviewBox";

import { feedbackSchema, FeedbackForm } from "./feedbackSchema";
import Link from "next/link";

const MAX_REGEN = 3;

export default function FeedbackPage() {
  const searchParams = useSearchParams();
  const createdBy    = searchParams.get("createdBy");
  const placeId      = searchParams.get("placeId");

  const [overallRating,      setOverallRating]      = useState(0);
  const [answers,            setAnswers]            = useState<Record<string, number>>({});
  const [submitted,          setSubmitted]          = useState(false);
  const [aiReview,           setAiReview]           = useState("");
  const [isGeneratingReview, setIsGeneratingReview] = useState(false);
  const [regenCount,         setRegenCount]         = useState(0);
  
  // ── refs — persist across rating changes without re-render ────────────────
  const scanRecorded  = useRef(false);
  const lastAiReview  = useRef("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FeedbackForm>({
    resolver:      zodResolver(feedbackSchema),
    defaultValues: { fullName: "", phoneNumber: "", comment: "" },
  });

  const { data, isLoading, isError, error }                   = useLocationForFeedback(placeId, createdBy);
  const { data: questions = [], isLoading: questionsLoading } = usePublicQuestions(createdBy || "");
  const { mutate: submitFeedback,    isPending: isSubmitting } = useSubmitFeedback();
  const { mutate: resetBadReviewCount }                        = useResetBadReviewCount();
  const { mutate: recordScan }                                 = useRecordScan();

  const location       = data?.location;
  const shouldRedirect = data?.shouldRedirect ?? false;

  // ── localStorage regen helpers ────────────────────────────────────────────
  const regenKey = `ai_regen_${location?._id}`;

  const loadRegenCount = () => {
    try { return parseInt(localStorage.getItem(regenKey) ?? "0"); }
    catch { return 0; }
  };

  const saveRegenCount = (count: number) => {
    console.log("count: ",count)
  try { localStorage.setItem(regenKey, String(count)); }
    catch {}
  };

  // ── init regen count from localStorage once location loads ────────────────
  const regenInitialized = useRef(false);

  if (location && !regenInitialized.current) {
    regenInitialized.current = true;
    const stored = loadRegenCount();
    if (stored !== regenCount) setRegenCount(stored);
  }

  const getAnswerValue = (id: string) =>
    answers[id] !== undefined ? answers[id] : 5;

  // ── trigger record scan API ───────────────────────────────────────────────
  const triggerRecordScan = (isRegenerate: boolean,chips:string[]) => {
    if (!location || !createdBy) return;
    setIsGeneratingReview(true);

    recordScan(
      { locationId: location._id, createdBy, isRegenerate,chips },
      {
        onSuccess: (res) => {
          if (!res?.AiReply) {
            // ai limit reached → redirect directly
            window.location.href = res?.reviewLink ?? location.reviewLink!;
            return;
          }
          lastAiReview.current = res.AiReply;
          setAiReview(res.AiReply);
          const newCount = regenCount + 1;
          setRegenCount(newCount);
          saveRegenCount(newCount);
        },
        onError: () => {
          toast.error(
            isRegenerate
              ? "Failed to regenerate review"
              : "Failed to generate AI review"
          );
          if (!isRegenerate) {
            window.location.href = location.reviewLink!;
          }
        },
        onSettled: () => setIsGeneratingReview(false),
      }
    );
  };

  // ── star rating change ────────────────────────────────────────────────────
  const handleOverallChange = (rating: number) => {
    setOverallRating(rating);

    if (rating <= 3) {
      // negative + shouldRedirect → reset count + redirect
      if (shouldRedirect && location?.reviewLink) {
        resetBadReviewCount(location._id, {
          onSettled: () => {
            window.location.href = location.reviewLink!;
          },
        });
      }
      return;
    }
  };

  // ── regenerate ────────────────────────────────────────────────────────────
  const handleReviewGeneration = (chips:string[]) => {
    if (regenCount >= MAX_REGEN) {
      toast.error("Maximum regenerations reached");
      return;
    }
    // 4/5 stars
    if (!scanRecorded.current) {
      // first time clicking 4/5 → call API, decrement both totalScans + aiReviews
      scanRecorded.current = true;
      triggerRecordScan(false,chips);
    } else {
      // already recorded → just restore last AI review, no API call
      setAiReview(lastAiReview.current);
    }
    triggerRecordScan(true,chips);
  };



  // ── form submit ───────────────────────────────────────────────────────────
  const onSubmit = (formData: FeedbackForm) => {
    if (!overallRating) {
      toast.error("Please select an overall rating");
      return;
    }

    const formattedAnswers = questions.map((q: any) => ({
      questionText: q.text,
      questionType: q.type,
      value:        getAnswerValue(q._id),
    }));

    submitFeedback(
      {
        locationId: location._id,
        data: {
          rating:      overallRating,
          createdBy:   createdBy!,
          fullName:    formData.fullName?.trim()    || undefined,
          phoneNumber: formData.phoneNumber?.trim() || undefined,
          comment:     formData.comment?.trim()     || undefined,
          answers:     formattedAnswers,
        },
      },
      {
        onSuccess: () => setSubmitted(true),
        onError:   () => toast.error("Failed to submit feedback"),
      }
    );
  };

  // ── guards ────────────────────────────────────────────────────────────────
  if (isLoading)  return <FeedbackSkeleton />;
  if (submitted)  return <FeedbackSuccess />;
  if (isError || !location) {
    return (
      <FeedbackError
        message={
          (error as any)?.response?.data?.message ??
          "This feedback link is unavailable."
        }
      />
    );
  }

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white flex items-start justify-center px-4 py-12">
      <div className="w-full max-w-sm my-auto">

        <BusinessInfo name={location.name} address={location.address} />

        <OverallRating value={overallRating} onChange={handleOverallChange} />

        {/* 4/5 stars → AI review */}
        {overallRating > 3 && (
          <div className="mt-6">
            <AiReviewBox
              review={aiReview}
              isLoading={isGeneratingReview}
              reviewLink={location.reviewLink ?? ""}
              regenCount={regenCount}
              maxRegen={MAX_REGEN}
              onRegenerate={handleReviewGeneration}
            />
          </div>
        )}

        {/* 1/2/3 stars → feedback form */}
        {overallRating > 0 && overallRating <= 3 && !shouldRedirect && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

            {/* full name */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                {...register("fullName")}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-gray-300 focus:outline-none"
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>
              )}
            </div>

            {/* phone number */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Phone Number{" "}
                <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                {...register("phoneNumber")}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-gray-300 focus:outline-none"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-xs text-red-500">{errors.phoneNumber.message}</p>
              )}
            </div>

            {/* questions */}
            <QuestionList
              questions={questions}
              isLoading={questionsLoading}
              answers={answers}
              getAnswerValue={getAnswerValue}
              onAnswerChange={(id, value) =>
                setAnswers((prev) => ({ ...prev, [id]: value }))
              }
            />

            {/* comment */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Anything else you'd like to share?{" "}
                <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <textarea
                rows={3}
                placeholder="Tell us more..."
                {...register("comment")}
                className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-gray-300 focus:outline-none"
              />
              {errors.comment && (
                <p className="mt-1 text-xs text-red-500">{errors.comment.message}</p>
              )}
            </div>

            {/* submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-md bg-leaf-dark text-sm font-semibold text-white transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>

          </form>
        )}

        {/* footer */}
        {/* footer — always visible at bottom of card */}
        <Link href="/" target="_blank" className="flex items-center justify-center gap-1.5 pt-4 border-t border-gray-100 mt-4">
          <p className="text-xs text-gray-400">Powered by</p>
          <Image
            src={LogoImage}
            alt="Mango Review"
            className="h-18 w-20 rounded-md object-contain"
          />
        </Link>
      </div>
    </div>
  );
}