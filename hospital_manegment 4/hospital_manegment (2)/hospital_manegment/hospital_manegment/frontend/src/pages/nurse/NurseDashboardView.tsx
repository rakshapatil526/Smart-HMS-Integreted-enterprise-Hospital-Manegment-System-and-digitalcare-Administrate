import React from 'react';
import { NursePatient, NurseVitalEntry, MedicationAdminEntry } from '../../types';
import { Users, HeartPulse, Pill, AlertTriangle, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

interface NurseDashboardViewProps {
  patients: NursePatient[];
  vitals: NurseVitalEntry[];
  medications: MedicationAdminEntry[];
  onOpenPatient: (patient: NursePatient, tab?: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const NurseDashboardView: React.FC<NurseDashboardViewProps> = ({
  patients,
  vitals,
  medications,
  onOpenPatient,
  onNavigateTab,
}) => {
  const pendingVitalsCount = patients.filter((p) => p.vitals_pending).length;
  const pendingMedsCount = medications.filter((m) => m.status === 'Pending').length;
  const criticalPatients = patients.filter((p) => p.status === 'Critical');
  const alertVitals = vitals.filter((v) => v.attention_required);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 rounded-full bg-teal-600/40 px-3 py-1 text-xs font-semibold text-teal-200 border border-teal-500/30 mb-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Inpatient Clinical Workspace • Morning Shift</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Good Morning, Nurse Sarah Jenkins 👋</h1>
            <p className="text-xs text-teal-100/80 mt-1">
              You are assigned to care for <strong className="text-white">{patients.length} patients</strong> in Ward General & ICU today.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigateTab('handover')}
              className="inline-flex items-center space-x-2 rounded-xl bg-white/10 hover:bg-white/20 px-4 py-2.5 text-xs font-medium text-white transition-all border border-white/20"
            >
              <Clock className="h-4 w-4" />
              <span>Shift Handover Log</span>
            </button>
            <button
              onClick={() => onNavigateTab('patients')}
              className="inline-flex items-center space-x-2 rounded-xl bg-teal-500 hover:bg-teal-400 px-4 py-2.5 text-xs font-bold text-slate-900 transition-all shadow-sm"
            >
              <span>View My Patients</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Assigned Patients */}
        <div
          onClick={() => onNavigateTab('patients')}
          className="cursor-pointer rounded-2xl bg-white p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Patients</span>
            <div className="rounded-xl bg-teal-50 p-2.5 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{patients.length}</span>
            <span className="text-xs text-slate-500">Admitted in Ward</span>
          </div>
          <p className="mt-2 text-xs text-slate-600 flex items-center space-x-1">
            <span className="font-semibold text-rose-600">{criticalPatients.length} Critical</span>
            <span>•</span>
            <span>{patients.length - criticalPatients.length} Stable/Recovery</span>
          </p>
        </div>

        {/* Card 2: Vitals Pending */}
        <div
          onClick={() => onNavigateTab('vitals')}
          className="cursor-pointer rounded-2xl bg-white p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vitals Pending</span>
            <div className="rounded-xl bg-rose-50 p-2.5 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <HeartPulse className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{pendingVitalsCount}</span>
            <span className="text-xs text-slate-500">Patients due now</span>
          </div>
          <p className="mt-2 text-xs text-amber-600 font-medium">
            Next vital check interval scheduled at 12:00 PM
          </p>
        </div>

        {/* Card 3: Medication Pending */}
        <div
          onClick={() => onNavigateTab('medications')}
          className="cursor-pointer rounded-2xl bg-white p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Medication Pending</span>
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Pill className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{pendingMedsCount}</span>
            <span className="text-xs text-slate-500">Prescriptions due</span>
          </div>
          <p className="mt-2 text-xs text-slate-600">
            Click to record dose administration or mark skipped
          </p>
        </div>
      </div>

      {/* Clinical Alert Section (Section 12 requirement: Abnormal vital indicator alert) */}
      {alertVitals.length > 0 && (
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/80 p-4 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="rounded-lg bg-amber-500 p-2 text-white shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-amber-950 flex items-center space-x-2">
                <span>⚠️ Attention Required</span>
                <span className="rounded-full bg-amber-200 text-amber-900 text-[10px] font-extrabold px-2 py-0.5">
                  Clinical Threshold Alert
                </span>
              </h3>
              <p className="text-xs text-amber-900 mt-1">
                Recent vital sign reading requires clinical review. System detected values exceeding threshold.
              </p>
              <div className="mt-3 space-y-2">
                {alertVitals.map((v) => {
                  const pat = patients.find((p) => p.id === v.patient_id);
                  return (
                    <div
                      key={v.id}
                      className="flex items-center justify-between rounded-xl bg-white p-3 border border-amber-200 text-xs shadow-2xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900">{v.patient_name}</span>
                        <span className="text-slate-500 ml-2">Bed: {v.bed_number}</span>
                        <div className="mt-1 text-slate-600 flex items-center space-x-3">
                          <span className="font-semibold text-rose-600">Temp: {v.temperature}</span>
                          <span>BP: {v.bp_systolic}/{v.bp_diastolic} mmHg</span>
                          <span>SpO2: {v.spo2}%</span>
                        </div>
                      </div>
                      {pat && (
                        <button
                          onClick={() => onOpenPatient(pat, 'vitals')}
                          className="rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 transition-colors shadow-2xs"
                        >
                          Review Vitals
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Today's Assigned Patients Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Today's Assigned Patients</h2>
            <p className="text-xs text-slate-500 mt-0.5">Only patients assigned to your active ward shift appear below.</p>
          </div>
          <button
            onClick={() => onNavigateTab('patients')}
            className="text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline"
          >
            View All ({patients.length}) →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Patient</th>
                <th className="px-5 py-3.5">Bed</th>
                <th className="px-5 py-3.5">Doctor</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patients.slice(0, 5).map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-4 font-semibold text-slate-900">
                    <div className="flex items-center space-x-3">
                      <div className="h-9 w-9 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                        {(patient?.name || 'P')[0]}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{patient.name}</div>
                        <div className="text-[11px] text-slate-400 font-normal">{patient.patient_id} • {patient.gender}, {patient.age} yrs</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-bold text-teal-700">
                    <span className="inline-flex items-center rounded-lg bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-800 border border-teal-200">
                      {patient.bed_number}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{patient.doctor_name}</td>
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
                      <span>Open</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
