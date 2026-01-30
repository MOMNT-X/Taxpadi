"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  size = "md",
}) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className={cn(
          "p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
          className
        )}
        aria-label="Toggle theme"
      >
        <div className={size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5"} />
      </button>
    );
  }

  const isDark = theme === "dark";

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "p-2 rounded-lg",
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        "text-gray-700 dark:text-gray-300",
        "transition-colors duration-200",
        className
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className={sizeClasses[size]} />
      ) : (
        <Moon className={sizeClasses[size]} />
      )}
    </button>
  );
};

