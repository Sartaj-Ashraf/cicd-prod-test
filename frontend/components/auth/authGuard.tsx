"use client";

import { useAuth } from "@/hooks/auth.hooks";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Loading from "@/app/loading"
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isDashboardRoute = pathname.startsWith("/dashboard");
  useEffect(() => {
    if (!isLoading && !data && isDashboardRoute) {
      router.replace("/auth/login"); 
    }
  }, [isLoading, data, isDashboardRoute, router]);

  // Show loader only for protected routes
  if (isLoading && isDashboardRoute) {
    return <Loading/>;
  }

  // Block ONLY protected routes
  if (!data && isDashboardRoute) {
    return null;
  }

  // ✅ Allow public + auth pages
  return <>{children}</>;
}