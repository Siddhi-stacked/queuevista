import { NotificationItem } from '../types';
import { mockNotifications } from '../mock/notifications';

const STORAGE_KEY = 'queuevista_notifications';

const getStoredNotifications = (): NotificationItem[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return mockNotifications;
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockNotifications));
  return mockNotifications;
};

const saveNotifications = (notifications: NotificationItem[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
};

export const notificationService = {
  getAll: async (userId?: string): Promise<NotificationItem[]> => {
    await new Promise((res) => setTimeout(res, 80));
    const all = getStoredNotifications();
    return userId ? all.filter((n) => n.userId === userId) : all;
  },

  markAsRead: async (id: string): Promise<void> => {
    await new Promise((res) => setTimeout(res, 50));
    const all = getStoredNotifications();
    const item = all.find((n) => n.id === id);
    if (item) {
      item.read = true;
      saveNotifications(all);
    }
  },

  markAllAsRead: async (userId?: string): Promise<void> => {
    await new Promise((res) => setTimeout(res, 50));
    const all = getStoredNotifications();
    all.forEach((n) => {
      if (!userId || n.userId === userId) {
        n.read = true;
      }
    });
    saveNotifications(all);
  },

  create: async (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): Promise<NotificationItem> => {
    const all = getStoredNotifications();
    const created: NotificationItem = {
      ...notification,
      id: `N-${Date.now().toString().slice(-4)}`,
      timestamp: 'Just now',
      read: false,
    };
    all.unshift(created);
    saveNotifications(all);
    return created;
  },
};
