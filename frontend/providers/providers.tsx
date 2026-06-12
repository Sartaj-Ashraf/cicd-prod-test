"use client"
import { QueryProvider } from "./query-provider"
export const Providers = ({ children }: { children: React.ReactNode }) => {
     return (
        <QueryProvider>
            { children }
            </QueryProvider>
    )
}
   