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
  sendMessage: (conversationId: string, content: string) => Promise<void>;
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
      set({ isLoading: true, error: null });
      const response = await api.post("/conversations", { title });
      const conversation = response.data.data || response.data;
      set((state) => ({
        conversations: [conversation, ...state.conversations],
        currentConversation: conversation.id,
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
      set({ isLoading: true, error: null });
      const response = await api.get(`/conversations/${conversationId}/messages`);
      const messages = response.data.data || response.data;
      set({ messages, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to load messages",
      });
    }
  },

  sendMessage: async (conversationId: string, content: string) => {
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

      const response = await api.post(`/conversations/${conversationId}/messages`, {
        content,
      });

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

      // Update conversation in list
      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv.id === conversationId
            ? { ...conv, updatedAt: new Date().toISOString() }
            : conv
        ),
      }));
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to send message",
      });
      // Remove optimistic message on error
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
    set({ currentConversation: conversationId, messages: [] });
    if (conversationId) {
      get().loadMessages(conversationId);
    }
  },
}));

