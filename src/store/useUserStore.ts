import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'CUSTOMER';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  username: string; 
  email: string;
  phone?: string;
  roles: Role[];    
  avatar?: string;
  status?: string;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  updateUser: (data: Partial<User>) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      setUser: (user) => set({ user, isAuthenticated: true }),
      
      updateUser: (data) => set((state) => ({
        user: state.user ? { ...state.user, ...data } : null
      })),
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
        // FIXED: Remove auth_token
        Cookies.remove('auth_token');
        Cookies.remove('token'); // Fallback cleanup
        Cookies.remove('user_role');
        localStorage.removeItem('token');
      },
    }),
    { 
      name: 'user-storage' 
    }
  )
);