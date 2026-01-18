"use client";

import React, { useState } from "react";
import { Menu, Plus, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  onMenuClick: () => void;
  onNewChat: () => void;
  className?: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  onMenuClick,
  className,
}) => {

  return (
    <header
      className={cn(
        "sticky top-0 z-10",
        "px-4 py-3",
        className
      )}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Hamburger Menu */}
        <button
          onClick={onMenuClick}
          className={cn(
            "p-2 -ml-2",
            "hover:bg-secondary/50 rounded-lg",
            "transition-colors duration-200",
            "md:hidden"
          )}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5 text-foreground" />
        </button>
        </div>
    </header>
  );
};
