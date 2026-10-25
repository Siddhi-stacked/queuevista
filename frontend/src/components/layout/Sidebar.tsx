import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Layers,
  Clock,
  Calendar,
  Bell,
  History,
  User as UserIcon,
  Monitor,
  Users,
  Settings,
  BarChart3,
  X,
  ListOrdered,
  Building2
} from 'lucide-react';

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { role, user } = useAuth();

  const userNavItems = [
    { label: 'Dashboard', path: '/user/dashboard', icon: LayoutDashboard },
    { label: 'Find Services', path: '/user/services', icon: Layers },
    { label: 'Live Queue', path: '/user/queue', icon: Clock },
    { label: 'Appointments', path: '/user/appointments', icon: Calendar },
    { label: 'Notifications', path: '/user/notifications', icon: Bell },
    { label: 'Queue History', path: '/user/history', icon: History },
    { label: 'My Profile', path: '/user/profile', icon: UserIcon },
  ];

  const staffNavItems = [
    { label: 'Counter Console', path: '/staff/dashboard', icon: LayoutDashboard },
    { label: 'Waiting Queue', path: '/staff/queue', icon: ListOrdered },
    { label: 'Counters', path: '/staff/counters', icon: Monitor },
    { label: 'Appointments', path: '/staff/appointments', icon: Calendar },
    { label: 'Activity History', path: '/staff/history', icon: History },
  ];

  const adminNavItems = [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Services', path: '/admin/services', icon: Layers },
    { label: 'Staff Management', path: '/admin/staff', icon: Users },
    { label: 'Counters', path: '/admin/counters', icon: Monitor },
    { label: 'Appointments', path: '/admin/appointments', icon: Calendar },
    { label: 'Live Queues', path: '/admin/queues', icon: ListOrdered },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const items =
    role === 'ADMIN'
      ? adminNavItems
      : role === 'STAFF'
      ? staffNavItems
      : userNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-[#E5E7EB] transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#2563EB] text-white flex items-center justify-center shadow-sm">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base text-[#0F172A] tracking-tight">QueueVista</span>
              <p className="text-[10px] text-[#64748B]">Digital Queue System</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Role Banner */}
        <div className="px-6 py-3 bg-[#F8FAFC] border-b border-[#E5E7EB] flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#2563EB]" />
          <div>
            <p className="text-xs font-semibold text-[#1E293B]">City Care Clinic</p>
            <p className="text-[10px] text-[#64748B] uppercase tracking-wider font-medium">
              Role: {role || 'USER'}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold border-l-4 border-[#2563EB]'
                      : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Status Footer */}
        <div className="p-4 border-t border-[#E5E7EB] bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
              {user?.name.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#1E293B] truncate">{user?.name}</p>
              <p className="text-[10px] text-emerald-600 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Connected
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
