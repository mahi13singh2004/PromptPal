import { create } from "zustand";
import axios from "axios";
axios.defaults.withCredentials = true;
export const useAuthStore = create((set, get) => ({
  user: null,
  err: null,
  loading: false,
  conversationHistory: [],

  signup: async (name, email, password) => {
    set({ loading: true });
    try {
      const res = await axios.post("https://promptpal-backend.onrender.com/api/auth/signup", {
        name,
        email,
        password,
      });
      set({ user: res.data.user, loading: false, err: null });
      console.log(res.data.user);
      return true;
    } catch (error) {
      console.log("Error in auth store-signup");
      set({
        loading: false,
        err: error.response?.data?.message || error.message,
      });
      return false;
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await axios.post("https://promptpal-backend.onrender.com/api/auth/login", {
        email,
        password,
      });
      set({ user: res.data.user, loading: false, err: null });
      return true;
    } catch (error) {
      console.log("Error in auth store-login");
      set({
        loading: false,
        err: error.response?.data?.message || error.message,
      });
      return false;
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await axios.post("https://promptpal-backend.onrender.com/api/auth/logout");
      set({ user: null, loading: false, err: null, conversationHistory: [] });
    } catch (error) {
      console.log("Error in auth store-logout");
      set({
        loading: false,
        err: error.response?.data?.message || error.message,
      });
    }
  },

  checkAuth: async () => {
    set({ loading: true });
    try {
      console.log("Checking authentication...");
      const res = await axios.get("https://promptpal-backend.onrender.com/api/auth/checkAuth");
      console.log("Auth check successful:", res.data);
      set({ user: res.data.user, loading: false, err: null });
      return true;
    } catch (error) {
      console.log("Error in auth store-checkAuth", error);
      console.log("Error response:", error.response?.data);
      console.log("Error status:", error.response?.status);
      set({ user: null, loading: false, err: null });
      return false;
    }
  },

  updateAssistantDetails: async (assistantName, assistantImage) => {
    set({ loading: true });
    try {
      const formData = new FormData();
      formData.append("assistantName", assistantName);
      formData.append("assistantImage", assistantImage);

      const res = await axios.put(
        "https://promptpal-backend.onrender.com/api/auth/update-assistant",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      set({ user: res.data.user, loading: false, err: null });
      return true;
    } catch (error) {
      console.log("Error in auth store-updateAssistantDetails");
      set({
        loading: false,
        err: error.response?.data?.message || error.message,
      });
      return false;
    }
  },

  getGeminiResponse: async (prompt) => {
    try {
      const res = await axios.post("https://promptpal-backend.onrender.com/api/gemini", {
        prompt,
      });

      // Add to conversation history
      const { conversationHistory } = get();
      const newEntry = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        userInput: prompt,
        assistantResponse: res.data.response,
        type: res.data.type,
      };

      set({
        conversationHistory: [...conversationHistory, newEntry],
      });

      return res.data;
    } catch (error) {
      console.log("Error in auth store-getGeminiResponse");
      console.log("Error:", error.response?.data?.message || error.message);
      return null;
    }
  },

  clearHistory: () => {
    set({ conversationHistory: [] });
  },
}));
