import { useQuery } from "@tanstack/react-query";

import { creditsLeft } from "@/services/auth/auth.services";

import { queryKeys } from "@/lib/query-keys";

export const useCredits = () => {
  return useQuery({
    queryKey: queryKeys.credits.all,
    queryFn: creditsLeft,
  });
};