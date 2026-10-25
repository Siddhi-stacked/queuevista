import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQueue } from '../../context/QueueContext';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  Clock,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BellRing,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const LiveQueuePage: React.FC = () => {
  const { token: paramToken } = useParams<{ token?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    queueEntries,
    userActiveQueueEntry,
    staffServingEntry,
    leaveQueue,
  } = useQueue();

  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);
  const [notifPrefEnabled, setNotifPrefEnabled] = useState(true);

  // Find targeted token: either URL param or user's active token
  const tokenToDisplay = paramToken
    ? queueEntries.find((e) => e.tokenNumber.toUpperCase() === paramToken.toUpperCase())
    : userActiveQueueEntry;

  // Active queue entries for the service to construct the visual chain
  const activeChain = queueEntries
    .filter((e) => e.serviceId === (tokenToDisplay?.serviceId || 'S-01') && (e.status === 'SERVING' || e.status === 'WAITING'))
    .sort((a, b) => {
      if (a.status === 'SERVING') return -1;
      if (b.status === 'SERVING') return 1;
      return a.position - b.position;
    });

  const handleLeaveConfirm = async () => {
    if (tokenToDisplay) {
      await leaveQueue(tokenToDisplay.tokenNumber);
      setConfirmLeaveOpen(false);
      navigate('/user/dashboard');
    }
  };

  if (!tokenToDisplay) {
    return (
      <EmptyState
        title="No active token found"
        description="You don't have a live token in any queue, or this token has already ended."
        actionText="Browse Services & Join Queue"
        onAction={() => navigate('/user/services')}
      />
    );
  }

  const isServing = tokenToDisplay.status === 'SERVING';
  const isCompleted = tokenToDisplay.status === 'COMPLETED';
  const isCancelled = tokenToDisplay.status === 'CANCELLED';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner Status */}
      <div className="bg-white rounded border border-[#E5E7EB] p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider">
            Live Queue Monitor
          </span>
          <h1 className="text-lg font-bold text-[#0F172A]">{tokenToDisplay.serviceName}</h1>
          <p className="text-xs text-[#64748B]">
            {tokenToDisplay.organizationName} &bull; Counter 2
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={tokenToDisplay.status} className="text-xs px-2.5 py-1">
            {tokenToDisplay.status}
          </Badge>
          <button
            onClick={() => setNotifPrefEnabled(!notifPrefEnabled)}
            className={`p-2 rounded border text-xs flex items-center gap-1.5 transition-colors ${
              notifPrefEnabled
                ? 'bg-blue-50 border-blue-200 text-[#2563EB]'
                : 'bg-gray-50 border-gray-200 text-gray-500'
            }`}
            title="Notification alerts enabled"
          >
            <BellRing className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Alerts {notifPrefEnabled ? 'On' : 'Off'}</span>
          </button>
        </div>
      </div>

      {/* Main Large Token Card (Mobile Friendly) */}
      <div className="bg-white rounded border border-[#E5E7EB] shadow-md p-6 sm:p-8 text-center relative overflow-hidden">
        {isServing && (
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full animate-bounce">
            <Sparkles className="w-4 h-4" /> IT'S YOUR TURN! PLEASE PROCEED TO COUNTER 2
          </div>
        )}

        <p className="text-xs sm:text-sm uppercase tracking-widest text-[#64748B] font-semibold">
          Your Token Number
        </p>

        {/* Large readable token badge */}
        <div className="text-6xl sm:text-7xl font-black text-[#0F172A] tracking-tight my-2">
          {tokenToDisplay.tokenNumber}
        </div>

        <p className="text-xs text-[#2563EB] font-medium flex items-center justify-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
          Queue information updates automatically.
        </p>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-[#F1F5F9]">
          <div className="p-3 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
            <span className="text-[11px] text-[#64748B] block uppercase tracking-wide">
              Currently Serving
            </span>
            <span className="text-2xl font-black text-emerald-600">
              {staffServingEntry?.tokenNumber || 'D-104'}
            </span>
          </div>

          <div className="p-3 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
            <span className="text-[11px] text-[#64748B] block uppercase tracking-wide">
              Your Position
            </span>
            <span className="text-2xl font-black text-[#1E293B]">
              {isServing ? 'NOW' : `#${tokenToDisplay.position}`}
            </span>
          </div>

          <div className="p-3 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
            <span className="text-[11px] text-[#64748B] block uppercase tracking-wide">
              People Ahead
            </span>
            <span className="text-2xl font-black text-[#1E293B]">
              {isServing ? 0 : tokenToDisplay.peopleAhead}
            </span>
          </div>

          <div className="p-3 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
            <span className="text-[11px] text-[#64748B] block uppercase tracking-wide">
              Est. Waiting Time
            </span>
            <span className="text-2xl font-black text-[#2563EB]">
              {isServing ? '0 min' : `${tokenToDisplay.estimatedWaitMinutes} min`}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Chain Diagram (As specified in SPEC.md Section 8) */}
      <div className="bg-white rounded border border-[#E5E7EB] p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">
            Queue Progression Sequence
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Sequential chain of tokens currently at Counter 2.
          </p>
        </div>

        {/* Horizontal Chain Flow */}
        <div className="overflow-x-auto py-4">
          <div className="flex items-center gap-2 min-w-max px-2">
            {activeChain.map((item, index) => {
              const isUserToken = item.tokenNumber === tokenToDisplay.tokenNumber;
              const isServingToken = item.status === 'SERVING';

              return (
                <React.Fragment key={item.id}>
                  <div
                    className={`flex flex-col items-center justify-center px-4 py-3 rounded border text-center transition-all ${
                      isUserToken
                        ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-300 scale-105'
                        : isServingToken
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-semibold tracking-wider opacity-80">
                      {isUserToken ? 'YOU' : isServingToken ? 'SERVING' : `Pos #${item.position}`}
                    </span>
                    <span className="text-base font-extrabold mt-0.5">{item.tokenNumber}</span>
                    <span className="text-[10px] mt-1 opacity-75">
                      {isServingToken ? 'At Counter 2' : `~${item.estimatedWaitMinutes} min`}
                    </span>
                  </div>

                  {index < activeChain.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="p-3 bg-blue-50/50 rounded border border-blue-100 flex items-start gap-2.5 text-xs text-[#334155]">
          <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
          <span>
            Staff at <strong>Counter 2</strong> advances tokens sequentially. Once your token reaches
            position 1, you will be notified to proceed to the consultation room.
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded border border-[#E5E7EB] p-4 flex flex-wrap items-center justify-between gap-3">
        <Link to="/user/services">
          <Button variant="outline" size="sm">
            View Service Details
          </Button>
        </Link>

        {!isCompleted && !isCancelled && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => setConfirmLeaveOpen(true)}
          >
            Leave Queue
          </Button>
        )}
      </div>

      {/* Confirm Leave Dialog */}
      <ConfirmDialog
        isOpen={confirmLeaveOpen}
        onClose={() => setConfirmLeaveOpen(false)}
        onConfirm={handleLeaveConfirm}
        title="Leave the Queue?"
        message={`Are you sure you want to cancel token ${tokenToDisplay.tokenNumber}? You will lose position #${tokenToDisplay.position}.`}
        confirmText="Yes, Leave Queue"
        isDestructive
      />
    </div>
  );
};
