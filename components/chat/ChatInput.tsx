"use client";

import React, { useState, KeyboardEvent, useRef, useEffect } from "react";
import { Paperclip, Mic, Send, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";

interface ChatInputProps {
  onSend: (message: string, file?: File) => void;
  onStartTyping?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  uploadProgress?: number;
  uploadError?: string | null;
  error?: string | null;
  isInEmptyState?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onStartTyping,
  isLoading = false,
  disabled = false,
  uploadProgress,
  uploadError,
  error,
  isInEmptyState = false,
}) => {
  const [message, setMessage] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    isRecording,
    transcript,
    isSupported: isVoiceSupported,
    error: voiceError,
    startRecording,
    stopRecording,
    resetTranscript,
  } = useVoiceRecording();

  // Update message when transcript changes
  useEffect(() => {
    if (transcript) {
      setMessage((prev) => {
        const separator = prev.trim() ? " " : "";
        return prev + separator + transcript;
      });
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  // Notify parent when user starts typing
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    
    // Call onStartTyping only once when user begins typing
    if (!hasStartedTyping && newMessage.length > 0 && onStartTyping) {
      setHasStartedTyping(true);
      onStartTyping();
    }
    
    // Reset flag if message is cleared
    if (newMessage.length === 0) {
      setHasStartedTyping(false);
    }
  };

  const handleSend = () => {
    if ((message.trim() || attachedFile) && !isLoading && !disabled) {
      onSend(message.trim(), attachedFile || undefined);
      setMessage("");
      setAttachedFile(null);
      setHasStartedTyping(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleVoiceClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const getFileType = (filename: string) => {
    const ext = filename.split(".").pop()?.toUpperCase();
    return ext || "FILE";
  };

  const showSendButton = message.trim().length > 0 || attachedFile !== null;

  return (
    <div
      className={cn(
        isInEmptyState
          ? "border-none"
          : "sticky bottom-0 border-t border-gray-200 dark:border-gray-700"
      )}
    >
      <div className="max-w-4xl mx-auto">
        {/* Upload Error Message */}
        {uploadError && (
          <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{uploadError}</p>
          </div>
        )}

        {/* Network/API Error Message */}
        {error && (
          <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Upload Progress */}
        {uploadProgress !== undefined && uploadProgress < 100 && (
          <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Uploading file...
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {uploadProgress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Recording Indicator */}
        {isRecording && (
          <div className="mb-3 flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Recording... Speak now
              </span>
            </div>
            <button
              onClick={stopRecording}
              className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              Stop
            </button>
          </div>
        )}

        {/* File Preview */}
        {attachedFile && (
          <div className="mb-3 flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="w-12 h-12 rounded-lg bg-purple-500 dark:bg-purple-600 flex items-center justify-center flex-shrink-0">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {attachedFile.name}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {getFileType(attachedFile.name)}
              </p>
            </div>
            <button
              onClick={handleRemoveFile}
              className="p-1.5 hover:bg-purple-100 dark:hover:bg-purple-800 rounded-lg transition-colors"
              aria-label="Remove file"
            >
              <X className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        )}

        {/* Input Container */}
        <div
          className={cn(
            "flex flex-col",
            "bg-neutral-100 dark:bg-neutral-700",
            "rounded-3xl",
            "px-5 py-5",
            "transition-all duration-200",
            isRecording && "bg-gray-500 dark:bg-gray-100"
          )}
        >
          {/* Text Input Area */}
          <textarea
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything"
            disabled={isLoading || disabled || isRecording}
            rows={1}
            className={cn(
              "w-full bg-transparent",
              "text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-200",
              "outline-none resize-none",
              "min-h-[24px] max-h-[120px]",
              "mb-6",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            style={{
              height: "auto",
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = target.scrollHeight + "px";
            }}
          />

          {/* Icons Row */}
          <div className="flex items-center justify-between">
            {/* Left Side Icons */}
            <div className="flex items-center gap-2">
              {/* Paperclip Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || disabled || isRecording}
                className={cn(
                  "p-1.5 rounded-lg",
                  "hover:bg-gray-100 dark:hover:bg-gray-700",
                  "transition-colors duration-200",
                  "text-gray-500 dark:text-gray-400",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
                aria-label="Attach file"
              >
                <Paperclip className="h-5 w-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
              />

              {/* Microphone Button */}
              {!showSendButton && (
                <button
                  onClick={handleVoiceClick}
                  disabled={isLoading || disabled || !isVoiceSupported}
                  className={cn(
                    "p-1.5 rounded-lg",
                    "transition-all duration-200",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    isRecording
                      ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                  )}
                  aria-label={isRecording ? "Stop recording" : "Voice input"}
                >
                  <Mic className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Right Side Icon */}
            <div className="flex items-center">
              {/* Send Button - Circular with up arrow */}
              {showSendButton && (
                <button
                  onClick={handleSend}
                  disabled={isLoading || disabled}
                  className={cn(
                    "w-8 h-8 rounded-full",
                    "bg-white dark:bg-gray-100",
                    "flex items-center justify-center",
                    "hover:bg-gray-50 dark:hover:bg-gray-200",
                    "transition-all duration-200",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                  aria-label="Send message"
                >
                  <svg
                    className="h-5 w-5 text-gray-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                </button>
              )}

              {/* Waveform Icon (when no text and not recording) */}
              {!showSendButton && !isRecording && (
                <div className="p-1.5 text-gray-500 dark:text-gray-400">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 9v6h2V9H3zm4 2v2h2v-2H7zm4-4v6h2V7h-2zm4 3v1h2v-1h-2zm4 2v2h2v-2h-2z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
