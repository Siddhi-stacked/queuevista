
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
  register: (data: {
    name: string;
    email: string;
    phone: string;
    password?: string;
  }) => Promise<User>;
  logout: () => Promise<void>;
  switchUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                        children,
                                                                      }) => {
  const [user, setUser] = useState<User | null>(() =>
      authService.getCurrentUser()
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const current = authService.getCurrentUser();
    if (current) {
      setUser(current);
    }
  }, []);

  const login = async (
      email: string,
      password?: string
  ): Promise<User> => {
    setIsLoading(true);

    try {
      const result = await authService.login(email, password);
      setUser(result.user);
      return result.user;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsRole = async (
      targetRole: UserRole
  ): Promise<User> => {
    setIsLoading(true);

    try {
      const result = await authService.loginAsRole(targetRole);
      setUser(result.user);
      return result.user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    phone: string;
    password?: string;
  }): Promise<User> => {
    setIsLoading(true);

    try {
      const result = await authService.register(data);
      setUser(result.user);
      return result.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);

    try {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const switchUser = (userId: string): void => {
    const targetUser = mockUsers.find((item) => item.id === userId);

    if (targetUser) {
      localStorage.setItem(
          'queuevista_user',
          JSON.stringify(targetUser)
      );

      localStorage.setItem(
          'queuevista_auth_token',
          `mock-jwt-token-for-${targetUser.id}`
      );

      setUser(targetUser);
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
