import React from 'react';
import { Appointment } from '../../types';
import { Badge } from './Badge';
import { Button } from './Button';
import { Calendar, Clock, MapPin } from 'lucide-react';

export interface AppointmentCardProps {
  appointment: Appointment;
  onCancel?: (id: string) => void;
  onCheckIn?: (id: string) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onCancel,
  onCheckIn,
}) => {
  return (
    <div className="bg-white rounded border border-[#E5E7EB] p-4 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-2.5 border-b border-[#F1F5F9]">
          <span className="text-xs font-semibold text-[#0F172A]">{appointment.id}</span>
          <Badge variant={appointment.status}>{appointment.status}</Badge>
        </div>

        <div className="mt-3">
          <h4 className="text-sm font-bold text-[#1E293B]">{appointment.serviceName}</h4>
          <p className="text-xs text-[#64748B] flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            {appointment.organizationName}
          </p>
        </div>

        <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs text-[#334155] bg-[#F8FAFC] p-2.5 rounded border border-[#F1F5F9]">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>{appointment.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>{appointment.timeSlot}</span>
          </div>
        </div>

        {appointment.notes && (
          <p className="mt-2 text-[11px] text-[#64748B] italic">Note: {appointment.notes}</p>
        )}
      </div>

      {(onCancel || onCheckIn) && appointment.status === 'SCHEDULED' && (
        <div className="mt-4 pt-2.5 border-t border-[#F1F5F9] flex items-center justify-end gap-2">
          {onCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancel(appointment.id)}
              className="text-[#DC2626] border-red-200 hover:bg-red-50 text-xs"
            >
              Cancel
            </Button>
          )}
          {onCheckIn && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onCheckIn(appointment.id)}
              className="text-xs"
            >
              Check In
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
