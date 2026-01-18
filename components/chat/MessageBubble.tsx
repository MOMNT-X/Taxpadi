"use client";

import React from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import {
  Copy,
  Check,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Message } from "@/lib/store";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const [copied, setCopied] = React.useState(false);
  const [liked, setLiked] = React.useState(false);
  const [disliked, setDisliked] = React.useState(false);
  const isUser = message.role === "USER";

  // Content is already extracted by backend, use as-is
  const displayContent = message.content;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(displayContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  return (
    <div
      className={cn(
        "px-4 py-6",
        isUser ? "bg-white dark:bg-neutral-800" : "bg-white dark:bg-neutral-800"
      )}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-4">
          {/* Avatar - Only for AI messages */}
          {!isUser && (
            <div className="flex-shrink-0">
              <div className="w-6 h-6 flex items-center justify-center">
                <Image 
                  src="/assets/logo.svg" 
                  alt="AI" 
                  width={24}
                  height={24}
                  className="w-6 h-6 dark:brightness-125" 
                />
              </div>
            </div>
          )}

          {/* Content */}
          <div className={cn("flex-1 min-w-0", isUser && "flex justify-end")}>
            <div className={cn(isUser ? "max-w-[80%] ml-auto" : "w-full")}>
              {/* User Message Bubble */}
              {isUser ? (
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                  <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap text-sm leading-relaxed">
                    {displayContent}
                  </p>
                </div>
              ) : (
                <>
                  {/* AI Message Bubble */}
                  <div className="px-0 py-2 mb-2">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <p className="mb-3 last:mb-0 text-gray-900 dark:text-gray-100 text-sm leading-relaxed">
                              {children}
                            </p>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc pl-5 mb-3 space-y-1">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal pl-5 mb-3 space-y-1">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="text-gray-900 dark:text-gray-100 text-sm">
                              {children}
                            </li>
                          ),
                          code: ({ children, className }) => {
                            const isInline = !className;
                            return isInline ? (
                              <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono text-gray-900 dark:text-gray-100">
                                {children}
                              </code>
                            ) : (
                              <code className={className}>{children}</code>
                            );
                          },
                          pre: ({ children }) => (
                            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto mb-3 text-sm">
                              {children}
                            </pre>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-blue-500 pl-4 italic my-3 text-gray-700 dark:text-gray-300">
                              {children}
                            </blockquote>
                          ),
                          a: ({ children, href }) => (
                            <a
                              href={href}
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {children}
                            </a>
                          ),
                        }}
                      >
                        {displayContent}
                      </ReactMarkdown>
                    </div>
                  </div>

                  {/* Interaction Icons - Always visible for AI messages */}
                  <div className="flex items-center gap-1">
                    <button
                      className={cn(
                        "p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                        "text-gray-500 dark:text-gray-400"
                      )}
                      title="Refresh"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>

                    <button
                      onClick={handleLike}
                      className={cn(
                        "p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                        liked
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-500 dark:text-gray-400"
                      )}
                      title="Like"
                    >
                      <ThumbsUp
                        className={cn("h-4 w-4", liked && "fill-current")}
                      />
                    </button>

                    <button
                      onClick={handleDislike}
                      className={cn(
                        "p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                        disliked
                          ? "text-red-600 dark:text-red-400"
                          : "text-gray-500 dark:text-gray-400"
                      )}
                      title="Dislike"
                    >
                      <ThumbsDown
                        className={cn("h-4 w-4", disliked && "fill-current")}
                      />
                    </button>

                    <button
                      className={cn(
                        "p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                        "text-gray-500 dark:text-gray-400"
                      )}
                      title="Read aloud"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>

                    <button
                      className={cn(
                        "p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                        "text-gray-500 dark:text-gray-400"
                      )}
                      title="More options"
                    >
                      <List className="h-4 w-4" />
                    </button>

                    <button
                      onClick={handleCopy}
                      className={cn(
                        "p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                        "text-gray-500 dark:text-gray-400"
                      )}
                      title="Copy"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};