"use client";

import React, { useState } from "react";
import { ChatSidebar } from "@/components/layout/ChatSidebar";
import { SuggestionChips } from "@/components/chat/SuggestionChips";
import { ChatInput } from "@/components/chat/ChatInput";
import { useChat } from "@/hooks/useChat";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { createConversation } = useChat();
  const router = useRouter();

  const handleNewChat = async () => {
    try {
      const conv = await createConversation();
      router.push(`/chat/${conv.id}`);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  const handleMenuClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleChipClick = async (suggestion: string) => {
    try {
      const conv = await createConversation();
      router.push(`/chat/${conv.id}?message=${encodeURIComponent(suggestion)}`);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-white dark:bg-gray-800">
      {/* Sidebar */}
      <ChatSidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />

      {/* Main Content - Empty State */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 bg-white dark:bg-neutral-800">
        <div className="w-full max-w-3xl space-y-6">
          {/* Centered Heading */}
          <div className="text-center space-y-2">
            <p className="text-xl font-normal text-gray-900 dark:text-gray-400">
              Ask freely we've got you.
            </p>
            <h1 className="text-4xl font-normal text-gray-900 dark:text-gray-100">
              What tax question is on your mind?
            </h1>
          </div>

          {/* Input Field */}
          <ChatInput 
            onSend={async (message) => {
              try {
                const conv = await createConversation();
                router.push(`/chat/${conv.id}?message=${encodeURIComponent(message)}`);
              } catch (error) {
                console.error("Failed to create conversation:", error);
              }
            }}
            isLoading={false}
            isInEmptyState={true}
          />

          {/* Suggestion Chips */}
          <div>
            <SuggestionChips onChipClick={handleChipClick} />
          </div>
        </div>
      </main>
    </div>
  );
}
