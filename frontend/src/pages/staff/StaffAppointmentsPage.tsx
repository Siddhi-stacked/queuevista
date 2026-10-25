import React, { useState } from 'react';
import { useQueue } from '../../context/QueueContext';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { Appointment } from '../../types';
import { Search, CheckCircle, Calendar, UserCheck } from 'lucide-react';

export const StaffAppointmentsPage: React.FC = () => {
  const { appointments, services, joinQueue, cancelAppointment } = useQueue();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = appointments.filter((item) => {
    const matchesSearch =
      item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.userPhone.includes(searchTerm);

    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCheckIn = async (appt: Appointment) => {
    // Generate high priority token for checked-in appointment patient
    await joinQueue(appt.serviceId, 'HIGH', 'APPOINTMENT');
  };

  const columns: Column<Appointment>[] = [
    {
      key: 'id',
      header: 'Appt ID',
      render: (item) => (
        <span className="font-mono font-bold text-xs text-[#0F172A]">{item.id}</span>
      ),
    },
    {
      key: 'patient',
      header: 'Patient Details',
      render: (item) => (
        <div>
          <span className="font-semibold text-xs text-[#1E293B] block">{item.userName}</span>
          <span className="text-[11px] text-gray-500">{item.userPhone}</span>
        </div>
      ),
    },
    {
      key: 'service',
      header: 'Department / Service',
      render: (item) => <span className="text-xs text-[#334155]">{item.serviceName}</span>,
    },
    {
      key: 'date',
      header: 'Date & Slot',
      render: (item) => (
        <div>
          <span className="text-xs font-medium text-[#1E293B] block">{item.date}</span>
          <span className="text-[11px] text-[#2563EB] font-semibold">{item.timeSlot}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => <Badge variant={item.status}>{item.status}</Badge>,
    },
    {
      key: 'notes',
      header: 'Notes',
      render: (item) => (
        <span className="text-xs text-gray-500 italic max-w-xs truncate block">
          {item.notes || '—'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <div className="flex items-center gap-1.5">
          {item.status === 'SCHEDULED' && (
            <Button
              size="sm"
              className="text-xs py-1"
              onClick={() => handleCheckIn(item)}
              icon={<UserCheck className="w-3.5 h-3.5" />}
            >
              Check In
            </Button>
          )}
          {item.status === 'SCHEDULED' && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs py-1 text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => cancelAppointment(item.id)}
            >
              Cancel
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A]">Scheduled Appointments</h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
          Process arrivals and check in patients into the live priority queue.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded border border-[#E5E7EB] p-4 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search patient, Appt ID, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="md:w-48">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: 'SCHEDULED', label: 'Scheduled' },
              { value: 'CHECKED_IN', label: 'Checked In' },
              { value: 'COMPLETED', label: 'Completed' },
              { value: 'CANCELLED', label: 'Cancelled' },
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filtered}
        keyField="id"
        emptyMessage="No appointments found."
      />
    </div>
  );
};
