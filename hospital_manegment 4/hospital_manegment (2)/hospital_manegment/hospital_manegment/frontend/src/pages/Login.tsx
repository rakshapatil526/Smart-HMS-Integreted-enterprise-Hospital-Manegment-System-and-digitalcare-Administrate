import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import { UserRole } from '../types';
import {
  Activity, Eye, EyeOff, Lock, Mail, CheckCircle2, X, KeyRound, UserCheck, ShieldCheck, Stethoscope, User, Building2
} from 'lucide-react';

interface LoginProps {
  onLoginSuccess: () => void;
  onGoToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onGoToRegister }) => {
  const { login, loginGoogle } = useAuth();

  // Role Selection State (Default: Patient or Doctor)
  const [selectedRole, setSelectedRole] = useState<UserRole>('Patient');

  // Form State (Default pre-filled for instant one-click login testing)
  const [email, setEmail] = useState('patient@smartcare.com');
  const [password, setPassword] = useState('Password@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Google OAuth Modal state
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [googleNameInput, setGoogleNameInput] = useState('');

  // Forgot Password Modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmailInput, setForgotEmailInput] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');

  // 16 Standard System Roles for dropdown and selection
  const availableRoles: { role: UserRole; label: string; icon: string; defaultEmail: string }[] = [
    { role: 'Patient', label: 'Patient', icon: '👤', defaultEmail: 'patient@smartcare.com' },
    { role: 'Doctor', label: 'Doctor', icon: '👨‍⚕️', defaultEmail: 'doctor@smartcare.com' },
    { role: 'Nurse', label: 'Nurse', icon: '👩‍⚕️', defaultEmail: 'nurse@smartcare.com' },
    { role: 'Reception', label: 'Receptionist', icon: '🏥', defaultEmail: 'reception@smartcare.com' },
    { role: 'Laboratory Technician', label: 'Lab Tech', icon: '🧪', defaultEmail: 'labtech@smartcare.com' },
    { role: 'Radiologist', label: 'Radiologist', icon: '🩻', defaultEmail: 'radiologist@smartcare.com' },
    { role: 'Pharmacist', label: 'Pharmacist', icon: '💊', defaultEmail: 'pharmacist@smartcare.com' },
    { role: 'OT Staff', label: 'OT Staff', icon: '✂️', defaultEmail: 'otstaff@smartcare.com' },
    { role: 'Billing Staff', label: 'Billing Staff', icon: '💳', defaultEmail: 'billing@smartcare.com' },
    { role: 'Insurance Staff', label: 'Insurance Staff', icon: '🛡️', defaultEmail: 'insurance@smartcare.com' },
    { role: 'Inventory Manager', label: 'Inventory Manager', icon: '📦', defaultEmail: 'inventory@smartcare.com' },
    { role: 'Blood Bank Staff', label: 'Blood Bank Staff', icon: '🩸', defaultEmail: 'bloodbank@smartcare.com' },
    { role: 'Ambulance Operator', label: 'Ambulance Operator', icon: '🚑', defaultEmail: 'ambulanceop@smartcare.com' },
    { role: 'Ambulance Driver', label: 'Ambulance Driver', icon: '🚗', defaultEmail: 'ambulancedriver@smartcare.com' },
    { role: 'HR Staff', label: 'HR Staff', icon: '👔', defaultEmail: 'hrstaff@smartcare.com' },
    { role: 'Admin', label: 'System Admin', icon: '⚙️', defaultEmail: 'admin@smartcare.com' },
  ];

  const validateEmail = (emailStr: string) => /\S+@\S+\.\S+/.test(emailStr);

  const handleRoleSelect = (roleName: UserRole) => {
    setSelectedRole(roleName);
    setError('');
    const matchedRole = availableRoles.find(r => r.role === roleName);
    const isCurrentEmailADefault = availableRoles.some(r => r.defaultEmail.toLowerCase() === email.trim().toLowerCase());
    if (matchedRole && (!email.trim() || isCurrentEmailADefault)) {
      setEmail(matchedRole.defaultEmail);
      setPassword('Password@123');
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Email / User ID is required.');
      return;
    }

    if (!validateEmail(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Password is required.');
      return;
    }

    setLoading(true);
    setError('');

   try {
  await login(
    email.trim(),
    password,
    selectedRole
  );

  onLoginSuccess();
} catch (err: any) {
  setError(
    err.response?.data?.error ||
    err.message ||
    'Invalid email or password.'
  );
}
    setLoading(false);
  };

  const handleGoogleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmailInput.trim() || !validateEmail(googleEmailInput.trim())) {
      alert("Please enter a valid Gmail address.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      await loginGoogle(googleEmailInput.trim(), googleNameInput.trim() || 'Google User');
      setShowGoogleModal(false);
      onLoginSuccess();
    } catch (err: any) {
      setError('Google verification failed. Please try again.');
    }
    setLoading(false);
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmailInput.trim() || !validateEmail(forgotEmailInput.trim())) {
      alert("Please enter a valid registered email address.");
      return;
    }

    setLoading(true);
    try {
      await authApi.forgotPassword(forgotEmailInput.trim());
      setForgotMsg('Check your email for password reset instructions.');
    } catch (err) {
      setForgotMsg('Check your email for password reset instructions.');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-4 font-['Inter',sans-serif]">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2">
        {/* Left Branding Column */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-tr from-teal-800 via-teal-700 to-cyan-700 p-10 text-white relative">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-md">
                <Activity className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight">SMART CARE HMS</h1>
                <p className="text-xs text-teal-100 font-medium">Smart Hospital Management System</p>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <h2 className="text-2xl font-bold leading-tight">Smart Hospital Management System</h2>
              <p className="text-xs text-teal-100 leading-relaxed">
                Connected healthcare management for patients and hospital teams.
              </p>
            </div>
          </div>

          <div className="space-y-3 border-t border-white/20 pt-6 text-xs text-teal-100">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-cyan-300" />
              <span>Select Your Role & Access Your Dashboard</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-cyan-300" />
              <span>Database Registered Account Verification</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-cyan-300" />
              <span>Single Sign-On with Google Account</span>
            </div>
          </div>
        </div>

        {/* Right Welcome Back Sign In Card */}
        <div className="flex flex-col justify-between p-8 sm:p-10">
          <div>
            {/* Header */}
            <div className="mb-5">
              <div className="flex items-center space-x-2 md:hidden mb-2">
                <Activity className="h-6 w-6 text-teal-600" />
                <span className="font-bold text-slate-900">SMART CARE HMS</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
              <p className="text-xs text-slate-500 mt-1">Sign in to your Smart Care account</p>
            </div>

            {error && (
              <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-200">
                {error}
              </div>
            )}

            {/* Role Selection Dropdown / Selector */}
            <div className="mb-4 space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Select Role</label>
              <div className="relative">
                <select
                  value={selectedRole}
                  onChange={(e) => handleRoleSelect(e.target.value as UserRole)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none transition-all cursor-pointer"
                >
                  {availableRoles.map((r) => (
                    <option key={r.role} value={r.role}>
                      {r.icon} {r.label} ({r.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Role Select Chips for Common Roles */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Patient', 'Doctor', 'Nurse', 'Reception', 'Admin'].map((roleName) => {
                  const item = availableRoles.find(r => r.role === roleName);
                  const isSelected = selectedRole === roleName;
                  return (
                    <button
                      key={roleName}
                      type="button"
                      onClick={() => handleRoleSelect(roleName as UserRole)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
                        isSelected
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {item?.icon} {roleName}
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Email / User ID */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email / User ID</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:border-teal-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-10 py-2.5 text-xs text-slate-900 focus:border-teal-500 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    title={showPassword ? "Hide Password" : "Show Password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center space-x-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => { setShowForgotModal(true); setForgotMsg(''); }}
                  className="font-semibold text-teal-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* SIGN IN Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 py-3 text-xs font-bold text-white hover:from-teal-700 hover:to-cyan-700 shadow-md shadow-teal-500/20 disabled:opacity-50 transition-all uppercase tracking-wider"
              >
                {loading ? 'Signing in...' : 'SIGN IN'}
              </button>
            </form>

            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
              <span className="relative bg-white px-3 text-[11px] font-semibold uppercase text-slate-400">OR</span>
            </div>

            {/* Google Sign-In Button */}
            <button
              type="button"
              onClick={() => setShowGoogleModal(true)}
              className="flex w-full items-center justify-center space-x-2.5 rounded-xl border border-slate-300 bg-white py-2.5 px-4 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.33 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Create Patient Account Link */}
            <div className="mt-4 text-center text-xs text-slate-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onGoToRegister}
                className="font-bold text-teal-600 hover:underline"
              >
                Create patient account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl relative space-y-4 border border-slate-100">
            <button onClick={() => setShowForgotModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-base border-b pb-3">
              <KeyRound className="h-5 w-5 text-teal-600" />
              <span>Forgot Password</span>
            </div>
            <p className="text-xs text-slate-500">Enter your registered email address</p>

            {forgotMsg ? (
              <div className="space-y-3">
                <div className="rounded-xl bg-teal-50 p-3 text-xs font-semibold text-teal-800 border border-teal-200">
                  {forgotMsg}
                </div>
                <button onClick={() => setShowForgotModal(false)} className="w-full rounded-xl bg-slate-100 py-2.5 text-xs font-semibold text-slate-700">Back to Sign In</button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Registered Email</label>
                  <input
                    type="email"
                    required
                    value={forgotEmailInput}
                    onChange={(e) => setForgotEmailInput(e.target.value)}
                    placeholder="Enter your registered email address"
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <button type="button" onClick={() => setShowForgotModal(false)} className="text-slate-500 hover:text-slate-700 font-medium">Back to Sign In</button>
                  <button type="submit" disabled={loading} className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white uppercase shadow-md shadow-teal-500/20">SEND RESET LINK</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Google OAuth Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl relative space-y-4 border border-slate-100">
            <button onClick={() => setShowGoogleModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-base border-b pb-3">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.33 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z" />
              </svg>
              <span>Continue with Google</span>
            </div>
            <p className="text-xs text-slate-500">Sign in or create account using your Google Account:</p>

            <form onSubmit={handleGoogleSignInSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Gmail Address</label>
                <input
                  type="email"
                  required
                  value={googleEmailInput}
                  onChange={(e) => setGoogleEmailInput(e.target.value)}
                  placeholder="e.g. user.gmail@gmail.com"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Name (Optional)</label>
                <input
                  type="text"
                  value={googleNameInput}
                  onChange={(e) => setGoogleNameInput(e.target.value)}
                  placeholder="e.g. Alex Smith"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowGoogleModal(false)} className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600">Cancel</button>
                <button type="submit" disabled={loading} className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white uppercase">Continue with Google</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

