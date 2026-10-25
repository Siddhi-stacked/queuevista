import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { useToast } from '../../context/ToastContext';
import { useQueue } from '../../context/QueueContext';
import { Building2, Sliders, Bell, User, RotateCcw } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { showToast } = useToast();
  const { resetAllData } = useQueue();

  // Organization settings
  const [orgName, setOrgName] = useState('City Care Clinic');
  const [orgCategory, setOrgCategory] = useState('Healthcare');
  const [orgAddress, setOrgAddress] = useState('42 Health Avenue, Central District, Bengaluru');
  const [orgPhone, setOrgPhone] = useState('+91 80 2345 6789');

  // Queue policy settings
  const [defaultWaitTime, setDefaultWaitTime] = useState(15);
  const [maxQueueCapacity, setMaxQueueCapacity] = useState(100);
  const [autoAdvanceDelay, setAutoAdvanceDelay] = useState(30);

  // Notification settings
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);

  const handleSaveOrg = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Organization settings updated', 'success');
  };

  const handleSaveQueue = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Queue policies updated', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A]">System Settings</h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
          Configure organization profile, token algorithms, and notification dispatch rules.
        </p>
      </div>

      {/* Organization Settings */}
      <Card>
        <CardHeader
          title={
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#2563EB]" />
              <span>Organization Profile</span>
            </div>
          }
          subtitle="Identity details displayed on patient digital tokens and receipts"
        />
        <CardContent className="p-6">
          <form onSubmit={handleSaveOrg} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Organization Name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
              />

              <Select
                label="Sector Category"
                value={orgCategory}
                onChange={(e) => setOrgCategory(e.target.value)}
                options={[
                  { value: 'Healthcare', label: 'Healthcare & Clinic' },
                  { value: 'Banking', label: 'Banking & Financial Services' },
                  { value: 'Government', label: 'Government & Public Administration' },
                  { value: 'Utility', label: 'Utility & Citizen Services' },
                ]}
              />
            </div>

            <Input
              label="Physical Address"
              value={orgAddress}
              onChange={(e) => setOrgAddress(e.target.value)}
            />

            <Input
              label="Contact Hotline"
              value={orgPhone}
              onChange={(e) => setOrgPhone(e.target.value)}
            />

            <div className="pt-2">
              <Button type="submit" size="sm">
                Save Organization Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Queue Policy Configuration */}
      <Card>
        <CardHeader
          title={
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#2563EB]" />
              <span>Queue Algorithm Policies</span>
            </div>
          }
          subtitle="Determine wait calculation intervals and buffer capacities"
        />
        <CardContent className="p-6">
          <form onSubmit={handleSaveQueue} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Default Wait per Token (min)"
                type="number"
                value={defaultWaitTime}
                onChange={(e) => setDefaultWaitTime(Number(e.target.value))}
              />

              <Input
                label="Daily Max Queue Cap"
                type="number"
                value={maxQueueCapacity}
                onChange={(e) => setMaxQueueCapacity(Number(e.target.value))}
              />

              <Input
                label="No-show Auto Skip Timeout (sec)"
                type="number"
                value={autoAdvanceDelay}
                onChange={(e) => setAutoAdvanceDelay(Number(e.target.value))}
              />
            </div>

            <div className="pt-2">
              <Button type="submit" size="sm">
                Update Queue Policies
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Notifications & System Maintenance */}
      <Card>
        <CardHeader
          title={
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#2563EB]" />
              <span>Notification Dispatches & Reset</span>
            </div>
          }
          subtitle="SMS gateway simulations and evaluation data reset"
        />
        <CardContent className="p-6 space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-sm font-semibold text-[#1E293B]">Simulate SMS Broadcasts</span>
              <p className="text-xs text-[#64748B]">Push SMS payload to console and user feed upon call</p>
            </div>
            <input
              type="checkbox"
              checked={smsEnabled}
              onChange={(e) => setSmsEnabled(e.target.checked)}
              className="rounded border-gray-300 text-[#2563EB] focus:ring-[#2563EB] w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer pt-3 border-t border-gray-100">
            <div>
              <span className="text-sm font-semibold text-[#1E293B]">Chime Audio Alerts</span>
              <p className="text-xs text-[#64748B]">Play audible ding when Next Token is triggered</p>
            </div>
            <input
              type="checkbox"
              checked={soundAlerts}
              onChange={(e) => setSoundAlerts(e.target.checked)}
              className="rounded border-gray-300 text-[#2563EB] focus:ring-[#2563EB] w-4 h-4"
            />
          </label>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-rose-700">Restore Initial Prototype Data</span>
              <p className="text-xs text-gray-500">Resets tokens, appointments, and staff actions back to seed data</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={resetAllData}
              icon={<RotateCcw className="w-4 h-4" />}
            >
              Reset Seed Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
