"use client";

import { PaymentStatusModalProps }         from "@/types/public/pricing.types";
import { pricingConfig } from "../../utils/pricingConfig";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function PaymentStatusModal({
  status,
  message,
  onClose,
  onRetry,
}: PaymentStatusModalProps) {
    const router  = useRouter();

  const current = pricingConfig(message)[status!];

 useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        onClose();
        router.push("/dashboard");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  if (!status) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={status !== "pending" ? onClose : undefined}
      />

      <div className="relative bg-white rounded-2xl border border-gray-200 shadow-xl p-8 w-full max-w-sm mx-4 text-center overflow-hidden">

        <div className={`absolute top-0 left-0 right-0 h-1.5 ${
          status === "success" ? "bg-leaf-dark" :
          status === "failed"  ? "bg-red-700"   :
          "bg-amber-400"
        } rounded-t-2xl`} />

        {/* icon */}
        <div className={`w-16 h-16 rounded-full  flex items-center justify-center mx-auto mb-5 mt-2`}>
          {current.icon}
        </div>

        {/* title */}
        <h4 className={` font-semibold mb-2 ${current.color} `}>
          {current.title}
        </h4>

        {/* subtitle */}
        <p className="text-gray-400 text-sm mb-6">
          {current.subtitle}
        </p>

        {/* success */}
        {status === "success" && (
          <p className="text-xs text-gray-400 tracking-wide">
            Redirecting to dashboard...
          </p>
        )}

        {/* failed */}
        {status === "failed" && (
          <div className="flex flex-col gap-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="bg-linear-to-br from-leaf-dark to-leaf-light text-white cursor-pointer  py-3.5 rounded-xl border border-gray-200 "
              >
                Try Again
              </button>
            )}
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-xl border border-gray-200 text-gray-500 font-semibold text-sm hover:bg-gray-50 transition-colors cursor-pointer "
            >
              Cancel
            </button>
          </div>
        )}

        {/* pending */}
        {status === "pending" && (
          <p className="text-xs text-gray-400 tracking-wide">
            Do not close or refresh this page
          </p>
        )}

      </div>
    </div>
  );
}