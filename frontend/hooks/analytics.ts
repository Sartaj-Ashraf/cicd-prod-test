"use client"
import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query-keys"
import { AnalysisData } from "@/types/dashboard/Analytics.types"
import { getAnalyticsData } from "@/services/analytics/analytics.service"
import { getAnalytics } from "@/services/analytics/analytics.service"

export const useAnalytics = (
  placeId: string,
  locationId: string
) => {
  return useQuery<AnalysisData>({
    queryKey: [queryKeys.analytics.data, placeId, locationId],
    queryFn: () => getAnalyticsData(placeId, locationId),
    staleTime: 15 * 60 * 1000,
    enabled: false, 
  });
};

export const useLocationAnalytics = (locationId: string) => {
    return useQuery({
        queryKey: queryKeys.analytics.location(locationId),

        queryFn: () => getAnalytics(locationId),

        enabled: !!locationId,

        staleTime: 15 * 60 * 1000,

        retry: false,

        refetchOnWindowFocus: true,
    })
}