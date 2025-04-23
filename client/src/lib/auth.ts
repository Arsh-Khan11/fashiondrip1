import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiRequest } from "./queryClient";

interface UserData {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
}

interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (username: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<UserData>) => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await apiRequest("POST", "/api/login", { username, password });
          const data = await res.json();
          
          if (data.user) {
            set({ user: data.user, isAuthenticated: true, isLoading: false });
          } else {
            set({ isLoading: false, error: "Invalid credentials" });
          }
        } catch (error) {
          set({ isLoading: false, error: "Login failed" });
        }
      },
      
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const res = await apiRequest("POST", "/api/register", userData);
          const data = await res.json();
          
          if (data.user) {
            set({ user: data.user, isAuthenticated: true, isLoading: false });
          } else {
            set({ isLoading: false, error: "Registration failed" });
          }
        } catch (error: any) {
          let errorMessage = "Registration failed";
          if (error.message) {
            errorMessage = error.message;
          }
          set({ isLoading: false, error: errorMessage });
        }
      },
      
      logout: async () => {
        set({ isLoading: true });
        try {
          await apiRequest("POST", "/api/logout", {});
          set({ user: null, isAuthenticated: false, isLoading: false });
        } catch (error) {
          set({ isLoading: false, error: "Logout failed" });
        }
      },
      
      updateProfile: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const res = await apiRequest("PUT", "/api/user", userData);
          const data = await res.json();
          
          if (data.user) {
            set({ user: data.user, isLoading: false });
          } else {
            set({ isLoading: false, error: "Profile update failed" });
          }
        } catch (error) {
          set({ isLoading: false, error: "Profile update failed" });
        }
      },
      
      checkAuthStatus: async () => {
        set({ isLoading: true });
        try {
          const res = await fetch("/api/user", {
            credentials: "include"
          });
          const data = await res.json();
          
          if (data.user) {
            set({ user: data.user, isAuthenticated: true, isLoading: false });
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        } catch (error) {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      }
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated })
    }
  )
);
