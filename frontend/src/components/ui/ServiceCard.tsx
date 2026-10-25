import React from 'react';
import { Service } from '../../types';
import { Badge } from './Badge';
import { Button } from './Button';
import { Clock, Users, Calendar } from 'lucide-react';

export interface ServiceCardProps {
  service: Service;
  onJoin: (service: Service) => void;
  onBook: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onJoin, onBook }) => {
  return (
    <div className="bg-white rounded border border-[#E5E7EB] shadow-sm p-4 flex flex-col justify-between hover:border-blue-300 transition-colors">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-base font-semibold text-[#0F172A]">{service.name}</h4>
            <p className="text-xs text-[#64748B] mt-0.5">{service.organizationName || 'City Care Clinic'}</p>
          </div>
          <Badge variant={service.status}>{service.status}</Badge>
        </div>

        <p className="text-xs text-[#475569] mt-2.5 line-clamp-2 leading-relaxed">
          {service.description}
        </p>

        <div className="grid grid-cols-2 gap-2 mt-4 py-2.5 px-3 bg-[#F8FAFC] rounded border border-[#F1F5F9] text-xs">
          <div className="flex items-center gap-1.5 text-[#334155]">
            <Users className="w-4 h-4 text-[#2563EB]" />
            <span>
              <strong className="text-[#0F172A]">{service.currentWaitingCount ?? 4}</strong> waiting
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[#334155]">
            <Clock className="w-4 h-4 text-[#2563EB]" />
            <span>
              ~<strong className="text-[#0F172A]">{service.averageServiceTimeMinutes} min</strong> avg
            </span>
          </div>
        </div>

        <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#64748B]">
          <span>Hours: {service.operatingHours}</span>
          {service.priorityEnabled && (
            <span className="text-indigo-600 font-medium">Priority queue enabled</span>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onBook(service)}
          icon={<Calendar className="w-3.5 h-3.5" />}
        >
          Book Slot
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="flex-1"
          onClick={() => onJoin(service)}
        >
          Join Queue
        </Button>
      </div>
    </div>
  );
};
