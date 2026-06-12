// hooks/subscription.hook.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSubscriptionOrder,
  verifySubscriptionPayment,
  verifyAutopayPayment,
  getMySubscriptions,
  setActiveSubscription,
  cancelAutopay,
} from "@/services/subscription/subscription-services";
import { queryKeys }   from "@/lib/query-keys";
import { queryClient } from "@/utils/query-client";

export type PaymentStatus = "pending" | "success" | "failed" | null;

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as any).Razorpay)      return resolve(true);

    const script   = document.createElement("script");
    script.src     = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const useMySubscriptions = () => {
  return useQuery({
    queryKey:  queryKeys.subscription.my,
    queryFn:   getMySubscriptions,
    staleTime: 5 * 60 * 1000,
    gcTime:    10 * 60 * 1000,
  });
};

export const useSubscribeToPlan = (
  onStatusChange: (status: PaymentStatus, message?: string) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      planId,
      billingCycle,
      currency,
      isAutoPay,
    }: {
      planId:       string;
      billingCycle: string;
      currency:     string;
      isAutoPay:    boolean;
    }) => {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        onStatusChange("failed", "Failed to load payment gateway.");
        return;
      }

      const orderData = await createSubscriptionOrder({ planId, billingCycle, isAutoPay });
      if (!orderData) {
        onStatusChange("failed", "Failed to create order.");
        return;
      }

      sessionStorage.setItem("pendingSubId", orderData.subscriptionId);

      return new Promise((resolve, reject) => {
        const baseOptions = {
          key:      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          currency,
          name:     "Mango Review",
          theme:    { color: "#000000" },
          modal: {
            ondismiss: () => {
              sessionStorage.removeItem("pendingSubId");
              onStatusChange(null);
              reject(new Error("Payment cancelled"));
            },
          },
        };

        // ── trial → open Razorpay to save card → verify → activate ───────────
        if (orderData.isTrial) {
          const options = {
            ...baseOptions,
            subscription_id: orderData.razorpaySubscriptionId,
            handler: async (response: any) => {
              onStatusChange("pending");
              try {
                await verifyAutopayPayment({
                  razorpaySubscriptionId: response.razorpay_subscription_id,
                  razorpayPaymentId:      response.razorpay_payment_id,
                  razorpaySignature:      response.razorpay_signature,
                  subscriptionId:         orderData.subscriptionId,
                });
                sessionStorage.removeItem("pendingSubId");
                onStatusChange("success");
                resolve(true);
              } catch (err: any) {
                onStatusChange("failed", err?.message ?? "Verification failed");
                reject(err);
              }
            },
          };
          const rzp = new (window as any).Razorpay(options);
          rzp.on("payment.failed", (response: any) => {
            sessionStorage.removeItem("pendingSubId");
            onStatusChange("failed", response.error?.description ?? "Payment failed.");
            reject(new Error(response.error?.description));
          });
          rzp.open();
          return;
        }

        const handler = async (response: any) => {
          onStatusChange("pending");
          try {
            if (orderData.isAutoPay) {
              await verifyAutopayPayment({
                razorpaySubscriptionId: response.razorpay_subscription_id,
                razorpayPaymentId:      response.razorpay_payment_id,
                razorpaySignature:      response.razorpay_signature,
                subscriptionId:         orderData.subscriptionId,
              });
            } else {
              await verifySubscriptionPayment({
                razorpayOrderId:   response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                subscriptionId:    orderData.subscriptionId,
              });
            }
            sessionStorage.removeItem("pendingSubId");
            onStatusChange("success");
            resolve(true);
          } catch (err: any) {
            onStatusChange("failed", err?.message ?? "Verification failed");
            reject(err);
          }
        };

        // ── autopay → subscription_id ─────────────────────────────────────────
        if (orderData.isAutoPay) {
          const options = {
            ...baseOptions,
            subscription_id: orderData.razorpaySubscriptionId,
            handler,
          };
          const rzp = new (window as any).Razorpay(options);
          rzp.on("payment.failed", (response: any) => {
            sessionStorage.removeItem("pendingSubId");
            onStatusChange("failed", response.error?.description ?? "Payment failed.");
            reject(new Error(response.error?.description));
          });
          rzp.open();

        } else {
          // ── manual → order_id ───────────────────────────────────────────────
          const options = {
            ...baseOptions,
            order_id: orderData.razorpayOrderId,
            amount:   orderData.amount * 100,
            handler,
          };
          const rzp = new (window as any).Razorpay(options);
          rzp.on("payment.failed", (response: any) => {
            sessionStorage.removeItem("pendingSubId");
            onStatusChange("failed", response.error?.description ?? "Payment failed.");
            reject(new Error(response.error?.description));
          });
          rzp.open();
        }
      });
    },

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.subscription.my }),
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.me }),
      ]);
    },

    onError: (error: any) => {
      if (error.message !== "Payment cancelled") {
        onStatusChange("failed", error.message ?? "Something went wrong");
      }
    },
  });
};

export const useSetActiveSubscription = () => {
  return useMutation({
    mutationFn: setActiveSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscription.my });
    },
  });
};

export const useCancelAutopay = () => {
  return useMutation({
    mutationFn: cancelAutopay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscription.my });
    },
  });
};