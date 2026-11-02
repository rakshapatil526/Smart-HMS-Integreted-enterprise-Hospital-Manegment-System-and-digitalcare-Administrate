import React, { useState } from 'react';
import { Users, Search, User, ShieldAlert, HeartPulse, Stethoscope, Bed, Pill, FlaskConical, Image as ImageIcon, X } from 'lucide-react';

interface MyPatientsViewProps {
  onNavigate: (tab: string, extraData?: any) => void;
}

export const MyPatientsView: React.FC<MyPatientsViewProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);

  const patientsData = [
    {
      id: 'P001',
      name: 'Patient A (Aarav Sharma)',
      age: 25,
      gender: 'Male',
      lastVisit: '15 Aug 2026',
      bloodGroup: 'O+',
      allergies: 'Penicillin, NSAIDs',
      history: 'Hypertension (2024), Asthma in childhood',
      phone: '+1 555-0192',
      email: 'aarav.sharma@gmail.com',
    },
    {
      id: 'P002',
      name: 'Patient B (Priya Patel)',
      age: 40,
      gender: 'Female',
      lastVisit: '16 Aug 2026',
      bloodGroup: 'A+',
      allergies: 'Sulfa Drugs',
      history: 'Type 2 Diabetes Mellitus',
      phone: '+1 555-0194',
      email: 'priya.patel@gmail.com',
    },
    {
      id: 'P003',
      name: 'Patient C (Vikram Singh)',
      age: 52,
      gender: 'Male',
      lastVisit: '10 Aug 2026',
      bloodGroup: 'B+',
      allergies: 'None reported',
      history: 'Coronary Artery Disease, Hyperlipidemia',
      phone: '+1 555-0196',
      email: 'vikram.singh@gmail.com',
    },
    {
      id: 'P004',
      name: 'Patient D (Anita Roy)',
      age: 31,
      gender: 'Female',
      lastVisit: '12 Aug 2026',
      bloodGroup: 'AB+',
      allergies: 'Aspirin',
      history: 'Mild Anemia',
      phone: '+1 555-0198',
      email: 'anita.roy@gmail.com',
    },
  ];

  const filtered = patientsData.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Users className="h-5 w-5 text-teal-600" />
            <span>MY PATIENTS</span>
          </h1>
          <p className="text-xs text-slate-500">
            Authorized patient directory & clinical health summaries
          </p>
        </div>
      </div>

      {/* SEARCH PATIENT BAR */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="[Search Patient] by Name, ID, or Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-xs font-semibold focus:border-teal-500 focus:outline-none"
          />
        </div>
      </div>

      {/* PATIENT LIST TABLE */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] border-b">
                <th className="p-3">Patient ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Age / Gender</th>
                <th className="p-3">Last Visit</th>
                <th className="p-3">Allergies</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-mono font-bold text-slate-700">{p.id}</td>
                  <td className="p-3 font-bold text-slate-900">{p.name}</td>
                  <td className="p-3 text-slate-600">{p.age} yrs | {p.gender}</td>
                  <td className="p-3 text-teal-700 font-semibold">{p.lastVisit}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.allergies === 'None reported' ? 'bg-slate-100 text-slate-600' : 'bg-red-100 text-red-700'}`}>
                      {p.allergies}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedPatient(p)}
                      className="rounded-lg bg-teal-600 text-white hover:bg-teal-700 px-3.5 py-1 text-xs font-bold transition-all shadow-sm"
                    >
                      [Open]
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PATIENT DETAIL MODAL */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md">
                  AUTHORIZATION GRANTED • PATIENT DOSSIER
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">{selectedPatient.name}</h2>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-slate-400 hover:text-slate-700 transition-colors p-1"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold">PATIENT ID</span>
                <div className="font-mono font-bold text-slate-800">{selectedPatient.id}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold">AGE / GENDER</span>
                <div className="font-bold text-slate-800">{selectedPatient.age} yrs ({selectedPatient.gender})</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold">BLOOD GROUP</span>
                <div className="font-bold text-rose-600">{selectedPatient.bloodGroup}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold">REGISTERED PHONE</span>
                <div className="font-bold text-slate-800">{selectedPatient.phone}</div>
              </div>
            </div>

            {/* Allergies & Medical History */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-2xl bg-red-50 p-4 border border-red-200">
                <div className="flex items-center space-x-1.5 font-bold text-red-800 mb-1">
                  <ShieldAlert className="h-4 w-4 text-red-600" />
                  <span>Known Allergies</span>
                </div>
                <p className="text-red-900 font-medium">{selectedPatient.allergies}</p>
              </div>

              <div className="rounded-2xl bg-slate-100 p-4 border border-slate-200">
                <div className="flex items-center space-x-1.5 font-bold text-slate-800 mb-1">
                  <HeartPulse className="h-4 w-4 text-teal-600" />
                  <span>Medical History</span>
                </div>
                <p className="text-slate-700 font-medium">{selectedPatient.history}</p>
              </div>
            </div>

            {/* MODULE QUICK NAVIGATION BUTTONS */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">QUICK MODULE ACTIONS FOR THIS PATIENT:</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                <button
                  onClick={() => { setSelectedPatient(null); onNavigate('opd', { patientName: selectedPatient.name }); }}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-teal-200 bg-teal-50 hover:bg-teal-100 transition-all font-bold text-xs text-teal-800"
                >
                  <Stethoscope className="h-4 w-4 mb-1 text-teal-600" />
                  <span>[OPD]</span>
                </button>
                <button
                  onClick={() => { setSelectedPatient(null); onNavigate('ipd', { patientName: selectedPatient.name }); }}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-cyan-200 bg-cyan-50 hover:bg-cyan-100 transition-all font-bold text-xs text-cyan-800"
                >
                  <Bed className="h-4 w-4 mb-1 text-cyan-600" />
                  <span>[IPD]</span>
                </button>
                <button
                  onClick={() => { setSelectedPatient(null); onNavigate('ehr', { patientId: selectedPatient.id }); }}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all font-bold text-xs text-slate-800"
                >
                  <HeartPulse className="h-4 w-4 mb-1 text-slate-600" />
                  <span>[EHR]</span>
                </button>
                <button
                  onClick={() => { setSelectedPatient(null); onNavigate('prescriptions', { patientName: selectedPatient.name }); }}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 transition-all font-bold text-xs text-rose-800"
                >
                  <Pill className="h-4 w-4 mb-1 text-rose-600" />
                  <span>[Prescription]</span>
                </button>
                <button
                  onClick={() => { setSelectedPatient(null); onNavigate('lab-requests', { patientName: selectedPatient.name }); }}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 transition-all font-bold text-xs text-purple-800"
                >
                  <FlaskConical className="h-4 w-4 mb-1 text-purple-600" />
                  <span>[Lab]</span>
                </button>
                <button
                  onClick={() => { setSelectedPatient(null); onNavigate('radiology', { patientName: selectedPatient.name }); }}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 transition-all font-bold text-xs text-amber-800"
                >
                  <ImageIcon className="h-4 w-4 mb-1 text-amber-600" />
                  <span>[Radiology]</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
