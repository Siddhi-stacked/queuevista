import React, { useState } from 'react';
import { useQueue } from '../../context/QueueContext';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Counter } from '../../types';
import { Plus, Power, Settings2, Monitor } from 'lucide-react';

export const AdminCountersPage: React.FC = () => {
  const { counters, services, updateCounterStatus, assignCounterService } = useQueue();

  const [selectedCounter, setSelectedCounter] = useState<Counter | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState('');

  const handleOpenEdit = (counter: Counter) => {
    setSelectedCounter(counter);
    setSelectedServiceId(counter.serviceId);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (selectedCounter && selectedServiceId) {
      const targetService = services.find((s) => s.id === selectedServiceId);
      if (targetService) {
        await assignCounterService(selectedCounter.id, targetService.id, targetService.name);
      }
      setIsEditModalOpen(false);
    }
  };

  const columns: Column<Counter>[] = [
    {
      key: 'name',
      header: 'Station',
      render: (item) => (
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-[#2563EB]" />
          <span className="font-bold text-xs text-[#0F172A]">{item.name}</span>
        </div>
      ),
    },
    {
      key: 'service',
      header: 'Assigned Service Desk',
      render: (item) => <span className="text-xs font-medium text-[#1E293B]">{item.serviceName}</span>,
    },
    {
      key: 'serving',
      header: 'Currently Serving',
      render: (item) => (
        <span className="font-mono font-bold text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
          {item.currentServingToken || 'None'}
        </span>
      ),
    },
    {
      key: 'staff',
      header: 'Staff Attendant',
      render: (item) => (
        <span className="text-xs text-gray-700">{item.staffName || 'Unassigned'}</span>
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
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenEdit(item)}
            icon={<Settings2 className="w-3.5 h-3.5" />}
          >
            Assign Service
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              updateCounterStatus(item.id, item.status === 'ACTIVE' ? 'IDLE' : 'ACTIVE')
            }
            icon={<Power className="w-3.5 h-3.5" />}
          >
            {item.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A]">Physical Counters</h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Configure service desks, toggle counter readiness, and map staff stations.
          </p>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={counters}
        keyField="id"
        emptyMessage="No counters found."
      />

      {/* Assign Service Modal */}
      {selectedCounter && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Assign Service to ${selectedCounter.name}`}
          subtitle="Map this physical counter to an active digital service queue"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveEdit}>
                Save Assignment
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <Select
              label="Service Desk"
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              options={services.map((s) => ({
                value: s.id,
                label: `${s.name} (${s.organizationName || 'City Care Clinic'})`,
              }))}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};
