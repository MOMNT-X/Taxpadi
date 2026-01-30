"use client";

import React from "react";
import { X, FileText, Download, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  conversationId: string;
  conversationTitle: string;
  uploadedAt: string;
}

interface MediaGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  files: MediaFile[];
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({
  isOpen,
  onClose,
  files,
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getFileIcon = (type: string) => {
    return <FileText className="w-8 h-8 text-purple-500" />;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 dark:bg-black/40 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[600px] flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-neutral-700 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Media & Files
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto scrollbar-hide p-6">
            {files.length === 0 ? (
              /* Empty State */
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                  No files uploaded yet
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm">
                  Files you upload in conversations will appear here
                </p>
              </div>
            ) : (
              /* Files Grid */
              <div className="grid gap-4">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700/50 transition-colors"
                  >
                    {/* File Icon */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                      {getFileIcon(file.type)}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {file.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
                        From: {file.conversationTitle}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <a
                        href={file.url}
                        download={file.name}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-600 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </a>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-600 rounded-lg transition-colors"
                        title="Open"
                      >
                        <ExternalLink className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
