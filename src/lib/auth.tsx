
'use client';

import { useState, useEffect, useContext, createContext, useCallback } from 'react';
import { checkUserAuth } from './action_api';
import { toast } from '@/hooks/use-toast';
import { User } from './data';

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  logout: () => void;
  login: (token: string, refreshToken: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  
  const verifyAuth = useCallback(async (isLoginEvent = false) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      return;
    }
    
    // Avoid showing loading state on every tab switch/re-focus
    // We check user state directly here before setting loading
    if (!user) {
      setIsLoading(true);
    }
    
    const { isAuthenticated: authStatus, user: userData, error, message } = await checkUserAuth(token);
    
    if (authStatus && userData) {
      setIsAuthenticated(true);
      setUser(userData);
      if (isLoginEvent) {
          toast({ title: "Login Successful", description: message });
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('username');
      console.error("Auth check failed:", error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    verifyAuth();

    const handleStorageChange = () => {
      verifyAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [verifyAuth]);

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUser(null);
    window.dispatchEvent(new Event('storage'));
  };

  const login = (token: string, refreshToken: string) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    verifyAuth(true); // Re-verify auth after login, indicating it's a login event
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
