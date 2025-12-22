"use client";

import React from "react";
import { useChat } from "@/hooks/useChat";
import { Button } from "@/components/ui/Button";
import { Plus, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const { createConversation, isLoading } = useChat();
  const router = useRouter();

  const handleNewChat = async () => {
    try {
      const conv = await createConversation();
      router.push(`/chat/${conv.id}`);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  return (
    <div className="h-full flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Start a new conversation</h2>
        <p className="text-muted-foreground mb-6">
          Ask me anything about Nigerian tax laws, calculations, or regulations.
        </p>
        <Button onClick={handleNewChat} isLoading={isLoading} size="lg">
          <Plus className="h-5 w-5 mr-2" />
          New Chat
        </Button>
      </div>
    </div>
  );
}

