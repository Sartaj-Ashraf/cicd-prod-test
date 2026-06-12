import { CheckCircle, Star, Clock } from "lucide-react";

export default function FeedbackSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm text-center p-8 rounded-2xl border border-gray-300">

        <div className="relative w-18 h-18 mx-auto mb-6">
          <div className="absolute inset-1.5 rounded-full bg-green-200 opacity-50" />
          <div className="absolute inset-3 rounded-full bg-leaf-dark flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
        </div>

        <h2 className="text-xl! font-semibold text-gray-900 mb-2">Thank you!</h2>
        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
          Your feedback means a lot — we'll use it to keep improving.
        </p>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
            <Star className="w-4 h-4 text-leaf-dark shrink-0" />
            <span className="text-sm text-gray-500">Review submitted successfully</span>
          </div>

        </div>
      </div>
    </div>
  );
}