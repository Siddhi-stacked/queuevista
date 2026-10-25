import { Organization } from '../types';

export const mockOrganizations: Organization[] = [
  {
    id: 'ORG-01',
    name: 'City Care Clinic',
    category: 'Healthcare',
    address: '42 Health Avenue, Central District, Bengaluru',
    phone: '+91 80 2345 6789',
    operatingHours: '08:00 AM - 08:00 PM',
  },
  {
    id: 'ORG-02',
    name: 'Apex National Bank',
    category: 'Banking',
    address: '15 Financial Tower, MG Road, Bengaluru',
    phone: '+91 80 2345 9900',
    operatingHours: '09:30 AM - 04:30 PM',
  },
  {
    id: 'ORG-03',
    name: 'Regional Transport Office (RTO)',
    category: 'Government',
    address: 'Sector 5, Civic Complex, Indiranagar',
    phone: '+91 80 2345 1122',
    operatingHours: '10:00 AM - 05:00 PM',
  }
];
