import { NotificationItem } from '../types';

export const mockNotifications: NotificationItem[] = [
  {
    id: 'N-001',
    userId: 'U001',
    title: 'Token Generated',
    message: 'Your token D-108 for General Consultation is confirmed. Current serving is D-104.',
    type: 'QUEUE_UPDATE',
    read: false,
    timestamp: '15 minutes ago',
    link: '/user/queue/D-108',
  },
  {
    id: 'N-002',
    userId: 'U001',
    title: 'Queue Advancement',
    message: 'Position updated: Token D-104 is being served. You are now 4th in line.',
    type: 'QUEUE_UPDATE',
    read: false,
    timestamp: '10 minutes ago',
    link: '/user/queue/D-108',
  },
  {
    id: 'N-003',
    userId: 'U001',
    title: 'Upcoming Appointment Reminder',
    message: 'You have a scheduled appointment tomorrow at 10:30 AM for General Consultation at City Care Clinic.',
    type: 'APPOINTMENT',
    read: true,
    timestamp: '2 hours ago',
    link: '/user/appointments',
  },
  {
    id: 'N-004',
    userId: 'U001',
    title: 'Clinic Notice',
    message: 'Billing Counter will operate until 07:30 PM today due to scheduled maintenance.',
    type: 'INFO',
    read: true,
    timestamp: 'Yesterday',
  }
];
