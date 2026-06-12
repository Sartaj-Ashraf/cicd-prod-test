"use client";

import { useState }                                     from "react";
import {
  useMySubscriptions,
  useSetActiveSubscription,
  useCancelAutopay,
}                                                        from "@/hooks/subscription.hook";
import ConfirmModal                                      from "../shared/ConfirmModal";
import { Card, CardContent }                            from "@/components/ui/card";
import { Button }                                       from "@/components/ui/button";
import { Badge }                                        from "@/components/ui/badge";
import { Progress }                                     from "@/components/ui/progress";
import {
  Dialog, DialogContent,
  DialogHeader, DialogTitle,
}                                                        from "@/components/ui/dialog";
import { Zap, RefreshCw, CheckCircle2, XCircle }        from "lucide-react";
import { toast }                                         from "sonner";
import { useAuth }                                       from "@/hooks/auth.hooks";
import { LIMITS_CONFIG, FEATURES_CONFIG }               from "@/constants/pricing";
import { useCredits } from "@/hooks/useCredits.hooks";

// ─── key maps ─────────────────────────────────────────────────────────────────

const LIMIT_TO_USAGE_KEY: Record<string, string> = {
  analysesPerMonth:             "analyses",
  aiRepliesPerMonth:            "aiReplies",
  totalScansPerMonth:           "scans",
  aiReviewsPerMonth:            "aiReviews",
  aiAutoRepliesPerMonth:        "aiAutoReplies",
  whatsappMessagesPerMonth:     "whatsappMessages",
  aiCompetitorAnalysisPerMonth: "aiCompetitorAnalysis",
};

const LIMIT_TO_CYCLE_KEY: Record<string, string> = {
  analysesPerMonth:             "analyses",
  aiRepliesPerMonth:            "aiReplies",
  totalScansPerMonth:           "totalScans",
  aiReviewsPerMonth:            "aiReviews",
  aiAutoRepliesPerMonth:        "aiAutoReplies",
  whatsappMessagesPerMonth:     "whatsappMessages",
  aiCompetitorAnalysisPerMonth: "aiCompetitorAnalysis",
};

// ─── helpers ──────────────────────────────────────────────────────────────────

