// app/(public)/pricing/page.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useActivePricing }     from "@/hooks/pricing.hook";
import { useSubscribeToPlan }   from "@/hooks/subscription.hook";
import { useAuth }              from "@/hooks/auth.hooks";
import type { PaymentStatus }   from "@/hooks/subscription.hook";

import DurationToggle        from "@/components/public/shared/pricing/Durationtoggle";
import PricingCard           from "@/components/public/shared/pricing/Pricingcard";
import PaymentStatusModal    from "@/components/public/shared/pricing/PaymentStatusModal";
import AutoPayModal          from "@/components/public/shared/pricing/AutoPayModal";
import PricingPageSkeleton   from "@/components/skeleton/Pricining";
import { DURATION_LABELS }   from "@/constants/pricing";

export default function PricingPage() {
  const { data = [], isLoading }        = useActivePricing();
  const { data: authData }              = useAuth();
  const [activeDuration, setActiveDuration] = useState("monthly");
  const hasInitialized                  = useRef(false);

  const [loadingPlanId, setLoadingPlanId]         = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus]         = useState<PaymentStatus>(null);
  const [paymentMessage, setPaymentMessage]       = useState<string | undefined>();
  const [retryPlan, setRetryPlan]                 = useState<any>(null);
  const [incompletePayment, setIncompletePayment] = useState(false);

  const [autoPayModal, setAutoPayModal]   = useState(false);
  const [selectedPlan, setSelectedPlan]   = useState<any>(null);

  useEffect(() => {
    const pendingId = sessionStorage.getItem("pendingSubId");
    if (pendingId) setIncompletePayment(true);
  }, []);

  const availableDurations = Object.keys(DURATION_LABELS).filter((key) =>
    data.some((plan: any) => plan.price?.[key])
  );

  useEffect(() => {
    if (availableDurations.length > 0 && !hasInitialized.current) {
      setActiveDuration(availableDurations[0] as string);
      hasInitialized.current = true;
    }
  }, [availableDurations]);

  const handleStatusChange = useCallback((status: PaymentStatus, message?: string) => {
    setPaymentStatus(status);
    setPaymentMessage(message);
    if (status !== "pending") setLoadingPlanId(null);
  }, []);

  const { mutate: subscribe } = useSubscribeToPlan(handleStatusChange);

  const triggerSubscribe = (plan: any, isAutoPay: boolean) => {
    setLoadingPlanId(plan._id);
    subscribe({
      planId:       plan._id,
      billingCycle: activeDuration,
      currency:     plan.currency ?? "INR",
      isAutoPay,
    });
  };

  const handlePlanClick = (plan: any) => {
    const priceEntry = plan.price?.[activeDuration];
    if (!priceEntry) return;
    setSelectedPlan(plan);
    setRetryPlan(plan);
    setAutoPayModal(true);
  };

  const handleAutoPayConfirm = () => {
    setAutoPayModal(false);
    triggerSubscribe(selectedPlan, true);
  };

  const handleManualPayConfirm = () => {
    setAutoPayModal(false);
    triggerSubscribe(selectedPlan, false);
  };

  const handleModalClose = () => {
    setPaymentStatus(null);
    setPaymentMessage(undefined);
    setLoadingPlanId(null);
  };

  const handleRetry = () => {
    setPaymentStatus(null);
    setPaymentMessage(undefined);
    if (retryPlan) handlePlanClick(retryPlan);
  };

  const isTrialEligible = (plan: any) =>
    !authData?.user?.hasEverSubscribed && plan.trial?.enabled === true;

  const selectedPriceEntry = selectedPlan?.price?.[activeDuration];
  const selectedAmount     = selectedPriceEntry?.discounted ?? selectedPriceEntry?.actual ?? 0;

  if (isLoading) {
    return (
      <div className="container px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <PricingPageSkeleton />
      </div>
    );
  }

  return (
    <main className="container px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 select-none">

      <PaymentStatusModal
        status={paymentStatus}
        message={paymentMessage}
        onClose={handleModalClose}
        onRetry={handleRetry}
      />

      {selectedPlan && (
        <AutoPayModal
          open={autoPayModal}
          isTrial={isTrialEligible(selectedPlan)}
          trialDays={selectedPlan.trial?.trialDays}
          planName={selectedPlan.name}
          amount={selectedAmount}
          currency={selectedPlan.currency ?? "INR"}
          billingCycle={activeDuration}
          onAutoPay={handleAutoPayConfirm}
          onManual={handleManualPayConfirm}
          onClose={() => setAutoPayModal(false)}
        />
      )}

      {incompletePayment && (
        <div className="mb-6 flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm">
          <span>⚠️</span>
          <span>You have an incomplete payment. Please try subscribing again.</span>
          <button
            onClick={() => {
              sessionStorage.removeItem("pendingSubId");
              setIncompletePayment(false);
            }}
            className="ml-auto text-amber-600 hover:text-amber-800 font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-leaf-dark/20 bg-card/60 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-leaf-dark">
          <div className="w-2 h-2 rounded-full bg-leaf-dark" />
          Simple Pricing
        </div>
      </div>

      <section className="text-center mb-12 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight text-foreground mb-5">
          Precision Pricing for{" "}
          <span className="block text-leaf-dark">Content Visionaries</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
          Select a plan that matches your scale. No hidden fees. No friction.
        </p>
      </section>

      {availableDurations.length > 1 && (
        <DurationToggle
          durations={availableDurations}
          active={activeDuration}
          labels={DURATION_LABELS}
          onChange={setActiveDuration}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        {data.map((plan: any) => (
          <PricingCard
            key={plan._id}
            plan={plan}
            activeDuration={activeDuration}
            durationLabel={DURATION_LABELS[activeDuration]}
            onClick={() => handlePlanClick(plan)}
            isLoading={loadingPlanId === plan._id}
            isTrialEligible={isTrialEligible(plan)}
          />
        ))}
      </div>

    </main>
  );
}