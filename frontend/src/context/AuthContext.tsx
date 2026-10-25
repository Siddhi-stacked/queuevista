import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authService } from '../services/authService';
import { mockUsers } from '../mock/users';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<User>;
  loginAsRole: (role: UserRole) => Promise<User>;
  register: (data: { name: string; email: string; phone: string; password?: string }) => Promise<User>;
  logout: () => Promise<void>;
  switchUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to User (Siddhi Patel) for immediate demonstration if no session stored
  const [user, setUser] = useState<User | null>(() => {
    const current = authService.getCurrentUser();
    if (current) return current;
    // Seed with Siddhi Patel as default demo user
    const defaultUser = mockUsers[0];
    localStorage.setItem('queuevista_user', JSON.stringify(defaultUser));
    localStorage.setItem('queuevista_auth_token', `mock-jwt-token-for-${defaultUser.id}`);
    return defaultUser;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const current = authService.getCurrentUser();
    if (current) {
      setUser(current);
    }
  }, []);

  const login = async (email: string, password?: string): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await authService.login(email, password);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsRole = async (targetRole: UserRole): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await authService.loginAsRole(targetRole);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; phone: string; password?: string }): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await authService.register(data);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const switchUser = (userId: string) => {
    const target = mockUsers.find((u) => u.id === userId);
    if (target) {
      localStorage.setItem('queuevista_user', JSON.stringify(target));
      localStorage.setItem('queuevista_auth_token', `mock-jwt-token-for-${target.id}`);
      setUser(target);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginAsRole,
        register,
        logout,
        switchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
