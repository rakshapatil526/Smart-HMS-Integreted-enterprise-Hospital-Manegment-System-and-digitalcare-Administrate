import React, { useState } from 'react';
import { NursePatient } from '../../types';
import { Search, ShieldAlert, ArrowRight, Bed, UserCheck, AlertCircle } from 'lucide-react';

interface NursePatientsViewProps {
  patients: NursePatient[];
  onOpenPatient: (patient: NursePatient, tab?: string) => void;
}

export const NursePatientsView: React.FC<NursePatientsViewProps> = ({ patients, onOpenPatient }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.bed_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.doctor_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Scope Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <span>MY ASSIGNED PATIENTS</span>
            <span className="rounded-full bg-teal-100 text-teal-800 text-xs font-bold px-2.5 py-0.5 border border-teal-200">
              Authorized Scope Only
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Displaying only IPD patients currently assigned to Nurse Sarah Jenkins.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Patient, Bed, or Doctor..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Security Scope Notice */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 text-xs text-blue-900 flex items-start space-x-3">
        <ShieldAlert className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Role Access Boundary:</span> Nurse account is authorized to view assigned care records.
          <span className="text-blue-700 ml-1">
            Other hospital departments (HR, Billing, Unassigned Ward Patients) are strictly restricted.
          </span>
        </div>
      </div>

      {/* Patient List Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Patient Name & ID</th>
                <th className="px-5 py-3.5">Bed / Ward</th>
                <th className="px-5 py-3.5">Attending Doctor</th>
                <th className="px-5 py-3.5">Current Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-4 font-semibold text-slate-900">
                    <div className="flex items-center space-x-3">
                      <div className="h-9 w-9 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                        {(patient?.name || 'P')[0]}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{patient.name}</div>
                        <div className="text-[11px] text-slate-400 font-normal">
                          {patient.patient_id} • {patient.gender}, {patient.age} yrs • Blood: <span className="font-semibold text-rose-600">{patient.blood_group}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-bold text-teal-700">
                    <div className="flex items-center space-x-1.5">
                      <Bed className="h-4 w-4 text-teal-600" />
                      <span className="font-bold">{patient.bed_number}</span>
                      <span className="text-[11px] text-slate-400 font-normal">({patient.ward_name})</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-700">
                    <div className="flex items-center space-x-1.5">
                      <UserCheck className="h-4 w-4 text-slate-400" />
                      <span>{patient.doctor_name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        patient.status === 'Critical'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : patient.status === 'Stable'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : patient.status === 'Monitoring'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => onOpenPatient(patient)}
                      className="inline-flex items-center space-x-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 px-3.5 py-1.5 text-xs font-bold text-white transition-all shadow-xs"
                    >
                      <span>Open Workspace</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-xs font-medium">No assigned patients match "{searchTerm}".</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
