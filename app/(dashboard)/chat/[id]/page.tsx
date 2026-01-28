"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useChat } from "@/hooks/useChat";
import { ChatSidebar } from "@/components/layout/ChatSidebar";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

// Component that uses useSearchParams - must be wrapped in Suspense
function ChatDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const conversationId = params.id as string;
  const { setCurrentConversation, currentConversation, sendMessage, createConversation } = useChat();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const initialMessageProcessedRef = useRef(false);

  useEffect(() => {
    if (conversationId && currentConversation !== conversationId) {
      setCurrentConversation(conversationId);
      initialMessageProcessedRef.current = false;
    }
  }, [conversationId, setCurrentConversation, currentConversation]);

  // Handle initial message from query params
  useEffect(() => {
    const initialMessage = searchParams.get("message");
    if (
      initialMessage &&
      conversationId &&
      currentConversation === conversationId &&
      !initialMessageProcessedRef.current
    ) {
      // Mark as processed IMMEDIATELY to prevent double submission
      initialMessageProcessedRef.current = true;
      
      // Send message after conversation is set
      sendMessage(conversationId, initialMessage).catch((error) => {
        console.error("Failed to send initial message:", error);
        // Reset flag on error so user can retry
        initialMessageProcessedRef.current = false;
      });
      
      // Remove the query param after sending
      window.history.replaceState({}, "", `/chat/${conversationId}`);
    }
  }, [
    conversationId,
    currentConversation,
    searchParams,
    sendMessage,
  ]);

  const handleMenuClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNewChat = async () => {
    try {
      const conv = await createConversation();
      router.push(`/chat/${conv.id}`);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  if (!conversationId) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-neutral-800">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-white dark:bg-neutral-800">
      {/* Sidebar */}
      <ChatSidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-neutral-800">
        <ChatHeader onMenuClick={handleMenuClick} onNewChat={handleNewChat} />
        <ChatContainer conversationId={conversationId} />
      </main>
    </div>
  );
}

// Main page component with Suspense boundary
export default function ChatDetailPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-white dark:bg-neutral-800">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <ChatDetailContent />
    </Suspense>
  );
}
