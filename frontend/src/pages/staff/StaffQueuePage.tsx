import React, { useState } from 'react';
import { useQueue } from '../../context/QueueContext';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { QueueEntry } from '../../types';
import { Search, Play, ArrowRightLeft } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';

export const StaffQueuePage: React.FC = () => {
  const { queueEntries, services, callNextToken, transferToken } = useQueue();
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [tokenToTransfer, setTokenToTransfer] = useState<string | null>(null);
  const [targetServiceId, setTargetServiceId] = useState(services[0]?.id || 'S-01');

  const filteredQueue = queueEntries.filter((item) => {
    const isWaitingOrServing = item.status === 'WAITING' || item.status === 'SERVING';
    const matchesSearch =
      item.tokenNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.userPhone.includes(searchTerm);

    const matchesService = serviceFilter === 'ALL' || item.serviceId === serviceFilter;
    const matchesPriority = priorityFilter === 'ALL' || item.priority === priorityFilter;

    return isWaitingOrServing && matchesSearch && matchesService && matchesPriority;
  });

  const handleTransferConfirm = async () => {
    if (tokenToTransfer) {
      await transferToken(tokenToTransfer, targetServiceId);
      setTransferModalOpen(false);
      setTokenToTransfer(null);
    }
  };

  const columns: Column<QueueEntry>[] = [
    {
      key: 'position',
      header: 'Pos',
      render: (item) => (
        <span className="font-bold text-xs text-[#0F172A]">
          {item.status === 'SERVING' ? 'SERVING' : `#${item.position}`}
        </span>
      ),
    },
    {
      key: 'token',
      header: 'Token',
      render: (item) => (
        <span className="font-mono font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
          {item.tokenNumber}
        </span>
      ),
    },
    {
      key: 'user',
      header: 'Patient / Visitor',
      render: (item) => (
        <div>
          <span className="font-semibold text-xs text-[#1E293B] block">{item.userName}</span>
          <span className="text-[11px] text-gray-500">{item.userPhone}</span>
        </div>
      ),
    },
    {
      key: 'service',
      header: 'Service Desk',
      render: (item) => <span className="text-xs text-[#334155]">{item.serviceName}</span>,
    },
    {
      key: 'type',
      header: 'Type',
      render: (item) => (
        <span className="text-xs text-gray-600">
          {item.type === 'APPOINTMENT' ? 'Appointment' : 'Walk-in'}
        </span>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (item) => <Badge variant={item.priority}>{item.priority}</Badge>,
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
        <div className="flex items-center gap-1.5">
          {item.status === 'WAITING' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setTokenToTransfer(item.tokenNumber);
                setTransferModalOpen(true);
              }}
              icon={<ArrowRightLeft className="w-3.5 h-3.5" />}
            >
              Transfer
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
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A]">Live Waiting Queue</h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Monitor patient queues across all department desks in real time.
          </p>
        </div>

        <Button
          onClick={() => callNextToken('C002')}
          icon={<Play className="w-4 h-4 fill-current" />}
          size="sm"
        >
          Call Next at Counter 2
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded border border-[#E5E7EB] p-4 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search patient name, token, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="md:w-56">
          <Select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Services' },
              ...services.map((s) => ({ value: s.id, label: s.name })),
            ]}
          />
        </div>

        <div className="md:w-44">
          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Priorities' },
              { value: 'NORMAL', label: 'Normal' },
              { value: 'HIGH', label: 'High Priority' },
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredQueue}
        keyField="id"
        emptyMessage="No patients currently waiting under this filter criteria."
      />

      {/* Transfer Modal */}
      <Modal
        isOpen={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        title={`Transfer Token ${tokenToTransfer}`}
        subtitle="Route token to another service queue"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setTransferModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleTransferConfirm}>
              Confirm Transfer
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Target Service"
            value={targetServiceId}
            onChange={(e) => setTargetServiceId(e.target.value)}
            options={services.map((s) => ({
              value: s.id,
              label: `${s.name} (${s.organizationName || 'City Care Clinic'})`,
            }))}
          />
        </div>
      </Modal>
    </div>
  );
};
