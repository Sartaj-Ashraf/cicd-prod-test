// components/public/shared/pricing/PricingCard.tsx
"use client";

import Link        from "next/link";
import { useAuth } from "@/hooks/auth.hooks";
import type { PricingCardProps } from "@/types/public/pricing.types";
import { Zap, Check, X }        from "lucide-react";
import { FEATURES_CONFIG, LIMITS_CONFIG } from "@/constants/pricing";

export default function PricingCard({
  plan,
  activeDuration,
  durationLabel,
  isLoading,
  isTrialEligible,
  onClick,
}: PricingCardProps) {
  const { data, isLoading: authLoading } = useAuth();

  const priceEntry = plan.price?.[activeDuration];
  if (!priceEntry) return null;

  const finalPrice  = priceEntry.discounted ?? priceEntry.actual;
  const hasDiscount = priceEntry.discounted !== null && priceEntry.discounted !== undefined;

  return (
    <div className={`
      relative bg-card rounded-2xl p-4 flex flex-col h-full border
      transition-all duration-300 overflow-hidden
      ${plan.isPopular
        ? "shadow-xl z-10 border-leaf-dark/30"
        : "border-border hover:shadow-lg"
      }
    `}>

      {plan.isPopular && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-leaf-dark to-leaf-light rounded-t-2xl" />
      )}

      <div className="flex justify-between items-center mb-5">
        <span className={`font-sans text-xs font-extrabold tracking-widest uppercase ${
          plan.isPopular ? "text-leaf-dark" : "text-muted-foreground"
        }`}>
          {plan.name}
        </span>
        {plan.isPopular && (
          <span className="bg-leaf-dark text-white px-3 py-1 rounded-md text-[10px] font-bold tracking-wide">
            MOST POPULAR
          </span>
        )}
      </div>

      {/* trial badge — no price, just days */}
      {isTrialEligible && plan.trial?.trialDays != null && (
        <div className="mb-3 inline-flex items-center gap-1.5 bg-leaf-dark/10 text-leaf-dark text-xs font-semibold px-3 py-1 rounded-full w-fit">
          <Zap size={11} />
          {plan.trial.trialDays}-day free trial
        </div>
      )}

      <div className="flex flex-wrap items-baseline gap-2 mb-3">
        {hasDiscount && (
          <span className="font-sans text-sm text-muted-foreground line-through">
            {plan.currency} {priceEntry.actual}
          </span>
        )}
        <span className="font-sans text-xl sm:text-2xl font-bold text-foreground">
          {plan.currency} {finalPrice}
        </span>
        <span className="text-muted-foreground text-sm">
          /{durationLabel.toLowerCase()}
        </span>
      </div>

      <p className="text-foreground text-sm mb-6">Tier {plan.tier} plan</p>

      <ul className="space-y-2.5 mb-4 grow">
        {LIMITS_CONFIG.map(({ key, icon: Icon, label, isStatic }) => {
          const val = plan.limits?.[key as keyof typeof plan.limits];

          if (isStatic) {
            if (val === null || val === undefined) {
              return (
                <li key={key} className="flex items-center gap-3 text-sm text-foreground">
                  <span className="shrink-0 w-5 h-5 rounded-xs flex items-center justify-center bg-leaf-dark/10">
                    <Icon size={12} className="text-leaf-dark" />
                  </span>
                  <span>Unlimited review analysis volume</span>
                </li>
              );
            }
            return (
              <li key={key} className="flex items-center gap-3 text-sm text-foreground">
                <span className="shrink-0 w-5 h-5 rounded-xs flex items-center justify-center bg-leaf-dark/10">
                  <Icon size={12} className="text-leaf-dark" />
                </span>
                <span>Analyze up to {val} reviews</span>
              </li>
            );
          }

          if (val === 0) {
            return (
              <li key={key} className="flex items-center gap-3 text-sm text-muted-foreground/50">
                <span className="shrink-0 w-5 h-5 rounded-xs flex items-center justify-center bg-muted">
                  <X size={11} className="text-destructive" />
                </span>
                <span className="line-through text-xs">
                  {label(0).replace("0 ", "No ")}
                </span>
              </li>
            );
          }

          if (val === null || val === undefined) {
            return (
              <li key={key} className="flex items-center gap-3 text-sm text-foreground">
                <span className="shrink-0 w-5 h-5 rounded-xs flex items-center justify-center bg-leaf-dark/10">
                  <Icon size={12} className="text-leaf-dark" />
                </span>
                <span>
                  Unlimited {label(0)
                    .replace(/^0\s*/, "")
                    .toLowerCase()
                    .replace("/ month", "/ month")}
                </span>
              </li>
            );
          }

          return (
            <li key={key} className="flex items-center gap-3 text-sm text-foreground">
              <span className="shrink-0 w-5 h-5 rounded-xs flex items-center justify-center bg-leaf-dark/10">
                <Icon size={12} className="text-leaf-dark" />
              </span>
              <span>{label(val as number)}</span>
            </li>
          );
        })}

        {FEATURES_CONFIG.map(({ key, icon: Icon, label }) => {
          const enabled = plan.features?.[key as keyof typeof plan.features];
          return (
            <li key={key} className={`flex items-center gap-3 text-sm ${
              enabled ? "text-foreground" : "text-muted-foreground/50"
            }`}>
              <span className={`shrink-0 w-5 h-5 rounded-xs flex items-center justify-center ${
                enabled ? "bg-leaf-dark/10" : "bg-muted"
              }`}>
                {enabled
                  ? <Icon size={12} className="text-leaf-dark" />
                  : <X size={11} className="text-destructive" />
                }
              </span>
              <span className={enabled ? "" : "line-through text-xs"}>
                {label}
              </span>
            </li>
          );
        })}
      </ul>

      {plan.notes && plan.notes.length > 0 && (
        <div className="mb-6 p-2 rounded-xl bg-muted/50 border border-border/60">
          <p className="text-xs font-medium tracking-wider text-muted-foreground mb-2">
            Plan Highlights
          </p>
          <ul className="space-y-2">
            {plan.notes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-foreground">
                <Check size={11} className="shrink-0 mt-0.5 text-leaf-dark" />
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data?.user ? (
  <button
  onClick={() => onClick(plan)}
  disabled={isLoading || authLoading}
  className={`
    w-full py-4 rounded-xl cursor-pointer font-sans text-sm font-bold
    transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
    ${plan.isPopular
      ? "bg-linear-to-br from-leaf-dark to-leaf-light text-white shadow-lg hover:scale-[1.02] hover:shadow-xl"
      : "border border-border text-foreground hover:bg-accent hover:border-muted"
    }
  `}
>
  {isLoading
    ? "Processing..."
    : isTrialEligible && plan.trial?.enabled && plan.trial?.trialDays != null
      ? `Start ${plan.trial.trialDays}-day free trial`
      : "Choose Plan"
  }
</button>
      ) : (
      <Link
  href="/auth/login?path=pricing"
  className={`
    block text-center w-full py-4 rounded-xl font-sans text-sm font-bold
    transition-all duration-200
    ${plan.isPopular
      ? "bg-linear-to-br from-leaf-dark to-leaf-light text-white shadow-lg hover:scale-[1.02] hover:shadow-xl"
      : "border border-border text-foreground hover:bg-accent hover:border-muted"
    }
  `}
>
  {plan.trial?.enabled && plan.trial?.trialDays != null
    ? `Start ${plan.trial.trialDays}-day free trial`
    : "Choose Plan"
  }
</Link>
      )}
    </div>
  );
}