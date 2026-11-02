import React, { useState } from 'react';
import { LabStaffProfile } from '../../types';
import { User, Lock, Save, CheckCircle2, ShieldCheck, Mail, Phone, Award } from 'lucide-react';

interface LabProfileViewProps {
  profile: LabStaffProfile;
  onUpdateProfile: (updated: LabStaffProfile) => void;
}

export const LabProfileView: React.FC<LabProfileViewProps> = ({ profile, onUpdateProfile }) => {
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [bio, setBio] = useState(profile.bio);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      phone,
      email,
      bio,
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {saveSuccess && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-900 flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold">Permitted Lab Staff Info Updated!</span>
            <span className="text-emerald-700 ml-1">Contact details and bio saved.</span>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-900 text-white flex items-center justify-center font-extrabold text-xl shadow-md">
            🧪
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{profile.name}</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Medical Laboratory Scientist • <strong className="text-purple-900">{profile.staff_id}</strong>
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1 rounded-full bg-purple-50 text-purple-900 text-[11px] font-bold px-2.5 py-0.5 border border-purple-200">
                <ShieldCheck className="h-3.5 w-3.5 text-purple-700" />
                <span>Role: LAB TECHNICIAN</span>
              </span>
              <span className="rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold px-2.5 py-0.5">
                {profile.department}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details & Administrative Locks */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">STAFF PROFILE DETAILS</h2>
          <span className="text-xs text-slate-400 font-semibold">Laboratory Credentials</span>
        </div>

        {/* Read-Only Administrative Section (Section 16 requirement) */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
              <Lock className="h-3.5 w-3.5 text-slate-400" />
              <span>Administrative Restricted Parameters (Read-Only)</span>
            </span>
            <span className="text-[10px] text-slate-400">Admin Authorization Required to Change</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-1">
            <div className="rounded-lg bg-white p-3 border border-slate-200">
              <span className="text-slate-400 block mb-0.5 font-medium">Staff ID</span>
              <span className="font-bold text-slate-900 font-mono">{profile.staff_id}</span>
            </div>

            <div className="rounded-lg bg-white p-3 border border-slate-200">
              <span className="text-slate-400 block mb-0.5 font-medium">Department</span>
              <span className="font-bold text-slate-900">{profile.department}</span>
            </div>

            <div className="rounded-lg bg-white p-3 border border-slate-200">
              <span className="text-slate-400 block mb-0.5 font-medium">System Role & Permissions</span>
              <span className="font-bold text-slate-900">{profile.role}</span>
            </div>
          </div>
        </div>

        {/* Editable Personal Form */}
        <form onSubmit={handleSave} className="space-y-5">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pt-2">
            Permitted Personal & Contact Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Phone */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 flex items-center space-x-1">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>Phone Number</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 flex items-center space-x-1">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-slate-700 flex items-center space-x-1">
              <Award className="h-3.5 w-3.5 text-slate-400" />
              <span>Professional Certifications</span>
            </label>
            <input
              type="text"
              readOnly
              value={profile.certifications}
              className="w-full rounded-xl border border-slate-200 bg-slate-100 p-2.5 font-semibold text-slate-700"
            />
          </div>

          {/* Bio */}
          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-slate-700">Laboratory Bio & Specialization Summary</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              type="submit"
              className="inline-flex items-center space-x-2 rounded-xl bg-purple-600 hover:bg-purple-700 px-6 py-2.5 text-xs font-bold text-white transition-all shadow-sm"
            >
              <Save className="h-4 w-4" />
              <span>SAVE PROFILE CHANGES</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
