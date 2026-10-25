import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useQueue } from '../../context/QueueContext';
import { Bell, Menu, X, User as UserIcon, LogOut, Check, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, role, loginAsRole, logout } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useQueue();
  const navigate = useNavigate();

  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read);

  const handleRoleSwitch = async (newRole: 'USER' | 'STAFF' | 'ADMIN') => {
    await loginAsRole(newRole);
    if (newRole === 'USER') navigate('/user/dashboard');
    else if (newRole === 'STAFF') navigate('/staff/dashboard');
    else if (newRole === 'ADMIN') navigate('/admin/dashboard');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] h-16 px-4 sm:px-6 flex items-center justify-between shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded focus:outline-none"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-[#2563EB] text-white flex items-center justify-center shadow-sm">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base text-[#0F172A] tracking-tight">QueueVista</span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200 uppercase">
              Prototype
            </span>
          </div>
        </Link>
      </div>

      {/* Demo Switcher & Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* DEMO Role Switcher for instant evaluator testing */}
        <div className="hidden md:flex items-center bg-[#F1F5F9] p-1 rounded border border-[#E2E8F0] text-xs">
          <span className="text-[11px] font-semibold text-gray-500 px-2 uppercase tracking-wide">Demo:</span>
          <button
            onClick={() => handleRoleSwitch('USER')}
            className={`px-2.5 py-1 rounded transition-colors ${
              role === 'USER'
                ? 'bg-white text-[#2563EB] font-bold shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            User
          </button>
          <button
            onClick={() => handleRoleSwitch('STAFF')}
            className={`px-2.5 py-1 rounded transition-colors ${
              role === 'STAFF'
                ? 'bg-white text-[#2563EB] font-bold shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Staff
          </button>
          <button
            onClick={() => handleRoleSwitch('ADMIN')}
            className={`px-2.5 py-1 rounded transition-colors ${
              role === 'ADMIN'
                ? 'bg-white text-[#2563EB] font-bold shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Admin
          </button>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifs(!showNotifs);
              setShowProfileMenu(false);
            }}
            className="relative p-2 text-gray-500 hover:text-[#2563EB] hover:bg-blue-50/50 rounded transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#DC2626] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadNotifs.length}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded border border-[#E5E7EB] shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 bg-[#F8FAFC] border-b border-[#F1F5F9] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                    Notifications
                  </h4>
                  <p className="text-[11px] text-[#64748B]">{unreadNotifs.length} unread updates</p>
                </div>
                {unreadNotifs.length > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-[#2563EB] hover:underline flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#F1F5F9]">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-gray-500">No notifications</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.link) {
                          navigate(notif.link);
                          setShowNotifs(false);
                        }
                      }}
                      className={`p-3 hover:bg-slate-50 cursor-pointer transition-colors ${
                        !notif.read ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-[#1E293B]">{notif.title}</span>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">
                          {notif.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-[#475569] mt-1 line-clamp-2">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2.5 bg-[#F8FAFC] border-t border-[#F1F5F9] text-center">
                <Link
                  to="/user/notifications"
                  onClick={() => setShowNotifs(false)}
                  className="text-xs text-[#2563EB] font-medium hover:underline"
                >
                  View all notifications →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifs(false);
            }}
            className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
              {user?.name.charAt(0) || 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-xs font-semibold text-[#1E293B] leading-none">
                {user?.name || 'Guest'}
              </span>
              <span className="block text-[10px] text-[#64748B] mt-0.5 uppercase tracking-wider">
                {user?.role || 'Guest'}
              </span>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded border border-[#E5E7EB] shadow-xl z-50 py-1">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-xs font-semibold text-[#1E293B]">{user?.name}</p>
                <p className="text-[11px] text-[#64748B] truncate">{user?.email}</p>
              </div>

              <Link
                to="/user/profile"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
              >
                <UserIcon className="w-4 h-4 text-gray-400" />
                Profile Settings
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left border-t border-gray-100"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
