"use client";

import { useLocationContext } from "@/context/selectedLocation.context";
import { queryKeys } from "@/lib/query-keys";
import { getAnalyticsData } from "@/services/analytics/analytics.service";
import { queryClient } from "@/utils/query-client";
import { toast } from "sonner";

type AnalyticsBtnProps = {
  onClick?: () => void;
  loading:boolean
};

const AnalyticsBtn = ({
    onClick,
    loading=false
}: AnalyticsBtnProps) => {

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="bg-gradient-to-br from-leaf-dark to-leaf-light text-white px-8 py-3 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
    >
      {loading ? "Loading..." : "Generate Analytics"}
    </button>
  );
};

export default AnalyticsBtn;