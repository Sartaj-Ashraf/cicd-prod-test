import { queryKeys } from "@/lib/query-keys";
import { confirmGbpLocation } from "@/services/location/location-services";
import customFetch from "@/utils/customFetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useLocations = (enabled:boolean) => {
  return useQuery({
    queryKey: ["gbp-locations"],
    queryFn: async () => {
      const res = await customFetch.get(`/google/locations`);
      return res.data.data;
    },
    retry:false,
    refetchOnMount:false,
    refetchOnWindowFocus:false,
    enabled
  });
};

export const useConfirmGbpLocation = (callbacks?: {
  onSuccess?: () => void
  onError?: (error: any) => void
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: confirmGbpLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.location.all,
        refetchType: 'all',
      });
      callbacks?.onSuccess?.()
    },
    onError: (error) => {
      callbacks?.onError?.(error)
    }
  });
};