const formatDate = (date?: string | null) => {
  if (!date) return "-";
  const d     = new Date(date);
  const day   = d.getDate().toString().padStart(2, "0");
  const month = d.toLocaleString("en-US", { month: "short" });
  const year  = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const calcPercent = (used: number, total: number | null) => {
  if (!total || total === 0) return 0;
  return Math.min((used / total) * 100, 100);
};

const getUsageLabel = (label: (v: number) => string) =>
  label(1).replace(/^1\s*/, "");

// ─── component ────────────────────────────────────────────────────────────────

const UserSubscriptionCard = () => {
  const { data }                                           = useMySubscriptions();
  const { mutate: setActiveSubscription, isPending }       = useSetActiveSubscription();
  const { mutate: cancelAutopay, isPending: isCancelling } = useCancelAutopay();
  const { data: authData, isLoading: authLoading }         = useAuth();
    const {   refetch } = useCredits();

  const [selectedSub,   setSelectedSub]   = useState<any>(null);
  const [confirmActive, setConfirmActive] = useState<{ id: string; name: string } | null>(null);
  const [confirmCancel, setConfirmCancel] = useState<{
    id:      string;
    name:    string;
    endDate: string;
  } | null>(null);

  const subscriptions = data?.subscriptions ?? [];

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {subscriptions.map((sub: any) => (
          <Card
            key={sub.id}
            className={`rounded-xl border ${
              sub.isActive ? "border-leaf-dark!" : "border-mango-orange!"
            }`}
          >
            <CardContent className="p-4 space-y-4">

              {/* header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{sub.planName}</p>
                  <p className="text-xs text-muted-foreground">
                    {sub.billing.amount} {sub.currency} / {sub.billing.cycle ?? "-"}
                  </p>
                  {sub.billing.isActiveTrial && (
                    <p className="text-[11px] text-amber-500 mt-0.5">
                      Trial active — paid {sub.currency} {sub.billing.trialAmount},
                      auto charged {sub.currency} {sub.billing.amount}/{sub.billing.cycle} after
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-1">
                  {sub.isActive ? (
                    <Badge className="bg-leaf-dark px-3">Active</Badge>
                  ) : (!authLoading && authData?.user?.role === "admin") ? (
                    <Button
                      size="sm"
                      className="bg-mango-orange cursor-pointer"
                      onClick={() => setConfirmActive({ id: sub.id, name: sub.planName })}
                    >
                      Activate
                    </Button>
                  ) : null}

                  {/* autopay badge */}
                  <div className={`flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    sub.isAutoPay
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-400"
                  }`}>
                    <RefreshCw size={9} />
                    {sub.isAutoPay ? "Auto Pay ON" : "Auto Pay OFF"}
                  </div>

                  {/* trial badge */}
                  {sub.trial?.isTrial && !sub.trial?.isConverted && (
                    <div className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-600">
                      <Zap size={9} />
                      Trial — ends {formatDate(sub.trial.trialEndDate)}
                    </div>
                  )}
                </div>
              </div>

              {/* billing info */}
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Period: {formatDate(sub.cycle.startDate)} → {formatDate(sub.cycle.endDate)}</p>
                <p>Last charged: {formatDate(sub.billing.lastCharged)}</p>
                <p>Next billing: {formatDate(sub.nextBilling)}</p>
              </div>

              {/* usage */}
              <div className="space-y-2.5 text-xs">
                {LIMITS_CONFIG.map(({ key, label, icon: Icon, isStatic }) => {

                  // ── static capacity (reviewAnalysisVolume) ────────────
                  if (isStatic) {
                    const capacity = sub.snapshot?.limits?.reviewAnalysisVolume;
                    if (capacity === undefined) return null;
                    return (
                      <div key={key} className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <Icon size={11} className="text-muted-foreground" />
                          <span>Review Analysis Volume</span>
                        </div>
                        <span className="text-muted-foreground">
                          {capacity === null ? "∞ Unlimited" : `Up to ${capacity} reviews`}
                        </span>
                      </div>
                    );
                  }

                  // ── depletable usage ──────────────────────────────────
                  const usageKey    = LIMIT_TO_USAGE_KEY[key];
                  const item        = sub.usage?.[usageKey];
                  if (!item) return null;

                  const isUnlimited = item.total === null || item.total === undefined;
                  const pct         = calcPercent(item.used, item.total);
                  const isWarning   = !isUnlimited && pct >= 80;
                  const isDanger    = !isUnlimited && pct >= 95;

                  return (
                    <div key={key}>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1.5">
                          <Icon size={11} className="text-muted-foreground" />
                          <span>{getUsageLabel(label)}</span>
                        </div>
                        <span className={
                          isDanger  ? "text-red-500"   :
                          isWarning ? "text-amber-500" :
                          "text-muted-foreground"
                        }>
                          {isUnlimited ? "∞ Unlimited" : `${item.used} / ${item.total}`}
                        </span>
                      </div>
                      {!isUnlimited && (
                        <Progress
                          value={pct}
                          className={`h-1.5 ${
                            isDanger  ? "[&>div]:bg-red-500"   :
                            isWarning ? "[&>div]:bg-amber-500" :
                            ""
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 py-5"
                  onClick={() => setSelectedSub(sub)}
                >
                  View Details
                </Button>

                {sub.isAutoPay && (
                  <Button
                    variant="outline"
                    className="flex-1 py-5 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                    onClick={() => setConfirmCancel({
                      id:      sub.id,
                      name:    sub.planName,
                      endDate: sub.endDate,
                    })}
                  >
                    Cancel Auto Pay
                  </Button>
                )}
              </div>

            </CardContent>
          </Card>
        ))}
      </div>

      {/* details dialog */}
      <Dialog open={!!selectedSub} onOpenChange={() => setSelectedSub(null)}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm">
              {selectedSub?.planName} Details
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">

            {/* features */}
            <div>
              <p className="text-sm font-medium mb-2">Features</p>
              <div className="grid grid-cols-2 gap-2">
                {FEATURES_CONFIG.map(({ key, label }) => {
                  const enabled = selectedSub?.snapshot?.features?.[key];
                  return (
                    <div key={key} className={`flex items-center gap-2 text-xs ${
                      enabled ? "text-foreground" : "text-muted-foreground/50"
                    }`}>
                      {enabled
                        ? <CheckCircle2 size={13} className="text-leaf-dark shrink-0" />
                        : <XCircle      size={13} className="text-muted-foreground/30 shrink-0" />
                      }
                      <span className={enabled ? "" : "line-through"}>{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* billing history */}
            <div>
              <p className="text-sm font-medium mb-2">Billing History</p>
              <div className="space-y-2">
                {selectedSub?.history?.payments?.map((p: any, i: number) => (
                  <div
                    key={i}
                    className="flex justify-between text-xs text-muted-foreground border border-border rounded-lg px-3 py-2"
                  >
                    <span>{formatDate(p.paidAt)}</span>
                    <span className="font-medium text-foreground">
                      {selectedSub?.currency} {p.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* current cycle usage */}
            <div>
              <p className="text-sm font-medium mb-2">Current Cycle Usage</p>
              <div className="space-y-2">
                {selectedSub?.history?.cycles?.map((cycle: any, i: number) => (
                  <div
                    key={i}
                    className="border border-leaf-dark/30 bg-leaf-dark/5 rounded-lg p-3 space-y-2 text-xs"
                  >
                    <p className="text-muted-foreground font-medium">
                      {formatDate(cycle.startDate)} → {formatDate(cycle.endDate)}
                      <span className="ml-2 text-leaf-dark">(current)</span>
                    </p>
                    <div className="grid gap-1">
                      {LIMITS_CONFIG.map(({ key, label, isStatic }) => {

                        // ── static capacity ───────────────────────────
                        if (isStatic) {
                          const capacity = selectedSub?.snapshot?.limits?.reviewAnalysisVolume;
                          if (capacity === undefined) return null;
                          return (
                            <div key={key} className="flex justify-between text-[11px]">
                              <span className="text-muted-foreground">
                                Review Analysis Volume
                              </span>
                              <span>
                                {capacity === null ? "∞" : `Up to ${capacity} reviews`}
                              </span>
                            </div>
                          );
                        }

                        // ── depletable usage ──────────────────────────
                        const cycleKey    = LIMIT_TO_CYCLE_KEY[key];
                        const data        = cycle[cycleKey];
                        if (!data) return null;

                        const isUnlimited = data.creditsTotal === null ||
                                            data.creditsTotal === undefined;

                        return (
                          <div key={key} className="flex justify-between text-[11px]">
                            <span className="text-muted-foreground">
                              {getUsageLabel(label)}
                            </span>
                            <span>
                              {isUnlimited
                                ? "∞"
                                : `${data.creditsUsed} / ${data.creditsTotal}`
                              }
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </DialogContent>
      </Dialog>

      {/* activate confirm */}
      <ConfirmModal
        open={!!confirmActive}
        onCancel={() => setConfirmActive(null)}
        onConfirm={() => {
          if (!confirmActive) return;
          setActiveSubscription(confirmActive.id, {
            onSuccess: () => {
              setConfirmActive(null);
              toast.success(`${confirmActive.name} activated`);
              refetch();
            },
          });
        }}
        isLoading={isPending}
        texts={{
          heading:     `Activate ${confirmActive?.name}?`,
          description: "This will set this as your active subscription.",
          cancelText:  "Cancel",
          confirmText: "Activate",
          loading:     "Activating...",
        }}
      />

      {/* cancel autopay confirm */}
      <ConfirmModal
        open={!!confirmCancel}
        onCancel={() => setConfirmCancel(null)}
        onConfirm={() => {
          if (!confirmCancel) return;
          cancelAutopay(confirmCancel.id, {
            onSuccess: () => {
              setConfirmCancel(null);
              toast.success(
                `Auto pay cancelled. Active until ${formatDate(confirmCancel.endDate)}`
              );
            },
            onError: () => {
              toast.error("Failed to cancel auto pay");
            },
          });
        }}
        isLoading={isCancelling}
        texts={{
          heading:     "Cancel Auto Pay?",
          description: `Your subscription stays active until ${formatDate(confirmCancel?.endDate)}. After that you'll need to renew manually.`,
          cancelText:  "Keep Auto Pay",
          confirmText: "Yes, Cancel",
          loading:     "Cancelling...",
        }}
      />
    </>
  );
};

export default UserSubscriptionCard;