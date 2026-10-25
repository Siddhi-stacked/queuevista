import { Counter } from '../types';
import { mockCounters } from '../mock/counters';

const STORAGE_KEY = 'queuevista_counters';

const getStoredCounters = (): Counter[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return mockCounters;
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockCounters));
  return mockCounters;
};

const saveCounters = (counters: Counter[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(counters));
};

export const counterService = {
  getAll: async (): Promise<Counter[]> => {
    await new Promise((res) => setTimeout(res, 100));
    return getStoredCounters();
  },

  getById: async (id: string): Promise<Counter | undefined> => {
    await new Promise((res) => setTimeout(res, 80));
    return getStoredCounters().find((c) => c.id === id);
  },

  create: async (newCounter: Omit<Counter, 'id'>): Promise<Counter> => {
    await new Promise((res) => setTimeout(res, 150));
    const counters = getStoredCounters();
    const created: Counter = {
      ...newCounter,
      id: `C00${counters.length + 1}`,
    };
    counters.push(created);
    saveCounters(counters);
    return created;
  },

  updateStatus: async (id: string, status: Counter['status']): Promise<Counter> => {
    await new Promise((res) => setTimeout(res, 100));
    const counters = getStoredCounters();
    const counter = counters.find((c) => c.id === id);
    if (!counter) throw new Error('Counter not found');
    counter.status = status;
    saveCounters(counters);
    return counter;
  },

  assignService: async (id: string, serviceId: string, serviceName: string): Promise<Counter> => {
    await new Promise((res) => setTimeout(res, 100));
    const counters = getStoredCounters();
    const counter = counters.find((c) => c.id === id);
    if (!counter) throw new Error('Counter not found');
    counter.serviceId = serviceId;
    counter.serviceName = serviceName;
    saveCounters(counters);
    return counter;
  },

  assignStaff: async (id: string, staffId: string, staffName: string): Promise<Counter> => {
    await new Promise((res) => setTimeout(res, 100));
    const counters = getStoredCounters();
    const counter = counters.find((c) => c.id === id);
    if (!counter) throw new Error('Counter not found');
    counter.staffId = staffId;
    counter.staffName = staffName;
    saveCounters(counters);
    return counter;
  },
};
