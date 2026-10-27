import { User, UserRole } from '../types';
import { mockUsers } from '../mock/users';

export const authService = {
  login: async (email: string, _password?: string): Promise<{ user: User; token: string }> => {
    // Simulated network delay
    await new Promise((res) => setTimeout(res, 200));
    const found = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      const token = `mock-jwt-token-for-${found.id}`;
      localStorage.setItem('queuevista_auth_token', token);
      localStorage.setItem('queuevista_user', JSON.stringify(found));
      return { user: found, token };
    }
    // Default fallback to first user if not matched in demo
    const defaultUser = mockUsers[0];
    const token = `mock-jwt-token-for-${defaultUser.id}`;
    localStorage.setItem('queuevista_auth_token', token);
    localStorage.setItem('queuevista_user', JSON.stringify(defaultUser));
    return { user: defaultUser, token };
  },

  loginAsRole: async (role: UserRole): Promise<{ user: User; token: string }> => {
    await new Promise((res) => setTimeout(res, 150));
    const targetUser = mockUsers.find((u) => u.role === role) || mockUsers[0];
    const token = `mock-jwt-token-for-${targetUser.id}`;
    localStorage.setItem('queuevista_auth_token', token);
    localStorage.setItem('queuevista_user', JSON.stringify(targetUser));
    return { user: targetUser, token };
  },

  register: async (userData: { name: string; email: string; phone: string; password?: string }): Promise<{ user: User; token: string }> => {
    await new Promise((res) => setTimeout(res, 250));
    const newUser: User = {
      id: `U00${mockUsers.length + 1}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: 'USER',
      status: 'ACTIVE',
      lastActive: 'Just now',
    };
    const token = `mock-jwt-token-for-${newUser.id}`;
    localStorage.setItem('queuevista_auth_token', token);
    localStorage.setItem('queuevista_user', JSON.stringify(newUser));
    return { user: newUser, token };
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem('queuevista_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  },

  logout: async (): Promise<void> => {
    await new Promise((res) => setTimeout(res, 100));
    localStorage.removeItem('queuevista_auth_token');
    localStorage.removeItem('queuevista_user');
  },
};