import {  useQuery } from "@tanstack/react-query";
import { getActivePricing } from "@/services/public/pricing-services";
import { queryKeys } from "@/lib/query-keys";

export const useActivePricing = () => {
  return useQuery({
    queryKey: queryKeys.pricing.active,
    queryFn: getActivePricing,
    staleTime: 15 * 60 * 1000, 
    gcTime: 30 * 60 * 1000,
  });
}

