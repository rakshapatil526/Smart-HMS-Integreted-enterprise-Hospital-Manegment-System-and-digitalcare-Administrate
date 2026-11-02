import React, { useState } from 'react';
import { User, Lock, Save, CheckCircle2, ShieldCheck, Mail, Phone, MapPin, Award } from 'lucide-react';

interface NurseProfileViewProps {
  profile: {
    name: string;
    nurse_id: string;
    department: string;
    ward: string;
    shift: string;
    phone: string;
    email: string;
    bio: string;
    emergency_contact: string;
  };
  onUpdateProfile: (updated: any) => void;
}

export const NurseProfileView: React.FC<NurseProfileViewProps> = ({ profile, onUpdateProfile }) => {
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [bio, setBio] = useState(profile.bio);
  const [emergencyContact, setEmergencyContact] = useState(profile.emergency_contact);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      phone,
      email,
      bio,
      emergency_contact: emergencyContact,
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
            <span className="font-bold">Permitted Profile Info Updated!</span>
            <span className="text-emerald-700 ml-1">
              Contact details and emergency info saved.
            </span>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-800 text-white flex items-center justify-center font-extrabold text-xl shadow-md">
            SJ
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{profile.name}</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Registered Nurse (RN) • <strong className="text-teal-700">{profile.nurse_id}</strong>
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1 rounded-full bg-teal-50 text-teal-800 text-[11px] font-bold px-2.5 py-0.5 border border-teal-200">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
                <span>Role: NURSE</span>
              </span>
              <span className="rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold px-2.5 py-0.5">
                {profile.ward}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form & Immutability Rules */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">MY PROFILE DETAILS</h2>
          <span className="text-xs text-slate-400 font-semibold">Nurse Credentials</span>
        </div>

        {/* Read-Only Administrative Section */}
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
              <span className="text-slate-400 block mb-0.5 font-medium">Nurse ID</span>
              <span className="font-bold text-slate-900">{profile.nurse_id}</span>
            </div>

            <div className="rounded-lg bg-white p-3 border border-slate-200">
              <span className="text-slate-400 block mb-0.5 font-medium">Department</span>
              <span className="font-bold text-slate-900">{profile.department}</span>
            </div>

            <div className="rounded-lg bg-white p-3 border border-slate-200">
              <span className="text-slate-400 block mb-0.5 font-medium">Shift Assignment</span>
              <span className="font-bold text-slate-900">{profile.shift}</span>
            </div>
          </div>
        </div>

        {/* Editable Form */}
        <form onSubmit={handleSave} className="space-y-5">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pt-2">
            Permitted Personal & Contact Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>Phone Number</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Emergency Contact Person & Phone</label>
            <input
              type="text"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Professional Summary / Clinical Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              type="submit"
              className="inline-flex items-center space-x-2 rounded-xl bg-teal-600 hover:bg-teal-700 px-6 py-2.5 text-xs font-bold text-white transition-all shadow-sm"
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
