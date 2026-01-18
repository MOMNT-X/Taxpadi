"use client";

import React, { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { Message } from "@/lib/store";
import { cn } from "@/lib/utils";

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading = false,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-neutral-800">
      <div className="max-w-4xl mx-auto">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {/* Loading/Thinking State */}
        {isLoading && (
          <div className="px-4 py-6  dark:bg-neutral-800">
            <div className="flex gap-4">
              {/* AI Avatar */}
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">TP</span>
                </div>
              </div>

              {/* Loading Content */}
              <div className="flex-1 min-w-0 flex items-center">
                {/* Animated Dots */}
                <div className="flex items-center gap-1.5">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500",
                      "animate-bounce"
                    )}
                    style={{ animationDelay: "0ms", animationDuration: "1.4s" }}
                  />
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500",
                      "animate-bounce"
                    )}
                    style={{ animationDelay: "200ms", animationDuration: "1.4s" }}
                  />
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500",
                      "animate-bounce"
                    )}
                    style={{ animationDelay: "400ms", animationDuration: "1.4s" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
