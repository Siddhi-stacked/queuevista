import React from 'react';
import { useQueue } from '../../context/QueueContext';
import { StatCard } from '../../components/ui/StatCard';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { mockAnalyticsSummary } from '../../mock/analytics';
import {
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Activity,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { services, counters, activities } = useQueue();

  // Metrics from SPEC.md Section 10
  const stats = mockAnalyticsSummary;

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A]">Operations Dashboard</h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Real-time queue monitoring, counter throughput, and service performance metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/analytics">
            <Button variant="outline" size="sm" icon={<TrendingUp className="w-4 h-4" />}>
              Full Analytics
            </Button>
          </Link>
          <Link to="/admin/services">
            <Button size="sm">Manage Services</Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid (SPEC.md Section 10) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        <StatCard
          title="Total Served"
          value={stats.totalServed}
          subtitle="+14% vs yesterday"
          icon={<CheckCircle2 className="w-5 h-5" />}
        />
        <StatCard
          title="Currently Waiting"
          value={stats.currentlyWaiting}
          subtitle="Across 3 counters"
          icon={<Users className="w-5 h-5 text-amber-600" />}
        />
        <StatCard
          title="Average Wait"
          value={`${stats.averageWaitMinutes} min`}
          subtitle="Target: ≤15 min"
          icon={<Clock className="w-5 h-5 text-[#2563EB]" />}
        />
        <StatCard
          title="No-Shows"
          value={stats.noShows}
          subtitle="Skipped tokens"
          icon={<AlertTriangle className="w-5 h-5 text-orange-600" />}
        />
        <StatCard
          title="Cancellations"
          value={stats.cancellations}
          subtitle="User requested"
          icon={<XCircle className="w-5 h-5 text-red-600" />}
        />
      </div>

      {/* Live Services & Counters Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Queues Overview */}
        <div className="lg:col-span-7 space-y-4">
          <Card>
            <CardHeader
              title="Live Queue Overview"
              subtitle="Departmental service load and current active serving tokens"
              action={
                <Link to="/admin/queues" className="text-xs text-[#2563EB] font-medium hover:underline flex items-center gap-1">
                  View Queues <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              }
            />
            <CardContent className="p-0">
              <div className="divide-y divide-[#F1F5F9]">
                {services.map((svc) => (
                  <div key={svc.id} className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-[#1E293B]">{svc.name}</h4>
                        <Badge variant={svc.status}>{svc.status}</Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Avg Service Time: ~{svc.averageServiceTimeMinutes} mins &bull; Max capacity: {svc.maxQueueSize}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 text-right shrink-0">
                      <div>
                        <span className="text-[11px] text-gray-400 block">Serving</span>
                        <span className="text-base font-bold text-emerald-600">
                          {svc.currentServingToken || 'None'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] text-gray-400 block">Waiting</span>
                        <span className="text-base font-bold text-[#2563EB]">
                          {svc.currentWaitingCount ?? 4}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Recent Operational Activity Audit Log (SPEC.md Section 10) */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader
              title="Recent Activity Log"
              subtitle="Real-time audit log of counter & queue operations"
            />
            <CardContent className="p-4">
              <div className="space-y-3.5">
                {activities.slice(0, 5).map((act) => (
                  <div key={act.id} className="flex items-start gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#1E293B] leading-snug">{act.description}</p>
                      <span className="text-[10px] text-gray-400">{act.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Counter Summary */}
          <Card>
            <CardHeader
              title="Station Summary"
              subtitle="Service desk allocation"
              action={
                <Link to="/admin/counters" className="text-xs text-[#2563EB] font-medium hover:underline">
                  Manage
                </Link>
              }
            />
            <CardContent className="p-4 space-y-2 text-xs">
              {counters.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-2 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
                  <span className="font-semibold text-[#1E293B]">{c.name} ({c.serviceName})</span>
                  <Badge variant={c.status}>{c.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
