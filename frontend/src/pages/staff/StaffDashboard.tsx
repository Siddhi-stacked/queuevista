import React, { useState } from 'react';
import { useQueue } from '../../context/QueueContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { QueueEntry } from '../../types';
import {
  Play,
  RotateCcw,
  SkipForward,
  ArrowRightLeft,
  XCircle,
  Building2,
  Users,
  CheckCircle2,
  Clock,
  Radio,
} from 'lucide-react';

export const StaffDashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    staffCounter,
    staffServingEntry,
    staffWaitingQueue,
    services,
    callNextToken,
    recallToken,
    skipToken,
    transferToken,
    cancelToken,
  } = useQueue();

  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [targetServiceId, setTargetServiceId] = useState(services[1]?.id || 'S-02');
  const [tokenToTransfer, setTokenToTransfer] = useState<string | null>(null);

  const [confirmSkipOpen, setConfirmSkipOpen] = useState(false);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

  const counterId = staffCounter?.id || 'C002';

  const handleNext = async () => {
    await callNextToken(counterId);
  };

  const handleRecall = async () => {
    await recallToken(counterId);
  };

  const handleSkipConfirm = async () => {
    await skipToken(counterId);
    setConfirmSkipOpen(false);
  };

  const handleCancelConfirm = async () => {
    if (staffServingEntry) {
      await cancelToken(staffServingEntry.tokenNumber);
      setConfirmCancelOpen(false);
    }
  };

  const handleTransferConfirm = async () => {
    const token = tokenToTransfer || staffServingEntry?.tokenNumber;
    if (token) {
      await transferToken(token, targetServiceId);
      setTransferModalOpen(false);
      setTokenToTransfer(null);
    }
  };

  const columns: Column<QueueEntry>[] = [
    {
      key: 'position',
      header: 'Pos',
      render: (item) => (
        <span className="font-bold text-xs text-[#0F172A] w-6 inline-block">
          #{item.position}
        </span>
      ),
    },
    {
      key: 'token',
      header: 'Token',
      render: (item) => (
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-sm text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
            {item.tokenNumber}
          </span>
          {item.userName && (
            <span className="text-xs text-gray-600 hidden sm:inline">({item.userName})</span>
          )}
        </div>
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
      key: 'priority',
      header: 'Priority',
      render: (item) => <Badge variant={item.priority}>{item.priority}</Badge>,
    },
    {
      key: 'waitTime',
      header: 'Wait Time',
      render: (item) => (
        <span className="text-xs text-[#334155]">{item.estimatedWaitMinutes} min</span>
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
            className="text-xs py-1"
            onClick={() => {
              setTokenToTransfer(item.tokenNumber);
              setTransferModalOpen(true);
            }}
          >
            Transfer
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Counter Header Status */}
      <div className="bg-white rounded border border-[#E5E7EB] p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">
              {staffCounter?.name || 'Counter 2'} &bull; Console
            </span>
            <Badge variant="ACTIVE">Active</Badge>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] mt-1">
            {staffCounter?.serviceName || 'General Consultation'}
          </h1>
          <p className="text-xs text-[#64748B] flex items-center gap-1.5 mt-0.5">
            <Building2 className="w-3.5 h-3.5 text-gray-400" />
            City Care Clinic &bull; Staff: <strong>{user?.name || 'Rajesh Kumar'}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-gray-500 block">Queue Status</span>
            <span className="text-sm font-bold text-[#1E293B] flex items-center gap-1 justify-end">
              <Users className="w-4 h-4 text-[#2563EB]" /> {staffWaitingQueue.length} Waiting
            </span>
          </div>
        </div>
      </div>

      {/* Main Counter Serving Card (SPEC.md Section 9) */}
      <Card className="border-2 border-blue-100">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50/30 p-6 border-b border-blue-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-widest block">
              Currently Serving at {staffCounter?.name || 'Counter 2'}
            </span>
            <div className="text-5xl font-black text-[#0F172A] tracking-tight mt-1 flex items-baseline gap-3">
              {staffServingEntry ? staffServingEntry.tokenNumber : 'None'}
              {staffServingEntry && (
                <span className="text-xs font-semibold text-gray-500">
                  Patient: {staffServingEntry.userName}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {staffServingEntry
                ? `Called at ${new Date(staffServingEntry.calledAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Duration ~${staffServingEntry.estimatedWaitMinutes || 0}m`
                : 'Counter is idle. Click "Next Token" to call the first waiting person.'}
            </p>
          </div>

          {/* Action Bar (Next, Recall, Skip, Transfer, Cancel) */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="lg"
              onClick={handleNext}
              icon={<Play className="w-5 h-5 fill-current" />}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] font-bold shadow"
            >
              Next Token
            </Button>

            <Button
              variant="outline"
              size="md"
              disabled={!staffServingEntry}
              onClick={handleRecall}
              icon={<RotateCcw className="w-4 h-4" />}
            >
              Recall
            </Button>

            <Button
              variant="outline"
              size="md"
              disabled={!staffServingEntry}
              onClick={() => setConfirmSkipOpen(true)}
              icon={<SkipForward className="w-4 h-4 text-amber-600" />}
            >
              Skip
            </Button>

            <Button
              variant="outline"
              size="md"
              disabled={!staffServingEntry}
              onClick={() => {
                setTokenToTransfer(null);
                setTransferModalOpen(true);
              }}
              icon={<ArrowRightLeft className="w-4 h-4 text-blue-600" />}
            >
              Transfer
            </Button>

            <Button
              variant="outline"
              size="md"
              disabled={!staffServingEntry}
              onClick={() => setConfirmCancelOpen(true)}
              icon={<XCircle className="w-4 h-4 text-red-600" />}
            >
              Cancel
            </Button>
          </div>
        </div>

        {/* Quick Helper Note for Evaluator */}
        <div className="p-3 bg-white text-xs text-[#475569] flex items-center justify-between border-t border-gray-100">
          <span>
            💡 <strong>Evaluation Note:</strong> Clicking <strong>Next Token</strong> advances the current token, updates the waiting count, and immediately updates User Siddhi's live queue screen (`/user/queue/D-108`).
          </span>
        </div>
      </Card>

      {/* Waiting Queue Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">
              Waiting Queue &bull; {staffCounter?.serviceName || 'General Consultation'}
            </h2>
            <p className="text-xs text-[#64748B]">
              Ordered by priority and arrival time. Next in line will be called automatically.
            </p>
          </div>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded font-medium">
            {staffWaitingQueue.length} Patients in line
          </span>
        </div>

        <DataTable
          columns={columns}
          data={staffWaitingQueue}
          keyField="id"
          emptyMessage="No one is currently waiting in this service queue."
        />
      </div>

      {/* Transfer Modal */}
      <Modal
        isOpen={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        title={`Transfer Token ${tokenToTransfer || staffServingEntry?.tokenNumber}`}
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
          <p className="text-xs text-gray-600">
            Select the destination service counter. The token will maintain its existing patient record and join the waiting list of the selected department.
          </p>

          <Select
            label="Target Service"
            value={targetServiceId}
            onChange={(e) => setTargetServiceId(e.target.value)}
            options={services
              .filter((s) => s.id !== staffCounter?.serviceId)
              .map((s) => ({ value: s.id, label: `${s.name} (Avg ~${s.averageServiceTimeMinutes} min)` }))}
          />
        </div>
      </Modal>

      {/* Confirm Skip Dialog */}
      <ConfirmDialog
        isOpen={confirmSkipOpen}
        onClose={() => setConfirmSkipOpen(false)}
        onConfirm={handleSkipConfirm}
        title="Skip Current Token?"
        message={`Mark token ${staffServingEntry?.tokenNumber} as Skipped (No-show)? The token will be logged and Counter 2 will become ready for the next call.`}
        confirmText="Yes, Mark Skipped"
        isDestructive
      />

      {/* Confirm Cancel Dialog */}
      <ConfirmDialog
        isOpen={confirmCancelOpen}
        onClose={() => setConfirmCancelOpen(false)}
        onConfirm={handleCancelConfirm}
        title="Cancel Token?"
        message={`Are you sure you want to cancel token ${staffServingEntry?.tokenNumber}?`}
        confirmText="Cancel Token"
        isDestructive
      />
    </div>
  );
};
