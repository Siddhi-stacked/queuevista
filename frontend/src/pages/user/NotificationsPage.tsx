import React, { useState } from 'react';
import { useQueue } from '../../context/QueueContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Bell, Check, Clock, Calendar, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useQueue();
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');

  const filtered = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.read;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'QUEUE_UPDATE':
        return <Clock className="w-4 h-4 text-[#2563EB]" />;
      case 'APPOINTMENT':
        return <Calendar className="w-4 h-4 text-emerald-600" />;
      case 'ALERT':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A]">Notifications</h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Real-time updates regarding token movement, appointments, and counter alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-white rounded border border-[#E5E7EB] p-1 flex text-xs">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1 rounded transition-colors ${
                filter === 'ALL'
                  ? 'bg-blue-50 text-[#2563EB] font-semibold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('UNREAD')}
              className={`px-3 py-1 rounded transition-colors ${
                filter === 'UNREAD'
                  ? 'bg-blue-50 text-[#2563EB] font-semibold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Unread ({notifications.filter((n) => !n.read).length})
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={markAllNotificationsRead}
            icon={<Check className="w-3.5 h-3.5" />}
          >
            Mark all read
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded border border-[#E5E7EB] p-4 shadow-sm transition-colors flex items-start gap-3.5 ${
                !item.read ? 'border-l-4 border-l-[#2563EB] bg-blue-50/20' : ''
              }`}
            >
              <div className="p-2 rounded bg-slate-100 shrink-0 mt-0.5">
                {getIcon(item.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-[#1E293B]">{item.title}</h4>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                    )}
                  </div>
                  <span className="text-[11px] text-[#64748B] whitespace-nowrap">
                    {item.timestamp}
                  </span>
                </div>

                <p className="text-xs text-[#475569] mt-1 leading-relaxed">{item.message}</p>

                <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-[#F8FAFC]">
                  {item.link ? (
                    <Link
                      to={item.link}
                      onClick={() => markNotificationRead(item.id)}
                      className="text-[#2563EB] font-medium hover:underline flex items-center gap-1 text-[11px]"
                    >
                      View details <ExternalLink className="w-3 h-3" />
                    </Link>
                  ) : <div />}

                  {!item.read && (
                    <button
                      onClick={() => markNotificationRead(item.id)}
                      className="text-gray-400 hover:text-gray-700 text-[11px]"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            title="No notifications to show"
            description={filter === 'UNREAD' ? 'You have read all your notifications.' : 'No notification history logged yet.'}
          />
        )}
      </div>
    </div>
  );
};
