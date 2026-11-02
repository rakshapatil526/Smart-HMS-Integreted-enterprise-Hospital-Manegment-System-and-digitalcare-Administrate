import React, { useState } from 'react';
import { User, ShieldAlert, Save, CheckCircle2, Building, Mail, Phone, Calendar, Stethoscope } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const DoctorProfileView: React.FC = () => {
  const { user } = useAuth();

  // Permitted edit states
  const [phone, setPhone] = useState(user?.phone || '+1 555-0199');
  const [email, setEmail] = useState(user?.email || 'doctor@smartcare.com');
  const [schedule, setSchedule] = useState('Monday - Friday (09:00 AM - 05:00 PM)');
  const [bio, setBio] = useState('Senior Consultant Interventional Cardiologist with 12+ years clinical experience in coronary intervention & structural heart care.');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSavePermittedDetails = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <User className="h-5 w-5 text-teal-600" />
            <span>MY PROFILE — DOCTOR CREDENTIALS</span>
          </h1>
          <p className="text-xs text-slate-500">
            View clinical profile & update permitted contact details and working schedule
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        {/* Header Badge */}
        <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-2xl bg-teal-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              👨‍⚕️
            </div>
            <div>
              <h2 className="text-lg font-bold">Dr. {user?.first_name || 'Sarah'} {user?.last_name || 'Jenkins'}</h2>
              <div className="text-xs text-teal-300 font-semibold mt-0.5">
                Specialization: Interventional Cardiology
              </div>
            </div>
          </div>

          <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 font-mono text-xs">
            <div className="text-[10px] text-slate-400">DOCTOR ID (IMMUTABLE)</div>
            <div className="font-bold text-teal-400">DOC-2026-108</div>
          </div>
        </div>

        {/* LOCKED ADMINISTRATIVE CREDENTIALS NOTICE */}
        <div className="rounded-2xl bg-amber-50 p-4 border border-amber-200 text-xs flex items-start space-x-3">
          <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-amber-900">
            <strong className="block text-amber-950 font-bold">System Governance Policy:</strong>
            You are viewing your official clinician profile. Role (Doctor), System Permissions, Staff ID, and Department assignment are locked by System Administration and cannot be self-modified.
          </div>
        </div>

        {/* PROFILE FIELDS FORM GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
          {/* IMMUTABLE FIELDS */}
          <div className="bg-slate-50 p-4 rounded-2xl border space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase">SYSTEM ROLE (LOCKED)</label>
            <input
              type="text"
              value="DOCTOR"
              disabled
              className="w-full bg-transparent font-bold text-slate-700 cursor-not-allowed"
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase">DEPARTMENT ASSIGNMENT (LOCKED)</label>
            <input
              type="text"
              value={user?.department_name || 'Cardiology & Clinical Operations'}
              disabled
              className="w-full bg-transparent font-bold text-slate-700 cursor-not-allowed"
            />
          </div>

          {/* PERMITTED EDITABLE FIELDS */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center space-x-1">
              <Mail className="h-3.5 w-3.5 text-teal-600" />
              <span>Contact Email</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 font-semibold focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center space-x-1">
              <Phone className="h-3.5 w-3.5 text-teal-600" />
              <span>Phone Number</span>
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 font-semibold focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 mb-1 flex items-center space-x-1">
              <Calendar className="h-3.5 w-3.5 text-teal-600" />
              <span>Working Schedule</span>
            </label>
            <input
              type="text"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 font-semibold focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Clinical Biography / Qualification</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 font-medium focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex items-center justify-between pt-4 border-t">
          {savedSuccess ? (
            <div className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
              <CheckCircle2 className="h-4 w-4" />
              <span>Permitted details updated successfully!</span>
            </div>
          ) : <div />}

          <button
            onClick={handleSavePermittedDetails}
            className="flex items-center space-x-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 text-xs font-extrabold shadow-md shadow-teal-500/20 transition-all"
          >
            <Save className="h-4 w-4" />
            <span>[ Save Permitted Details ]</span>
          </button>
        </div>
      </div>
    </div>
  );
};
