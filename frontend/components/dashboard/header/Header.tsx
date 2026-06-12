"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";

import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Moon, Sun, } from "lucide-react";
import { useMyLocations } from "@/hooks/location.hooks";
import { useLocationContext } from "@/context/selectedLocation.context";
import { CreditsLeft } from "./creditsLimit/CreditsLeft";
import { useAuth } from "@/hooks/auth.hooks";
import { Badge } from "@/components/ui/badge";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { data , isLoading } = useMyLocations();
  const {data :authData} = useAuth()

  const { selectedLocation, setSelectedLocation } = useLocationContext();
  // Auto-select first branch

  useEffect(() => {
    if (data && !selectedLocation && !isLoading) {
      setSelectedLocation(data);
    }
  }, [data, isLoading]);


  return (
    <header className="flex items-center justify-between border-b border-border px-4 h-14 bg-background">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <SidebarTrigger />

       {data ? (
         <Badge>{data.name}</Badge>
) : (
  authData?.user.role === "admin" && (
    <Link href="/dashboard/locations">
      <Button
        size="sm"
        variant="outline"
        className="text-xs flex gap-1"
      >
        Add Location
      </Button>
    </Link>
  )
)}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        <CreditsLeft />
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Moon /> : <Sun />}
        </Button>
      </div>
    </header>
  );
}
