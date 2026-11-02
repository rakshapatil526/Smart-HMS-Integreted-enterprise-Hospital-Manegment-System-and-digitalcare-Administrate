import React, { useState, useEffect } from 'react';
import { sharedStore } from '../../services/sharedStore';
import {
  NursePatient,
  NurseVitalEntry,
  NursingNoteEntry,
  MedicationAdminEntry,
  CarePlanTask,
  DoctorInstructionItem,
  ShiftHandoverNote,
  NurseNotificationItem
} from '../../types';
import {
  initialNursePatients,
  initialNurseVitals,
  initialNursingNotes,
  initialMedicationAdmin,
  initialCarePlans,
  initialDoctorInstructions,
  initialShiftHandovers,
  initialNurseNotifications,
  initialNurseProfile
} from './nurseData';
import { NurseDashboardView } from './NurseDashboardView';
import { NursePatientsView } from './NursePatientsView';
import { NursePatientDetailView } from './NursePatientDetailView';
import { NurseVitalsView } from './NurseVitalsView';
import { NurseNotesView } from './NurseNotesView';
import { NurseMedicationView } from './NurseMedicationView';
import { NurseCarePlanView } from './NurseCarePlanView';
import { NurseDoctorInstructionsView } from './NurseDoctorInstructionsView';
import { NurseIPDView } from './NurseIPDView';
import { NurseHandoverView } from './NurseHandoverView';
import { NurseNotificationsView } from './NurseNotificationsView';
import { NurseProfileView } from './NurseProfileView';
import { AINurseCareSuggestionCard } from '../../components/ai/AINurseCareSuggestionCard';

interface NursePortalProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const NursePortal: React.FC<NursePortalProps> = ({ activeTab, setActiveTab }) => {
  const [patients, setPatients] = useState<NursePatient[]>(initialNursePatients);
  const [vitals, setVitals] = useState<NurseVitalEntry[]>(initialNurseVitals);
  const [notes, setNotes] = useState<NursingNoteEntry[]>(initialNursingNotes);
  const [medications, setMedications] = useState<MedicationAdminEntry[]>(initialMedicationAdmin);
  const [carePlans, setCarePlans] = useState<CarePlanTask[]>(initialCarePlans);
  const [instructions, setInstructions] = useState<DoctorInstructionItem[]>(initialDoctorInstructions);
  const [handovers, setHandovers] = useState<ShiftHandoverNote[]>(initialShiftHandovers);
  const [notifications, setNotifications] = useState<NurseNotificationItem[]>(sharedStore.getNurseNotifications());
  const [profile, setProfile] = useState(initialNurseProfile);

  useEffect(() => {
    const handleNurseNotifs = () => {
      setNotifications(sharedStore.getNurseNotifications());
    };
    handleNurseNotifs();
    window.addEventListener('smartcare_nurse_notif_added', handleNurseNotifs);
    return () => window.removeEventListener('smartcare_nurse_notif_added', handleNurseNotifs);
  }, []);

  // Patient detail workspace context
  const [selectedPatient, setSelectedPatient] = useState<NursePatient | null>(null);
  const [patientDetailTab, setPatientDetailTab] = useState<string>('vitals');

  const handleOpenPatient = (patient: NursePatient, tab: string = 'vitals') => {
    setSelectedPatient(patient);
    setPatientDetailTab(tab);
  };

  const handleBackToList = () => {
    setSelectedPatient(null);
  };

  // State Mutators
  const handleSaveVitals = (newVital: Omit<NurseVitalEntry, 'id'>) => {
    const created: NurseVitalEntry = {
      ...newVital,
      id: `vtl-${Date.now()}`,
    };
    setVitals((prev) => [created, ...prev]);

    // Clear pending vitals flag for patient
    setPatients((prev) =>
      prev.map((p) => (p.id === newVital.patient_id ? { ...p, vitals_pending: false } : p))
    );

    // Notify doctor in shared store
    sharedStore.sendNurseUpdateToDoctor({
      nurseName: profile.name || 'Nurse Sarah',
      doctorName: 'Dr. Narayan Swamy',
      patientName: newVital.patient_name || 'Patient',
      bedNumber: newVital.bed_number || 'B101',
      vitalsSummary: `BP: ${newVital.bp_systolic}/${newVital.bp_diastolic}, Pulse: ${newVital.pulse} bpm, Temp: ${newVital.temperature} °F, SpO2: ${newVital.spo2}%`
    });
  };

  const handleSaveNote = (newNote: Omit<NursingNoteEntry, 'id'>) => {
    const created: NursingNoteEntry = {
      ...newNote,
      id: `note-${Date.now()}`,
    };
    setNotes((prev) => [created, ...prev]);

    // Notify doctor in shared store
    sharedStore.sendNurseUpdateToDoctor({
      nurseName: profile.name || 'Nurse Sarah',
      doctorName: 'Dr. Narayan Swamy',
      patientName: newNote.patient_name || 'Patient',
      bedNumber: newNote.bed_number || 'B101',
      vitalsSummary: `Nursing Note logged: ${newNote.observation}`
    });
  };

