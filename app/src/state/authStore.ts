import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { User } from "@/api/types";

const TOKEN_KEY = "crescendo.token";

interface AuthState {
  token: string | null;
  user: User | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setSession: (token: string, user: User) => Promise<void>;
  setUser: (user: User) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  hydrated: false,
  hydrate: async () => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    set({ token, hydrated: true });
  },
  setSession: async (token, user) => {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    set({ token, user });
  },
  setUser: (user) => set({ user }),
  signOut: async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    set({ token: null, user: null });
  },
}));
