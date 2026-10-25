import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import {
  Clock,
  Users,
  CheckCircle2,
  Building2,
  Calendar,
  Smartphone,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAction = (path: string) => {
    if (user) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-[#2563EB]">
              <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
              Smart Queue Management for Public Services
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
              Skip the uncertainty. <br />
              <span className="text-[#2563EB]">Know your place</span> in the queue.
            </h1>

            <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-xl">
              Join digital queues, book appointments, and track your token in real time without
              standing in line at clinics, banks, and government offices.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                size="lg"
                onClick={() => handleAction('/user/services')}
                icon={<Clock className="w-5 h-5" />}
              >
                Join a Queue
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleAction('/user/appointments')}
                icon={<Calendar className="w-5 h-5" />}
              >
                Book Appointment
              </Button>
            </div>

            <div className="pt-4 flex items-center gap-6 text-xs text-[#64748B]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> No app download required
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Real-time position tracking
              </span>
            </div>
          </div>

          {/* Right Column: Queue Tracking Preview Card (As specified in SPEC.md Section 5) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded border border-[#E5E7EB] shadow-lg p-6 max-w-md mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                <div>
                  <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                    Live Queue Simulation
                  </span>
                  <h3 className="text-sm font-semibold text-[#1E293B]">City Care Clinic</h3>
                  <p className="text-xs text-[#64748B]">General Consultation</p>
                </div>
                <Badge variant="WAITING">Waiting</Badge>
              </div>

              <div className="my-6 text-center py-4 bg-[#F8FAFC] rounded border border-[#F1F5F9]">
                <span className="text-xs text-[#64748B] uppercase tracking-wider font-medium">
                  Your Token
                </span>
                <div className="text-5xl font-black text-[#0F172A] tracking-tight mt-1">
                  D-108
                </div>
                <p className="text-xs text-[#2563EB] font-medium mt-1">
                  Queue updates automatically
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center mb-6">
                <div className="p-3 bg-white rounded border border-[#E2E8F0]">
                  <span className="text-[11px] text-[#64748B] block">Currently Serving</span>
                  <span className="text-lg font-bold text-emerald-600">D-104</span>
                </div>
                <div className="p-3 bg-white rounded border border-[#E2E8F0]">
                  <span className="text-[11px] text-[#64748B] block">Your Position</span>
                  <span className="text-lg font-bold text-[#1E293B]">4</span>
                </div>
                <div className="p-3 bg-white rounded border border-[#E2E8F0]">
                  <span className="text-[11px] text-[#64748B] block">People Ahead</span>
                  <span className="text-lg font-bold text-[#1E293B]">3</span>
                </div>
                <div className="p-3 bg-white rounded border border-[#E2E8F0]">
                  <span className="text-[11px] text-[#64748B] block">Estimated Wait</span>
                  <span className="text-lg font-bold text-[#2563EB]">18 min</span>
                </div>
              </div>

              <Link to="/login" className="block">
                <Button className="w-full" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                  Try Demo in Live App
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white border-y border-[#E5E7EB] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">
              Simple 3-Step Process
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mt-2">
              How QueueVista Works
            </h3>
            <p className="text-sm text-[#64748B] mt-2">
              Eliminate physical lines and reduce waiting room congestion with digital token flows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded p-6">
              <div className="w-10 h-10 rounded bg-[#2563EB] text-white flex items-center justify-center font-bold text-sm mb-4">
                1
              </div>
              <h4 className="text-base font-bold text-[#1E293B]">Find Service & Join</h4>
              <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                Select your clinic, bank branch, or office service. Receive a digital token with
                exact estimated wait times.
              </p>
            </div>

            <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded p-6">
              <div className="w-10 h-10 rounded bg-[#2563EB] text-white flex items-center justify-center font-bold text-sm mb-4">
                2
              </div>
              <h4 className="text-base font-bold text-[#1E293B]">Track in Real Time</h4>
              <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                Monitor your position from anywhere on your phone. Receive alerts when previous
                tokens complete and your turn nears.
              </p>
            </div>

            <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded p-6">
              <div className="w-10 h-10 rounded bg-[#2563EB] text-white flex items-center justify-center font-bold text-sm mb-4">
                3
              </div>
              <h4 className="text-base font-bold text-[#1E293B]">Arrive at the Counter</h4>
              <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                Step straight up to Counter 2 when called. Avoid unnecessary wait times and enjoy
                efficient service delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-[#0F172A]">Available Service Centers</h3>
            <p className="text-xs text-[#64748B] mt-1">
              Serving clinics, banking halls, and regional transport offices
            </p>
          </div>
          <Link to="/login">
            <Button variant="outline" size="sm">
              View All Services
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded border border-[#E5E7EB] p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-blue-50 text-[#2563EB] rounded">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0F172A]">City Care Clinic</h4>
                <p className="text-xs text-[#64748B]">Healthcare Services</p>
              </div>
            </div>
            <p className="text-xs text-[#475569] mb-4">
              General OPD consultations, billing desk, and diagnostic clearance queues.
            </p>
            <div className="flex items-center justify-between text-xs text-[#334155] pt-3 border-t border-gray-100">
              <span>Avg wait: 15 min</span>
              <span className="text-emerald-600 font-medium">3 counters active</span>
            </div>
          </div>

          <div className="bg-white rounded border border-[#E5E7EB] p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0F172A]">Apex National Bank</h4>
                <p className="text-xs text-[#64748B]">Banking & Forex</p>
              </div>
            </div>
            <p className="text-xs text-[#475569] mb-4">
              Cash deposit counters, loan consultations, and account verification desks.
            </p>
            <div className="flex items-center justify-between text-xs text-[#334155] pt-3 border-t border-gray-100">
              <span>Avg wait: 7 min</span>
              <span className="text-emerald-600 font-medium">4 counters active</span>
            </div>
          </div>

          <div className="bg-white rounded border border-[#E5E7EB] p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0F172A]">Regional Transport Office</h4>
                <p className="text-xs text-[#64748B]">Government Administration</p>
              </div>
            </div>
            <p className="text-xs text-[#475569] mb-4">
              Licence renewals, vehicle registrations, and biometric verification tokens.
            </p>
            <div className="flex items-center justify-between text-xs text-[#334155] pt-3 border-t border-gray-100">
              <span>Avg wait: 20 min</span>
              <span className="text-emerald-600 font-medium">2 counters active</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
