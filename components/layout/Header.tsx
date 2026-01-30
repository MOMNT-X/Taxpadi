"use client";

import React from "react";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Dropdown } from "@/components/ui/Dropdown";
import { Menu, Sun, Moon, User, LogOut } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="lg:hidden mr-2"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex-1">
          <h1 className="text-lg font-semibold">TaxGPT</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* User Menu */}
          <Dropdown
            trigger={
              <button className="flex items-center gap-2 p-2 rounded-md hover:bg-accent">
                <Avatar name={user?.name} src={user?.avatar} size="sm" />
              </button>
            }
            items={[
              {
                label: user?.name || "User",
                onClick: () => {},
                icon: <User className="h-4 w-4" />,
              },
              {
                label: "Logout",
                onClick: logout,
                icon: <LogOut className="h-4 w-4" />,
                danger: true,
              },
            ]}
            align="right"
          />
        </div>
      </div>
    </header>
  );
};


