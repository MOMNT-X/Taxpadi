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
        "bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-800",
        className
      )}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Hamburger Menu + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className={cn(
              "p-2 -ml-2",
              "hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg",
              "transition-colors duration-200",
              "lg:hidden"
            )}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 text-gray-900 dark:text-gray-100" />
          </button>
          
          {/* Taxgpt Logo and Text */}

            <span className="text-lg font-semibold text-gray-900 dark:text-white">Taxgpt</span>
          </div>
        </div>
    </header>
  );
};
