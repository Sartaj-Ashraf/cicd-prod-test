"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useConfirmGbpLocation, useLocations } from "@/hooks/gbpLocations";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type GBPSelection = {
  accountId: string;
  locationId: string;
  title: string;
};

export default function SelectLocationDialog({ open, onOpenChange }: Props) {
  const { data: locations = [], isLoading,isError,error } = useLocations(open);
  const [selected, setSelected] = useState<GBPSelection | null>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router=useRouter();
  const pathname=usePathname();

  const { mutateAsync } = useConfirmGbpLocation({
    onSuccess: () => {
      onOpenChange(false);
      router.replace(pathname)
      toast.success('Successfully added the locations')
    },
    onError: (error) => {
      router.replace(pathname)
      console.error('Failed to confirm locations:', error)
  }
})
 
  useEffect(() => {
    if (isError) {
        router.replace(pathname)
        toast.error(error.message);
      }
    }, [isError, error]);

  
  const isSelected = (locationId: string) =>{
    return selected?.locationId === locationId;
  }

  const toggleLocation = (location: any) => {
    if (isSelected(location.name)) {
      setSelected(null);
    } else {
      setSelected(
        {
          accountId: location.accountId,
          locationId: location.name,
          title: location.title,
        },
      );
    }
  };


  const handleContinue = async () => {
    try{
      if(!selected){
        toast.error("Please Select a location");
        return;
      }
      setIsSubmitting(true);
      await mutateAsync(selected);
    }
    catch (error) {
      console.error("Failed to confirm locations:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
      
    

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Select Your Locations</DialogTitle>
          <DialogDescription>
            Choose the Google Business Profile locations you want to manage.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 max-h-[400px] overflow-y-auto">
     {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}

      {!isLoading && isError && locations.length === 0 && (
        <div className="rounded-md border p-4 text-sm text-muted-foreground">
          This Google account doesn't have any Business Profile locations.
        </div>
      )}

      {!isLoading &&
        !isError &&
        locations.map((location: any) => (
          <div
            key={location.name}
            onClick={() => toggleLocation(location)}
            className={`
              cursor-pointer rounded-xl border p-4 transition-all
          ${
            isSelected(location.name)
              ? "border-leaf-main bg-leaf-main/10"
              : "hover:border-leaf-main/40"
          }
        `}
      >
           <div className="flex gap-3">
              <Checkbox checked={isSelected(location.name)} />
              <div>
                <h6>{location.title}</h6>
                <p className="text-xs text-muted-foreground mt-1">
              {location.accountId}
                </p>
              </div>
            </div>
          </div>
        ))}
    </div>

        <Button
          disabled={!selected || isSubmitting}
          className="w-full bg-leaf-dark!"
          onClick={handleContinue}
        >
          {isSubmitting ? 
            <div className="flex gap-2 items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            Saving...
          </div> : 
        `Continue ${selected?`(${selected?.title})`:""}`}
        </Button>
      </DialogContent>
    </Dialog>
  );
}