import React, { useState, useMemo } from 'react';
import { useQueue } from '../../context/QueueContext';
import { useAuth } from '../../context/AuthContext';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Pagination } from '../../components/ui/Pagination';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { QueueEntry } from '../../types';
import { Search, Download } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const HistoryPage: React.FC = () => {
  const { user } = useAuth();
  const { queueEntries } = useQueue();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Filter history for current user or all completed/cancelled entries
  const userHistory = useMemo(() => {
    return queueEntries.filter((q) => {
      const isRelevant = q.userId === user?.id || q.status === 'COMPLETED' || q.status === 'SKIPPED' || q.status === 'CANCELLED';
      const matchesSearch =
        q.tokenNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.organizationName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || q.status === statusFilter;

      return isRelevant && matchesSearch && matchesStatus;
    });
  }, [queueEntries, user?.id, searchTerm, statusFilter]);

  const totalPages = Math.ceil(userHistory.length / pageSize) || 1;
  const paginatedData = userHistory.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns: Column<QueueEntry>[] = [
    {
      key: 'date',
      header: 'Date & Time',
      render: (item) => (
        <div>
          <span className="font-medium text-[#1E293B]">
            {new Date(item.joinedAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
          <span className="block text-[11px] text-[#64748B]">
            {new Date(item.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      ),
    },
    {
      key: 'organization',
      header: 'Organization',
      render: (item) => (
        <span className="text-xs text-[#334155] font-medium">{item.organizationName}</span>
      ),
    },
    {
      key: 'service',
      header: 'Service',
      render: (item) => (
        <span className="text-xs font-semibold text-[#0F172A]">{item.serviceName}</span>
      ),
    },
    {
      key: 'token',
      header: 'Token',
      render: (item) => (
        <span className="font-mono font-bold text-[#2563EB] text-sm bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
          {item.tokenNumber}
        </span>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (item) => (
        <span className="text-xs text-[#475569]">
          {item.type === 'APPOINTMENT' ? 'Appointment' : 'Walk-in'}
        </span>
      ),
    },
    {
      key: 'waitTime',
      header: 'Wait Time',
      render: (item) => (
        <span className="text-xs font-medium text-[#334155]">
          {item.estimatedWaitMinutes || 15} min
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => <Badge variant={item.status}>{item.status}</Badge>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A]">Queue History</h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Archived logs of your visited services, completed tokens, and wait durations.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={<Download className="w-4 h-4" />}
          onClick={() => alert('Exporting history report as CSV...')}
        >
          Export CSV
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded border border-[#E5E7EB] p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search by token, service, or clinic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="sm:w-48">
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: 'COMPLETED', label: 'Completed' },
              { value: 'CANCELLED', label: 'Cancelled' },
              { value: 'SKIPPED', label: 'Skipped' },
            ]}
          />
        </div>
      </div>

      {/* History Table */}
      <div className="space-y-2">
        <DataTable
          columns={columns}
          data={paginatedData}
          keyField="id"
          emptyMessage="No matching queue history records found."
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={userHistory.length}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
};
