import React from 'react';
import { QueueEntry } from '../../types';
import { Badge } from './Badge';
import { Button } from './Button';
import { Clock, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface TokenCardProps {
  entry: QueueEntry;
  currentServingToken?: string;
  onLeave?: () => void;
  showActions?: boolean;
}

export const TokenCard: React.FC<TokenCardProps> = ({
  entry,
  currentServingToken = 'D-104',
  onLeave,
  showActions = true,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded border border-[#E5E7EB] shadow-sm p-5">
      <div className="flex items-center justify-between pb-3.5 border-b border-[#F1F5F9]">
        <div>
          <span className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider">
            {entry.serviceName}
          </span>
          <h4 className="text-sm font-medium text-[#475569]">{entry.organizationName}</h4>
        </div>
        <Badge variant={entry.status}>{entry.status}</Badge>
      </div>

      <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs text-[#64748B] block font-medium">Your Token</span>
          <span className="text-4xl font-extrabold text-[#0F172A] tracking-tight">
            {entry.tokenNumber}
          </span>
          {entry.priority === 'HIGH' && (
            <span className="ml-2 inline-block">
              <Badge variant="HIGH">High Priority</Badge>
            </span>
          )}
        </div>

        <div className="flex items-center gap-6 sm:border-l sm:pl-6 border-[#F1F5F9] w-full sm:w-auto justify-between sm:justify-start">
          <div className="text-center sm:text-left">
            <span className="text-xs text-[#64748B] block">Now Serving</span>
            <span className="text-xl font-bold text-emerald-600">
              {entry.status === 'SERVING' ? entry.tokenNumber : currentServingToken || 'None'}
            </span>
          </div>

          <div className="text-center sm:text-left">
            <span className="text-xs text-[#64748B] block flex items-center justify-center sm:justify-start gap-1">
              <Users className="w-3.5 h-3.5" /> Ahead
            </span>
            <span className="text-xl font-bold text-[#1E293B]">
              {entry.status === 'SERVING' ? '0' : entry.peopleAhead}
            </span>
          </div>

          <div className="text-center sm:text-left">
            <span className="text-xs text-[#64748B] block flex items-center justify-center sm:justify-start gap-1">
              <Clock className="w-3.5 h-3.5" /> Est. Wait
            </span>
            <span className="text-xl font-bold text-[#2563EB]">
              {entry.status === 'SERVING' ? 'Now' : `${entry.estimatedWaitMinutes} min`}
            </span>
          </div>
        </div>
      </div>

      {showActions && (
        <div className="pt-3.5 border-t border-[#F1F5F9] flex items-center justify-between gap-2">
          {onLeave ? (
            <Button variant="outline" size="sm" onClick={onLeave} className="text-[#DC2626] border-red-200 hover:bg-red-50">
              Leave Queue
            </Button>
          ) : <div />}
          <Button
            size="sm"
            onClick={() => navigate(`/user/queue/${entry.tokenNumber}`)}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Track Live Queue
          </Button>
        </div>
      )}
    </div>
  );
};
