import React, { useState, useMemo } from 'react';
import { useQueue } from '../../context/QueueContext';
import { useAuth } from '../../context/AuthContext';
import { ServiceCard } from '../../components/ui/ServiceCard';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Service } from '../../types';
import { Search, Filter, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ServicesPage: React.FC = () => {
  const { services, joinQueue, bookAppointment } = useQueue();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [orgFilter, setOrgFilter] = useState('ALL');
  const [waitFilter, setWaitFilter] = useState('ALL');

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [prioritySelect, setPrioritySelect] = useState<'NORMAL' | 'HIGH'>('NORMAL');
  const [appointmentDate, setAppointmentDate] = useState('2026-10-27');
  const [appointmentSlot, setAppointmentSlot] = useState('10:30 AM');
  const [appointmentNotes, setAppointmentNotes] = useState('');

  const [joinedSuccessToken, setJoinedSuccessToken] = useState<string | null>(null);

  const filteredServices = useMemo(() => {
    return services.filter((svc) => {
      const matchesSearch =
        svc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (svc.organizationName && svc.organizationName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        svc.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesOrg =
        orgFilter === 'ALL' ||
        (orgFilter === 'CITY_CARE' && svc.organizationId === 'ORG-01') ||
        (orgFilter === 'APEX_BANK' && svc.organizationId === 'ORG-02') ||
        (orgFilter === 'RTO' && svc.organizationId === 'ORG-03');

      const matchesWait =
        waitFilter === 'ALL' ||
        (waitFilter === 'UNDER_10' && svc.averageServiceTimeMinutes <= 10) ||
        (waitFilter === 'OVER_10' && svc.averageServiceTimeMinutes > 10);

      return matchesSearch && matchesOrg && matchesWait;
    });
  }, [services, searchTerm, orgFilter, waitFilter]);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A]">Find & Join Services</h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
          Browse digital queues across healthcare, banking, and government service centers.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded border border-[#E5E7EB] p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6">
            <Input
              placeholder="Search services or organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="md:col-span-3">
            <Select
              value={orgFilter}
              onChange={(e) => setOrgFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Organizations' },
                { value: 'CITY_CARE', label: 'City Care Clinic' },
                { value: 'APEX_BANK', label: 'Apex National Bank' },
                { value: 'RTO', label: 'Regional Transport Office' },
              ]}
            />
          </div>

          <div className="md:col-span-3">
            <Select
              value={waitFilter}
              onChange={(e) => setWaitFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Wait Times' },
                { value: 'UNDER_10', label: 'Quick (≤ 10 mins)' },
                { value: 'OVER_10', label: 'Standard (> 10 mins)' },
              ]}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[#64748B] pt-2 border-t border-[#F1F5F9]">
          <span className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Showing {filteredServices.length} of {services.length} services
          </span>
          {(searchTerm || orgFilter !== 'ALL' || waitFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setOrgFilter('ALL');
                setWaitFilter('ALL');
              }}
              className="text-[#2563EB] hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onJoin={handleOpenJoin}
              onBook={handleOpenBook}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No services match your filters"
          description="Try clearing search keywords or selecting all organizations."
          actionText="Clear Filters"
          onAction={() => {
            setSearchTerm('');
            setOrgFilter('ALL');
            setWaitFilter('ALL');
          }}
        />
      )}

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
              <span>Token will be issued to {user?.name} ({user?.phone})</span>
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
              placeholder="e.g. Health checkup or document verification"
              value={appointmentNotes}
              onChange={(e) => setAppointmentNotes(e.target.value)}
            />
          </div>
        </Modal>
      )}

      {/* Joined Success Modal */}
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
            You can monitor this live from the Live Queue page.
          </p>
        </div>
      </Modal>
    </div>
  );
};
