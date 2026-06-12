"use client";

import { useState } from "react";
import { useConfirmLocation, useMyLocations } from "@/hooks/location.hooks";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

export default function ExtractPreviewDialog({
  open,
  onOpenChange,
  closeAll,
  data,
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  closeAll:(val:boolean)=>void
  data: any;
}) {
  const { mutate, isPending } = useConfirmLocation();
  const { data:location, isLoading:locationLoading } = useMyLocations();
  const [nickname, setNickname] = useState("");
  const queryClient=useQueryClient();
  if (!data) return null;

  const handleConfirm = () => {
    
    if(location && !locationLoading){
      toast.success("You already have a location, delete that for adding new one");
      onOpenChange(false);
      return;
    }

    mutate(
      {
        ...data,
        nickname: nickname || undefined, 
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({queryKey:queryKeys.gbp.connection});
          setNickname("");
          onOpenChange(false);
          closeAll(false)
          toast.success("Location added successfully");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">

        <DialogHeader>
          <DialogTitle>Confirm Location</DialogTitle>
          <DialogDescription>
            Verify details and optionally add a nickname
          </DialogDescription>
        </DialogHeader>

        {/* Image */}
        {data.image && (
          <div className="w-full h-40 rounded-lg overflow-hidden border">
            <img
              src={data.image}
              alt={data.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Details */}
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Name</p>
            <p className="font-medium">{data.name}</p>
          </div>

          <div>
            <p className="text-muted-foreground text-xs">Address</p>
            <p className="font-medium">{data.address}</p>
          </div>

          {data.rating && (
            <div>
              <p className="text-muted-foreground text-xs">Rating</p>
              <p className="font-medium">
                {data.rating} ({data.totalReviews || 0})
              </p>
            </div>
          )}
        </div>

        <Separator />

       <div className="space-y-2">
        <p className="text-xs text-muted-foreground">
          Nickname (optional)
          <span className="block">
            Give this location a custom name to identify it easily later
          </span>
        </p>

        <Input
          placeholder={`e.g. ${data?.name || "Srinagar Store"}, Office Branch`}
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 ">
          <Button
            onClick={handleConfirm}
            disabled={isPending}
            className="w-full py-5 bg-leaf-dark!"
          >
            {isPending ? "Saving..." : "Confirm & Save"}
          </Button>

          <Button
            className="w-full py-5 bg-mango-orange!"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Not my location
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}