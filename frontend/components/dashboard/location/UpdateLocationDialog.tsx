"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useUpdateLocation } from "@/hooks/location.hooks";
import { toast } from "sonner";


export const updateLocationSchema = z.object({
  nickname: z
    .string()
    .min(2, "Nickname must be at least 2 characters")
    .max(50, "Too long")
    .or(z.literal("")),
});

type FormType = z.infer<typeof updateLocationSchema>;

export default function UpdateLocationDialog({
  open,
  onOpenChange,
  location,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  location: any;
}) {
  const { mutate, isPending } = useUpdateLocation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(updateLocationSchema),
    defaultValues: {
      nickname: location?.nickname || "",
    },
  });

  const onSubmit = (values: FormType) => {
    mutate(
      {
        id: location._id,
        data: {
          nickname: values.nickname || undefined,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          reset();
          toast.success("Nickname updated successfully");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xs">
            Update Nickname
            <span className="block text-xs text-muted-foreground font-normal truncate">
              {location.name}
            </span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div>
            <Input
              placeholder="Enter nickname"
              {...register("nickname")}
            />
            {errors.nickname && (
              <p className="text-xs text-red-500 mt-1">
                {errors.nickname.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-leaf-dark py-5"
          >
            {isPending ? "Updating..." : "Update"}
          </Button>

        </form>
      </DialogContent>
    </Dialog>
  );
}