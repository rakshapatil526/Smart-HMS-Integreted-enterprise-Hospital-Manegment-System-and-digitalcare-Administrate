import React from 'react';
import { NursePatient } from '../../types';
import { Bed, Calendar, UserCheck, ArrowRightLeft, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface NurseIPDViewProps {
  patient: NursePatient;
}

export const NurseIPDView: React.FC<NurseIPDViewProps> = ({ patient }) => {
  return (
    <div className="space-y-6">
      {/* Workflow Boundary Banner */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-xs text-blue-950 flex items-start space-x-3">
        <ShieldAlert className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm text-blue-900">IPD Allocation & Bed Management Boundary</h4>
          <p className="mt-0.5 text-blue-800">
            Bed allocation and room transfer requests are managed via central IPD reception workflow. Nurse can view assigned bed details and live transfer history.
          </p>
        </div>
      </div>

      {/* IPD PATIENT CARD */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="rounded-xl bg-teal-50 p-2.5 text-teal-600">
              <Bed className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">IPD PATIENT BED DETAILS</h2>
              <p className="text-xs text-slate-500">Inpatient Admission & Bed Allocation Record</p>
            </div>
          </div>

          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
              patient.status === 'Critical'
                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}
          >
            Status: {patient.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
            <span className="text-slate-400 font-semibold block mb-1">Ward Name</span>
            <span className="text-sm font-extrabold text-slate-900">{patient.ward_name}</span>
          </div>

          <div className="rounded-xl bg-teal-50/60 p-4 border border-teal-200">
            <span className="text-teal-700 font-semibold block mb-1">Room / Bed</span>
            <span className="text-sm font-extrabold text-teal-950">Room {patient.room_number} • Bed {patient.bed_number}</span>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
            <span className="text-slate-400 font-semibold block mb-1">Admission Date</span>
            <span className="text-sm font-extrabold text-slate-900 flex items-center space-x-1">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>{patient.admission_date}</span>
            </span>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
            <span className="text-slate-400 font-semibold block mb-1">Attending Physician</span>
            <span className="text-sm font-extrabold text-slate-900 flex items-center space-x-1">
              <UserCheck className="h-4 w-4 text-slate-400" />
              <span>{patient.doctor_name}</span>
            </span>
          </div>
        </div>

        {/* Transfer History Tracker (Section 11 requirement) */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <ArrowRightLeft className="h-4 w-4 text-teal-600" />
            <span>Bed Transfer & Assignment Log</span>
          </h3>

          <div className="relative pl-6 space-y-4 border-l-2 border-slate-200">
            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-teal-600 border-2 border-white" />
              <div className="text-xs font-bold text-slate-900">Current Assignment: Bed {patient.bed_number} (Ward {patient.ward_name})</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Assigned on {patient.admission_date} • Confirmed by IPD Admissions</div>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-slate-300 border-2 border-white" />
              <div className="text-xs font-semibold text-slate-600">Admission Check-in</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Initial triage & bed placement completed.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
