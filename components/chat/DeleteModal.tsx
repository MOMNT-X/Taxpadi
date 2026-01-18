"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 dark:bg-black/80" />

      {/* Modal */}
      <div
        className={cn(
          "relative bg-white dark:bg-gray-800",
          "rounded-lg",
          "p-6",
          "shadow-xl",
          "max-w-md w-full mx-4",
          "animate-in fade-in-0 zoom-in-95 duration-200"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Delete Chat?
        </h2>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className={cn(
              "px-4 py-2",
              "rounded-lg",
              "bg-gray-100 dark:bg-gray-700",
              "text-gray-900 dark:text-gray-100",
              "hover:bg-gray-200 dark:hover:bg-gray-600",
              "transition-colors",
              "font-medium"
            )}
          >
            No, keep
          </button>
          <button
            onClick={handleConfirm}
            className={cn(
              "px-4 py-2",
              "rounded-lg",
              "bg-red-600 dark:bg-red-500",
              "text-white",
              "hover:bg-red-700 dark:hover:bg-red-600",
              "transition-colors",
              "font-medium"
            )}
          >
            Yes, delete
          </button>
        </div>
      </div>
    </div>
  );
};

