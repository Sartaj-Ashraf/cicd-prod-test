// hooks/manager.hooks.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  inviteManagerApi,
  resendInviteApi,
  getManagersByLocationApi,
  deleteManagerApi,
  acceptInviteApi,
} from "@/services/manager/manager.service";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "sonner";


export const useManagers = (locationId?: string) => {
  return useQuery({
    queryKey: queryKeys.manager.byLocation(locationId as string),
    queryFn: () => getManagersByLocationApi(locationId as string),
    enabled: !!locationId,
  });
};


export const useInviteManager = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: inviteManagerApi,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({
        queryKey: queryKeys.manager.byLocation(variables.locationId),
      });

      toast.success("Invite sent successfully");
    },
  });
};


export const useResendInvite = () => {
  return useMutation({
    mutationFn: resendInviteApi,
    onSuccess: () => {
      toast.success("Invite resent successfully");
    },
  });
};


export const useDeleteManager = (locationId?: string) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteManagerApi,
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: queryKeys.manager.byLocation(locationId as string),
      });

      toast.success("Manager removed successfully");
    },
  });
};


export const useAcceptInvite = () => {
  return useMutation({
    mutationFn: acceptInviteApi,
    onSuccess: () => {
      toast.success("Invite accepted successfully");
    },
  });
};