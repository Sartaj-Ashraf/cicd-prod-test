"use client";

import { useState } from "react";
import { useManagers, useInviteManager } from "@/hooks/manager.hooks";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import ManagerRow from "./ManagerRow";
import PendingInviteRow from "./PendingInviteRow";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const inviteManagerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

type InviteFormType = z.infer<typeof inviteManagerSchema>;

export default function ManageManagersDialog({
  open,
  onOpenChange,
  location,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  location: any;
}) {
  const { data, isLoading } = useManagers(location._id);
  const { mutate, isPending } = useInviteManager();

  const [showInvite, setShowInvite] = useState(false);

  const managers = data?.data?.managers || [];
  const pendingInvites = data?.data?.pendingInvites || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteFormType>({
    resolver: zodResolver(inviteManagerSchema),
  });

  const onSubmit = (values: InviteFormType) => {
    mutate(
      {
        ...values,
        locationId: location._id,
      },
      {
        onSuccess: () => {
          reset();
          setShowInvite(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm">
            Managers - {location.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <Button
            className="w-full py-4 bg-mango-orange"
            onClick={() => setShowInvite((prev) => !prev)}
          >
            {showInvite ? "Cancel" : "Invite Manager"}
          </Button>

          {/* Invite Form */}
          {showInvite && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-3 border rounded-md p-3"
            >
              <div>
                <Input
                  placeholder="Manager name"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Input
                  placeholder="Manager email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-leaf-dark py-5"
              >
                {isPending ? "Sending..." : "Send Invite"}
              </Button>
            </form>
          )}

          {/* Loading */}
          {isLoading && (
            <p className="text-sm text-center text-muted-foreground">Loading...</p>
          )}

          {/* Empty */}
          {!isLoading && !managers.length && !pendingInvites.length && (
            <p className="text-sm text-center text-muted-foreground">
              No managers yet
            </p>
          )}

          {/* Managers */}
          {managers.map((m: any) => (
            <ManagerRow key={m._id} manager={m} locationId={location._id} />
          ))}

          {/* Pending Invites */}
          {pendingInvites.map((i: any) => (
            <PendingInviteRow key={i._id} invite={i} locationId={location._id} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}