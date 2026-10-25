import React, { useState } from 'react';
import { useQueue } from '../../context/QueueContext';
import { useAuth } from '../../context/AuthContext';
import { AppointmentCard } from '../../components/ui/AppointmentCard';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Calendar, Plus, Clock, CheckCircle } from 'lucide-react';

export const AppointmentsPage: React.FC = () => {
  const { user } = useAuth();
  const {
    appointments,
    services,
    bookAppointment,
    cancelAppointment,
  } = useQueue();

  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || 'S-01');
  const [date, setDate] = useState('2026-10-27');
  const [timeSlot, setTimeSlot] = useState('10:30 AM');
  const [notes, setNotes] = useState('');

  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  // User's appointments
  const userAppts = appointments.filter((a) => a.userId === user?.id);
  const upcoming = userAppts.filter((a) => a.status === 'SCHEDULED' || a.status === 'CHECKED_IN');
  const past = userAppts.filter((a) => a.status === 'COMPLETED' || a.status === 'CANCELLED');

  const handleCreateAppointment = async () => {
    await bookAppointment(selectedServiceId, date, timeSlot, notes);
    setIsBookModalOpen(false);
    setNotes('');
  };

  const handleConfirmCancel = async () => {
    if (confirmCancelId) {
      await cancelAppointment(confirmCancelId);
      setConfirmCancelId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A]">My Appointments</h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Book scheduled consultation slots and review past appointment history.
          </p>
        </div>

        <Button
          onClick={() => setIsBookModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
          size="sm"
        >
          Book New Appointment
        </Button>
      </div>

      {/* Upcoming Section */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#2563EB]" />
          Upcoming Appointments ({upcoming.length})
        </h2>

        {upcoming.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcoming.map((appt) => (
              <AppointmentCard
                key={appt.id}
                appointment={appt}
                onCancel={(id) => setConfirmCancelId(id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No upcoming appointments"
            description="You do not have any scheduled appointments right now."
            actionText="Schedule an Appointment"
            onAction={() => setIsBookModalOpen(true)}
          />
        )}
      </div>

      {/* Past / Completed Section */}
      <div className="space-y-3 pt-4 border-t border-[#E5E7EB]">
        <h2 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          Past Appointments ({past.length})
        </h2>

        {past.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {past.map((appt) => (
              <AppointmentCard key={appt.id} appointment={appt} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded border border-[#E5E7EB] p-6 text-center text-xs text-[#64748B]">
            No past appointment records.
          </div>
        )}
      </div>

      {/* Book Appointment Modal */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        title="Book Appointment"
        subtitle="Select a service, date, and preferred time slot"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsBookModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreateAppointment}>
              Confirm Appointment
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Service"
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            options={services.map((s) => ({
              value: s.id,
              label: `${s.name} (${s.organizationName || 'City Care Clinic'})`,
            }))}
          />

          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min="2026-10-25"
          />

          <Select
            label="Time Slot"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            options={[
              { value: '09:30 AM', label: '09:30 AM' },
              { value: '10:00 AM', label: '10:00 AM' },
              { value: '10:30 AM', label: '10:30 AM' },
              { value: '11:00 AM', label: '11:00 AM' },
              { value: '11:30 AM', label: '11:30 AM' },
            ]}
          />

          <Input
            label="Notes (Optional)"
            placeholder="e.g. Health history or previous token query"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </Modal>

      {/* Cancel Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!confirmCancelId}
        onClose={() => setConfirmCancelId(null)}
        onConfirm={handleConfirmCancel}
        title="Cancel Appointment?"
        message={`Are you sure you want to cancel appointment ${confirmCancelId}? This action cannot be reversed.`}
        confirmText="Yes, Cancel"
        isDestructive
      />
    </div>
  );
};
