"use client";

import React, { useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { useFileUpload } from "@/hooks/useFileUpload";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { SuggestionChips } from "./SuggestionChips";

interface ChatContainerProps {
  conversationId: string;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  conversationId,
}) => {
  const { messages, isLoading, sendMessage, setCurrentConversation, error } = useChat();
  const { uploadFile, isUploading, uploadProgress, error: uploadError } = useFileUpload();

  // Ensure conversation is set when component mounts or conversationId changes
  useEffect(() => {
    setCurrentConversation(conversationId);
  }, [conversationId, setCurrentConversation]);

  const handleSend = async (content: string, file?: File) => {
    try {
      let fileUrl: string | undefined;

      // Upload file first if present
      if (file) {
        const uploadResult = await uploadFile(conversationId, file);
        fileUrl = uploadResult.url;
      }

      // Send message with optional file URL
      await sendMessage(conversationId, content, fileUrl);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleChipClick = (suggestion: string) => {
    // Prevent multiple clicks while loading
    if (isLoading || isUploading) return;
    handleSend(suggestion);
  };

  // Check if there's an initial message being processed
  const [hasInitialMessage, setHasInitialMessage] = React.useState(false);
  const [userStartedTyping, setUserStartedTyping] = React.useState(false);

  React.useEffect(() => {
    // Check for initial message in URL
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const initialMessage = urlParams.get('message');
      setHasInitialMessage(!!initialMessage);
    }
  }, [conversationId]);

  // Show suggestions only if: no messages, not loading, not uploading, no initial message pending, and user hasn't started typing
  // IMPORTANT: Don't show empty state if we're loading (prevents flash when switching conversations)
  const showSuggestions = messages.length === 0 && !isLoading && !isUploading && !hasInitialMessage && !userStartedTyping;

  return (
    <div className="flex flex-col h-full">
      {showSuggestions ? (
        /* Empty State - Input in middle position */
        <div className="flex-1 flex flex-col items-center justify-center px-4 bg-white dark:bg-neutral-800">
          <div className="w-full max-w-3xl space-y-6">
            {/* Centered Heading */}
            <div className="text-center space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Ask freely we've got you.
              </p>
              <h1 className="text-2xl font-normal text-gray-900 dark:text-gray-100">
                What tax question is on your mind?
              </h1>
            </div>

            {/* Input Field */}
            <ChatInput 
              onSend={handleSend}
              onStartTyping={() => setUserStartedTyping(true)}
              isLoading={isLoading || isUploading}
              uploadProgress={isUploading ? uploadProgress : undefined}
              uploadError={uploadError}
              error={error}
              isInEmptyState={true}
            />

            {/* Suggestion Chips */}
            <div>
              <SuggestionChips onChipClick={handleChipClick} disabled={isLoading || isUploading} />
            </div>
          </div>
        </div>
      ) : (
        /* Messages State - Input sticky at bottom */
        <>
          {/* Show loading state when switching conversations */}
          {isLoading && messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center bg-white dark:bg-neutral-800">
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: "0ms", animationDuration: "1.4s" }} />
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: "200ms", animationDuration: "1.4s" }} />
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: "400ms", animationDuration: "1.4s" }} />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Loading conversation...</p>
              </div>
            </div>
          ) : (
            <MessageList messages={messages} isLoading={isLoading || isUploading} />
          )}
          <ChatInput 
            onSend={handleSend} 
            isLoading={isLoading || isUploading}
            uploadProgress={isUploading ? uploadProgress : undefined}
            uploadError={uploadError}
            error={error}
            isInEmptyState={false}
          />
        </>
      )}
    </div>
  );
};


