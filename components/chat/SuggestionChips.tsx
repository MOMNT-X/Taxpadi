"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SuggestionChipsProps {
  onChipClick: (suggestion: string) => void;
  className?: string;
  disabled?: boolean;
}

const suggestions = [
  {
    title: "Explain the new tax reform",
  },
  {
    title: "Generate a tax report",
  },
  {
    title: "Generate a tax summary",
  },
  {
    title: "Do startups pay tax in Nigeria?",
  },
];

export const SuggestionChips: React.FC<SuggestionChipsProps> = ({
  onChipClick,
  className,
  disabled = false,
}) => {
  return (
    <div
      className={cn(
        "flex flex-row flex-wrap gap-3 justify-center items-center px-4",
        className
      )}
    >
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onChipClick(`${suggestion.title}`)}
          disabled={disabled}
          className={cn(
            "group relative",
            "bg-neutral-100 dark:bg-neutral-900",
            "rounded-full",
            "px-5 py-4",
            "text-left",
            "transition-all duration-200",
            "hover:bg-gray-50 dark:hover:bg-gray-750",
            "active:scale-[0.98]",
            "w-auto max-w-[240px]",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <div className="flex flex-col gap-1">
            <span className="text-sm font-light text-gray-900 dark:text-gray-300">
              {suggestion.title}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};
