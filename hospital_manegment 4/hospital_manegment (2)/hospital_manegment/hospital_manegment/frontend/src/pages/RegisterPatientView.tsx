import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Activity, Eye, EyeOff, Lock, Mail, User, Phone, Calendar, UserPlus, CheckCircle2 } from 'lucide-react';

interface RegisterPatientViewProps {
  onGoToLogin: () => void;
  onRegisterSuccess: () => void;
}

export const RegisterPatientView: React.FC<RegisterPatientViewProps> = ({ onGoToLogin, onRegisterSuccess }) => {
  const { registerPatient } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (eStr: string) => /\S+@\S+\.\S+/.test(eStr);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) { setError('Full Name is required.'); return; }
    if (!email.trim() || !validateEmail(email.trim())) { setError('Please enter a valid email address.'); return; }
    if (!password) { setError('Password is required.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (!agreeTerms) { setError('You must agree to the Terms and Privacy.'); return; }

    setLoading(true);

    try {
      await registerPatient({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        dob: dob,
        gender: gender,
        password: password
      });
      onRegisterSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center p-4 font-['Inter',sans-serif]">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl space-y-5 border border-slate-100">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center space-x-2 text-teal-600 mb-1">
            <Activity className="h-6 w-6" />
            <span className="font-bold text-sm tracking-tight text-slate-900">SMART CARE HMS</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Create Patient Account</h2>
          <p className="text-xs text-slate-500">Public patient medical portal registration</p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {/* Full Name */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Date of Birth & Gender */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-200 pl-9 pr-9 py-2 text-xs text-slate-900 focus:border-teal-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full rounded-xl border border-slate-200 pl-9 pr-9 py-2 text-xs text-slate-900 focus:border-teal-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Terms checkbox */}
          <label className="flex items-center space-x-2 text-slate-600 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <span>I agree to the Terms and Privacy</span>
          </label>

          {/* CREATE ACCOUNT button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 py-3 text-xs font-bold text-white hover:from-teal-700 hover:to-cyan-700 shadow-md shadow-teal-500/20 disabled:opacity-50 transition-all uppercase tracking-wider mt-2"
          >
            {loading ? 'Creating Account...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-600 pt-2 border-t border-slate-100">
          Already have an account?{' '}
          <button onClick={onGoToLogin} className="font-bold text-teal-600 hover:underline">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
