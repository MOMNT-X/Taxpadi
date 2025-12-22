"use client";

import React from "react";
import { useChat } from "@/hooks/useChat";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";

interface ChatContainerProps {
  conversationId: string;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  conversationId,
}) => {
  const { messages, isLoading, sendMessage } = useChat();

  const handleSend = async (content: string) => {
    try {
      await sendMessage(conversationId, content);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <MessageList messages={messages} isLoading={isLoading} />
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
};

