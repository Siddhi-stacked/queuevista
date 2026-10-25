import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Breadcrumbs } from './Breadcrumbs';
import { ToastContainer } from '../ui/Toast';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />

        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          <Breadcrumbs />
          <Outlet />
        </main>

        <footer className="py-4 px-6 border-t border-[#E5E7EB] bg-white text-center text-xs text-[#64748B]">
          QueueVista &copy; 2026 &mdash; Real-Time Visibility for Digital Queues.
        </footer>
      </div>

      <ToastContainer />
    </div>
  );
};
