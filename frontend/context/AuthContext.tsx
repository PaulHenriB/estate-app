import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from '../../shared/types';

// FIX: Use a relative path for the API URL to work in proxied environments.
const API_URL = '/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (username: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('dwelli_token'));
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async (authToken: string) => {
    try {
      const response = await fetch(`${API_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch user');
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      localStorage.removeItem('dwelli_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, [token, fetchUser]);

  const login = async (email: string, pass: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
    }

    const { token: authToken, user: userData } = await response.json();
    localStorage.setItem('dwelli_token', authToken);
    setToken(authToken);
    setUser(userData);
  };

  const signup = async (username: string, email: string, pass: string) => {
     const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password: pass }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
    }

    const { token: authToken, user: userData } = await response.json();
    localStorage.setItem('dwelli_token', authToken);
    setToken(authToken);
    setUser(userData);
  }

  const logout = () => {
    localStorage.removeItem('dwelli_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};