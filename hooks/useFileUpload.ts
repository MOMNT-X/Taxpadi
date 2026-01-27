import { useState, useCallback, useRef } from "react";
import { api } from "@/lib/api";

interface UploadResult {
  url: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
}

interface UseFileUploadReturn {
  uploadFile: (conversationId: string, file: File) => Promise<UploadResult>;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  cancelUpload: () => void;
  resetError: () => void;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = [
  // Images
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "text/csv",
  // Audio
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/webm",
  // Video
  "video/mp4",
  "video/webm",
  "video/ogg",
];

export const useFileUpload = (): UseFileUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`;
    }

    // Check file type
    if (!ALLOWED_TYPES.includes(file.type) && file.type !== "") {
      return `File type "${file.type}" is not supported`;
    }

    // Check if file is empty
    if (file.size === 0) {
      return "File is empty";
    }

    return null;
  };

  const uploadFile = useCallback(
    async (conversationId: string, file: File): Promise<UploadResult> => {
      // Validate conversation ID
      if (!conversationId || conversationId.trim() === "") {
        const errorMsg = "Invalid conversation ID";
        setError(errorMsg);
        throw new Error(errorMsg);
      }

      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        throw new Error(validationError);
      }

      setIsUploading(true);
      setUploadProgress(0);
      setError(null);

      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();

      try {
        const formData = new FormData();
        formData.append("file", file);
        
        // Add additional metadata
        formData.append("originalName", file.name);
        formData.append("mimeType", file.type);
        formData.append("size", file.size.toString());

        console.log("Uploading file:", {
          name: file.name,
          size: file.size,
          type: file.type,
          conversationId,
        });

        const response = await api.post(
          `/conversations/${conversationId}/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            signal: abortControllerRef.current.signal,
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const progress = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                setUploadProgress(progress);
                console.log(`Upload progress: ${progress}%`);
              }
            },
            timeout: 300000, // 5 minutes timeout
          }
        );

        console.log("Upload successful:", response.data);

        setIsUploading(false);
        setUploadProgress(100);
        
        // Validate response
        if (!response.data || !response.data.file) {
          throw new Error("Invalid response from server");
        }

        return response.data.file;
      } catch (err: any) {
        console.error("Upload error:", err);

        let errorMessage = "Failed to upload file";

        // Handle different error types
        if (err.name === "AbortError" || err.code === "ERR_CANCELED") {
          errorMessage = "Upload cancelled";
        } else if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
          errorMessage = "Upload timeout. Please try again with a smaller file.";
        } else if (err.response) {
          // Server responded with error
          if (err.response.status === 413) {
            errorMessage = "File is too large";
          } else if (err.response.status === 415) {
            errorMessage = "File type not supported";
          } else if (err.response.status === 401) {
            errorMessage = "Authentication required. Please log in again.";
          } else if (err.response.status === 404) {
            errorMessage = "Conversation not found";
          } else if (err.response.data?.message) {
            errorMessage = err.response.data.message;
          } else if (err.response.data?.error) {
            errorMessage = err.response.data.error;
          }
        } else if (err.request) {
          // Request made but no response
          errorMessage = "No response from server. Please check your connection.";
        } else if (err.message) {
          errorMessage = err.message;
        }

        setError(errorMessage);
        setIsUploading(false);
        setUploadProgress(0);
        throw new Error(errorMessage);
      } finally {
        abortControllerRef.current = null;
      }
    },
    []
  );

  const cancelUpload = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsUploading(false);
      setUploadProgress(0);
      setError("Upload cancelled");
    }
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    uploadFile,
    isUploading,
    uploadProgress,
    error,
    cancelUpload,
    resetError,
  };
};