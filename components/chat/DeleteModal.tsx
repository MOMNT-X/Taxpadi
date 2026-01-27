"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  conversationTitle: string;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  conversationTitle,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onClose}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Modal */}
      <div
        className={cn(
          "relative bg-black",
          "rounded-2xl",
          "p-8",
          "shadow-2xl",
          "max-w-sm w-full mx-4",
          "animate-in fade-in-0 zoom-in-95 duration-200"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-white mb-4">
          Delete Chat?
        </h2>

        <p className="text-gray-300 text-sm mb-8 leading-relaxed">
          You cannot recover <span className="text-white font-medium">{conversationTitle}</span> once it has been deleted.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className={cn(
              "px-6 py-2.5",
              "rounded-full",
              "bg-white",
              "text-black",
              "hover:bg-gray-100",
              "transition-colors",
              "font-medium text-sm"
            )}
          >
            No, keep
          </button>
          <button
            onClick={handleConfirm}
            className={cn(
              "px-6 py-2.5",
              "rounded-full",
              "bg-red-600",
              "text-white",
              "hover:bg-red-700",
              "transition-colors",
              "font-medium text-sm"
            )}
          >
            Yes, delete
          </button>
        </div>
      </div>
    </div>
  );
};

