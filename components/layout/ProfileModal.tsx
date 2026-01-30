"use client";

import React from "react";
import { X, Send, FileText, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, logout } = useAuth();

  if (!isOpen) return null;

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed bottom-20 left-4 z-50 w-64 bg-neutral-900 rounded-lg shadow-xl overflow-hidden">
        {/* Profile Header */}
        <div className="p-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || "User"}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user?.email || ""}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Options */}
        <div className="py-2">
          <button
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3",
              "text-sm text-gray-300",
              "hover:bg-neutral-800 transition-colors"
            )}
            onClick={() => {
              // TODO: Implement send feedback
              console.log("Send feedback clicked");
            }}
          >
            <Send className="w-4 h-4" />
            <span>Send feedback</span>
          </button>

          <button
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3",
              "text-sm text-gray-300",
              "hover:bg-neutral-800 transition-colors"
            )}
            onClick={() => {
              // TODO: Implement privacy policy
              console.log("Privacy policy clicked");
            }}
          >
            <FileText className="w-4 h-4" />
            <span>Privacy policy</span>
          </button>

          <div className="border-t border-neutral-800 my-2" />

          <button
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3",
              "text-sm text-gray-300",
              "hover:bg-neutral-800 transition-colors"
            )}
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </>
  );
};
