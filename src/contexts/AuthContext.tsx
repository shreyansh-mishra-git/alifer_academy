import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiGetMe } from '@/lib/api';

export interface UserData {
  _id: string;
  name: string;
  email: string;
  age: number;
  phone: string;
  isAdmin: boolean;
  enrolledCourses: Array<{ _id: string; title: string; price: number; image?: string; category?: string }>;
  studyStreak: number;
  hoursStudied: number;
  completedVideos: string[];
  token: string;
}

interface AuthContextType {
  user: UserData | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (userData: UserData) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  const login = (userData: UserData) => {
    setUser(userData);
    setToken(userData.token);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('alifer_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('alifer_user');
  };

  const refreshUser = useCallback(async () => {
    try {
      const freshUser = await apiGetMe();
      setUser((prev) => prev ? { ...prev, ...freshUser } : { ...freshUser, token: prev?.token || '' });
      const stored = localStorage.getItem('alifer_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        localStorage.setItem('alifer_user', JSON.stringify({ ...parsed, ...freshUser }));
      }
    } catch {
      // Token might be expired
      logout();
    }
  }, []);

  useEffect(() => {
    // Restore user from localStorage on mount
    const storedUser = localStorage.getItem('alifer_user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        // Refresh from server silently
        refreshUser();
      } catch {
        logout();
      }
    }
  }, []); // eslint-disable-line

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn: !!user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
