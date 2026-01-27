import { create } from "zustand";
import api from "./api";
import { setTokens, clearTokens, getToken } from "./auth";

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: "USER" | "ASSISTANT";
  content: string;
  timestamp: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
}

// Auth Store
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true });
      const response = await api.post("/auth/login", { email, password });
      
      // Handle nested response structure
      const responseData = response.data.data || response.data;
      const { accessToken, refreshToken, user } = responseData;

      setTokens(accessToken, refreshToken);
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({ isLoading: false });
      throw new Error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  },

  signup: async (name: string, email: string, password: string) => {
    try {
      set({ isLoading: true });
      const response = await api.post("/auth/signup", {
        name,
        email,
        password,
      });
      
      // Handle nested response structure
      const responseData = response.data.data || response.data;
      const { accessToken, refreshToken, user } = responseData;

      setTokens(accessToken, refreshToken);
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({ isLoading: false });
      throw new Error(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    }
  },

  logout: () => {
    clearTokens();
    set({
      user: null,
      isAuthenticated: false,
    });
    // Redirect to homepage after logout
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  },

  checkAuth: async () => {
    const token = getToken();
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    try {
      set({ isLoading: true });
      const response = await api.get("/auth/me");
      
      // Extract user data from nested response (backend returns {data: {user}, success: true})
      const userData = response.data.data || response.data;
      
      console.log("User data from /auth/me:", userData);
      console.log("User avatar:", userData?.avatar);
      console.log("User name:", userData?.name);
      console.log("User email:", userData?.email);
      
      set({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error("checkAuth error:", error);
      clearTokens();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  refreshToken: async () => {
    const refreshToken = get().user ? getToken() : null;
    if (!refreshToken) return;

    try {
      const response = await api.post("/auth/refresh", { refreshToken });
      const { accessToken } = response.data;
      // Token is already set by interceptor
    } catch (error) {
      get().logout();
    }
  },
}));

// Chat Store
interface ChatState {
  conversations: Conversation[];
  currentConversation: string | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  createConversation: (title?: string) => Promise<Conversation>;
  loadConversations: () => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string, fileUrl?: string) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
  renameConversation: (conversationId: string, newTitle: string) => Promise<void>;
  setCurrentConversation: (conversationId: string | null) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// Helper to auto-dismiss errors after a delay
let errorTimeout: NodeJS.Timeout | null = null;

const setErrorWithAutoDismiss = (set: any, errorMessage: string) => {
  // Clear any existing timeout
  if (errorTimeout) {
    clearTimeout(errorTimeout);
  }
  
  // Set the error
  set({ error: errorMessage });
  
  // Auto-dismiss after 7 seconds
  errorTimeout = setTimeout(() => {
    set({ error: null });
    errorTimeout = null;
  }, 7000);
};

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  error: null,

  setError: (error: string | null) => {
    if (error) {
      setErrorWithAutoDismiss(set, error);
    } else {
      set({ error: null });
    }
  },

  clearError: () => {
    if (errorTimeout) {
      clearTimeout(errorTimeout);
      errorTimeout = null;
    }
    set({ error: null });
  },

  createConversation: async (title?: string) => {
    try {
      set({ error: null });
      const response = await api.post("/conversations", { title });
      const conversation = response.data.data || response.data;
      set((state) => ({
        conversations: [conversation, ...state.conversations],
        currentConversation: conversation.id,
        messages: [],
        isLoading: false,
      }));
      return conversation;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to create conversation",
      });
      throw error;
    }
  },

  loadConversations: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get("/conversations");
      const conversations = response.data.data || response.data;
      set({ conversations, isLoading: false });
    } catch (error: any) {
      setErrorWithAutoDismiss(set, error.response?.data?.message || "Failed to load conversations");
      set({ isLoading: false });
    }
  },

  loadMessages: async (conversationId: string) => {
    try {
      // Only set loading if we're actually loading messages (not for new empty conversations)
      const response = await api.get(`/conversations/${conversationId}/messages`);
      const messages = response.data.data || response.data;
      // Ensure we only set messages if we're still on the same conversation
      set((state) => {
        if (state.currentConversation === conversationId) {
          return { messages, isLoading: false };
        }
        return { isLoading: false };
      });
    } catch (error: any) {
      let errorMessage = "Failed to load messages";
      
      // Log the full error for developers
      console.error("Load messages error:", error);
      
      if (!navigator.onLine) {
        errorMessage = "No network connection. Please check your internet connection and try again.";
      } else if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error') || error.message?.includes('network')) {
        errorMessage = "Network error. Please check your internet connection and try again.";
      } else if (error.response) {
        // Handle specific HTTP error codes
        const status = error.response.status;
        
        if (status === 429) {
          // Rate limiting - user-friendly message
          errorMessage = "You're loading messages too quickly. Please wait a moment and try again.";
        } else if (status >= 500) {
          // Server errors
          errorMessage = "Our servers are experiencing issues. Please try again in a moment.";
        } else if (status === 403) {
          errorMessage = "You don't have permission to view this conversation.";
        } else if (status === 404) {
          errorMessage = "The conversation could not be found.";
        } else {
          // Generic error - don't expose technical details
          errorMessage = "Something went wrong. Please try again.";
        }
      } else if (error.request) {
        errorMessage = "Unable to reach server. Please check your internet connection and try again.";
      }
      
      setErrorWithAutoDismiss(set, errorMessage);
      set({ isLoading: false });
    }
  },

  sendMessage: async (conversationId: string, content: string, fileUrl?: string) => {
    // Optimistically add user message
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      conversationId,
      role: "USER",
      content,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    try {
      set({ isLoading: true, error: null });

      set((state) => ({
        messages: [...state.messages, userMessage],
      }));

      // Prepare request body with optional attachments
      const requestBody: any = { content };
      if (fileUrl) {
        requestBody.attachments = [fileUrl];
      }

      const response = await api.post(`/conversations/${conversationId}/messages`, requestBody);

      const responseData = response.data.data || response.data;
      const savedUserMessage = responseData.userMessage || responseData;
      const assistantMessage = responseData.assistantMessage;

      // Replace temp message with saved message and add assistant response
      set((state) => ({
        messages: state.messages
          .filter((msg) => msg.id !== userMessage.id)
          .concat([savedUserMessage, assistantMessage]),
        isLoading: false,
      }));

      // Update conversation in list and set title from first message if needed
      set((state) => {
        const currentConv = state.conversations.find((conv) => conv.id === conversationId);
        const isFirstMessage = state.messages.filter((msg) => msg.conversationId === conversationId).length === 0;
        
        return {
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  updatedAt: new Date().toISOString(),
                  // Update title with user's first message (truncate if too long)
                  title: isFirstMessage && currentConv?.title === "New Conversation"
                    ? content.length > 50
                      ? content.substring(0, 47) + "..."
                      : content
                    : conv.title,
                }
              : conv
          ),
        };
      });
    } catch (error: any) {
      // Check for network/connectivity errors
      let errorMessage = "Failed to send message";
      
      // Log the full error for developers
      console.error("Send message error:", error);
      
      if (!navigator.onLine) {
        errorMessage = "No network connection. Please check your internet connection and try again.";
      } else if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error') || error.message?.includes('network')) {
        errorMessage = "Network error. Please check your internet connection and try again.";
      } else if (error.response) {
        // Handle specific HTTP error codes
        const status = error.response.status;
        
        if (status === 429) {
          // Rate limiting - user-friendly message
          errorMessage = "You're sending messages too quickly. Please wait a moment and try again.";
        } else if (status >= 500) {
          // Server errors
          errorMessage = "Our servers are experiencing issues. Please try again in a moment.";
        } else if (status === 403) {
          errorMessage = "You don't have permission to perform this action.";
        } else if (status === 404) {
          errorMessage = "The conversation could not be found.";
        } else {
          // Generic error - don't expose technical details
          errorMessage = "Something went wrong. Please try again.";
        }
      } else if (error.request) {
        errorMessage = "Unable to reach server. Please check your internet connection and try again.";
      }

      setErrorWithAutoDismiss(set, errorMessage);
      set({ isLoading: false });
      
      // Remove optimistic message on error using the actual userMessage id
      set((state) => ({
        messages: state.messages.filter((msg) => msg.id !== userMessage.id),
      }));
      throw error;
    }
  },

  deleteConversation: async (conversationId: string) => {
    try {
      set({ isLoading: true, error: null });
      await api.delete(`/conversations/${conversationId}`);
      set((state) => ({
        conversations: state.conversations.filter(
          (conv) => conv.id !== conversationId
        ),
        currentConversation:
          state.currentConversation === conversationId
            ? null
            : state.currentConversation,
        messages:
          state.currentConversation === conversationId ? [] : state.messages,
        isLoading: false,
      }));
    } catch (error: any) {
      setErrorWithAutoDismiss(set, error.response?.data?.message || "Failed to delete conversation");
      set({ isLoading: false });
      throw error;
    }
  },

  renameConversation: async (conversationId: string, newTitle: string) => {
    try {
      set({ error: null });
      await api.patch(`/conversations/${conversationId}`, { title: newTitle });
      
      // Update local state
      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv.id === conversationId ? { ...conv, title: newTitle } : conv
        ),
      }));
    } catch (error: any) {
      setErrorWithAutoDismiss(set, error.response?.data?.message || "Failed to rename conversation");
      throw error;
    }
  },

  setCurrentConversation: (conversationId: string | null) => {
    // Set loading FIRST before clearing messages to prevent empty state flash
    set({ 
      currentConversation: conversationId, 
      isLoading: !!conversationId, // Set loading true if switching to a conversation
      error: null 
    });
    
    // Then clear messages after a brief delay to allow loading state to render
    setTimeout(() => {
      set({ messages: [] });
      if (conversationId) {
        get().loadMessages(conversationId);
      }
    }, 0);
  },
}));
