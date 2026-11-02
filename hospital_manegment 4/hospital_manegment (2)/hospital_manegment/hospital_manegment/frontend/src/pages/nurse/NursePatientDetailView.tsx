import React, { useState } from 'react';
import {
  NursePatient,
  NurseVitalEntry,
  NursingNoteEntry,
  MedicationAdminEntry,
  CarePlanTask,
  DoctorInstructionItem,
  ShiftHandoverNote
} from '../../types';
import { NurseVitalsView } from './NurseVitalsView';
import { NurseNotesView } from './NurseNotesView';
import { NurseMedicationView } from './NurseMedicationView';
import { NurseCarePlanView } from './NurseCarePlanView';
import { NurseDoctorInstructionsView } from './NurseDoctorInstructionsView';
import { NurseIPDView } from './NurseIPDView';
import { NurseHandoverView } from './NurseHandoverView';
import { ArrowLeft, HeartPulse, FileText, Pill, ClipboardList, Stethoscope, Bed, RefreshCw, UserCheck, AlertTriangle } from 'lucide-react';

interface NursePatientDetailViewProps {
  patient: NursePatient;
  initialTab?: string;
  onBack: () => void;
  vitalsHistory: NurseVitalEntry[];
  onSaveVitals: (v: Omit<NurseVitalEntry, 'id'>) => void;
  notesHistory: NursingNoteEntry[];
  onSaveNote: (n: Omit<NursingNoteEntry, 'id'>) => void;
  medications: MedicationAdminEntry[];
  onUpdateMedStatus: (id: string, status: 'Given' | 'Pending' | 'Not Given', reason?: string) => void;
  carePlanTasks: CarePlanTask[];
  onUpdateTaskStatus: (taskId: string, status: 'Completed' | 'Pending' | 'In-Progress') => void;
  instructions: DoctorInstructionItem[];
  onAcknowledgeInstruction: (id: string) => void;
  handovers: ShiftHandoverNote[];
  onSaveHandover: (h: Omit<ShiftHandoverNote, 'id'>) => void;
  allPatients: NursePatient[];
}

export const NursePatientDetailView: React.FC<NursePatientDetailViewProps> = ({
  patient,
  initialTab = 'vitals',
  onBack,
  vitalsHistory,
  onSaveVitals,
  notesHistory,
  onSaveNote,
  medications,
  onUpdateMedStatus,
  carePlanTasks,
  onUpdateTaskStatus,
  instructions,
  onAcknowledgeInstruction,
  handovers,
  onSaveHandover,
  allPatients,
}) => {
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<string>(initialTab);

  const tabs = [
    { id: 'vitals', label: 'VITALS', icon: <HeartPulse className="h-4 w-4" /> },
    { id: 'notes', label: 'NURSING NOTES', icon: <FileText className="h-4 w-4" /> },
    { id: 'medication', label: 'MEDICATION', icon: <Pill className="h-4 w-4" /> },
    { id: 'care-plan', label: 'CARE PLAN', icon: <ClipboardList className="h-4 w-4" /> },
    { id: 'doctor-instructions', label: 'DOCTOR INSTRUCTIONS', icon: <Stethoscope className="h-4 w-4" /> },
    { id: 'handover', label: 'HANDOVER', icon: <RefreshCw className="h-4 w-4" /> },
    { id: 'ipd-info', label: 'IPD / BED DETAILS', icon: <Bed className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 rounded-xl bg-white border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>← Back to Assigned Patients</span>
        </button>

        <span className="text-xs text-slate-400 font-medium">
          Inpatient Care Workspace • <strong className="text-slate-700">{patient.patient_id}</strong>
        </span>
      </div>

      {/* PATIENT SUMMARY CARD (Section 4 requirement) */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-4">
            <div className="h-14 w-14 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-extrabold text-lg shadow-md">
              {(patient?.name || 'P')[0]}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-slate-900">{patient.name}</h1>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    patient.status === 'Critical'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {patient.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                ID: <strong className="text-slate-800">{patient.patient_id}</strong> • Age: {patient.age} yrs • Gender: {patient.gender} • Blood Group: <strong className="text-rose-600">{patient.blood_group}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-400 block font-semibold">Attending Doctor</span>
              <span className="font-extrabold text-slate-900 flex items-center space-x-1 mt-0.5">
                <UserCheck className="h-3.5 w-3.5 text-teal-600" />
                <span>{patient.doctor_name}</span>
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <span className="text-slate-400 block font-semibold">Ward & Bed</span>
              <span className="font-extrabold text-teal-800 flex items-center space-x-1 mt-0.5">
                <Bed className="h-3.5 w-3.5 text-teal-600" />
                <span>{patient.ward_name} ({patient.bed_number})</span>
              </span>
            </div>
          </div>
        </div>

        {/* Patient Allergies Banner */}
        <div className="flex items-center space-x-2 text-xs bg-rose-50/70 border border-rose-200 p-2.5 rounded-xl text-rose-900 font-medium">
          <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
          <span>Known Allergies: <strong className="text-rose-950">{patient.allergies}</strong></span>
        </div>

        {/* WORKSPACE SUB-NAVIGATION TABS */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          {tabs.map((tab) => {
            const isActive = activeWorkspaceTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveWorkspaceTab(tab.id)}
                className={`flex items-center space-x-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>[ {tab.label} ]</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE SUB-TAB CONTENT */}
      <div className="pt-2">
        {activeWorkspaceTab === 'vitals' && (
          <NurseVitalsView
            patient={patient}
            vitalsHistory={vitalsHistory}
            onSaveVitals={onSaveVitals}
          />
        )}

        {activeWorkspaceTab === 'notes' && (
          <NurseNotesView
            patient={patient}
            notesHistory={notesHistory}
            onSaveNote={onSaveNote}
          />
        )}

        {activeWorkspaceTab === 'medication' && (
          <NurseMedicationView
            patient={patient}
            medications={medications}
            onUpdateMedStatus={onUpdateMedStatus}
          />
        )}

        {activeWorkspaceTab === 'care-plan' && (
          <NurseCarePlanView
            patient={patient}
            carePlanTasks={carePlanTasks}
            onUpdateTaskStatus={onUpdateTaskStatus}
          />
        )}

        {activeWorkspaceTab === 'doctor-instructions' && (
          <NurseDoctorInstructionsView
            patient={patient}
            instructions={instructions}
            onAcknowledgeInstruction={onAcknowledgeInstruction}
          />
        )}

        {activeWorkspaceTab === 'handover' && (
          <NurseHandoverView
            patients={allPatients}
            handovers={handovers}
            onSaveHandover={onSaveHandover}
          />
        )}

        {activeWorkspaceTab === 'ipd-info' && <NurseIPDView patient={patient} />}
      </div>
    </div>
  );
};
