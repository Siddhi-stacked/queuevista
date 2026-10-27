import { QueueEntry, QueuePriority, QueueType } from '../types';
import { mockQueueEntries } from '../mock/queueEntries';
import { analyticsService } from './analyticsService';
import { notificationService } from './notificationService';

const STORAGE_KEY = 'queuevista_queue_entries';

export const getStoredQueueEntries = (): QueueEntry[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return mockQueueEntries;
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockQueueEntries));
  return mockQueueEntries;
};

export const saveQueueEntries = (entries: QueueEntry[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

export const queueService = {
  getAll: async (): Promise<QueueEntry[]> => {
    await new Promise((res) => setTimeout(res, 80));
    return getStoredQueueEntries();
  },

  getByToken: async (tokenNumber: string): Promise<QueueEntry | undefined> => {
    await new Promise((res) => setTimeout(res, 80));
    return getStoredQueueEntries().find(
        (q) => q.tokenNumber.toUpperCase() === tokenNumber.toUpperCase()
    );
  },

  getActiveForService: async (serviceId: string): Promise<QueueEntry[]> => {
    await new Promise((res) => setTimeout(res, 80));
    return getStoredQueueEntries().filter(
        (q) => q.serviceId === serviceId && (q.status === 'WAITING' || q.status === 'SERVING')
    );
  },

  joinQueue: async (params: {
    serviceId: string;
    serviceName: string;
    organizationId: string;
    organizationName: string;
    userId: string;
    userName: string;
    userPhone: string;
    priority?: QueuePriority;
    type?: QueueType;
  }): Promise<QueueEntry> => {
    await new Promise((res) => setTimeout(res, 150));
    const entries = getStoredQueueEntries();

    // Determine token prefix
    const prefix = params.serviceName.includes('General')
        ? 'D'
        : params.serviceName.includes('Billing')
            ? 'B'
            : params.serviceName.includes('Document')
                ? 'V'
                : 'T';

    // Find highest token number for prefix
    const existingTokens = entries
        .filter((e) => e.tokenNumber.startsWith(prefix))
        .map((e) => parseInt(e.tokenNumber.split('-')[1], 10))
        .filter((n) => !isNaN(n));
    const nextNumber = existingTokens.length > 0 ? Math.max(...existingTokens) + 1 : 101;
    const tokenNumber = `${prefix}-${nextNumber}`;

    // Calculate waiting positions
    const waitingInService = entries.filter(
        (e) => e.serviceId === params.serviceId && e.status === 'WAITING'
    );
    const position = waitingInService.length + 1;
    const peopleAhead = waitingInService.length;
    const estimatedWaitMinutes = position * 4 + 2;

    const newEntry: QueueEntry = {
      id: `Q-${Date.now().toString().slice(-4)}`,
      tokenNumber,
      userId: params.userId,
      userName: params.userName,
      userPhone: params.userPhone,
      organizationId: params.organizationId,
      organizationName: params.organizationName,
      serviceId: params.serviceId,
      serviceName: params.serviceName,
      position,
      peopleAhead,
      estimatedWaitMinutes,
      status: 'WAITING',
      priority: params.priority || 'NORMAL',
      type: params.type || 'WALK_IN',
      joinedAt: new Date().toISOString(),
    };

    entries.push(newEntry);
    saveQueueEntries(entries);

    // Add initial user notification
    await notificationService.create({
      userId: params.userId,
      title: 'Joined Queue',
      message: `Your token ${tokenNumber} for ${params.serviceName} is confirmed. Position: #${position}.`,
      type: 'QUEUE_UPDATE',
      link: `/user/queue/${tokenNumber}`,
    });

    return newEntry;
  },

  leaveQueue: async (tokenNumber: string): Promise<QueueEntry> => {
    await new Promise((res) => setTimeout(res, 120));
    const entries = getStoredQueueEntries();
    const target = entries.find((e) => e.tokenNumber.toUpperCase() === tokenNumber.toUpperCase());
    if (!target) throw new Error('Token not found');

    target.status = 'CANCELLED';
    target.completedAt = new Date().toISOString();

    // Recalculate remaining waiting positions
    const remainingWaiting = entries.filter(
        (e) => e.serviceId === target.serviceId && e.status === 'WAITING'
    );
    remainingWaiting.forEach((entry, idx) => {
      entry.position = idx + 1;
      entry.peopleAhead = idx;
      entry.estimatedWaitMinutes = (idx + 1) * 4;
    });

    saveQueueEntries(entries);
    await analyticsService.logActivity(`Token ${tokenNumber} cancelled by user`, 'TOKEN_SKIPPED');

    return target;
  },

  callNextToken: async (counterId: string): Promise<{ completed?: QueueEntry; current?: QueueEntry }> => {
    await new Promise((res) => setTimeout(res, 150));
    const entries = getStoredQueueEntries();

    // Find currently serving token for this counter
    const currentServing = entries.find(
        (e) => e.counterId === counterId && e.status === 'SERVING'
    );

    let completedToken: QueueEntry | undefined;
    if (currentServing) {
      currentServing.status = 'COMPLETED';
      currentServing.completedAt = new Date().toISOString();
      completedToken = currentServing;
      await analyticsService.logActivity(
          `Token ${currentServing.tokenNumber} completed at Counter 2`,
          'TOKEN_COMPLETED'
      );
    }

    // Find next waiting token (Prioritize HIGH priority, then earliest joinedAt)
    const waitingTokens = entries
        .filter((e) => e.status === 'WAITING')
        .sort((a, b) => {
          if (a.priority === 'HIGH' && b.priority !== 'HIGH') return -1;
          if (b.priority === 'HIGH' && a.priority !== 'HIGH') return 1;
          return new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
        });

    let nextToken: QueueEntry | undefined;
    if (waitingTokens.length > 0) {
      nextToken = waitingTokens[0];
      nextToken.status = 'SERVING';
      nextToken.counterId = counterId;
      nextToken.counterNumber = 2;
      nextToken.counterName = 'Counter 2';
      nextToken.position = 0;
      nextToken.peopleAhead = 0;
      nextToken.estimatedWaitMinutes = 0;
      nextToken.calledAt = new Date().toISOString();

      // Notify the user whose token is being called
      await notificationService.create({
        userId: nextToken.userId,
        title: 'Token Being Called!',
        message: `Token ${nextToken.tokenNumber} is now being served at Counter 2. Please proceed immediately.`,
        type: 'QUEUE_UPDATE',
        link: `/user/queue/${nextToken.tokenNumber}`,
      });

      await analyticsService.logActivity(
          `Counter 2 called token ${nextToken.tokenNumber}`,
          'TOKEN_CALLED'
      );
    }

    // Recalculate remaining waiting tokens
    const remainingWaiting = entries.filter((e) => e.status === 'WAITING');
    remainingWaiting.forEach((entry, idx) => {
      entry.position = idx + 1;
      entry.peopleAhead = idx;
      entry.estimatedWaitMinutes = (idx + 1) * 4;
    });

    saveQueueEntries(entries);

    // Notify any remaining users that queue moved
    const user108 = remainingWaiting.find((e) => e.tokenNumber === 'D-108');
    if (user108) {
      await notificationService.create({
        userId: user108.userId,
        title: 'Queue Moved Forward',
        message: `Token ${nextToken ? nextToken.tokenNumber : 'next'} called. You are now at position #${user108.position} with ${user108.peopleAhead} people ahead.`,
        type: 'QUEUE_UPDATE',
        link: `/user/queue/D-108`,
      });
    }

    return { completed: completedToken, current: nextToken };
  },

  skipToken: async (counterId: string): Promise<QueueEntry | undefined> => {
    await new Promise((res) => setTimeout(res, 120));
    const entries = getStoredQueueEntries();
    const current = entries.find(
        (e) => e.counterId === counterId && e.status === 'SERVING'
    );
    if (!current) return undefined;

    current.status = 'SKIPPED';
    current.completedAt = new Date().toISOString();
    saveQueueEntries(entries);

    await analyticsService.logActivity(
        `Counter 2 skipped token ${current.tokenNumber} (No-show)`,
        'TOKEN_SKIPPED'
    );

    return current;
  },

  recallToken: async (counterId: string): Promise<QueueEntry | undefined> => {
    await new Promise((res) => setTimeout(res, 80));
    const entries = getStoredQueueEntries();
    const current = entries.find(
        (e) => e.counterId === counterId && e.status === 'SERVING'
    );
    if (current) {
      await notificationService.create({
        userId: current.userId,
        title: 'Token Recall Notification',
        message: `Recall: Token ${current.tokenNumber} please report to Counter 2 immediately.`,
        type: 'ALERT',
        link: `/user/queue/${current.tokenNumber}`,
      });
      await analyticsService.logActivity(
          `Counter 2 recalled token ${current.tokenNumber}`,
          'TOKEN_CALLED'
      );
    }
    return current;
  },

  cancelToken: async (tokenNumber: string): Promise<QueueEntry> => {
    return queueService.leaveQueue(tokenNumber);
  },

  resetMockData: () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('queuevista_services');
    localStorage.removeItem('queuevista_counters');
    localStorage.removeItem('queuevista_appointments');
    localStorage.removeItem('queuevista_notifications');
    localStorage.removeItem('queuevista_activities');
  }
};