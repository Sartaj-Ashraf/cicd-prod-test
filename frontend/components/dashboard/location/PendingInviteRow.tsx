"use client";

import { useResendInvite } from "@/hooks/manager.hooks";
import { Button } from "@/components/ui/button";

export default function PendingInviteRow({ invite }: any) {
  const { mutate, isPending } = useResendInvite();

  return (
    <div className="flex items-center justify-between border rounded-md p-3">
      <div>
        <p className="text-sm font-medium">{invite.invitedEmail}</p>
        <p className="text-xs text-leaf-dark">Pending</p>
      </div>

      <Button
        size="sm"
        className="bg-leaf-dark"
        onClick={() => mutate(invite._id)}
        disabled={isPending}
      >
        Resend
      </Button>
    </div>
  );
}