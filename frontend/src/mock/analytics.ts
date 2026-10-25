import { ActivityLog, AnalyticsSummary } from '../types';

export const mockAnalyticsSummary: AnalyticsSummary = {
  totalServed: 128,
  currentlyWaiting: 24,
  averageWaitMinutes: 14,
  noShows: 7,
  cancellations: 12,
  peakHour: '11:00 AM - 12:00 PM',
  averageServiceTimeMinutes: 11,
  completedByHour: [
    { hour: '08:00', count: 8 },
    { hour: '09:00', count: 16 },
    { hour: '10:00', count: 22 },
    { hour: '11:00', count: 28 },
    { hour: '12:00', count: 24 },
    { hour: '13:00', count: 14 },
    { hour: '14:00', count: 16 },
  ],
  waitTimesByService: [
    { serviceName: 'General Consultation', averageWaitMinutes: 15 },
    { serviceName: 'Billing Counter', averageWaitMinutes: 6 },
    { serviceName: 'Document Verification', averageWaitMinutes: 12 },
    { serviceName: 'Pharmacy Counter', averageWaitMinutes: 8 },
  ],
  statusDistribution: [
    { status: 'Completed', count: 128 },
    { status: 'Waiting', count: 24 },
    { status: 'Serving', count: 2 },
    { status: 'Cancelled', count: 12 },
    { status: 'No-Show / Skipped', count: 7 },
  ],
};

export const mockRecentActivities: ActivityLog[] = [
  {
    id: 'ACT-01',
    timestamp: '2 mins ago',
    description: 'Counter 2 called token D-104 (General Consultation)',
    type: 'TOKEN_CALLED',
  },
  {
    id: 'ACT-02',
    timestamp: '5 mins ago',
    description: 'Token D-103 completed at Counter 2 (Service duration 17 min)',
    type: 'TOKEN_COMPLETED',
  },
  {
    id: 'ACT-03',
    timestamp: '11 mins ago',
    description: 'Appointment A-204 checked in (Meera Nambiar, priority token D-106)',
    type: 'APPOINTMENT_CHECKIN',
  },
  {
    id: 'ACT-04',
    timestamp: '18 mins ago',
    description: 'Counter 2 skipped token D-102 (Patient did not report on call)',
    type: 'TOKEN_SKIPPED',
  },
  {
    id: 'ACT-05',
    timestamp: '30 mins ago',
    description: 'Counter 1 activated for Billing Counter by Pooja Verma',
    type: 'SERVICE_UPDATE',
  }
];
