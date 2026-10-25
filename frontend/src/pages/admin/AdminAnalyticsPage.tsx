import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { mockAnalyticsSummary } from '../../mock/analytics';
import {
  Clock,
  Users,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Calendar,
  Download,
  BarChart2,
  TrendingUp,
} from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<'TODAY' | '7_DAYS' | '30_DAYS'>('TODAY');

  const stats = mockAnalyticsSummary;

  // Max value for hourly completion to scale bar chart heights
  const maxHourCount = Math.max(...stats.completedByHour.map((h) => h.count), 1);

  return (
    <div className="space-y-6">
      {/* Header with Date Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A]">Queue Analytics & Reports</h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Operational throughput, patient wait duration benchmarks, and load distribution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-white rounded border border-[#E5E7EB] p-1 flex text-xs">
            <button
              onClick={() => setTimeFilter('TODAY')}
              className={`px-3 py-1 rounded transition-colors ${
                timeFilter === 'TODAY'
                  ? 'bg-blue-50 text-[#2563EB] font-bold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeFilter('7_DAYS')}
              className={`px-3 py-1 rounded transition-colors ${
                timeFilter === '7_DAYS'
                  ? 'bg-blue-50 text-[#2563EB] font-bold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setTimeFilter('30_DAYS')}
              className={`px-3 py-1 rounded transition-colors ${
                timeFilter === '30_DAYS'
                  ? 'bg-blue-50 text-[#2563EB] font-bold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Last 30 Days
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={() => alert('Exporting analytics report as PDF...')}
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid (SPEC.md Section 10) */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <StatCard
          title="Completed"
          value={timeFilter === 'TODAY' ? stats.totalServed : stats.totalServed * 6}
          subtitle="+12% weekly"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          title="Avg Wait"
          value={`${stats.averageWaitMinutes} min`}
          subtitle="Target ≤15m"
          icon={<Clock className="w-5 h-5 text-[#2563EB]" />}
        />
        <StatCard
          title="Avg Service"
          value={`${stats.averageServiceTimeMinutes} min`}
          subtitle="Standard OPD"
          icon={<BarChart2 className="w-5 h-5 text-indigo-600" />}
        />
        <StatCard
          title="Cancellations"
          value={stats.cancellations}
          subtitle="9.3% drop rate"
          icon={<XCircle className="w-5 h-5 text-red-600" />}
        />
        <StatCard
          title="No-Shows"
          value={stats.noShows}
          subtitle="Skipped calls"
          icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
        />
        <StatCard
          title="Peak Hour"
          value="11:00 AM"
          subtitle="28 tokens/hr"
          icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
        />
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Completed Tokens By Hour (Bar Chart) */}
        <div className="lg:col-span-8">
          <Card>
            <CardHeader
              title="Token Volume by Hour"
              subtitle="Completed service encounters throughout the operating day"
            />
            <CardContent className="p-6">
              <div className="h-48 flex items-end gap-4 pt-4 border-b border-[#E5E7EB] pb-2">
                {stats.completedByHour.map((item) => {
                  const heightPercent = Math.round((item.count / maxHourCount) * 100);
                  return (
                    <div key={item.hour} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[10px] text-gray-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.count}
                      </span>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] rounded-t transition-all cursor-pointer min-h-[4px]"
                      />
                      <span className="text-[11px] text-[#64748B] font-medium">{item.hour}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-[#64748B]">
                <span>Peak load observed between 11:00 AM and 12:00 PM</span>
                <span className="font-semibold text-[#0F172A]">Total: {stats.totalServed} Patients</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Queue Status Distribution */}
        <div className="lg:col-span-4">
          <Card>
            <CardHeader
              title="Queue Status Breakdown"
              subtitle="Distribution of overall queue outcomes"
            />
            <CardContent className="p-5 space-y-4">
              {stats.statusDistribution.map((item) => {
                const total = stats.statusDistribution.reduce((acc, curr) => acc + curr.count, 0);
                const pct = Math.round((item.count / total) * 100);

                let color = 'bg-[#2563EB]';
                if (item.status === 'Completed') color = 'bg-emerald-600';
                if (item.status === 'Cancelled') color = 'bg-rose-500';
                if (item.status === 'No-Show / Skipped') color = 'bg-amber-500';

                return (
                  <div key={item.status} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-[#1E293B]">{item.status}</span>
                      <span className="text-[#64748B]">
                        {item.count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded bg-slate-100 overflow-hidden">
                      <div style={{ width: `${pct}%` }} className={`h-full ${color}`} />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Average Wait Times By Department Desk */}
      <Card>
        <CardHeader
          title="Average Waiting Time by Service Desk"
          subtitle="Comparing bottleneck levels across clinics and counters"
        />
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {stats.waitTimesByService.map((svc) => (
              <div
                key={svc.serviceName}
                className="p-4 rounded border border-[#E5E7EB] bg-[#F8FAFC] flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-xs font-semibold text-[#1E293B]">{svc.serviceName}</h4>
                  <div className="text-2xl font-black text-[#2563EB] mt-2">
                    {svc.averageWaitMinutes} min
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-200 text-[11px] text-gray-500 flex items-center justify-between">
                  <span>Target: 15m</span>
                  <span className={svc.averageWaitMinutes <= 15 ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-semibold'}>
                    {svc.averageWaitMinutes <= 15 ? 'Optimal' : 'Elevated'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
