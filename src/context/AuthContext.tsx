"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/axios';
import Cookies from 'js-cookie';

export type Role = 
  | 'SUPER_ADMIN' 
  | 'ADMIN' 
  | 'PRODUCT_MANAGER' 
  | 'ORDER_MANAGER' 
  | 'SUPPORT_AGENT' 
  | 'MARKETING_SPECIALIST' 
  | 'DELIVERY_MANAGER' 
  | 'CUSTOMER';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phone?: string;
  role: Role;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = Cookies.get('token') || localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token) {
          if (savedUser) setUser(JSON.parse(savedUser));

          const res = await api.get('/users/me'); 
          
          const userData = res.data.data || res.data;
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    Cookies.remove('token');
    Cookies.remove('user_role');
    setUser(null);
    window.location.href = '/login';
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