import React, { useState } from 'react';
import { ReceptionPatientRecord } from '../../types';
import { demoBedStatusList } from './receptionData';
import { Bed, UserPlus, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';

interface ReceptionAdmissionsViewProps {
  patients: ReceptionPatientRecord[];
}

export const ReceptionAdmissionsView: React.FC<ReceptionAdmissionsViewProps> = ({ patients }) => {
  const [beds, setBeds] = useState(demoBedStatusList);
  const [selectedPatientId, setSelectedPatientId] = useState('SC-P012');
  const [selectedWard, setSelectedWard] = useState('General Ward');
  const [selectedBed, setSelectedBed] = useState('B102');
  const [successMessage, setSuccessMessage] = useState('');

  const pendingAdmissionPatients = patients.filter(
    (p) => p.admission_status === 'Pending Admission' || p.patient_id === 'SC-P012'
  );

  const handleRegisterAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    const targetPatient = patients.find((p) => p.patient_id === selectedPatientId);
    if (!targetPatient) return;

    setBeds((prev) =>
      prev.map((b) =>
        b.bed_number === selectedBed ? { ...b, status: 'Occupied', patient: `${targetPatient.name} (${targetPatient.patient_id})` } : b
      )
    );

    setSuccessMessage(`Bed ${selectedBed} (${selectedWard}) registered for ${targetPatient.name}! Administrative admission complete.`);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">ADMISSIONS & BED AVAILABILITY MANAGEMENT</h1>
          <p className="text-xs text-slate-500">Administrative IPD registration based on doctor admission recommendations</p>
        </div>
      </div>

      {successMessage && (
        <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Grid: Left Admission Form, Right Bed Status Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Administrative Admission Registration Form */}
        <div className="lg:col-span-1 rounded-2xl bg-white border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <UserPlus className="h-5 w-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">REGISTER IPD ADMISSION</h3>
          </div>

          <form onSubmit={handleRegisterAdmission} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Select Patient *</label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white text-slate-800 font-semibold"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.patient_id}>
                    {p.name} ({p.patient_id}) — {p.department}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Ward Selection</label>
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white text-slate-800 font-semibold"
              >
                <option value="General Ward">General Ward</option>
                <option value="ICU">ICU Ward</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Assign Available Bed *</label>
              <select
                value={selectedBed}
                onChange={(e) => setSelectedBed(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white text-slate-800 font-semibold font-mono"
              >
                {beds
                  .filter((b) => b.status === 'Available')
                  .map((b) => (
                    <option key={b.bed_number} value={b.bed_number}>
                      🟢 Bed {b.bed_number} ({b.ward})
                    </option>
                  ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2.5 text-xs font-bold shadow-sm transition-all text-center"
            >
              [ REGISTER ADMISSION ]
            </button>
          </form>
        </div>

        {/* Right: Bed Availability Matrix (Section 17 Blueprint) */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Bed className="h-5 w-5 text-purple-600" />
              <h3 className="text-sm font-bold text-slate-900">REAL-TIME BED AVAILABILITY MATRIX</h3>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
              Reception View
            </span>
          </div>

          {/* General Ward Beds */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">General Ward</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {beds
                .filter((b) => b.ward === 'General Ward')
                .map((b) => (
                  <div
                    key={b.bed_number}
                    className={`rounded-xl p-3 border text-xs flex flex-col justify-between ${
                      b.status === 'Occupied' ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <strong className="font-mono text-slate-900">{b.bed_number}</strong>
                      <span className={`text-[10px] font-extrabold ${b.status === 'Occupied' ? 'text-rose-700' : 'text-emerald-700'}`}>
                        {b.status === 'Occupied' ? '🔴 Occupied' : '🟢 Available'}
                      </span>
                    </div>
                    {b.patient && <div className="text-[10px] text-slate-600 truncate mt-1">{b.patient}</div>}
                  </div>
                ))}
            </div>
          </div>

          {/* ICU Beds */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">ICU Ward</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {beds
                .filter((b) => b.ward === 'ICU')
                .map((b) => (
                  <div
                    key={b.bed_number}
                    className={`rounded-xl p-3 border text-xs flex flex-col justify-between ${
                      b.status === 'Occupied' ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <strong className="font-mono text-slate-900">{b.bed_number}</strong>
                      <span className={`text-[10px] font-extrabold ${b.status === 'Occupied' ? 'text-rose-700' : 'text-emerald-700'}`}>
                        {b.status === 'Occupied' ? '🔴 Occupied' : '🟢 Available'}
                      </span>
                    </div>
                    {b.patient && <div className="text-[10px] text-slate-600 truncate mt-1">{b.patient}</div>}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
