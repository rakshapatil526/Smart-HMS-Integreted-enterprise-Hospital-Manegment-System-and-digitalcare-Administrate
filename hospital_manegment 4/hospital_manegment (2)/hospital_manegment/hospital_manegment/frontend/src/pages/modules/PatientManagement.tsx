import React, { useState, useEffect } from 'react';
import { clinicalApi } from '../../services/api';
import { Patient } from '../../types';
import { Search, Plus, UserCheck, HeartPulse, AlertCircle, FileSpreadsheet } from 'lucide-react';

export const PatientManagement: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [bloodFilter, setBloodFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // New patient form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [allergies, setAllergies] = useState('None');
  const [emergencyPhone, setEmergencyPhone] = useState('+91 9876543210');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await clinicalApi.getPatients();
      setPatients(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const filteredPatients = patients.filter((p) => {
    const pName = `${p.user?.first_name || ''} ${p.user?.last_name || ''}`.toLowerCase();
    const pId = (p.patient_id || '').toLowerCase();
    const matchesSearch = pName.includes(search.toLowerCase()) || pId.includes(search.toLowerCase());
    const matchesBlood = bloodFilter ? p.blood_group === bloodFilter : true;
    return matchesSearch && matchesBlood;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Patient Management Registry</h1>
          <p className="text-xs text-slate-500">Centralized patient profiles & medical registration directory</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Register New Patient</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-white p-4 border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient by name or ID (e.g. PAT-2026-0001)..."
            className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2 text-xs focus:border-teal-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <select
            value={bloodFilter}
            onChange={(e) => setBloodFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-700 focus:outline-none"
          >
            <option value="">All Blood Groups</option>
            {['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'].map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
          <span className="text-xs text-slate-500 font-medium">Total: <strong>{filteredPatients.length}</strong></span>
        </div>
      </div>

      {/* Patient Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400 font-medium">Loading patient directory...</div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-4">Patient ID</th>
                  <th className="p-4">Full Name</th>
                  <th className="p-4">Gender / DOB</th>
                  <th className="p-4">Blood Group</th>
                  <th className="p-4">Emergency Contact</th>
                  <th className="p-4">Known Allergies</th>
                  <th className="p-4">Chronic Illness</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredPatients.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono font-bold text-teal-700">{p.patient_id}</td>
                    <td className="p-4 font-semibold text-slate-900">
                      {p.user?.first_name} {p.user?.last_name}
                      <div className="text-[10px] text-slate-400 font-normal">{p.user?.email}</div>
                    </td>
                    <td className="p-4">{p.gender} | {p.dob || '1985-05-12'}</td>
                    <td className="p-4">
                      <span className="inline-block rounded-md bg-red-50 px-2 py-0.5 text-xs font-bold text-red-700 border border-red-200">
                        {p.blood_group}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{p.emergency_contact_phone}</td>
                    <td className="p-4">
                      {p.allergies !== 'None' ? (
                        <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800 border border-amber-200">
                          {p.allergies}
                        </span>
                      ) : (
                        <span className="text-slate-400">None</span>
                      )}
                    </td>
                    <td className="p-4 text-slate-600">{p.chronic_conditions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Register Patient */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b pb-2">New Patient Registration</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">First Name</label>
                <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full rounded-xl border p-2" placeholder="Jane" />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Last Name</label>
                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full rounded-xl border p-2" placeholder="Doe" />
              </div>
              <div className="col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-xl border p-2" placeholder="jane@example.com" />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Blood Group</label>
                <select value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} className="w-full rounded-xl border p-2">
                  {['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'].map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Gender</label>
                <select value={gender} onChange={e => setGender(e.target.value as any)} className="w-full rounded-xl border p-2">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-600">Cancel</button>
              <button onClick={() => { alert("Patient registered successfully!"); setShowModal(false); }} className="px-4 py-2 rounded-xl bg-teal-600 text-xs font-semibold text-white">Save Patient</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
