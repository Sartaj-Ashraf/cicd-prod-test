"use client";

import { useEffect, useState } from "react";
import { useExtractLocation, useMyLocations } from "@/hooks/location.hooks";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import ExtractPreviewDialog from "./ExtractPreviewDialog";
import SelectLocationDialog from "./addLocationsFromGbp";
import { useSearchParams } from "next/navigation";

import {
  MapPin,
  Link2,
  Building2,
  ShieldCheck,
  Clock,
  Star,
  Image,
  ExternalLink,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

type Tab = "maps" | "gbp";

export default function AddLocationDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
}) {
  const [url, setUrl] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("maps");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [gbpLocations, setGbpLocations] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const connected = searchParams.get("connected");
  const { data:location, isLoading:locationLoading } = useMyLocations();
  const queryClient=useQueryClient();

  useEffect(() => {
    if (connected) {
      queryClient.setQueryData(queryKeys.gbp.connection,{
        connected:true
      })
      setGbpLocations(true);
    }
    console.log(queryClient.getQueryData(queryKeys.gbp.connection))
  }, [connected]);

  const { mutate, data, isPending } = useExtractLocation();

  const handleExtract = () => {
    if(!locationLoading && location){
       toast.success("You already have a location, delete that for adding new one");
       onOpenChange(false);
       return;
    }
    mutate(url, {
      onSuccess: () => {
        setPreviewOpen(true);
        setUrl("");
      },
    });
  };

  const addLocationsFromGbp = async () => {
    if(!locationLoading && location){
       toast.success("You already have a location delete that for adding new one");
       onOpenChange(false);
       return;
    }
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/google/connect`;
  };

  return (
    <>
      {gbpLocations && <SelectLocationDialog open={gbpLocations} onOpenChange={setGbpLocations} />}

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">

          {/* Header */}
          <DialogHeader className="px-6 pt-6 pb-0">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                <MapPin className="w-[18px] h-[18px] text-green-600" />
              </div>
              <div>
                <DialogTitle className="text-base font-medium leading-tight">
                  Add location
                </DialogTitle>
                <DialogDescription className="text-[13px] mt-0">
                  Paste a link or connect your Business Profile
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Tab switcher */}
          <div className="px-6 pt-4">
            <div className="grid grid-cols-2 gap-1.5 bg-muted rounded-lg p-1">
              <button
                onClick={() => setActiveTab("maps")}
                className={cn(
                  "flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-[13px] font-medium transition-all",
                  activeTab === "maps"
                    ? "bg-background text-foreground shadow-sm border border-border/40"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                Google Maps link
              </button>
              <button
                onClick={() => setActiveTab("gbp")}
                className={cn(
                  "flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-[13px] font-medium transition-all",
                  activeTab === "gbp"
                    ? "bg-background text-foreground shadow-sm border border-border/40"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Building2 className="w-3.5 h-3.5 shrink-0" />
                Business Profile
                <span className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded-full font-medium leading-none">
                  Best
                </span>
              </button>
            </div>
          </div>

          {/* Maps panel */}
          {activeTab === "maps" && (
            <div className="px-6 pt-4 pb-6 space-y-4">
              {/* Steps */}
              <div className="bg-muted/60 rounded-lg px-4 py-3 space-y-2.5">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                  How to get your link
                </p>
                {[
                  "Open Google Maps & search your business",
                  'Click "Share" → "Copy link"',
                  "Paste the link below",
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-background border border-border/60 text-[11px] font-medium text-muted-foreground flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-[13px] text-foreground">{step}</span>
                  </div>
                ))}
                <div className="border-t border-border/40 pt-2 mt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-[12px] text-blue-600 hover:text-blue-700 hover:bg-transparent font-normal"
                    onClick={() => window.open("https://maps.google.com", "_blank")}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Open Google Maps
                  </Button>
                </div>
              </div>

              {/* Input */}
              <div className="space-y-1.5">
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder="https://maps.google.com/..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="pl-9 py-5 text-[13px]"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground pl-0.5">
                  Example: https://maps.app.goo.gl/abc123
                </p>
              </div>

              <Button
                onClick={handleExtract}
                disabled={!url || isPending}
                className="w-full py-5 bg-green-700 hover:bg-green-800 text-white disabled:opacity-40"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Extracting details…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Extract location
                  </>
                )}
              </Button>
            </div>
          )}

          {/* GBP panel */}
          {activeTab === "gbp" && (
            <div className="px-6 pt-4 pb-6 space-y-4">
              {/* Value prop */}
              <div className="bg-green-50 border border-green-200/70 rounded-lg p-3.5 flex gap-3">
                <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13px] font-medium text-green-800">
                    More accurate & faster
                  </p>
                  <p className="text-[12px] text-green-700/80 mt-0.5 leading-relaxed">
                    Imports verified data — hours, photos, and reviews — automatically.
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                {[
                  { icon: Clock, label: "Auto-sync business hours & info" },
                  { icon: Star, label: "Pull in reviews & ratings" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2.5 px-3 py-2.5 bg-muted/60 rounded-lg"
                  >
                    <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-[13px] text-foreground">{label}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Button
                  onClick={addLocationsFromGbp}
                  className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                >
                  {/* Google "G" icon */}
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff" fillOpacity=".8" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#fff" fillOpacity=".6" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff" fillOpacity=".6" />
                  </svg>
                  Connect Google Business Profile
                </Button>
                <p className="text-center text-[11px] text-muted-foreground">
                  You'll be redirected to Google to authorise access
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ExtractPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        closeAll={onOpenChange}
        data={data}
      />
    </>
  );
}