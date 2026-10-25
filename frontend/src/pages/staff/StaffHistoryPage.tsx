import React, { useState } from 'react';
import { useQueue } from '../../context/QueueContext';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { QueueEntry } from '../../types';
import { Search, History, Download } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const StaffHistoryPage: React.FC = () => {
  const { queueEntries } = useQueue();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const historyEntries = queueEntries.filter((item) => {
    const isPast = item.status === 'COMPLETED' || item.status === 'SKIPPED' || item.status === 'CANCELLED';
    const matchesSearch =
      item.tokenNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.userName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;

    return isPast && matchesSearch && matchesStatus;
  });

  const columns: Column<QueueEntry>[] = [
    {
      key: 'token',
      header: 'Token',
      render: (item) => (
        <span className="font-mono font-bold text-xs text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
          {item.tokenNumber}
        </span>
      ),
    },
    {
      key: 'patient',
      header: 'Patient Name',
      render: (item) => (
        <span className="font-semibold text-xs text-[#1E293B]">{item.userName}</span>
      ),
    },
    {
      key: 'service',
      header: 'Service Desk',
      render: (item) => <span className="text-xs text-[#334155]">{item.serviceName}</span>,
    },
    {
      key: 'counter',
      header: 'Counter',
      render: (item) => (
        <span className="text-xs font-medium text-gray-700">{item.counterName || 'Counter 2'}</span>
      ),
    },
    {
      key: 'calledAt',
      header: 'Called At',
      render: (item) => (
        <span className="text-xs text-gray-600">
          {item.calledAt
            ? new Date(item.calledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '—'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Final Outcome',
      render: (item) => <Badge variant={item.status}>{item.status}</Badge>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A]">Counter Session History</h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Audit logs of tokens served, skipped, and completed at service desks.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={<Download className="w-4 h-4" />}
          onClick={() => alert('Exporting staff session log...')}
        >
          Export Log
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded border border-[#E5E7EB] p-4 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search by token or patient name..."
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
              { value: 'ALL', label: 'All Outcomes' },
              { value: 'COMPLETED', label: 'Completed' },
              { value: 'SKIPPED', label: 'Skipped' },
              { value: 'CANCELLED', label: 'Cancelled' },
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={historyEntries}
        keyField="id"
        emptyMessage="No completed counter activity found for this session."
      />
    </div>
  );
};
