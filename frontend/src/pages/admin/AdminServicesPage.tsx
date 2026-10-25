import React, { useState } from 'react';
import { useQueue } from '../../context/QueueContext';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Service } from '../../types';
import { Plus, Edit2, Trash2, Power, Layers } from 'lucide-react';

export const AdminServicesPage: React.FC = () => {
  const { services, addService, updateService, deleteService } = useQueue();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [avgTime, setAvgTime] = useState(15);
  const [priorityEnabled, setPriorityEnabled] = useState(true);
  const [maxQueueSize, setMaxQueueSize] = useState(50);
  const [operatingHours, setOperatingHours] = useState('08:00 AM - 02:00 PM');

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingService(null);
    setName('');
    setDescription('');
    setAvgTime(15);
    setPriorityEnabled(true);
    setMaxQueueSize(50);
    setOperatingHours('08:00 AM - 04:00 PM');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (svc: Service) => {
    setEditingService(svc);
    setName(svc.name);
    setDescription(svc.description);
    setAvgTime(svc.averageServiceTimeMinutes);
    setPriorityEnabled(svc.priorityEnabled);
    setMaxQueueSize(svc.maxQueueSize);
    setOperatingHours(svc.operatingHours);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!name) return;

    if (editingService) {
      await updateService(editingService.id, {
        name,
        description,
        averageServiceTimeMinutes: Number(avgTime),
        priorityEnabled,
        maxQueueSize: Number(maxQueueSize),
        operatingHours,
      });
    } else {
      await addService({
        name,
        description,
        organizationId: 'ORG-01',
        organizationName: 'City Care Clinic',
        averageServiceTimeMinutes: Number(avgTime),
        priorityEnabled,
        maxQueueSize: Number(maxQueueSize),
        operatingHours,
        status: 'ACTIVE',
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (deleteConfirmId) {
      await deleteService(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const columns: Column<Service>[] = [
    {
      key: 'name',
      header: 'Service Name',
      render: (item) => (
        <div>
          <span className="font-bold text-xs text-[#0F172A] block">{item.name}</span>
          <span className="text-[11px] text-gray-500 max-w-xs truncate block">
            {item.description}
          </span>
        </div>
      ),
    },
    {
      key: 'organization',
      header: 'Organization',
      render: (item) => (
        <span className="text-xs text-gray-700">{item.organizationName || 'City Care Clinic'}</span>
      ),
    },
    {
      key: 'avgTime',
      header: 'Avg Service Time',
      render: (item) => (
        <span className="text-xs font-semibold text-[#2563EB]">
          {item.averageServiceTimeMinutes} mins
        </span>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (item) => (
        <Badge variant={item.priorityEnabled ? 'HIGH' : 'NORMAL'}>
          {item.priorityEnabled ? 'Enabled' : 'Disabled'}
        </Badge>
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
            icon={<Edit2 className="w-3.5 h-3.5" />}
          >
            Edit
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              updateService(item.id, {
                status: item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
              })
            }
            icon={<Power className="w-3.5 h-3.5" />}
          >
            {item.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => setDeleteConfirmId(item.id)}
            icon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Delete
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
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A]">Service Directory</h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Configure queues, service durations, priority gates, and operating hours.
          </p>
        </div>

        <Button onClick={handleOpenAdd} icon={<Plus className="w-4 h-4" />} size="sm">
          Add New Service
        </Button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={services}
        keyField="id"
        emptyMessage="No services configured."
      />

      {/* Add / Edit Service Modal (SPEC.md Section 10) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? 'Edit Service' : 'Add New Service'}
        subtitle="Saved service will immediately become available in the directory."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              {editingService ? 'Save Changes' : 'Create Service'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Service Name"
            placeholder="e.g. Pediatric Consultation or Document Verification"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Description"
            placeholder="e.g. Routine checkups and developmental screening"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Average Service Time (Mins)"
              type="number"
              value={avgTime}
              onChange={(e) => setAvgTime(Number(e.target.value))}
              min={1}
            />

            <Input
              label="Max Queue Capacity"
              type="number"
              value={maxQueueSize}
              onChange={(e) => setMaxQueueSize(Number(e.target.value))}
              min={5}
            />
          </div>

          <Input
            label="Operating Hours"
            value={operatingHours}
            onChange={(e) => setOperatingHours(e.target.value)}
            placeholder="e.g. 08:00 AM - 02:00 PM"
          />

          <label className="flex items-center gap-2 cursor-pointer text-xs pt-2">
            <input
              type="checkbox"
              checked={priorityEnabled}
              onChange={(e) => setPriorityEnabled(e.target.checked)}
              className="rounded border-gray-300 text-[#2563EB] focus:ring-[#2563EB]"
            />
            <span className="font-semibold text-gray-800">
              Enable priority queue tokens (Elderly, emergencies, VIP)
            </span>
          </label>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Service?"
        message="Are you sure you want to delete this service? All active tokens in this service will be cancelled."
        confirmText="Yes, Delete"
        isDestructive
      />
    </div>
  );
};
