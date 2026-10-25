import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../components/layout/PublicLayout';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Public Pages
import { LandingPage } from '../pages/public/LandingPage';
import { LoginPage } from '../pages/public/LoginPage';
import { RegisterPage } from '../pages/public/RegisterPage';
import { NotFoundPage } from '../pages/public/NotFoundPage';

// User Pages
import { UserDashboard } from '../pages/user/UserDashboard';
import { ServicesPage } from '../pages/user/ServicesPage';
import { LiveQueuePage } from '../pages/user/LiveQueuePage';
import { AppointmentsPage } from '../pages/user/AppointmentsPage';
import { NotificationsPage } from '../pages/user/NotificationsPage';
import { HistoryPage } from '../pages/user/HistoryPage';
import { ProfilePage } from '../pages/user/ProfilePage';

// Staff Pages
import { StaffDashboard } from '../pages/staff/StaffDashboard';
import { StaffQueuePage } from '../pages/staff/StaffQueuePage';
import { StaffCountersPage } from '../pages/staff/StaffCountersPage';
import { StaffAppointmentsPage } from '../pages/staff/StaffAppointmentsPage';
import { StaffHistoryPage } from '../pages/staff/StaffHistoryPage';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminServicesPage } from '../pages/admin/AdminServicesPage';
import { AdminStaffPage } from '../pages/admin/AdminStaffPage';
import { AdminCountersPage } from '../pages/admin/AdminCountersPage';
import { AdminAppointmentsPage } from '../pages/admin/AdminAppointmentsPage';
import { AdminQueuesPage } from '../pages/admin/AdminQueuesPage';
import { AdminAnalyticsPage } from '../pages/admin/AdminAnalyticsPage';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* User Portal Routes */}
      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRoles={['USER', 'STAFF', 'ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/user/dashboard" replace />} />
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="queue" element={<LiveQueuePage />} />
        <Route path="queue/:token" element={<LiveQueuePage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Staff Portal Routes */}
      <Route
        path="/staff"
        element={
          <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/staff/dashboard" replace />} />
        <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="queue" element={<StaffQueuePage />} />
        <Route path="counters" element={<StaffCountersPage />} />
        <Route path="appointments" element={<StaffAppointmentsPage />} />
        <Route path="history" element={<StaffHistoryPage />} />
      </Route>

      {/* Admin Portal Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="services" element={<AdminServicesPage />} />
        <Route path="staff" element={<AdminStaffPage />} />
        <Route path="counters" element={<AdminCountersPage />} />
        <Route path="appointments" element={<AdminAppointmentsPage />} />
        <Route path="queues" element={<AdminQueuesPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* 404 Route */}
      <Route element={<PublicLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
