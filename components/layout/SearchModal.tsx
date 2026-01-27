"use client";

import React, { useState, useMemo } from "react";
import { X, MessageSquare, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Conversation } from "@/lib/store";
import { useRouter } from "next/navigation";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  onNewChat: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  conversations,
  onNewChat,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Filter conversations based on search query
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    return conversations.filter((conv) =>
      conv.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [conversations, searchQuery]);

  // Group conversations by date
  const groupedConversations = useMemo(() => {
    const groups: { [key: string]: Conversation[] } = {
      Today: [],
      Yesterday: [],
      "Previous 7 Days": [],
      "Previous 30 Days": [],
      Older: [],
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    filteredConversations.forEach((conv) => {
      const convDate = new Date(conv.updatedAt || conv.createdAt);
      const convDay = new Date(
        convDate.getFullYear(),
        convDate.getMonth(),
        convDate.getDate()
      );

      if (convDay.getTime() === today.getTime()) {
        groups.Today.push(conv);
      } else if (convDay.getTime() === yesterday.getTime()) {
        groups.Yesterday.push(conv);
      } else if (convDay >= sevenDaysAgo) {
        groups["Previous 7 Days"].push(conv);
      } else if (convDay >= thirtyDaysAgo) {
        groups["Previous 30 Days"].push(conv);
      } else {
        groups.Older.push(conv);
      }
    });

    return groups;
  }, [filteredConversations]);

  const handleConversationClick = (conversationId: string) => {
    router.push(`/chat/${conversationId}`);
    onClose();
  };

  const handleNewChat = () => {
    onNewChat();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 dark:bg-black/40 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[600px] flex flex-col">
          {/* Search Input */}
          <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats..."
                autoFocus
                className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none text-lg"
              />
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto scrollbar-hide p-6">
            {/* New Chat Button */}
            <button
              onClick={handleNewChat}
              className="w-full flex items-center gap-3 px-4 py-3 mb-6 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors text-left"
            >
              <Edit3 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <span className="text-gray-900 dark:text-white font-medium">
                New chat
              </span>
            </button>

            {/* Grouped Conversations */}
            {Object.entries(groupedConversations).map(([group, convs]) => {
              if (convs.length === 0) return null;

              return (
                <div key={group} className="mb-6">
                  {/* Group Header */}
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 px-4">
                    {group}
                  </h3>

                  {/* Conversations */}
                  <div className="space-y-1">
                    {convs.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => handleConversationClick(conv.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors text-left"
                      >
                        <MessageSquare className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                        <span className="text-gray-900 dark:text-white truncate">
                          {conv.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Empty State */}
            {filteredConversations.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery
                    ? "No conversations found"
                    : "No conversations yet"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