  const handleUpdateMedStatus = (
    id: string,
    status: 'Given' | 'Pending' | 'Not Given',
    reason?: string
  ) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMedications((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              status,
              administered_at: status === 'Given' ? timeStr : m.administered_at,
              administered_by: status === 'Given' ? 'Nurse Sarah Jenkins' : m.administered_by,
              reason_not_given: reason || m.reason_not_given,
            }
          : m
      )
    );
  };

  const handleUpdateTaskStatus = (
    taskId: string,
    status: 'Completed' | 'Pending' | 'In-Progress'
  ) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setCarePlans((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status, updated_at: timeStr, updated_by: 'Nurse Sarah Jenkins' }
          : t
      )
    );
  };

  const handleAcknowledgeInstruction = (id: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setInstructions((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              status: 'Acknowledged',
              acknowledged_at: timeStr,
              acknowledged_by: 'Nurse Sarah Jenkins',
            }
          : i
      )
    );
  };

  const handleSaveHandover = (newHandover: Omit<ShiftHandoverNote, 'id'>) => {
    const created: ShiftHandoverNote = {
      ...newHandover,
      id: `hnd-${Date.now()}`,
    };
    setHandovers((prev) => [created, ...prev]);
  };

  const handleNotificationSelect = (notif: NurseNotificationItem) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );

    if (notif.patient_id) {
      const targetPat = patients.find((p) => p.id === notif.patient_id);
      if (targetPat) {
        handleOpenPatient(targetPat, notif.target_tab || 'vitals');
        return;
      }
    }
    if (notif.target_tab) {
      setActiveTab(notif.target_tab);
    }
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // If a patient workspace is actively selected, render Patient Detail Workspace
  if (selectedPatient) {
    return (
      <NursePatientDetailView
        patient={selectedPatient}
        initialTab={patientDetailTab}
        onBack={handleBackToList}
        vitalsHistory={vitals}
        onSaveVitals={handleSaveVitals}
        notesHistory={notes}
        onSaveNote={handleSaveNote}
        medications={medications}
        onUpdateMedStatus={handleUpdateMedStatus}
        carePlanTasks={carePlans}
        onUpdateTaskStatus={handleUpdateTaskStatus}
        instructions={instructions}
        onAcknowledgeInstruction={handleAcknowledgeInstruction}
        handovers={handovers}
        onSaveHandover={handleSaveHandover}
        allPatients={patients}
      />
    );
  }

  // Render view corresponding to active sidebar tab
  const defaultPatient = patients[0];

  switch (activeTab) {
    case 'dashboard':
      return (
        <NurseDashboardView
          patients={patients}
          vitals={vitals}
          medications={medications}
          onOpenPatient={handleOpenPatient}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />
      );

    case 'patients':
      return (
        <NursePatientsView
          patients={patients}
          onOpenPatient={handleOpenPatient}
        />
      );

    case 'ipd':
      return (
        <NurseIPDView patient={defaultPatient} />
      );

    case 'vitals':
      return (
        <NurseVitalsView
          patient={defaultPatient}
          vitalsHistory={vitals}
          onSaveVitals={handleSaveVitals}
        />
      );

    case 'notes':
      return (
        <NurseNotesView
          patient={defaultPatient}
          notesHistory={notes}
          onSaveNote={handleSaveNote}
        />
      );

    case 'medications':
      return (
        <NurseMedicationView
          patient={defaultPatient}
          medications={medications}
          onUpdateMedStatus={handleUpdateMedStatus}
        />
      );

    case 'care-plans':
      return (
        <NurseCarePlanView
          patient={defaultPatient}
          carePlanTasks={carePlans}
          onUpdateTaskStatus={handleUpdateTaskStatus}
        />
      );

    case 'handover':
      return (
        <NurseHandoverView
          patients={patients}
          handovers={handovers}
          onSaveHandover={handleSaveHandover}
        />
      );

    case 'notifications':
      return (
        <NurseNotificationsView
          notifications={notifications}
          patients={patients}
          onSelectNotification={handleNotificationSelect}
          onMarkAllRead={handleMarkAllRead}
        />
      );

    case 'profile':
      return (
        <NurseProfileView
          profile={profile}
          onUpdateProfile={(updated) => setProfile(updated)}
        />
      );

    case 'ai-assistant':
      return (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">AI NURSING CARE ASSISTANT & CDS</h1>
              <p className="text-xs text-slate-500">Real-time clinical decision support, vital trend analysis, and care suggestions</p>
            </div>
          </div>
          <AINurseCareSuggestionCard
            patientName={defaultPatient?.name}
            bedNumber={defaultPatient?.bed_number}
          />
        </div>
      );


    default:
      return (
        <NurseDashboardView
          patients={patients}
          vitals={vitals}
          medications={medications}
          onOpenPatient={handleOpenPatient}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />
      );
  }
};
