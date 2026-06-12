"use client";

import { useEffect, useState }          from "react";
import { useMyLocations }               from "@/hooks/location.hooks";
import { useToggleBadReviewGlobal }     from "@/hooks/location.hooks";
import { useAuth }                      from "@/hooks/auth.hooks";
import { useRouter }                    from "next/navigation";

import {
  Table, TableBody, TableHead,
  TableHeader, TableRow,
}                                       from "@/components/ui/table";
import { Button }                       from "@/components/ui/button";
import { Card, CardContent }            from "@/components/ui/card";
import { Label }                        from "@/components/ui/label";
import ConfirmModal      from "@/components/dashboard/shared/ConfirmModal";

import LocationRow       from "@/components/dashboard/location/LocationRow";
import LocationCard      from "@/components/dashboard/location/LocationCard";
import AddLocationDialog from "@/components/dashboard/location/AddLocationDialog";
import LocationGlobalTooltip from "@/components/tooltips/LocationGlobalTooltip"
import LocationSkeleton  from "@/components/skeleton/location";
import { useCheckGbpConnection } from "@/hooks/location.hooks";

const LocationsPage = () => {
  const { data:location, isLoading:locationLoading }    = useMyLocations();
  const { data: authData, isLoading: authLoading }      = useAuth();
  const { mutate: toggleGlobal, isPending: isToggling } = useToggleBadReviewGlobal();
  const {data,isLoading}=useCheckGbpConnection();
  const router    = useRouter();
  const [openAdd, setOpenAdd]           = useState(false);
  const [confirmOpen, setConfirmOpen]   = useState(false);


  if (authData?.user.role !== "admin" && !authLoading) {
    router.push("/dashboard");
    return null;
  }

  const isGlobalEnabled = authData?.user?.badReviewRedirectEnabled ?? false;

  const handleConfirm = () => {
    toggleGlobal(!isGlobalEnabled, {
      onSettled: () => setConfirmOpen(false),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto bg-card p-4 md:p-8 gap-4 grid">

        {/* Header */}
        <div className="md:mb-8 flex-col flex md:flex-row gap-2 md:items-center justify-between">
          <div>
            <h4 className="font-bold">Locations</h4>
            <p className="text-sm text-muted-foreground mt-2">
              Manage your saved locations
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-end">

            {/* bad review redirect toggle */}
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2">

             <div className="flex items-center gap-2"    
              onClick={() => setConfirmOpen(true)}>
               <Label
                htmlFor="bad-review-global"
                className="text-sm text-muted-foreground cursor-pointer"
              >
              Review Guard</Label>

              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                isGlobalEnabled
                  ? "bg-leaf-dark text-white"
                  : "bg-destructive text-white"
              }`}>
                {isGlobalEnabled ? "On" : "Off"}
              </span>
             </div>

            <LocationGlobalTooltip/>

            </div>

            <Button
              className="py-5 bg-mango-orange!"
              onClick={() => setOpenAdd(true)}
            >
              Add Location
            </Button>
          </div>
        </div>

        {/* Content */}
        <Card>
          <CardContent className="md:p-4">

            {(locationLoading || authLoading) && (
              <LocationSkeleton />
          )}
             

            {!locationLoading && !authLoading && !location && (
              <div className="text-sm text-muted-foreground">
                No locations added yet
              </div>
            )}

            {!locationLoading && location &&
              <LocationCard location={location} gbpConnection={data?.connected} />
            }

          </CardContent>
        </Card>
               
             


        <AddLocationDialog open={openAdd} onOpenChange={setOpenAdd} />
        
        
        <ConfirmModal
          open={confirmOpen}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmOpen(false)}
          isLoading={isToggling}
          texts={{
            heading:     isGlobalEnabled ? "Disable Review Guard?" : "Enable Review Guard?",
            description: isGlobalEnabled
          ? "Disabling Review Guard means bad reviews (1–3 stars) will always stay private and never reach Google. Only your happy customers (4–5 stars) will be directed to Google. Note: a profile with only perfect ratings can appear suspicious to Google and may be flagged."
          : "Review Guard sends happy customers (4–5 stars) to Google while collecting negative feedback (1–3 stars) privately. Every 4th bad review is also sent to Google to keep your profile looking natural and credible — a profile with only 5-star reviews can appear suspicious to Google and may be ranked lower.",
            cancelText:  "Cancel",
            confirmText: isGlobalEnabled ? "Yes, Disable" : "Yes, Enable",
            loading:     "Saving...",
          }}
        />

      </div>
    </div>
  );
};

export default LocationsPage;