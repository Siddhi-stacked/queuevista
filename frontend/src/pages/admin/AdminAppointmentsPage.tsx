import React, { useState } from 'react';
import { useQueue } from '../../context/QueueContext';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Appointment } from '../../types';
import { Search, Download, Calendar } from 'lucide-react';

export const AdminAppointmentsPage: React.FC = () => {
  const { appointments, cancelAppointment } = useQueue();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = appointments.filter((item) => {
    const matchesSearch =
      item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serviceName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const columns: Column<Appointment>[] = [
    {
      key: 'id',
      header: 'ID',
      render: (item) => (
        <span className="font-mono font-bold text-xs text-[#0F172A]">{item.id}</span>
      ),
    },
    {
      key: 'user',
      header: 'Visitor / Patient',
      render: (item) => (
        <div>
          <span className="font-semibold text-xs text-[#1E293B] block">{item.userName}</span>
          <span className="text-[11px] text-gray-500">{item.userPhone}</span>
        </div>
      ),
    },
    {
      key: 'service',
      header: 'Department',
      render: (item) => <span className="text-xs text-[#334155]">{item.serviceName}</span>,
    },
    {
      key: 'date',
      header: 'Scheduled Slot',
      render: (item) => (
        <div>
          <span className="text-xs font-medium text-[#1E293B] block">{item.date}</span>
          <span className="text-[11px] text-[#2563EB] font-bold">{item.timeSlot}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => <Badge variant={item.status}>{item.status}</Badge>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <div>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A]">Master Appointments</h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Central registry of all scheduled bookings across clinic and bank counters.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={<Download className="w-4 h-4" />}
          onClick={() => alert('Exporting appointments schedule...')}
        >
          Export Schedule
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded border border-[#E5E7EB] p-4 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search patient, Appt ID, or department..."
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
        emptyMessage="No appointment bookings found."
      />
    </div>
  );
};
