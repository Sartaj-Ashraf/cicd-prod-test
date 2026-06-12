import { AlertTriangle, Info } from "lucide-react";

export default function FeedbackError({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-300 bg-white p-8 text-center ">

        <div className="relative w-18 h-18 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full opacity-60" />
          <div className="absolute inset-1.5 rounded-full bg-red-200 opacity-50" />
          <div className="absolute inset-3 rounded-full bg-red-500 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
        </div>

        <h2 className="text-xl! font-semibold tracking-tight text-gray-900 mb-2">
          Feedback unavailable
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-5">{message}</p>

        <div className="bg-red-50 rounded-xl px-4 py-3 mb-5 text-left flex items-start gap-2">
          <Info className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-xs text-red-700 leading-relaxed">
            The location may no longer be active, or this link has expired.
          </p>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-400">
    Looks like this link isn't set up yet, ask the business for a working one.
          </p>
        </div>
      </div>
    </div>
  );
}