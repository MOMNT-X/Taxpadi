import { create } from "zustand";
import api from "./api";
import { setTokens, clearTokens, getToken } from "./auth";

// Types
export interface User {
  id: string;
  email: string;
  name: string;
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
      const { accessToken, refreshToken, user } = response.data;

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
      const { accessToken, refreshToken, user } = response.data;

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
      set({
        user: response.data,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
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
  setCurrentConversation: (conversationId: string | null) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  error: null,

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
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to load conversations",
      });
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
      
      if (!navigator.onLine) {
        errorMessage = "No network connection. Please check your internet connection and try again.";
      } else if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error') || error.message?.includes('network')) {
        errorMessage = "Network error. Please check your internet connection and try again.";
      } else if (error.response) {
        errorMessage = error.response?.data?.message || "Failed to load messages";
      } else if (error.request) {
        errorMessage = "Unable to reach server. Please check your internet connection and try again.";
      }
      
      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  sendMessage: async (conversationId: string, content: string, fileUrl?: string) => {
    try {
      set({ isLoading: true, error: null });

      // Optimistically add user message
      const userMessage: Message = {
        id: `temp-${Date.now()}`,
        conversationId,
        role: "USER",
        content,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

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
      
      if (!navigator.onLine) {
        errorMessage = "No network connection. Please check your internet connection and try again.";
      } else if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error') || error.message?.includes('network')) {
        errorMessage = "Network error. Please check your internet connection and try again.";
      } else if (error.response) {
        errorMessage = error.response?.data?.message || "Failed to send message";
      } else if (error.request) {
        errorMessage = "Unable to reach server. Please check your internet connection and try again.";
      }

      set({
        isLoading: false,
        error: errorMessage,
      });
      
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
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to delete conversation",
      });
      throw error;
    }
  },

  setCurrentConversation: (conversationId: string | null) => {
    // Clear messages immediately when switching conversations to prevent showing wrong messages
    set({ currentConversation: conversationId, messages: [], isLoading: false, error: null });
    if (conversationId) {
      get().loadMessages(conversationId);
    }
  },
}));

