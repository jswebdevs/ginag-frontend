"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/axios';
import Cookies from 'js-cookie';

export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'CUSTOMER';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phone?: string;
  roles: Role[]; // FIXED: Must be an array to match backend and Zustand
  avatar?: string;
  status?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Wipe every place we cache auth without navigating away. Used when a stale
// token fails verification on a public page — we just forget the user, the
// page they're already on stays where it is.
const clearLocalAuth = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  Cookies.remove('auth_token');
  Cookies.remove('token');
  Cookies.remove('user_role');
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = Cookies.get('auth_token') || localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (!token) {
          // First-time visitor / fully signed-out — nothing to verify.
          setLoading(false);
          return;
        }

        // Optimistically render with the cached user; we'll re-validate
        // against /users/me below.
        if (savedUser) {
          try { setUser(JSON.parse(savedUser)); } catch { /* corrupt cache */ }
        }

        const res = await api.get('/users/me');
        const userData = res.data.data || res.data;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (error: any) {
        // Only clear auth state on real auth failures (401/403). Network
        // blips, CORS, 5xx, etc. shouldn't kick the user out of a page they
        // arrived at without ever asking to be authenticated.
        const status = error?.response?.status;
        if (status === 401 || status === 403) {
          clearLocalAuth();
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Explicit user-initiated sign-out: clear and route to /login.
  const logout = () => {
    clearLocalAuth();
    setUser(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
