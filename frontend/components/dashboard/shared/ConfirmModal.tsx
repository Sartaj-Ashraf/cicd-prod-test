"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

interface Props {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  isLoading: boolean
  texts: {
    heading: string
    description: string
    cancelText: string
    confirmText: string
    loading: string
  }
}

export default function ConfirmModal({
  open,
  onConfirm,
  onCancel,
  isLoading,
  texts,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-sm">

        <DialogHeader>
          <DialogTitle className="text-center font-semibold text-2xl!">{texts.heading}</DialogTitle>
          <DialogDescription className="text-center text-xs!">
            {texts.description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button variant="outline" onClick={onCancel} className="text-sm">
            {texts.cancelText}
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading} className="text-sm">
            {isLoading ? texts.loading : texts.confirmText}
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}