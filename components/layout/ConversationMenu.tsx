"use client";

import React, { useRef, useEffect } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConversationMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: () => void;
  onDelete: () => void;
  position?: { top: number; left: number };
}

export const ConversationMenu: React.FC<ConversationMenuProps> = ({
  isOpen,
  onClose,
  onRename,
  onDelete,
  position,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className={cn(
        "fixed z-[60] w-44 bg-neutral-800 rounded-lg shadow-2xl overflow-hidden",
        "border border-neutral-700",
        "animate-in fade-in-0 zoom-in-95 duration-150"
      )}
      style={position ? { top: `${position.top}px`, left: `${position.left}px` } : {}}
    >
      <button
        className={cn(
          "w-full flex items-center gap-3 px-4 py-2.5",
          "text-sm text-gray-300",
          "hover:bg-neutral-700 transition-colors"
        )}
        onClick={() => {
          onRename();
          onClose();
        }}
      >
        <Edit2 className="w-4 h-4" />
        <span>Rename</span>
      </button>

      <button
        className={cn(
          "w-full flex items-center gap-3 px-4 py-2.5",
          "text-sm text-red-400",
          "hover:bg-neutral-700 transition-colors"
        )}
        onClick={() => {
          onDelete();
          onClose();
        }}
      >
        <Trash2 className="w-4 h-4" />
        <span>Delete</span>
      </button>
    </div>
  );
};
