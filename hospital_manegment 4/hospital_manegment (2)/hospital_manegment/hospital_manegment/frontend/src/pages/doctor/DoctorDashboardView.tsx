import React, { useState, useEffect } from 'react';
import {
  Users, Stethoscope, Bed, FlaskConical, Image as ImageIcon,
  Clock, ArrowRight, Bell, ChevronDown, CheckCircle, FileText, User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sharedStore } from '../../services/sharedStore';
import { ReceptionAppointmentRecord } from '../../types';

interface DoctorDashboardViewProps {
  onNavigate: (tab: string, extraData?: any) => void;
}

export const DoctorDashboardView: React.FC<DoctorDashboardViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const activeDoctor = sharedStore.getDoctorNameForUser(user);
  const [appointmentsList, setAppointmentsList] = useState<ReceptionAppointmentRecord[]>([]);

  const refreshData = () => {
    const list = sharedStore.getAppointmentsForDoctor(activeDoctor);
    setAppointmentsList(list);
  };

  useEffect(() => {
    sharedStore.setSelectedDoctor(activeDoctor);
    refreshData();
    const handleAptAdded = () => refreshData();

    window.addEventListener('smartcare_appointment_added', handleAptAdded);
    return () => {
      window.removeEventListener('smartcare_appointment_added', handleAptAdded);
    };
  }, [activeDoctor]);

  const doctorInfo = sharedStore.getDoctorDetailsForUser(user);

  return (
    <div className="space-y-6">
      {/* Top Smart Care HMS Branding Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 p-6 rounded-3xl text-white shadow-xl border border-teal-500/20">
        <div>
          <div className="flex items-center space-x-2 text-teal-400 font-bold text-xs uppercase tracking-wider mb-1">
            <span className="h-2 w-2 rounded-full bg-teal-400 animate-ping" />
            <span>🏥 SMART CARE HMS — DOCTOR MODULE</span>
          </div>
          <h1 className="text-2xl font-bold">Good Morning, {activeDoctor}</h1>
          <p className="text-xs text-slate-300 mt-1">
            Department: <strong className="text-teal-300">{doctorInfo.department}</strong> | Specialization: <strong className="text-teal-300">{doctorInfo.specialization}</strong>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Active Doctor Duty Status Badge */}
          <div className="flex items-center space-x-2 bg-slate-800/90 text-teal-300 px-3.5 py-2 rounded-xl text-xs font-semibold border border-teal-500/30">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] text-slate-300 font-bold">Duty Status: Active</span>
          </div>

          <button
            onClick={() => onNavigate('notifications')}
            className="flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-800 text-teal-300 px-3.5 py-2 rounded-xl text-xs font-semibold border border-teal-500/30 transition-all"
          >
            <Bell className="h-4 w-4 text-teal-400" />
            <span>Notifications ({sharedStore.getDoctorNotifications(activeDoctor).length})</span>
          </button>
        </div>
      </div>

      {/* Quick KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div
          onClick={() => onNavigate('appointments')}
          className="cursor-pointer rounded-2xl border border-teal-100 bg-white p-4 shadow-sm hover:shadow-md hover:border-teal-300 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold text-slate-600">Today's Patients</span>
            <Users className="h-4 w-4 text-teal-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3 text-2xl font-extrabold text-slate-900">{appointmentsList.length}</div>
          <div className="text-[10px] text-teal-600 font-semibold mt-1 flex items-center space-x-1">
            <span>Scheduled for {activeDoctor}</span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('opd')}
          className="cursor-pointer rounded-2xl border border-amber-100 bg-white p-4 shadow-sm hover:shadow-md hover:border-amber-300 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold text-slate-600">Waiting Patients</span>
            <Clock className="h-4 w-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3 text-2xl font-extrabold text-amber-600">
            {appointmentsList.filter(a => a.status === 'Waiting' || a.status === 'Confirmed').length}
          </div>
          <div className="text-[10px] text-amber-600 font-semibold mt-1">In OPD Queue</div>
        </div>

        <div
          onClick={() => onNavigate('ipd')}
          className="cursor-pointer rounded-2xl border border-cyan-100 bg-white p-4 shadow-sm hover:shadow-md hover:border-cyan-300 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold text-slate-600">IPD Patients</span>
            <Bed className="h-4 w-4 text-cyan-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3 text-2xl font-extrabold text-cyan-700">3</div>
          <div className="text-[10px] text-cyan-600 font-semibold mt-1">Admitted under care</div>
        </div>

        <div
          onClick={() => onNavigate('lab-requests')}
          className="cursor-pointer rounded-2xl border border-purple-100 bg-white p-4 shadow-sm hover:shadow-md hover:border-purple-300 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold text-slate-600">Pending Lab</span>
            <FlaskConical className="h-4 w-4 text-purple-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3 text-2xl font-extrabold text-purple-700">3</div>
          <div className="text-[10px] text-purple-600 font-semibold mt-1">Awaiting verification</div>
        </div>

        <div
          onClick={() => onNavigate('radiology')}
          className="cursor-pointer rounded-2xl border border-rose-100 bg-white p-4 shadow-sm hover:shadow-md hover:border-rose-300 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold text-slate-600">Pending Radiology</span>
            <ImageIcon className="h-4 w-4 text-rose-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-3 text-2xl font-extrabold text-rose-700">2</div>
          <div className="text-[10px] text-rose-600 font-semibold mt-1">Scans ready for review</div>
        </div>
      </div>

      {/* Main Content Grid: Today's Appointments & Pending Reports Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments Table */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center space-x-2">
              <Stethoscope className="h-5 w-5 text-teal-600" />
              <h2 className="text-base font-bold text-slate-900">Appointments for {activeDoctor}</h2>
            </div>
            <button
              onClick={() => onNavigate('appointments')}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] border-b">
                  <th className="p-3">Time Slot</th>
                  <th className="p-3">Patient Name</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {appointmentsList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-xs text-slate-400">
                      No appointments booked for {activeDoctor} today.
                    </td>
                  </tr>
                ) : (
                  appointmentsList.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-bold font-mono text-teal-700">{apt.time_slot}</td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-900">{apt.patient_name}</div>
                        <div className="text-[10px] text-slate-400">ID: {apt.patient_id}</div>
                      </td>
                      <td className="p-3">
                        <span className="rounded-md bg-slate-100 text-slate-700 px-2 py-0.5 font-semibold text-[10px]">
                          {apt.department}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            apt.status === 'Waiting'
                              ? 'bg-amber-100 text-amber-800'
                              : apt.status === 'Confirmed'
                              ? 'bg-teal-100 text-teal-800'
                              : apt.status === 'Checked-in'
                              ? 'bg-cyan-100 text-cyan-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onNavigate('opd', { patientName: apt.patient_name })}
                          className="rounded-lg bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 text-xs font-bold shadow-sm transition-all"
                        >
                          [Open Consultation]
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Reports & AI Assistant Side Box */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 border-b pb-3">
              <FileText className="h-4 w-4 text-purple-600" />
              <span>Pending Diagnostic Reports</span>
            </h3>

            <div className="space-y-3">
              <div
                onClick={() => onNavigate('lab-requests')}
                className="cursor-pointer rounded-xl bg-purple-50 p-3.5 border border-purple-100 hover:border-purple-300 transition-all flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <FlaskConical className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Laboratory Reports</div>
                    <div className="text-[10px] text-purple-700">3 Pending Results for Verification</div>
                  </div>
                </div>
                <span className="rounded-full bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5">3</span>
              </div>

              <div
                onClick={() => onNavigate('radiology')}
                className="cursor-pointer rounded-xl bg-rose-50 p-3.5 border border-rose-100 hover:border-rose-300 transition-all flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <ImageIcon className="h-5 w-5 text-rose-600" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Radiology Imaging</div>
                    <div className="text-[10px] text-rose-700">2 X-Ray / CT Scans Completed</div>
                  </div>
                </div>
                <span className="rounded-full bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5">2</span>
              </div>
            </div>
          </div>

          <div
            onClick={() => onNavigate('ai-assistant')}
            className="cursor-pointer rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-5 text-white shadow-md hover:shadow-lg transition-all relative overflow-hidden"
          >
            <div className="relative z-10 space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md">
                🤖 AI Clinical Decision Assist
              </span>
              <h4 className="text-sm font-bold">Analyze Patient Risk & Allergies</h4>
              <p className="text-xs text-amber-100">
                Run clinical decision support on active patient symptoms, drug-drug interactions, and lab summaries.
              </p>
              <div className="pt-1 flex items-center text-xs font-bold text-amber-900 bg-white px-3 py-1.5 rounded-xl w-fit shadow-sm">
                <span>Launch Clinical AI</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
