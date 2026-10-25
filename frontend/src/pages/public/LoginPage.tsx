import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Mail, Lock, UserCheck, ShieldAlert, Users, Clock } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginAsRole, isLoading } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('siddhi@example.com');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter your email', 'error');
      return;
    }
    try {
      const loggedIn = await login(email, password);
      showToast(`Welcome back, ${loggedIn.name}!`, 'success');
      if (loggedIn.role === 'ADMIN') navigate('/admin/dashboard');
      else if (loggedIn.role === 'STAFF') navigate('/staff/dashboard');
      else navigate('/user/dashboard');
    } catch {
      showToast('Failed to log in', 'error');
    }
  };

  const handleDemoLogin = async (role: 'USER' | 'STAFF' | 'ADMIN') => {
    try {
      const loggedIn = await loginAsRole(role);
      showToast(`Logged in as ${role}: ${loggedIn.name}`, 'success');
      if (role === 'ADMIN') navigate('/admin/dashboard');
      else if (role === 'STAFF') navigate('/staff/dashboard');
      else navigate('/user/dashboard');
    } catch {
      showToast('Demo login failed', 'error');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="w-10 h-10 rounded bg-[#2563EB] text-white flex items-center justify-center mx-auto shadow-sm">
            <Clock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-[#0F172A] mt-3">Sign in to QueueVista</h2>
          <p className="text-xs text-[#64748B] mt-1">
            Access your tokens, appointments, or staff counter
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                icon={<Mail className="w-4 h-4" />}
              />

              <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4" />}
              />

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-[#475569]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-[#2563EB] focus:ring-[#2563EB]"
                  />
                  Remember me
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); showToast('Demo environment: password recovery disabled', 'info'); }} className="text-[#2563EB] hover:underline">
                  Forgot password?
                </a>
              </div>

              <Button type="submit" className="w-full" isLoading={isLoading}>
                Sign In
              </Button>
            </form>

            {/* Clear DEMO Section as required by SPEC.md Section 6 */}
            <div className="mt-6 pt-5 border-t border-[#E5E7EB]">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
                  1-Click Demo Evaluation
                </span>
                <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                  Mock Auth
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] mb-3">
                Select a role below to simulate the complete user journey:
              </p>

              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin('USER')}
                  className="flex flex-col py-2.5 h-auto text-xs"
                >
                  <Users className="w-4 h-4 text-[#2563EB] mb-1" />
                  <span className="font-semibold text-[#1E293B]">User</span>
                  <span className="text-[10px] text-gray-400">Siddhi (U001)</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin('STAFF')}
                  className="flex flex-col py-2.5 h-auto text-xs"
                >
                  <UserCheck className="w-4 h-4 text-emerald-600 mb-1" />
                  <span className="font-semibold text-[#1E293B]">Staff</span>
                  <span className="text-[10px] text-gray-400">Rajesh (S001)</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin('ADMIN')}
                  className="flex flex-col py-2.5 h-auto text-xs"
                >
                  <ShieldAlert className="w-4 h-4 text-purple-600 mb-1" />
                  <span className="font-semibold text-[#1E293B]">Admin</span>
                  <span className="text-[10px] text-gray-400">Dr. Roy (A001)</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-[#64748B]">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-[#2563EB] hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
