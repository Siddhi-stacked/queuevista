import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useQueue } from '../../context/QueueContext';
import { TokenCard } from '../../components/ui/TokenCard';
import { ServiceCard } from '../../components/ui/ServiceCard';
import { AppointmentCard } from '../../components/ui/AppointmentCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { Service } from '../../types';
import { Clock, Calendar, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    userActiveQueueEntry,
    staffServingEntry,
    services,
    appointments,
    leaveQueue,
    joinQueue,
    bookAppointment,
    cancelAppointment,
  } = useQueue();
  const navigate = useNavigate();

  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [prioritySelect, setPrioritySelect] = useState<'NORMAL' | 'HIGH'>('NORMAL');
  const [appointmentDate, setAppointmentDate] = useState('2026-10-27');
  const [appointmentSlot, setAppointmentSlot] = useState('10:30 AM');
  const [appointmentNotes, setAppointmentNotes] = useState('');

  // Confirmation screen after joining queue
  const [joinedSuccessToken, setJoinedSuccessToken] = useState<string | null>(null);

  // Filter upcoming appointments for current user
  const userAppointments = appointments.filter(
    (a) => a.userId === user?.id && a.status === 'SCHEDULED'
  );

  const handleOpenJoin = (svc: Service) => {
    setSelectedService(svc);
    setJoinModalOpen(true);
  };

  const handleConfirmJoin = async () => {
    if (!selectedService) return;
    const entry = await joinQueue(selectedService.id, prioritySelect, 'WALK_IN');
    setJoinModalOpen(false);
    setJoinedSuccessToken(entry.tokenNumber);
  };

  const handleOpenBook = (svc: Service) => {
    setSelectedService(svc);
    setBookModalOpen(true);
  };

  const handleConfirmBook = async () => {
    if (!selectedService) return;
    await bookAppointment(selectedService.id, appointmentDate, appointmentSlot, appointmentNotes);
    setBookModalOpen(false);
  };

  const handleLeaveConfirm = async () => {
    if (userActiveQueueEntry) {
      await leaveQueue(userActiveQueueEntry.tokenNumber);
      setConfirmLeaveOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Greeting Banner */}
      <div className="bg-white rounded border border-[#E5E7EB] p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
            Good morning, {user?.name.split(' ')[0] || 'User'}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Here's your current queue activity and appointment schedule.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/user/services">
            <Button size="sm" icon={<Clock className="w-4 h-4" />}>
              Find Service
            </Button>
          </Link>
          <Link to="/user/appointments">
            <Button variant="outline" size="sm" icon={<Calendar className="w-4 h-4" />}>
              Book Slot
            </Button>
          </Link>
        </div>
      </div>

      {/* Active Queue Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Queue Activity
          </h2>
          {userActiveQueueEntry && (
            <Link
              to={`/user/queue/${userActiveQueueEntry.tokenNumber}`}
              className="text-xs text-[#2563EB] font-medium hover:underline flex items-center gap-1"
            >
              Full Screen Monitor <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {userActiveQueueEntry ? (
          <TokenCard
            entry={userActiveQueueEntry}
            currentServingToken={staffServingEntry?.tokenNumber || 'D-104'}
            onLeave={() => setConfirmLeaveOpen(true)}
          />
        ) : (
          <EmptyState
            title="You are not currently in any queue"
            description="Explore available services below to join a digital queue and track your token in real time."
            actionText="Browse Available Services"
            onAction={() => navigate('/user/services')}
          />
        )}
      </div>

      {/* Available Services Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">
            Available Services
          </h2>
          <Link to="/user/services" className="text-xs text-[#2563EB] font-medium hover:underline">
            View All Services →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.slice(0, 3).map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onJoin={handleOpenJoin}
              onBook={handleOpenBook}
            />
          ))}
        </div>
      </div>

      {/* Upcoming Appointments Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">
            Upcoming Appointments
          </h2>
          <Link to="/user/appointments" className="text-xs text-[#2563EB] font-medium hover:underline">
            Manage Appointments →
          </Link>
        </div>

        {userAppointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userAppointments.map((appt) => (
              <AppointmentCard
                key={appt.id}
                appointment={appt}
                onCancel={(id) => cancelAppointment(id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded border border-[#E5E7EB] p-5 text-center text-xs text-[#64748B]">
            No upcoming appointments scheduled.
          </div>
        )}
      </div>

      {/* Confirm Leave Queue Dialog */}
      <ConfirmDialog
        isOpen={confirmLeaveOpen}
        onClose={() => setConfirmLeaveOpen(false)}
        onConfirm={handleLeaveConfirm}
        title="Leave the Queue?"
        message={`Are you sure you want to cancel token ${userActiveQueueEntry?.tokenNumber}? You will forfeit your position #${userActiveQueueEntry?.position} and will need to rejoin from the end.`}
        confirmText="Leave Queue"
        isDestructive
      />

      {/* Join Queue Modal */}
      {selectedService && (
        <Modal
          isOpen={joinModalOpen}
          onClose={() => setJoinModalOpen(false)}
          title={`Join Queue - ${selectedService.name}`}
          subtitle={selectedService.organizationName || 'City Care Clinic'}
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setJoinModalOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleConfirmJoin}>
                Confirm & Join Queue
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-[#F8FAFC] rounded border border-[#E2E8F0] space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Service:</span>
                <span className="font-semibold text-gray-900">{selectedService.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Currently Waiting:</span>
                <span className="font-semibold text-gray-900">
                  {selectedService.currentWaitingCount ?? 4} people
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Estimated Waiting Time:</span>
                <span className="font-semibold text-[#2563EB]">
                  ~{selectedService.averageServiceTimeMinutes} minutes
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Operating Hours:</span>
                <span className="font-semibold text-gray-900">{selectedService.operatingHours}</span>
              </div>
            </div>

            {selectedService.priorityEnabled && (
              <Select
                label="Queue Priority Category"
                value={prioritySelect}
                onChange={(e) => setPrioritySelect(e.target.value as 'NORMAL' | 'HIGH')}
                options={[
                  { value: 'NORMAL', label: 'Standard Walk-in Queue' },
                  { value: 'HIGH', label: 'Priority (Senior Citizen / Medical Urgent / Verified)' },
                ]}
              />
            )}

            <div className="flex items-center gap-2 text-gray-500 bg-blue-50/50 p-2.5 rounded border border-blue-100">
              <ShieldCheck className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span>Token will be generated under {user?.name} ({user?.phone})</span>
            </div>
          </div>
        </Modal>
      )}

      {/* Book Appointment Modal */}
      {selectedService && (
        <Modal
          isOpen={bookModalOpen}
          onClose={() => setBookModalOpen(false)}
          title={`Book Appointment - ${selectedService.name}`}
          subtitle={selectedService.organizationName || 'City Care Clinic'}
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setBookModalOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleConfirmBook}>
                Confirm Appointment
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input
              label="Appointment Date"
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              min="2026-10-25"
            />

            <Select
              label="Select Time Slot"
              value={appointmentSlot}
              onChange={(e) => setAppointmentSlot(e.target.value)}
              options={[
                { value: '09:30 AM', label: '09:30 AM' },
                { value: '10:00 AM', label: '10:00 AM' },
                { value: '10:30 AM', label: '10:30 AM' },
                { value: '11:00 AM', label: '11:00 AM' },
                { value: '11:30 AM', label: '11:30 AM' },
              ]}
            />

            <Input
              label="Notes / Reason for Visit"
              type="text"
              placeholder="e.g. Follow-up consultation or symptom summary"
              value={appointmentNotes}
              onChange={(e) => setAppointmentNotes(e.target.value)}
            />
          </div>
        </Modal>
      )}

      {/* Joined Success Modal (SPEC.md Section 8) */}
      <Modal
        isOpen={!!joinedSuccessToken}
        onClose={() => setJoinedSuccessToken(null)}
        title="You're in the queue!"
        footer={
          <Button
            className="w-full"
            onClick={() => {
              const tok = joinedSuccessToken;
              setJoinedSuccessToken(null);
              navigate(`/user/queue/${tok}`);
            }}
          >
            Track My Queue
          </Button>
        }
      >
        <div className="text-center py-4 space-y-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Your Assigned Token</span>
            <div className="text-4xl font-black text-[#0F172A] mt-1">{joinedSuccessToken}</div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-left bg-[#F8FAFC] p-3 rounded border border-[#E5E7EB]">
            <div>
              <span className="text-gray-500 block">People Ahead:</span>
              <span className="font-bold text-gray-900">3</span>
            </div>
            <div>
              <span className="text-gray-500 block">Estimated Wait:</span>
              <span className="font-bold text-[#2563EB]">18 minutes</span>
            </div>
            <div>
              <span className="text-gray-500 block">Currently Serving:</span>
              <span className="font-bold text-emerald-600">D-104</span>
            </div>
            <div>
              <span className="text-gray-500 block">Status:</span>
              <span className="font-bold text-amber-600">Waiting</span>
            </div>
          </div>

          <p className="text-xs text-gray-500">
            You will receive live position alerts as the queue advances.
          </p>
        </div>
      </Modal>
    </div>
  );
};
