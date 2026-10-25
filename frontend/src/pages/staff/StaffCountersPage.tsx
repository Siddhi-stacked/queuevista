import React, { useState } from 'react';
import { useQueue } from '../../context/QueueContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { Counter } from '../../types';
import { Monitor, User, Power, Settings2 } from 'lucide-react';

export const StaffCountersPage: React.FC = () => {
  const { counters, services, updateCounterStatus, assignCounterService } = useQueue();

  const [selectedCounter, setSelectedCounter] = useState<Counter | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [newServiceId, setNewServiceId] = useState('');

  const handleOpenChangeService = (counter: Counter) => {
    setSelectedCounter(counter);
    setNewServiceId(counter.serviceId);
    setIsServiceModalOpen(true);
  };

  const handleConfirmChangeService = async () => {
    if (selectedCounter && newServiceId) {
      const targetService = services.find((s) => s.id === newServiceId);
      if (targetService) {
        await assignCounterService(selectedCounter.id, targetService.id, targetService.name);
      }
      setIsServiceModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A]">Counter Stations</h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
          Live status of service desks, assigned operators, and currently serving tokens.
        </p>
      </div>

      {/* Counters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {counters.map((counter) => {
          const isActive = counter.status === 'ACTIVE';

          return (
            <Card key={counter.id} className="flex flex-col justify-between">
              <div>
                <CardHeader
                  title={
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-[#2563EB]" />
                      <span>{counter.name}</span>
                    </div>
                  }
                  action={<Badge variant={counter.status}>{counter.status}</Badge>}
                />

                <CardContent className="space-y-4 pt-4">
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide block">
                      Assigned Service
                    </span>
                    <h4 className="text-sm font-bold text-[#0F172A] mt-0.5">
                      {counter.serviceName}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
                    <div>
                      <span className="text-[11px] text-gray-500 block">Serving Token</span>
                      <span className="text-lg font-black text-emerald-600">
                        {counter.currentServingToken || 'None'}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-gray-500 block">Staff Operator</span>
                      <span className="text-xs font-semibold text-[#1E293B] flex items-center gap-1 justify-end">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        {counter.staffName || 'Unassigned'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </div>

              {/* Action Buttons */}
              <div className="px-5 py-3.5 bg-[#F8FAFC] border-t border-[#F1F5F9] flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenChangeService(counter)}
                  icon={<Settings2 className="w-3.5 h-3.5" />}
                >
                  Change Service
                </Button>

                {isActive ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[#DC2626] border-red-200 hover:bg-red-50"
                    onClick={() => updateCounterStatus(counter.id, 'IDLE')}
                    icon={<Power className="w-3.5 h-3.5" />}
                  >
                    Deactivate
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => updateCounterStatus(counter.id, 'ACTIVE')}
                    icon={<Power className="w-3.5 h-3.5" />}
                  >
                    Activate
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Change Service Modal */}
      {selectedCounter && (
        <Modal
          isOpen={isServiceModalOpen}
          onClose={() => setIsServiceModalOpen(false)}
          title={`Change Service - ${selectedCounter.name}`}
          subtitle="Re-assign this counter to a different service department"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setIsServiceModalOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleConfirmChangeService}>
                Update Service
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <Select
              label="Select New Service"
              value={newServiceId}
              onChange={(e) => setNewServiceId(e.target.value)}
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
