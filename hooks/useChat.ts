import { useEffect } from "react";
import { useChatStore } from "@/lib/store";

export const useChat = () => {
  const {
    conversations,
    currentConversation,
    messages,
    isLoading,
    error,
    createConversation,
    loadConversations,
    loadMessages,
    sendMessage,
    deleteConversation,
    setCurrentConversation,
  } = useChatStore();

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (currentConversation) {
      loadMessages(currentConversation);
    }
  }, [currentConversation, loadMessages]);

  return {
    conversations,
    currentConversation,
    messages,
    isLoading,
    error,
    createConversation,
    loadConversations,
    sendMessage,
    deleteConversation,
    setCurrentConversation,
  };
};


