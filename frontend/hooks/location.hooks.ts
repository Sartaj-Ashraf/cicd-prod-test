import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  extractLocation,
  confirmLocation,
  getMyLocations,
  getLocationById,
  updateLocation,
  deleteLocation,
    toggleBadReviewRedirectGlobal,
  toggleBadReviewRedirectLocation,
  getGbpConnection,
} from "@/services/location/location-services";
import { queryKeys } from "@/lib/query-keys";

export const useExtractLocation = () => {
  return useMutation({
    mutationFn: extractLocation,
  });
};

export const useConfirmLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: confirmLocation,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.location.all,
      });
    }
  });
};

export const useCheckGbpConnection = ()=>{
   return useQuery({
    queryKey: queryKeys.gbp.connection,
    queryFn: getGbpConnection,
    staleTime: 7*24*60 * 60 * 1000,
  });
}

export const useMyLocations = () => {
  return useQuery({
    queryKey: queryKeys.location.all,
    queryFn: getMyLocations,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

};

export const useLocationById = (id: string) => {
  return useQuery({
    queryKey: queryKeys.location.single(id),
    queryFn: () => getLocationById(id),
    enabled: !!id,
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLocation,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.location.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.location.single(variables.id),
      });
    },
  });
};

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLocation,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.location.all,
      });
    }
  });
};


export const useToggleBadReviewGlobal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (enabled: boolean) => toggleBadReviewRedirectGlobal(enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
};

export const useToggleBadReviewLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ locationId, enabled }: { locationId: string; enabled: boolean }) =>
      toggleBadReviewRedirectLocation(locationId, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.location.all });
    },
  });

};