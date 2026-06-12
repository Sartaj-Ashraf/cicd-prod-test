import { CheckCircle2, Loader2, XCircle } from "lucide-react";

 
 export const pricingConfig = (message?: string) => ({
  pending: {
    icon:     <Loader2 className="w-10 h-10 text-amber-500 animate-spin mx-auto mb-4" />,
    bg:       "bg-amber-50",
    border:   "border-amber-200",
    title:    "Processing Payment",
    subtitle: "Please wait while we confirm your payment...",
    color:    "text-amber-600",
  },
  success: {
    icon:     <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-4" />,
    bg:       "bg-green-50",
    border:   "border-green-200",
    title:    "Payment Successful!",
    subtitle: "Your subscription has been activated.",
    color:    "text-green-600",
  },
  failed: {
    icon:     <XCircle className="w-10 h-10 text-red-700 mx-auto" />,
    bg:       "bg-red-50",
    border:   "border-red-700",
    title:    "Payment Failed",
    subtitle: message ?? "Something went wrong with your payment.",
    color:    "text-red-700",
  },
});
