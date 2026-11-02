import React, { useState } from 'react';
import { DoctorDashboardView } from './DoctorDashboardView';
import { MyAppointmentsView } from './MyAppointmentsView';
import { MyPatientsView } from './MyPatientsView';
import { OPDDoctorView } from './OPDDoctorView';
import { EHRClinicalTimelineView } from './EHRClinicalTimelineView';
import { PrescriptionDoctorView } from './PrescriptionDoctorView';
import { LabRequestDoctorView } from './LabRequestDoctorView';
import { RadiologyRequestDoctorView } from './RadiologyRequestDoctorView';
import { IPDDoctorView } from './IPDDoctorView';
import { OTDoctorView } from './OTDoctorView';
import { AIClinicalAssistView } from './AIClinicalAssistView';
import { DoctorNotificationsView } from './DoctorNotificationsView';
import { RapidoPatientEmergencyFlow } from '../../components/emergency/RapidoPatientEmergencyFlow';
import { MobileNotificationToast, MobileNotificationPayload } from '../../components/common/MobileNotificationToast';

interface DoctorPortalProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const DoctorPortal: React.FC<DoctorPortalProps> = ({ activeTab, setActiveTab }) => {
  const [extraData, setExtraData] = useState<any>(null);
  const [mobileNotifications, setMobileNotifications] = useState<MobileNotificationPayload[]>([]);

  const handleNavigate = (tab: string, data?: any) => {
    if (data) setExtraData(data);
    setActiveTab(tab);
  };

  const handleTriggerNotification = (payload: MobileNotificationPayload) => {
    setMobileNotifications((prev) => [payload, ...prev]);
    // Auto remove toast after 7 seconds
    setTimeout(() => {
      setMobileNotifications((prev) => prev.filter((item) => item.id !== payload.id));
    }, 7000);
  };

  const handleDismissNotification = (id: string) => {
    setMobileNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DoctorDashboardView onNavigate={handleNavigate} />;
      case 'ambulance':
        return (
          <RapidoPatientEmergencyFlow
            initialScreen="BUTTON"
            onBackToDashboard={() => setActiveTab('dashboard')}
          />
        );
      case 'appointments':
        return <MyAppointmentsView onNavigate={handleNavigate} />;
      case 'patients':
        return <MyPatientsView onNavigate={handleNavigate} />;
      case 'opd':
        return (
          <OPDDoctorView
            onNavigate={handleNavigate}
            onTriggerNotification={handleTriggerNotification}
            initialPatientName={extraData?.patientName}
          />
        );
      case 'ipd':
        return (
          <IPDDoctorView
            onNavigate={handleNavigate}
            onTriggerNotification={handleTriggerNotification}
            initialPatientName={extraData?.patientName}
          />
        );
      case 'ehr':
        return <EHRClinicalTimelineView onNavigate={handleNavigate} initialPatientId={extraData?.patientId} />;
      case 'prescriptions':
        return (
          <PrescriptionDoctorView
            onNavigate={handleNavigate}
            onTriggerNotification={handleTriggerNotification}
            initialPatientName={extraData?.patientName}
          />
        );
      case 'lab-requests':
        return (
          <LabRequestDoctorView
            onNavigate={handleNavigate}
            onTriggerNotification={handleTriggerNotification}
            initialPatientName={extraData?.patientName}
          />
        );
      case 'radiology':
        return (
          <RadiologyRequestDoctorView
            onNavigate={handleNavigate}
            onTriggerNotification={handleTriggerNotification}
            initialPatientName={extraData?.patientName}
          />
        );
      case 'ot':
        return (
          <OTDoctorView
            onNavigate={handleNavigate}
            onTriggerNotification={handleTriggerNotification}
            initialPatientName={extraData?.patientName}
          />
        );
      case 'ai-assistant':
        return <AIClinicalAssistView onNavigate={handleNavigate} initialSymptoms={extraData?.symptoms} />;
      case 'notifications':
        return <DoctorNotificationsView onNavigate={handleNavigate} />;
      default:
        return <DoctorDashboardView onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="relative">
      {renderTabContent()}

      {/* Real-time SMS & Email Mobile Notification Toast Container */}
      <MobileNotificationToast
        notifications={mobileNotifications}
        onDismiss={handleDismissNotification}
      />
    </div>
  );
};
