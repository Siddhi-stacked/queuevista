import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ToastContainer } from '../ui/Toast';
import { Button } from '../ui/Button';
import { Clock } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Public Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] h-16 px-4 sm:px-8 flex items-center justify-between shadow-sm">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-[#2563EB] text-white flex items-center justify-center shadow-sm">
            <Clock className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-[#0F172A] tracking-tight">QueueVista</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#475569]">
          <Link to="/" className="hover:text-[#2563EB] transition-colors">
            Home
          </Link>
          <a href="#how-it-works" className="hover:text-[#2563EB] transition-colors">
            How It Works
          </a>
          <a href="#services" className="hover:text-[#2563EB] transition-colors">
            Services
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="outline" size="sm">
              Log In
            </Button>
          </Link>
          <Link to="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5E7EB] py-8 px-4 sm:px-8 text-center text-xs text-[#64748B]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#2563EB] text-white flex items-center justify-center shadow-sm">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-sm text-[#0F172A]">QueueVista</span>
            <span className="text-gray-400">| Real-Time Visibility for Digital Queues</span>
          </div>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
};
