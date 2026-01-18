"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Paperclip, X, MessageSquare, Trash2, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { DeleteModal } from "@/components/chat/DeleteModal";

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isOpen,
  onClose,
  className,
}) => {
  const { user } = useAuth();
  const { createConversation, conversations, currentConversation, setCurrentConversation, deleteConversation } = useChat();
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved !== null) {
      setIsCollapsed(saved === 'true');
    }
  }, []);

  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', isCollapsed.toString());
  }, [isCollapsed]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleNewChat = async () => {
    try {
      const conv = await createConversation();
      router.push(`/chat/${conv.id}`);
      onClose();
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  const handleConversationClick = (conversationId: string) => {
    setCurrentConversation(conversationId);
    router.push(`/chat/${conversationId}`);
    onClose();
  };

  const handleDeleteClick = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    setConversationToDelete(conversationId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (conversationToDelete) {
      try {
        await deleteConversation(conversationToDelete);
        if (currentConversation === conversationToDelete) {
          router.push('/chat');
        }
        setDeleteModalOpen(false);
        setConversationToDelete(null);
      } catch (error) {
        console.error("Failed to delete conversation:", error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 z-50",
          "bg-gray-50 dark:bg-neutral-900 ",
          "transform transition-all duration-300 ease-in-out",
          "md:relative md:translate-x-0",
          "flex flex-col h-full",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "w-20" : "w-64",
          className
        )}
      >
        {/* Header with collapse arrow only */}
        <div className={cn(
          "p-4 flex items-center",
          isCollapsed && "justify-center px-2"
        )}>
          <button
            onClick={toggleCollapse}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft className={cn(
              "h-5 w-5 text-gray-600 dark:text-gray-400 transition-transform",
              isCollapsed && "rotate-180"
            )} />
          </button>
        </div>

        {/* Navigation */}
        <nav className={cn(
          "flex-1 px-4 space-y-0.5",
          isCollapsed && "px-2"
        )}>
          <button
            onClick={handleNewChat}
            className={cn(
              "w-full flex items-center rounded-lg",
              "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
              "text-gray-900 dark:text-gray-100 text-sm font-medium",
              isCollapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
            )}
            title={isCollapsed ? "New chat" : undefined}
          >
            <Plus className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            {!isCollapsed && <span>New Chat</span>}
          </button>

          <button
            className={cn(
              "w-full flex items-center rounded-lg relative",
              "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
              "text-gray-900 dark:text-gray-100 text-sm font-normal",
              isCollapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
            )}
            title={isCollapsed ? "Search" : undefined}
          >
            <Search className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            {!isCollapsed && (
              <>
                <span>Search</span>
                <span className="ml-auto px-2 py-0.5 text-[10px] font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded border border-gray-300 dark:border-gray-700">
                  NEW
                </span>
              </>
            )}
          </button>

          <button
            className={cn(
              "w-full flex items-center rounded-lg",
              "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
              "text-gray-900 dark:text-gray-100 text-sm font-normal",
              isCollapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
            )}
            title={isCollapsed ? "Media" : undefined}
          >
            <Paperclip className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            {!isCollapsed && <span>Media</span>}
          </button>
        </nav>

        {/* Conversations List */}
        {!isCollapsed && conversations.length > 0 && (
          <div className="px-4 py-2 overflow-y-auto scrollbar-hide" style={{ maxHeight: 'calc(100vh - 400px)' }}>
            {/* Chats Header */}
            <div className="px-3 py-2 mb-1">
              <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Chats
              </h2>
            </div>
            
            <div className="space-y-0.5">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => handleConversationClick(conv.id)}
                  className={cn(
                    "group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors relative",
                    currentConversation === conv.id
                      ? "bg-gray-200 dark:bg-gray-800"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-sm font-normal text-gray-900 dark:text-gray-100 truncate">
                      {conv.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(conv.updatedAt)}
                    </span>
                    <button
                      onClick={(e) => handleDeleteClick(e, conv.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-opacity"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Profile */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200/50 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500 dark:bg-orange-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-medium">
                  {getInitials(user?.name)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate font-normal">
                  {user?.email || ""}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg md:hidden"
        >
          <X className="h-5 w-5 text-gray-900 dark:text-gray-100" />
        </button>
      </aside>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setConversationToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};
