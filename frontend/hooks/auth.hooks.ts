"use client"
import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query-keys"
import { me } from "@/services/auth/auth.services"
import { MeResponse } from "@/types/auth/auth.types"

export const useAuth= ()=>{
    return useQuery<MeResponse>({
        queryKey:queryKeys.auth.me,
        queryFn:me,
        staleTime:15*60*1000,
        retry:false,
        refetchOnWindowFocus:true,
    })
}   