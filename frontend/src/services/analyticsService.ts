import { ActivityLog, AnalyticsSummary } from '../types';
import { mockAnalyticsSummary, mockRecentActivities } from '../mock/analytics';

const ACTIVITY_KEY = 'queuevista_activities';

const getStoredActivities = (): ActivityLog[] => {
  const data = localStorage.getItem(ACTIVITY_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return mockRecentActivities;
    }
  }
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(mockRecentActivities));
  return mockRecentActivities;
};

export const analyticsService = {
  getSummary: async (_filter: 'TODAY' | '7_DAYS' | '30_DAYS' = 'TODAY'): Promise<AnalyticsSummary> => {
    await new Promise((res) => setTimeout(res, 120));
    return mockAnalyticsSummary;
  },

  getRecentActivities: async (): Promise<ActivityLog[]> => {
    await new Promise((res) => setTimeout(res, 100));
    return getStoredActivities();
  },

  logActivity: async (description: string, type: ActivityLog['type']): Promise<ActivityLog> => {
    const list = getStoredActivities();
    const newLog: ActivityLog = {
      id: `ACT-${Date.now().toString().slice(-4)}`,
      timestamp: 'Just now',
      description,
      type,
    };
    list.unshift(newLog);
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(list.slice(0, 30)));
    return newLog;
  },
};
