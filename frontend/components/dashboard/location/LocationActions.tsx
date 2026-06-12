"use client";

import { useState } from "react";

import { useDeleteLocation }          from "@/hooks/location.hooks";
import { useToggleBadReviewLocation } from "@/hooks/location.hooks";
import { useAuth }                    from "@/hooks/auth.hooks";

import { Button }   from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import ConfirmModal         from "../shared/ConfirmModal";
import ManageManagersDialog from "./ManageManagersDialog";
import UpdateLocationDialog from "./UpdateLocationDialog";

import { Edit,  MoreHorizontalIcon, Shield, Trash2, Users } from "lucide-react";
import { useLocationContext } from "@/context/selectedLocation.context";
import LocationCardTooltip from "@/components/tooltips/LocationCardTooltip";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import customFetch from "@/utils/customFetch";

export default function LocationActions({ location }: { location: any }) {
  const [openDelete,   setOpenDelete]   = useState(false);
  const [openManagers, setOpenManagers] = useState(false);
  const [openEdit,     setOpenEdit]     = useState(false);
  const [confirmGuard, setConfirmGuard] = useState(false);

  const { setSelectedLocation }                            = useLocationContext();
  const { mutate: deleteLocation, isPending: isDeleting }  = useDeleteLocation();
  const { mutate: toggleLocation, isPending: isToggling }  = useToggleBadReviewLocation();
  const { data: authData }                                 = useAuth();
  const [openInfo, setOpenInfo] = useState(false);
  const queryClient=useQueryClient();


  const isGlobalEnabled   = authData?.user?.badReviewRedirectEnabled ?? false;
  const isLocationEnabled = location?.badReviewRedirect?.enabled     ?? false;

  const handleDelete = () => {
    deleteLocation(location._id, {
      onSuccess:async () => {
        queryClient.setQueryData(
          queryKeys.location.all,
          null
        );
        setOpenDelete(false);
        setSelectedLocation(null);
      },
    });
  };

  const handleGuardConfirm = () => {
    toggleLocation(
      { locationId: location._id, enabled: !isLocationEnabled },
      { onSettled: () => setConfirmGuard(false) }
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontalIcon />

          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-52">

          {/* edit */}
          <DropdownMenuItem
            className="gap-2 cursor-pointer"
            onClick={() => setOpenEdit(true)}
          >
            <Edit size={14} />
            Edit Location
          </DropdownMenuItem>

          {/* managee managers */}
          <DropdownMenuItem
            className="gap-2 cursor-pointer"
            onClick={() => setOpenManagers(true)}
          >
            <Users size={14} />
            Manage Managers
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* review fuard */}
          <DropdownMenuItem
  className={`gap-2 cursor-pointer ${
    !isGlobalEnabled ? "opacity-60" : ""
  }`}
  onSelect={(e) => {
    e.preventDefault();

    if (isGlobalEnabled) {
      setConfirmGuard(true);
    }
  }}
>
  <Shield size={14} />

  <div className="flex items-center justify-between w-full">
    <span>Review Guard</span>

    <div className="flex items-center gap-1">
      <span
        className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
          isLocationEnabled && isGlobalEnabled
            ? "bg-leaf-dark "
            : "bg-destructive "
        }`}
      >
        {isLocationEnabled && isGlobalEnabled ? "On" : "Off"}
      </span>

      <LocationCardTooltip
        openInfo={openInfo}
        setOpenInfo={setOpenInfo}
        isGlobalEnabled={isGlobalEnabled}
      />
    </div>
  </div>
</DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* delete */}
          <DropdownMenuItem
            className="gap-2 cursor-pointer text-destructive focus:text-destructive"
            onClick={() => setOpenDelete(true)}
          >
            <Trash2 size={14} />
            Delete Location
          </DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu>

      {/* dialogs */}
      <UpdateLocationDialog
        open={openEdit}
        onOpenChange={setOpenEdit}
        location={location}
      />

      <ManageManagersDialog
        open={openManagers}
        onOpenChange={setOpenManagers}
        location={location}
      />

      {/* delete confirm */}
      <ConfirmModal
        open={openDelete}
        onCancel={() => setOpenDelete(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        texts={{
          heading:     "Delete Location",
          description: "Are you sure you want to delete this location? This will remove all access and cannot be undone.",
          cancelText:  "Cancel",
          confirmText: "Delete",
          loading:     "Deleting...",
        }}
      />

      {/* review guard confirm */}
      <ConfirmModal
        open={confirmGuard}
        onCancel={() => setConfirmGuard(false)}
        onConfirm={handleGuardConfirm}
        isLoading={isToggling}
        texts={{
          heading:     isLocationEnabled ? "Disable Review Guard?" : "Enable Review Guard?",
          description: isLocationEnabled
            ? "Disabling Review Guard for this location means bad reviews (1–3 stars) will always stay private and never reach Google. Only happy customers (4–5 stars) will be directed to Google."
            : "Review Guard will send happy customers (4–5 stars) to Google while collecting negative feedback (1–3 stars) privately. Every 4th bad review is also sent to Google to keep this location's profile looking natural and credible.",
          cancelText:  "Cancel",
          confirmText: isLocationEnabled ? "Yes, Disable" : "Yes, Enable",
          loading:     "Saving...",
        }}
      />
    </>
  );
}