import React, { useState } from 'react';
import { mockUsers } from '../../mock/users';
import { User, UserRole } from '../../types';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useToast } from '../../context/ToastContext';
import { useQueue } from '../../context/QueueContext';
import { Plus, Power, UserPlus, Shield } from 'lucide-react';

export const AdminStaffPage: React.FC = () => {
  const { counters } = useQueue();
  const { showToast } = useToast();

  const [staffList, setStaffList] = useState<User[]>(() => {
    return mockUsers.filter((u) => u.role === 'STAFF' || u.role === 'ADMIN');
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('STAFF');
  const [counterId, setCounterId] = useState('C002');

  const handleToggleStatus = (id: string) => {
    setStaffList((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const newStatus = u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
          showToast(`Updated status of ${u.name} to ${newStatus}`, 'info');
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const handleAddStaff = () => {
    if (!name || !email) return;

    const newStaff: User = {
      id: `S00${staffList.length + 1}`,
      name,
      email,
      phone: phone || '+91 98765 00000',
      role,
      assignedCounterId: counterId,
      status: 'ACTIVE',
      lastActive: 'Just registered',
    };

    setStaffList([...staffList, newStaff]);
    showToast(`Staff member "${name}" added successfully`, 'success');
    setIsModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
  };

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'Staff Member',
      render: (item) => (
        <div>
          <span className="font-bold text-xs text-[#0F172A] block">{item.name}</span>
          <span className="text-[11px] text-gray-500">{item.id}</span>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email / Phone',
      render: (item) => (
        <div>
          <span className="text-xs text-gray-800 block">{item.email}</span>
          <span className="text-[11px] text-gray-500">{item.phone}</span>
        </div>
      ),
    },
    {
      key: 'counter',
      header: 'Assigned Station',
      render: (item) => {
        const c = counters.find((counter) => counter.id === item.assignedCounterId);
        return (
          <span className="text-xs font-medium text-[#2563EB]">
            {c ? `${c.name} (${c.serviceName})` : item.assignedCounterId || 'Unassigned'}
          </span>
        );
      },
    },
    {
      key: 'role',
      header: 'Role',
      render: (item) => <Badge variant={item.role}>{item.role}</Badge>,
    },
    {
      key: 'lastActive',
      header: 'Last Active',
      render: (item) => <span className="text-xs text-gray-500">{item.lastActive || 'Today'}</span>,
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleToggleStatus(item.id)}
          icon={<Power className="w-3.5 h-3.5" />}
        >
          {item.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A]">Staff & Operators</h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Manage counter attendants, permissions, and service desk allocations.
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} icon={<UserPlus className="w-4 h-4" />} size="sm">
          Add Staff Member
        </Button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={staffList}
        keyField="id"
        emptyMessage="No staff members registered."
      />

      {/* Add Staff Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Staff Member"
        subtitle="Create credentials for counter operator or administrator"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleAddStaff}>
              Register Staff
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Deepak Joshi"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Email Address"
            placeholder="deepak@citycare.org"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Phone Number"
            placeholder="+91 98765 11122"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="System Role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              options={[
                { value: 'STAFF', label: 'Counter Staff' },
                { value: 'ADMIN', label: 'Administrator' },
              ]}
            />

            <Select
              label="Assigned Counter"
              value={counterId}
              onChange={(e) => setCounterId(e.target.value)}
              options={counters.map((c) => ({
                value: c.id,
                label: `${c.name} (${c.serviceName})`,
              }))}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
