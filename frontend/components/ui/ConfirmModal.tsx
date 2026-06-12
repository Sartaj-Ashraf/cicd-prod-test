"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  isLoading?: boolean;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
  isLoading = false,
}: ConfirmModalProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener("mousedown", handler);
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("mousedown", handler);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        ref={ref}
        className="relative bg-card border border-border rounded-2xl shadow-xl shadow-black/10 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-center p-6">
          <h5 className="text-xl font-medium text-destructive">
            {title}
          </h5>
        </div>

        {/* Body */}
        <div className="px-6 pb-6">
          <p className="text-foreground text-base leading-relaxed text-center">
            {description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium cursor-pointer text-muted-foreground hover:bg-secondary hover:text-secondary-foreground rounded-lg transition-all duration-200 ease-in-out"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 text-sm font-medium cursor-pointer text-destructive-foreground bg-destructive rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-destructive-foreground/30 border-t-destructive-foreground rounded-full animate-spin" />
                {confirmText}
              </div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
    , document.body)
  );
};        
