export type UserRole = 'USER' | 'STAFF' | 'ADMIN';

export interface User {
  id: string; // e.g. U001, S001, A001
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  assignedCounterId?: string;
  organizationId?: string;
  status: 'ACTIVE' | 'INACTIVE';
  lastActive?: string;
}

export interface Organization {
  id: string; // e.g. ORG-01
  name: string;
  category: 'Healthcare' | 'Banking' | 'Government' | 'Utility';
  address: string;
  phone: string;
  operatingHours: string;
}

export interface Service {
  id: string; // e.g. S-01
  organizationId: string;
  organizationName?: string;
  name: string;
  description: string;
  assignedCounterId?: string;
  averageServiceTimeMinutes: number;
  priorityEnabled: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  maxQueueSize: number;
  operatingHours: string;
  currentWaitingCount?: number;
  currentServingToken?: string;
}

export type CounterStatus = 'ACTIVE' | 'IDLE' | 'CLOSED';

export interface Counter {
  id: string; // e.g. C001, C002, C003
  organizationId: string;
  counterNumber: number;
  name: string; // e.g. "Counter 2"
  serviceId: string;
  serviceName?: string;
  staffId?: string;
  staffName?: string;
  status: CounterStatus;
  currentServingToken?: string;
}

export type QueueStatus = 'WAITING' | 'SERVING' | 'COMPLETED' | 'SKIPPED' | 'CANCELLED';
export type QueueType = 'WALK_IN' | 'APPOINTMENT';
export type QueuePriority = 'NORMAL' | 'HIGH';

export interface QueueEntry {
  id: string; // e.g. Q-1001
  tokenNumber: string; // e.g. D-104, D-108
  userId: string;
  userName: string;
  userPhone: string;
  organizationId: string;
  organizationName: string;
  serviceId: string;
  serviceName: string;
  counterId?: string;
  counterNumber?: number;
  counterName?: string;
  position: number; // 1-based index in queue
  peopleAhead: number;
  estimatedWaitMinutes: number;
  status: QueueStatus;
  priority: QueuePriority;
  type: QueueType;
  joinedAt: string;
  calledAt?: string;
  completedAt?: string;
}

export type AppointmentStatus = 'SCHEDULED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED';

export interface Appointment {
  id: string; // e.g. A-201, A-204
  userId: string;
  userName: string;
  userPhone: string;
  organizationId: string;
  organizationName: string;
  serviceId: string;
  serviceName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:30 AM"
  status: AppointmentStatus;
  createdAt: string;
  notes?: string;
}

export type NotificationType = 'INFO' | 'QUEUE_UPDATE' | 'APPOINTMENT' | 'ALERT';

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  timestamp: string;
  link?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  description: string;
  type: 'TOKEN_CALLED' | 'TOKEN_COMPLETED' | 'TOKEN_SKIPPED' | 'APPOINTMENT_CHECKIN' | 'SERVICE_UPDATE';
}

export interface AnalyticsSummary {
  totalServed: number;
  currentlyWaiting: number;
  averageWaitMinutes: number;
  noShows: number;
  cancellations: number;
  peakHour: string;
  averageServiceTimeMinutes: number;
  completedByHour: { hour: string; count: number }[];
  waitTimesByService: { serviceName: string; averageWaitMinutes: number }[];
  statusDistribution: { status: string; count: number }[];
}
