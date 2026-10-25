import { Service } from '../types';
import { mockServices } from '../mock/services';

const STORAGE_KEY = 'queuevista_services';

const getStoredServices = (): Service[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return mockServices;
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockServices));
  return mockServices;
};

const saveServices = (services: Service[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
};

export const serviceService = {
  getAll: async (): Promise<Service[]> => {
    await new Promise((res) => setTimeout(res, 100));
    return getStoredServices();
  },

  getById: async (id: string): Promise<Service | undefined> => {
    await new Promise((res) => setTimeout(res, 80));
    return getStoredServices().find((s) => s.id === id);
  },

  create: async (newService: Omit<Service, 'id'>): Promise<Service> => {
    await new Promise((res) => setTimeout(res, 150));
    const services = getStoredServices();
    const created: Service = {
      ...newService,
      id: `S-0${services.length + 1}`,
      currentWaitingCount: 0,
    };
    services.push(created);
    saveServices(services);
    return created;
  },

  update: async (id: string, updates: Partial<Service>): Promise<Service> => {
    await new Promise((res) => setTimeout(res, 120));
    const services = getStoredServices();
    const index = services.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Service not found');
    services[index] = { ...services[index], ...updates };
    saveServices(services);
    return services[index];
  },

  delete: async (id: string): Promise<void> => {
    await new Promise((res) => setTimeout(res, 120));
    const services = getStoredServices().filter((s) => s.id !== id);
    saveServices(services);
  },
};
