import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { QueueEntry, Counter, Service, Appointment, NotificationItem, ActivityLog, QueuePriority, QueueType } from '../types';
import { queueService, getStoredQueueEntries } from '../services/queueService';
import { counterService } from '../services/counterService';
import { serviceService } from '../services/serviceService';
import { appointmentService } from '../services/appointmentService';
import { notificationService } from '../services/notificationService';
import { analyticsService } from '../services/analyticsService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface QueueContextType {
  queueEntries: QueueEntry[];
  counters: Counter[];
  services: Service[];
  appointments: Appointment[];
  notifications: NotificationItem[];
  activities: ActivityLog[];
  userActiveQueueEntry: QueueEntry | undefined;
  staffCounter: Counter | undefined;
  staffServingEntry: QueueEntry | undefined;
  staffWaitingQueue: QueueEntry[];
  isLoading: boolean;
  
  // Real-time Staff Actions
  callNextToken: (counterId: string) => Promise<void>;
  recallToken: (counterId: string) => Promise<void>;
  skipToken: (counterId: string) => Promise<void>;
  transferToken: (tokenNumber: string, targetServiceId: string) => Promise<void>;
  cancelToken: (tokenNumber: string) => Promise<void>;

  // User Actions
  joinQueue: (serviceId: string, priority?: QueuePriority, type?: QueueType) => Promise<QueueEntry>;
  leaveQueue: (tokenNumber: string) => Promise<void>;
  bookAppointment: (serviceId: string, date: string, timeSlot: string, notes?: string) => Promise<Appointment>;
  cancelAppointment: (id: string) => Promise<void>;

  // Admin & General Actions
  addService: (newService: Omit<Service, 'id'>) => Promise<Service>;
  updateService: (id: string, updates: Partial<Service>) => Promise<Service>;
  deleteService: (id: string) => Promise<void>;
  updateCounterStatus: (id: string, status: Counter['status']) => Promise<void>;
  assignCounterService: (id: string, serviceId: string, serviceName: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  resetAllData: () => void;
  refreshData: () => Promise<void>;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [queueEntries, setQueueEntries] = useState<QueueEntry[]>([]);
  const [counters, setCounters] = useState<Counter[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshData = useCallback(async () => {
    try {
      const [entriesData, countersData, servicesData, apptsData, notifsData, actsData] = await Promise.all([
        queueService.getAll(),
        counterService.getAll(),
        serviceService.getAll(),
        appointmentService.getAll(),
        notificationService.getAll(user?.id),
        analyticsService.getRecentActivities(),
      ]);

      setQueueEntries(entriesData);
      setCounters(countersData);
      setServices(servicesData);
      setAppointments(apptsData);
      setNotifications(notifsData);
      setActivities(actsData);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Derived: Active token for currently logged-in user
  const userActiveQueueEntry = queueEntries.find(
    (e) => e.userId === user?.id && (e.status === 'WAITING' || e.status === 'SERVING')
  );

  // Derived: Counter managed by logged in staff member (e.g. Rajesh Kumar -> C002)
  const staffCounter = counters.find((c) => c.staffId === user?.id) || counters.find((c) => c.id === 'C002');

  // Derived: Current token being served at staff counter
  const staffServingEntry = queueEntries.find(
    (e) => e.counterId === staffCounter?.id && e.status === 'SERVING'
  );

  // Derived: Waiting queue for staff counter's assigned service
  const staffWaitingQueue = queueEntries
    .filter((e) => e.serviceId === staffCounter?.serviceId && e.status === 'WAITING')
    .sort((a, b) => a.position - b.position);

  // =================== ACTIONS =================== //

  const callNextToken = async (counterId: string) => {
    try {
      const result = await queueService.callNextToken(counterId);
      
      // Update local counter current serving token
      if (result.current) {
        await counterService.assignService(
          counterId,
          result.current.serviceId,
          result.current.serviceName
        );
        // Set counter currentServingToken
        const updatedCounters = counters.map((c) =>
          c.id === counterId ? { ...c, currentServingToken: result.current?.tokenNumber } : c
        );
        setCounters(updatedCounters);
      }

      await refreshData();

      if (result.current) {
        showToast(
          `Called token ${result.current.tokenNumber} to Counter 2!`,
          'success'
        );
      } else {
        showToast('No more tokens waiting in the queue.', 'info');
      }
    } catch {
      showToast('Failed to call next token', 'error');
    }
  };

  const recallToken = async (counterId: string) => {
    try {
      const recalled = await queueService.recallToken(counterId);
      if (recalled) {
        showToast(`Token ${recalled.tokenNumber} recalled to Counter 2.`, 'info');
      }
      await refreshData();
    } catch {
      showToast('Failed to recall token', 'error');
    }
  };

  const skipToken = async (counterId: string) => {
    try {
      const skipped = await queueService.skipToken(counterId);
      if (skipped) {
        showToast(`Token ${skipped.tokenNumber} marked as Skipped (No-show).`, 'warning');
      }
      await refreshData();
    } catch {
      showToast('Failed to skip token', 'error');
    }
  };

  const transferToken = async (tokenNumber: string, targetServiceId: string) => {
    try {
      const targetService = services.find((s) => s.id === targetServiceId);
      if (!targetService) return;

      const entries = getStoredQueueEntries();
      const target = entries.find((e) => e.tokenNumber === tokenNumber);
      if (target) {
        target.serviceId = targetService.id;
        target.serviceName = targetService.name;
        target.status = 'WAITING';
        target.counterId = undefined;
        target.counterName = undefined;
        // Recalculate
        const waitingInTarget = entries.filter(
          (e) => e.serviceId === targetServiceId && e.status === 'WAITING'
        );
        target.position = waitingInTarget.length + 1;
        target.peopleAhead = waitingInTarget.length;
        target.estimatedWaitMinutes = (waitingInTarget.length + 1) * targetService.averageServiceTimeMinutes;

        queueService.leaveQueue(tokenNumber); // save logic
        await analyticsService.logActivity(
          `Token ${tokenNumber} transferred to ${targetService.name}`,
          'SERVICE_UPDATE'
        );
      }

      showToast(`Token ${tokenNumber} transferred to ${targetService.name}`, 'info');
      await refreshData();
    } catch {
      showToast('Failed to transfer token', 'error');
    }
  };

  const cancelToken = async (tokenNumber: string) => {
    try {
      await queueService.leaveQueue(tokenNumber);
      showToast(`Token ${tokenNumber} has been cancelled.`, 'info');
      await refreshData();
    } catch {
      showToast('Failed to cancel token', 'error');
    }
  };

  const joinQueue = async (serviceId: string, priority: QueuePriority = 'NORMAL', type: QueueType = 'WALK_IN') => {
    const service = services.find((s) => s.id === serviceId) || services[0];
    if (!user) throw new Error('User must be logged in to join queue');

    const entry = await queueService.joinQueue({
      serviceId: service.id,
      serviceName: service.name,
      organizationId: service.organizationId,
      organizationName: service.organizationName || 'City Care Clinic',
      userId: user.id,
      userName: user.name,
      userPhone: user.phone,
      priority,
      type,
    });

    showToast(`You joined the queue for ${service.name}. Token: ${entry.tokenNumber}`, 'success');
    await refreshData();
    return entry;
  };

  const leaveQueue = async (tokenNumber: string) => {
    await queueService.leaveQueue(tokenNumber);
    showToast(`You have left the queue for token ${tokenNumber}`, 'info');
    await refreshData();
  };

  const bookAppointment = async (serviceId: string, date: string, timeSlot: string, notes?: string) => {
    if (!user) throw new Error('User must be logged in');
    const service = services.find((s) => s.id === serviceId) || services[0];

    const appt = await appointmentService.create({
      userId: user.id,
      userName: user.name,
      userPhone: user.phone,
      organizationId: service.organizationId,
      organizationName: service.organizationName || 'City Care Clinic',
      serviceId: service.id,
      serviceName: service.name,
      date,
      timeSlot,
      notes,
    });

    await notificationService.create({
      userId: user.id,
      title: 'Appointment Booked',
      message: `Appointment ${appt.id} confirmed for ${service.name} on ${date} at ${timeSlot}.`,
      type: 'APPOINTMENT',
      link: '/user/appointments',
    });

    showToast(`Appointment ${appt.id} booked successfully!`, 'success');
    await refreshData();
    return appt;
  };

  const cancelAppointment = async (id: string) => {
    await appointmentService.cancel(id);
    showToast(`Appointment ${id} cancelled`, 'info');
    await refreshData();
  };

  const addService = async (newService: Omit<Service, 'id'>) => {
    const created = await serviceService.create(newService);
    showToast(`Service "${created.name}" created successfully`, 'success');
    await refreshData();
    return created;
  };

  const updateService = async (id: string, updates: Partial<Service>) => {
    const updated = await serviceService.update(id, updates);
    showToast(`Service "${updated.name}" updated`, 'success');
    await refreshData();
    return updated;
  };

  const deleteService = async (id: string) => {
    await serviceService.delete(id);
    showToast('Service deleted', 'info');
    await refreshData();
  };

  const updateCounterStatus = async (id: string, status: Counter['status']) => {
    await counterService.updateStatus(id, status);
    showToast(`Counter status updated to ${status}`, 'success');
    await refreshData();
  };

  const assignCounterService = async (id: string, serviceId: string, serviceName: string) => {
    await counterService.assignService(id, serviceId, serviceName);
    showToast(`Assigned ${serviceName} to counter`, 'success');
    await refreshData();
  };

  const markNotificationRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = async () => {
    await notificationService.markAllAsRead(user?.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const resetAllData = () => {
    queueService.resetMockData();
    refreshData();
    showToast('Mock data reset to original defaults', 'info');
  };

  return (
    <QueueContext.Provider
      value={{
        queueEntries,
        counters,
        services,
        appointments,
        notifications,
        activities,
        userActiveQueueEntry,
        staffCounter,
        staffServingEntry,
        staffWaitingQueue,
        isLoading,
        callNextToken,
        recallToken,
        skipToken,
        transferToken,
        cancelToken,
        joinQueue,
        leaveQueue,
        bookAppointment,
        cancelAppointment,
        addService,
        updateService,
        deleteService,
        updateCounterStatus,
        assignCounterService,
        markNotificationRead,
        markAllNotificationsRead,
        resetAllData,
        refreshData,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = (): QueueContextType => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};
