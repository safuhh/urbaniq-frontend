import { create } from 'zustand';

export type UserRole = 'Admin' | 'Owner' | 'Agent' | 'Buyer';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  phone?: string;
  whatsapp?: string;
  bio?: string;
  location?: {
    city?: string;
    area?: string;
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User) => void;
  logout: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start in loading state while checking session

  setAuth: (user) => {
    set({ user, isAuthenticated: true, isLoading: false });
  },

<<<<<<< Updated upstream
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('urbaniq_token');
      localStorage.removeItem('urbaniq_user');
=======
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false });
>>>>>>> Stashed changes
    }
    set({ user: null, token: null, isAuthenticated: false });
  },

  initialize: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/auth/me');
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  }
}));
