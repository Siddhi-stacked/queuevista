import { Appointment } from '../types';
import { mockAppointments } from '../mock/appointments';

const STORAGE_KEY = 'queuevista_appointments';

const getStoredAppointments = (): Appointment[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return mockAppointments;
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockAppointments));
  return mockAppointments;
};

const saveAppointments = (appointments: Appointment[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
};

export const appointmentService = {
  getAll: async (): Promise<Appointment[]> => {
    await new Promise((res) => setTimeout(res, 100));
    return getStoredAppointments();
  },

  getByUserId: async (userId: string): Promise<Appointment[]> => {
    await new Promise((res) => setTimeout(res, 80));
    return getStoredAppointments().filter((a) => a.userId === userId);
  },

  create: async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'status'>): Promise<Appointment> => {
    await new Promise((res) => setTimeout(res, 150));
    const appointments = getStoredAppointments();
    const created: Appointment = {
      ...appointmentData,
      id: `A-${Math.floor(205 + Math.random() * 50)}`,
      status: 'SCHEDULED',
      createdAt: new Date().toISOString(),
    };
    appointments.unshift(created);
    saveAppointments(appointments);
    return created;
  },

  cancel: async (id: string): Promise<Appointment> => {
    await new Promise((res) => setTimeout(res, 100));
    const appointments = getStoredAppointments();
    const target = appointments.find((a) => a.id === id);
    if (!target) throw new Error('Appointment not found');
    target.status = 'CANCELLED';
    saveAppointments(appointments);
    return target;
  },

  checkIn: async (id: string): Promise<Appointment> => {
    await new Promise((res) => setTimeout(res, 100));
    const appointments = getStoredAppointments();
    const target = appointments.find((a) => a.id === id);
    if (!target) throw new Error('Appointment not found');
    target.status = 'CHECKED_IN';
    saveAppointments(appointments);
    return target;
  },
};
