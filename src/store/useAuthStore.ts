import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserProfile = 'Illy' | 'Mins' | null;

interface AuthState {
  user: any | null; // Placeholder for Firebase User
  profile: UserProfile;
  isAuthenticated: boolean;
  setProfile: (profile: UserProfile) => void;
  setUser: (user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      isAuthenticated: false,
      setProfile: (profile) => set({ profile }),
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, profile: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
