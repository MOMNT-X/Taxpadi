"use client";

import React, { useState, useEffect, useRef } from "react";
import { MoreVertical } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { useRouter } from "next/navigation";
import { DeleteModal } from "@/components/chat/DeleteModal";
import { ProfileModal } from "@/components/layout/ProfileModal";
import { ConversationMenu } from "@/components/layout/ConversationMenu";
import { SearchModal } from "@/components/layout/SearchModal";
import { MediaGallery } from "@/components/layout/MediaGallery";

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
  const { user, logout } = useAuth();
  const { createConversation, conversations, currentConversation, setCurrentConversation, deleteConversation } = useChat();
  const router = useRouter();
  
  // State management
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  
  const renameInputRef = useRef<HTMLInputElement>(null);

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

  // Focus rename input when renaming starts
  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingId]);

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
    if (renamingId === conversationId) return; // Don't navigate while renaming
    setCurrentConversation(conversationId);
    router.push(`/chat/${conversationId}`);
    onClose();
  };

  const handleMenuClick = (e: React.MouseEvent<HTMLButtonElement>, conversationId: string) => {
    e.stopPropagation();
    
    if (menuOpenId === conversationId) {
      setMenuOpenId(null);
      setMenuPosition(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setMenuPosition({
        top: rect.top,
        left: rect.right + 8, // 8px gap from the button
      });
      setMenuOpenId(conversationId);
    }
  };

  const handleRenameStart = (conversationId: string, currentTitle: string) => {
    setRenamingId(conversationId);
    setRenameValue(currentTitle);
    setMenuOpenId(null);
  };

  const handleRenameSubmit = async () => {
    if (renamingId && renameValue.trim()) {
      try {
        // TODO: Implement renameConversation in store
        // await renameConversation(renamingId, renameValue.trim());
        console.log("Rename to:", renameValue);
      } catch (error) {
        console.error("Failed to rename conversation:", error);
      }
    }
    setRenamingId(null);
    setRenameValue("");
  };

  const handleRenameCancel = () => {
    setRenamingId(null);
    setRenameValue("");
  };

  const handleDeleteClick = (conversationId: string) => {
    setConversationToDelete(conversationId);
    setDeleteModalOpen(true);
    setMenuOpenId(null);
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
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-50",
          "flex flex-col",
          "bg-neutral-200 dark:bg-neutral-900",
          "border-r border-gray-200/50 dark:border-neutral-800",
          "transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200/50 dark:border-neutral-800">
          {!isCollapsed && (
            <Image
              src="/assets/logo.svg"
              alt="TaxGPT"
              width={32}
              height={32}
              className="flex-shrink-0"
            />
          )}
          <button
            onClick={toggleCollapse}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors ml-auto"
          >
            <Image
              src="/assets/arrow-bar.svg"
              alt="Collapse"
              width={20}
              height={20}
              className={cn(
                "transition-transform",
                "dark:invert dark:brightness-0 dark:contrast-200",
                isCollapsed && "rotate-180"
              )}
            />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="px-2 py-3 space-y-1">
          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg relative group",
              "text-sm text-gray-900 dark:text-gray-100",
              "hover:bg-gray-100 dark:hover:bg-neutral-800",
              "transition-colors",
              isCollapsed && "justify-center"
            )}
            title={isCollapsed ? "New chat" : ""}
          >
            <Image 
              src="/assets/plus-circle.svg" 
              width={20} 
              height={20} 
              alt="New chat" 
              className="dark:invert dark:brightness-0 dark:contrast-200"
            />
            {!isCollapsed && <span>New chat</span>}
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                New chat
              </div>
            )}
          </button>

          {/* Search Button */}
          <button
            onClick={() => setShowSearchModal(true)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg relative group",
              "text-sm text-gray-900 dark:text-gray-100",
              "hover:bg-gray-100 dark:hover:bg-neutral-800",
              "transition-colors",
              isCollapsed && "justify-center"
            )}
            title={isCollapsed ? "Search" : ""}
          >
            <Image 
              src="/assets/search.svg" 
              width={20} 
              height={20} 
              alt="Search" 
              className="dark:invert dark:brightness-0 dark:contrast-200"
            />
            {!isCollapsed && <span>Search</span>}
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                Search
              </div>
            )}
          </button>

          {/* Media Button */}
          <button
            onClick={() => setShowMediaGallery(true)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg relative group",
              "text-sm text-gray-900 dark:text-gray-100",
              "hover:bg-gray-100 dark:hover:bg-neutral-800",
              "transition-colors",
              isCollapsed && "justify-center"
            )}
            title={isCollapsed ? "Media" : ""}
          >
            <Image 
              src="/assets/media.svg" 
              width={20} 
              height={20} 
              alt="Media" 
              className="dark:invert dark:brightness-0 dark:contrast-200"
            />
            {!isCollapsed && <span>Media</span>}
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                Media
              </div>
            )}
          </button>
        </div>

        {/* Chats Header */}
        {!isCollapsed && (
          <div className="px-4 py-2">
            <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Chats
            </h2>
          </div>
        )}

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-2 scrollbar-hide">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="relative"
              onMouseEnter={() => setHoveredId(conversation.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <button
                onClick={() => handleConversationClick(conversation.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1",
                  "text-sm text-left",
                  "transition-colors group",
                  currentConversation === conversation.id
                    ? "bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800/50"
                )}
              >
                {!isCollapsed && (
                  <>
                    {renamingId === conversation.id ? (
                      <input
                        ref={renameInputRef}
                        type="text"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onBlur={handleRenameSubmit}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleRenameSubmit();
                          if (e.key === "Escape") handleRenameCancel();
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 bg-transparent border-none outline-none text-sm"
                      />
                    ) : (
                      <span className="flex-1 truncate">{conversation.title}</span>
                    )}
                    
                    {hoveredId === conversation.id && renamingId !== conversation.id && (
                      <button
                        onClick={(e) => handleMenuClick(e, conversation.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200 dark:hover:bg-neutral-700 transition-opacity"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    )}
                  </>
                )}
              </button>

              {/* Conversation Menu */}
              {menuOpenId === conversation.id && menuPosition && (
                <ConversationMenu
                  isOpen={true}
                  onClose={() => {
                    setMenuOpenId(null);
                    setMenuPosition(null);
                  }}
                  onRename={() => handleRenameStart(conversation.id, conversation.title)}
                  onDelete={() => handleDeleteClick(conversation.id)}
                  position={menuPosition}
                />
              )}
            </div>
          ))}
        </div>

        {/* User Profile */}
        {!isCollapsed && (
          <div className="p-3 border-t border-gray-200/50 dark:border-neutral-800">
            <button
              onClick={() => setProfileModalOpen(true)}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || "User"}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-orange-500 dark:bg-orange-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-medium">
                    {getInitials(user?.name)}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {user?.email || ""}
                </p>
              </div>
            </button>
          </div>
        )}
      </aside>

      {/* Modals */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setConversationToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        conversationTitle={
          conversations.find((c) => c.id === conversationToDelete)?.title || ""
        }
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        conversations={conversations}
        onNewChat={handleNewChat}
      />

      {/* Media Gallery */}
      <MediaGallery
        isOpen={showMediaGallery}
        onClose={() => setShowMediaGallery(false)}
        files={[]} // TODO: Extract files from messages
      />
    </>
  );
};
