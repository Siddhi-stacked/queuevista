import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useQueue } from '../../context/QueueContext';
import { useToast } from '../../context/ToastContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { User, Phone, Mail, Building2, Shield, RotateCcw } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { resetAllData } = useQueue();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || 'Siddhi Patel');
  const [email] = useState(user?.email || 'siddhi@example.com');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [smsNotifs, setSmsNotifs] = useState(true);
  const [browserNotifs, setBrowserNotifs] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Profile information updated successfully', 'success');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A]">User Profile</h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
          Manage your contact credentials and notification alerts for queue tracking.
        </p>
      </div>

      {/* Account Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold text-2xl border border-blue-200">
              {user?.name.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#0F172A]">{user?.name}</h3>
                <Badge variant={user?.role || 'USER'}>{user?.role}</Badge>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">{user?.email}</p>
              <p className="text-[11px] text-gray-400 mt-1">
                User ID: <span className="font-mono font-medium">{user?.id || 'U001'}</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Form */}
      <Card>
        <CardHeader title="Contact Information" subtitle="Your phone number is used for SMS token updates" />
        <CardContent className="p-6">
          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User className="w-4 h-4" />}
            />

            <Input
              label="Email Address"
              value={email}
              disabled
              helperText="Email is managed via authentication credentials"
              icon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              icon={<Phone className="w-4 h-4" />}
            />

            <div className="pt-2">
              <Button type="submit" size="sm">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader title="Queue Notification Preferences" subtitle="Configure automated queue alert triggers" />
        <CardContent className="p-6 space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-sm font-semibold text-[#1E293B]">SMS Token Alerts</span>
              <p className="text-xs text-[#64748B]">Receive text messages when you are 3 positions away</p>
            </div>
            <input
              type="checkbox"
              checked={smsNotifs}
              onChange={(e) => setSmsNotifs(e.target.checked)}
              className="rounded border-gray-300 text-[#2563EB] focus:ring-[#2563EB] w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer pt-3 border-t border-gray-100">
            <div>
              <span className="text-sm font-semibold text-[#1E293B]">Live Browser Notifications</span>
              <p className="text-xs text-[#64748B]">Audible alerts and visual banners when next token is called</p>
            </div>
            <input
              type="checkbox"
              checked={browserNotifs}
              onChange={(e) => setBrowserNotifs(e.target.checked)}
              className="rounded border-gray-300 text-[#2563EB] focus:ring-[#2563EB] w-4 h-4"
            />
          </label>
        </CardContent>
      </Card>

      {/* Reset Mock State Option */}
      <Card>
        <CardHeader title="Evaluation Reset" subtitle="Restore original prototype seed state" />
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-[#475569]">
              Reset all token movements, appointments, and counter states back to default seed records.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resetAllData}
            icon={<RotateCcw className="w-4 h-4" />}
          >
            Reset Seed Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
