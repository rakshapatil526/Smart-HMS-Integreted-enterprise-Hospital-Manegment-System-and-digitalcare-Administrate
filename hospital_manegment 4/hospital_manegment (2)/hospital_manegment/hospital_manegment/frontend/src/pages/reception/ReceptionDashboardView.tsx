import React from 'react';
import { ReceptionAppointmentRecord, ReceptionPatientRecord, ReceptionDoctorRecord } from '../../types';
import { Calendar, Users, UserCheck, Clock, Bed, AlertTriangle, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ReceptionDashboardViewProps {
  appointments: ReceptionAppointmentRecord[];
  patients: ReceptionPatientRecord[];
  doctors: ReceptionDoctorRecord[];
  onOpenPatient: (patient: ReceptionPatientRecord) => void;
  onNavigateTab: (tab: string) => void;
}

export const ReceptionDashboardView: React.FC<ReceptionDashboardViewProps> = ({
  appointments,
  patients,
  doctors,
  onOpenPatient,
  onNavigateTab,
}) => {
  const waitingCount = appointments.filter((a) => a.status === 'Waiting').length;
  const checkedInCount = appointments.filter((a) => a.status === 'Checked-in').length;
  const newRegistrationsCount = 18;
  const availableDoctorsCount = doctors.filter((d) => d.status === 'Available').length;
  const availableBedsCount = 4;
  const pendingAdmissionsCount = 3;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-800 via-indigo-900 to-slate-900 p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 rounded-full bg-blue-600/40 px-3 py-1 text-xs font-semibold text-blue-200 border border-blue-400/30 mb-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Front Desk Reception & Patient Coordination Hub</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Good Morning, Reception 👋</h1>
            <p className="text-xs text-blue-100/80 mt-1">
              Active Front Desk Desk Queue: <strong className="text-white">86 total patient appointments</strong> scheduled today across 10 hospital departments.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigateTab('registration')}
              className="inline-flex items-center space-x-2 rounded-xl bg-blue-500 hover:bg-blue-400 px-4 py-2.5 text-xs font-bold text-slate-900 transition-all shadow-sm"
            >
              <span>+ Register New Patient</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards (8 Front-Desk Cards as specified in Section 3 Blueprint) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Appointments */}
        <div
          onClick={() => onNavigateTab('appointments')}
          className="cursor-pointer rounded-2xl bg-white p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Today's Appointments</span>
            <div className="rounded-xl bg-blue-50 p-2 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">86</div>
          <span className="text-[10px] text-blue-600 font-medium">Scheduled for today</span>
        </div>

        {/* Card 2: Waiting Patients */}
        <div
          onClick={() => onNavigateTab('opd-queue')}
          className="cursor-pointer rounded-2xl bg-white p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Waiting Patients</span>
            <div className="rounded-xl bg-amber-50 p-2 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{waitingCount + 12}</div>
          <span className="text-[10px] text-amber-600 font-medium">In waiting lobby</span>
        </div>

        {/* Card 3: Checked-in Patients */}
        <div
          onClick={() => onNavigateTab('opd-queue')}
          className="cursor-pointer rounded-2xl bg-white p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Checked-in Patients</span>
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{checkedInCount + 15}</div>
          <span className="text-[10px] text-emerald-600 font-medium">With doctor / OPD</span>
        </div>

        {/* Card 4: New Registrations */}
        <div
          onClick={() => onNavigateTab('search')}
          className="cursor-pointer rounded-2xl bg-white p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">New Registrations</span>
            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{newRegistrationsCount}</div>
          <span className="text-[10px] text-indigo-600 font-medium">Registered today</span>
        </div>

        {/* Card 5: Available Doctors */}
        <div
          onClick={() => onNavigateTab('doctors')}
          className="cursor-pointer rounded-2xl bg-white p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Available Doctors</span>
            <div className="rounded-xl bg-teal-50 p-2 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{availableDoctorsCount}</div>
          <span className="text-[10px] text-teal-600 font-medium">Active in OPD</span>
        </div>

        {/* Card 6: Available Beds */}
        <div
          onClick={() => onNavigateTab('beds')}
          className="cursor-pointer rounded-2xl bg-white p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Available Beds</span>
            <div className="rounded-xl bg-purple-50 p-2 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Bed className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{availableBedsCount}</div>
          <span className="text-[10px] text-purple-600 font-medium">General & ICU beds</span>
        </div>

        {/* Card 7: Pending Admissions */}
        <div
          onClick={() => onNavigateTab('admissions')}
          className="cursor-pointer rounded-2xl bg-white p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pending Admissions</span>
            <div className="rounded-xl bg-amber-50 p-2 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Bed className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{pendingAdmissionsCount}</div>
          <span className="text-[10px] text-amber-600 font-medium">Orders from doctor</span>
        </div>

        {/* Card 8: Emergency Alerts */}
        <div
          onClick={() => onNavigateTab('emergency')}
          className="cursor-pointer rounded-2xl bg-white p-4 border border-rose-200 shadow-sm hover:shadow-md transition-all group bg-rose-50/30"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">Emergency Alerts</span>
            <div className="rounded-xl bg-rose-100 p-2 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-rose-900">1 STAT</div>
          <span className="text-[10px] text-rose-600 font-medium">Ambulance arriving</span>
        </div>
      </div>

      {/* Today's Appointments Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Today's Appointments Queue</h2>
            <p className="text-xs text-slate-500 mt-0.5">Front desk patient check-in and doctor assignment list.</p>
          </div>
          <button
            onClick={() => onNavigateTab('appointments')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            View All ({appointments.length}) →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Time</th>
                <th className="px-5 py-3.5">Patient ID & Name</th>
                <th className="px-5 py-3.5">Doctor</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Front Desk Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.slice(0, 6).map((apt) => {
                const patRecord = patients.find((p) => p.patient_id === apt.patient_id);
                return (
                  <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-900">{apt.time_slot}</td>
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      <div className="flex items-center space-x-3">
                        <img
                          src={patRecord?.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80'}
                          alt={apt.patient_name}
                          className="h-8 w-8 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{apt.patient_name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{apt.patient_id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-800">{apt.doctor_name}</td>
                    <td className="px-5 py-4 text-slate-600">{apt.department}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          apt.status === 'Confirmed'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : apt.status === 'Waiting'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : apt.status === 'Checked-in'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {patRecord && (
                        <button
                          onClick={() => onOpenPatient(patRecord)}
                          className="inline-flex items-center space-x-1 rounded-xl bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-xs font-bold text-white transition-all shadow-2xs"
                        >
                          <span>View Profile</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
