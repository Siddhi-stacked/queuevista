import React, { useState } from 'react';
import { useQueue } from '../../context/QueueContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { DataTable, Column } from '../../components/ui/DataTable';
import { QueueEntry, Service } from '../../types';
import { Users, Clock, Play, ArrowRight, Radio } from 'lucide-react';

export const AdminQueuesPage: React.FC = () => {
  const { services, queueEntries, callNextToken } = useQueue();
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || 'S-01');

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];

  const serviceQueue = queueEntries
    .filter((q) => q.serviceId === selectedServiceId && (q.status === 'WAITING' || q.status === 'SERVING'))
    .sort((a, b) => a.position - b.position);

  const columns: Column<QueueEntry>[] = [
    {
      key: 'position',
      header: 'Position',
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
        <span className="font-mono font-bold text-xs text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
          {item.tokenNumber}
        </span>
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
      key: 'wait',
      header: 'Wait Duration',
      render: (item) => <span className="text-xs text-gray-700">{item.estimatedWaitMinutes} min</span>,
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
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A]">Queue Operations Monitor</h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
          Inspect waiting lines and active token movement per service desk.
        </p>
      </div>

      {/* Per-Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {services.map((svc) => {
          const isSelected = svc.id === selectedServiceId;
          const waitingInSvc = queueEntries.filter(
            (q) => q.serviceId === svc.id && q.status === 'WAITING'
          ).length;

          return (
            <div
              key={svc.id}
              onClick={() => setSelectedServiceId(svc.id)}
              className={`p-4 rounded border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-blue-50/40 border-[#2563EB] shadow-sm ring-1 ring-[#2563EB]'
                  : 'bg-white border-[#E5E7EB] hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs font-bold text-[#0F172A]">{svc.name}</span>
                <Badge variant={svc.status}>{svc.status}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div>
                  <span className="text-gray-400 block text-[11px]">Now Serving</span>
                  <span className="text-base font-bold text-emerald-600">
                    {svc.currentServingToken || 'None'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Waiting</span>
                  <span className="text-base font-bold text-[#2563EB]">{waitingInSvc} in line</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Queue Inspection Detail */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">
              Live Queue: {selectedService.name}
            </h3>
            <p className="text-xs text-[#64748B]">
              Real-time sequence of patients waiting to be called.
            </p>
          </div>

          <Button
            size="sm"
            onClick={() => callNextToken('C002')}
            icon={<Play className="w-3.5 h-3.5 fill-current" />}
          >
            Advance Queue
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={serviceQueue}
          keyField="id"
          emptyMessage="No one is currently waiting in this service queue."
        />
      </div>
    </div>
  );
};
