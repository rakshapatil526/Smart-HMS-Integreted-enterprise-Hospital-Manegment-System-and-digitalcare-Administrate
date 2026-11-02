import React, { useState, useEffect } from 'react';
import {
  ReceptionPatientRecord,
  ReceptionDoctorRecord,
  ReceptionAppointmentRecord,
  ReceptionNotificationItem
} from '../../types';
import {
  demoDoctors,
  demoPatients20,
  initialReceptionAppointments,
  initialReceptionNotifications
} from './receptionData';
import { sharedStore } from '../../services/sharedStore';
import { ReceptionDashboardView } from './ReceptionDashboardView';
import { ReceptionPatientSearchView } from './ReceptionPatientSearchView';
import { ReceptionNewPatientView } from './ReceptionNewPatientView';
import { ReceptionAppointmentsView } from './ReceptionAppointmentsView';
import { ReceptionDoctorsView } from './ReceptionDoctorsView';
import { ReceptionOPDQueueView } from './ReceptionOPDQueueView';
import { ReceptionAdmissionsView } from './ReceptionAdmissionsView';
import { ReceptionBillingView } from './ReceptionBillingView';
import { ReceptionEmergencyView } from './ReceptionEmergencyView';
import { ReceptionNotificationsView } from './ReceptionNotificationsView';
import { ReceptionProfileView } from './ReceptionProfileView';
import { AIReceptionSuggestionCard } from '../../components/ai/AIReceptionSuggestionCard';

interface ReceptionPortalProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const ReceptionPortal: React.FC<ReceptionPortalProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const [patients, setPatients] = useState<ReceptionPatientRecord[]>(demoPatients20);
  const [doctors, setDoctors] = useState<ReceptionDoctorRecord[]>(sharedStore.getDoctors());
  const [appointments, setAppointments] = useState<ReceptionAppointmentRecord[]>(sharedStore.getAppointments());
  const [notifications, setNotifications] = useState<ReceptionNotificationItem[]>(sharedStore.getReceptionNotifications());
  const [selectedPatientForModal, setSelectedPatientForModal] = useState<ReceptionPatientRecord | null>(null);

  const refreshData = () => {
    setDoctors(sharedStore.getDoctors());
    setAppointments(sharedStore.getAppointments());
    setNotifications(sharedStore.getReceptionNotifications());
  };

  useEffect(() => {
    refreshData();
    const handleAptAdded = () => refreshData();
    const handleNotifAdded = () => refreshData();
    const handleDoctorAdded = () => refreshData();

    window.addEventListener('smartcare_appointment_added', handleAptAdded);
    window.addEventListener('smartcare_reception_notif_added', handleNotifAdded);
    window.addEventListener('smartcare_doctor_added', handleDoctorAdded);
    return () => {
      window.removeEventListener('smartcare_appointment_added', handleAptAdded);
      window.removeEventListener('smartcare_reception_notif_added', handleNotifAdded);
      window.removeEventListener('smartcare_doctor_added', handleDoctorAdded);
    };
  }, []);

  const handleRegisterPatient = (newPatient: ReceptionPatientRecord) => {
    setPatients((prev) => [newPatient, ...prev]);

    sharedStore.addAppointment({
      patient_name: newPatient.name,
      patient_id: newPatient.patient_id,
      doctor_name: newPatient.assigned_doctor || 'Dr. Narayan Swamy',
      department: newPatient.department || 'Cardiology',
      date: new Date().toISOString().split('T')[0],
      time_slot: '11:30 AM',
      reason: 'New Patient OPD Registration'
    });
  };

  const handleStatusChange = (id: string, newStatus: ReceptionAppointmentRecord['status']) => {
    sharedStore.updateAppointmentStatus(id, newStatus);
  };

  const handleBookForPatient = (patient: ReceptionPatientRecord) => {
    sharedStore.addAppointment({
      patient_name: patient.name,
      patient_id: patient.patient_id,
      doctor_name: patient.assigned_doctor || 'Dr. Narayan Swamy',
      department: patient.department || 'Cardiology',
      date: new Date().toISOString().split('T')[0],
      time_slot: '02:00 PM',
      reason: 'OPD Consultation'
    });
    setActiveTab('appointments');
  };

  const handleCheckInPatient = (patient: ReceptionPatientRecord) => {
    const existing = appointments.find((a) => a.patient_id === patient.patient_id);
    if (existing) {
      handleStatusChange(existing.id, 'Checked-in');
    } else {
      handleBookForPatient(patient);
    }
    setActiveTab('opd-queue');
  };

  const handleBookForDoctor = (doctor: ReceptionDoctorRecord) => {
    const targetPatient = patients[0];
    sharedStore.addAppointment({
      patient_name: targetPatient.name,
      patient_id: targetPatient.patient_id,
      doctor_name: doctor.name,
      department: doctor.department,
      date: new Date().toISOString().split('T')[0],
      time_slot: (doctor?.consultation_hours || '10:00 AM – 01:00 PM').split('–')[0].trim() || '10:00 AM',
      reason: 'OPD Consultation Slot'
    });
    setActiveTab('appointments');
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  switch (activeTab) {
    case 'registration':
      return (
        <ReceptionNewPatientView
          onRegisterPatient={handleRegisterPatient}
          onNavigateTab={setActiveTab}
        />
      );

    case 'search':
    case 'patients':
      return (
        <ReceptionPatientSearchView
          patients={patients}
          onBookAppointment={handleBookForPatient}
          onCheckIn={handleCheckInPatient}
        />
      );

    case 'appointments':
      return (
        <ReceptionAppointmentsView
          appointments={appointments}
          patients={patients}
          doctors={doctors}
          onStatusChange={handleStatusChange}
          onBookNew={() => setActiveTab('search')}
        />
      );

    case 'doctors':
    case 'availability':
      return (
        <ReceptionDoctorsView
          doctors={doctors}
          onBookForDoctor={handleBookForDoctor}
        />
      );

    case 'opd-queue':
    case 'opd':
      return (
        <ReceptionOPDQueueView
          appointments={appointments}
          patients={patients}
          onStatusChange={handleStatusChange}
        />
      );

    case 'admissions':
    case 'beds':
    case 'ipd':
      return (
        <ReceptionAdmissionsView patients={patients} />
      );

    case 'billing':
      return (
        <ReceptionBillingView patients={patients} />
      );

    case 'ambulance':
    case 'emergency':
      return (
        <ReceptionEmergencyView />
      );

    case 'notifications':
      return (
        <ReceptionNotificationsView
          notifications={notifications}
          onMarkAllRead={handleMarkAllRead}
        />
      );

    case 'profile':
      return (
        <ReceptionProfileView />
      );

    case 'ai-assistant':
    case 'ai-cds':
      return (
        <AIReceptionSuggestionCard onNavigateTab={setActiveTab} />
      );

    default:
      return (
        <ReceptionDashboardView
          appointments={appointments}
          patients={patients}
          doctors={doctors}
          onOpenPatient={(p) => {
            setSelectedPatientForModal(p);
            setActiveTab('search');
          }}
          onNavigateTab={setActiveTab}
        />
      );
  }
};
