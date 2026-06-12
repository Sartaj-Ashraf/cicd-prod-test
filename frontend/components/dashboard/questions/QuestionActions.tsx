"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Power } from "lucide-react";
import ConfirmModal from "../shared/ConfirmModal";

type Props = {
  isActive: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function QuestionActions({
  isActive,
  onToggle,
  onEdit,
  onDelete,
}: Props) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toggleOpen, setToggleOpen] = useState(false);

  const isActivating = !isActive;

  return (
    <>
 
      <div className=" flex gap-2">
        
        {/* Toggle Button */}
        <Button 
          size="sm" 
          onClick={() => setToggleOpen(true)} 
          className={isActive 
            ? "bg-destructive hover:bg-destructive/90" 
            : "bg-leaf-dark hover:bg-leaf-dark/90"
          }
        > 
          <Power className="h-5 w-5 shrink-0" /> 
          <span className="text-xs font-medium">{isActive ? "Deactivate" : "Activate"}</span>
        </Button>

        {/* Edit Button */}
        <Button
          size="sm"
          onClick={onEdit}
          className=" bg-mango-orange"
        >
          <Pencil className="h-5 w-5 shrink-0" />
          <span className="text-xs font-medium">Edit</span>
        </Button>

        {/* Delete Button */}
        <Button
          size="sm"
          variant="destructive"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="h-5 w-5 shrink-0" />
          <span className="text-xs font-medium">Delete</span>
        </Button>
      </div>


        <ConfirmModal
              open={deleteOpen}
              onCancel={() => setDeleteOpen(false)}
              onConfirm={onDelete}
              isLoading={false}
              texts={{
                heading: "Delete Question",
                description: "Are you sure you want to delete this question?",
                cancelText: "Cancel",
                confirmText: "Delete",
                loading: "Deleting...",
              }}
            />

      {/* ⚡ Toggle Confirm */}
      <ConfirmModal
        open={toggleOpen}
        onCancel={() => setToggleOpen(false)}
        onConfirm={() => {
          onToggle();
          setToggleOpen(false);
        }}
        isLoading={false}
        texts={{
          heading: isActivating ? "Activate Question?" : "Deactivate Question?",
          description: isActivating 
            ? "This question will become visible to users."
            : "This question will no longer be visible to users.",
          cancelText: "Cancel",
          confirmText: isActivating ? "Activate" : "Deactivate",
          loading: isActivating ? "Activating..." : "Deactivating...",
        }}
      />
    </>
  );
}