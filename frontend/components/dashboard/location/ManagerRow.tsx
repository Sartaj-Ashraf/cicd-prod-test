"use client";

import { useState } from "react";
import { useDeleteManager } from "@/hooks/manager.hooks";
import ConfirmModal from "../shared/ConfirmModal";
import { Button } from "@/components/ui/button";

export default function ManagerRow({ manager, locationId }: any) {
  const [open, setOpen] = useState(false);
  const { mutate :deleteManager, isPending } = useDeleteManager(locationId);

  return (
    <>
      <div className="flex items-center justify-between border rounded-md p-3">
        <div>
          <p className="text-sm font-medium">
            {manager.userId?.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {manager.userId?.email}
          </p>
        </div>

        <Button size="sm" variant="destructive" onClick={() => setOpen(true)}>
          Remove
        </Button>
      </div>

      <ConfirmModal
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={() =>
          deleteManager(manager._id, {
            onSuccess: () => setOpen(false),
          })
        }
        isLoading={isPending}
        texts={{
          heading: "Remove Manager",
          description: "Are you sure you want to remove this manager?",
          cancelText: "Cancel",
          confirmText: "Remove",
          loading: "Removing...",
        }}
      />
    </>
  );
}