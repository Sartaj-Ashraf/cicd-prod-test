"use client";

import Link from "next/link";
import Image from "next/image";
import toplogo from "@/public/MangoLogo.png";
import AnalyticsBtn from "./Analytics-btn";
import { toast } from "sonner";
import { useLocationContext } from "@/context/selectedLocation.context";
import { useRouter } from "next/navigation";
import { queryClient } from "@/utils/query-client";
import { queryKeys } from "@/lib/query-keys";
import { getAnalyticsData } from "@/services/analytics/analytics.service";
import { useState } from "react";
import AnalyticsLoading from "@/components/dashboard/Analytic/Analytics-loading";

const NoAnalyticsPage = () => {

    const { selectedLocation } = useLocationContext();
    const [isLoading,setIsLoading]=useState(false);
    const router = useRouter();

   const handleClick = async () => {

    // No location selected
    if (!selectedLocation) {

      toast.error(
        "You don't have a location yet. Please add a location first."
      );

      router.push("/dashboard/locations");

      return;
    }
    setIsLoading(true);
    const res = await getAnalyticsData(
      selectedLocation.placeId,
      selectedLocation._id
    );

    if (res.success) {
     queryClient.setQueryData(queryKeys.analytics.location(selectedLocation._id),res.data);
      queryClient.invalidateQueries({queryKey:queryKeys.credits.all})
      setIsLoading(false)
      toast.success("Analytics fetched successfully");
    }
  };
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center relative overflow-hidden bg-background">
      {/* ── Background blobs ── */}
      <div className="absolute w-96 h-96 rounded-full bg-leaf-main/5 -top-24 -left-24 pointer-events-none" />
      <div className="absolute w-72 h-72 rounded-full bg-mango-mid/8 -bottom-16 -right-16 pointer-events-none" />
      <div className="absolute w-48 h-48 rounded-full bg-mango-orange/5 top-1/3 left-[65%] pointer-events-none" />
      <div className="absolute w-32 h-32 rounded-full bg-leaf-light/10 bottom-1/4 left-[10%] pointer-events-none" />

      <div >
        <Image
          src={toplogo}
          alt="GrowUpReview Logo"
          width={110}
          height={110}
          className="mx-auto"
        />
      </div>
      {/* ── Headline ── */}
      <h1 className="text-3xl! md:text-4xl! font-extrabold text-base-black mb-4">
        No Analytics Found
      </h1>

      {/* ── Description ── */}
      <p className="max-w-2xl text-gray-medium leading-relaxed mb-8 text-xs! md:text-base">
        We couldn&apos;t find any analytics data for this location yet.
        Generate your first analytics report to unlock customer insights,
        review trends, growth opportunities, and AI-powered recommendations.
      </p>

     

      {/* ── CTA Buttons ── */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {!isLoading?<AnalyticsBtn  onClick={handleClick} loading={isLoading}/>:<AnalyticsLoading />}

        <Link
          href="/dashboard"
          className="border-2 border-mango-orange text-mango-orange px-8 py-3 rounded-md text-sm font-semibold hover:bg-mango-orange/5 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* ── Bottom dots ── */}
      <div className="flex gap-2 justify-center">
        {[
          "bg-leaf-light",
          "bg-leaf-main",
          "bg-mango-mid",
          "bg-mango-orange",
          "bg-mango-mid",
          "bg-leaf-main",
          "bg-leaf-light",
        ].map((cls, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full ${cls} opacity-80`}
          />
        ))}
      </div>

      {/* ── Footer ── */}
      <p className="mt-8 text-xs text-gray-light">
        &copy; {new Date().getFullYear()} GrowUpReview · Smart insights for
        smarter growth 🌱
      </p>
    </main>
  );
};

export default NoAnalyticsPage;