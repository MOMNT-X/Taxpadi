"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useChat } from "@/hooks/useChat";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function ChatDetailPage() {
  const params = useParams();
  const conversationId = params.id as string;
  const { setCurrentConversation, currentConversation } = useChat();

  useEffect(() => {
    if (conversationId && currentConversation !== conversationId) {
      setCurrentConversation(conversationId);
    }
  }, [conversationId, setCurrentConversation, currentConversation]);

  if (!conversationId) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return <ChatContainer conversationId={conversationId} />;
}

