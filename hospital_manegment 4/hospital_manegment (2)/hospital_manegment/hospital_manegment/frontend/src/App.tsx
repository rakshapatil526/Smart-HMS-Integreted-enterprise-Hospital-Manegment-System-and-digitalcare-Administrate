import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { WelcomePage } from './pages/WelcomePage';
import { Login } from './pages/Login';
import { RegisterPatientView } from './pages/RegisterPatientView';
import { RoleDashboardContainer } from './pages/Dashboards/RoleDashboardContainer';
import AdminDashboard from './pages/admin/AdminDashboard';
import { PatientPortal } from './pages/patient/PatientPortal';
import { DoctorPortal } from './pages/doctor/DoctorPortal';
import { NursePortal } from './pages/nurse/NursePortal';
import { LabPortal } from './pages/lab/LabPortal';
import { ReceptionPortal } from './pages/reception/ReceptionPortal';

// Module Views
import { PatientManagement } from './pages/modules/PatientManagement';
import { AppointmentBooking } from './pages/modules/AppointmentBooking';
import { OPDManagement } from './pages/modules/OPDManagement';
import { IPDManagement } from './pages/modules/IPDManagement';
import { LISModule } from './pages/modules/LISModule';
import { RISModule } from './pages/modules/RISModule';
import { PharmacyModule } from './pages/modules/PharmacyModule';
import { BillingModule } from './pages/modules/BillingModule';
import { EHRTimeline } from './pages/modules/EHRTimeline';
import { EmergencyModule } from './pages/modules/EmergencyModule';
import { RapidoPatientEmergencyFlow } from './components/emergency/RapidoPatientEmergencyFlow';
import { AmbulanceDriverDashboard } from './components/emergency/AmbulanceDriverDashboard';
import { AmbulanceOperatorDashboard } from './components/emergency/AmbulanceOperatorDashboard';
import { AIClinicalSuggestionCard } from './components/ai/AIClinicalSuggestionCard';
import { BillingOperatorReportView } from './pages/modules/BillingOperatorReportView';
import { BloodBankModule } from './pages/modules/BloodBankModule';

// AI Modals
import { AIChatbotModal } from './components/ai/AIChatbotModal';

const MainLayout: React.FC = () => {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Trigger modal if AI Chatbot is clicked
  const handleTabChange = (tab: string) => {
    if (tab === 'ai-chatbot') {
      setIsChatOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  const renderModuleView = () => {
    // Dedicated Ambulance Portals
    if (role === 'Ambulance Operator') {
      return <AmbulanceOperatorDashboard activeTab={activeTab} setActiveTab={handleTabChange} />;
    }

    if (role === 'Ambulance Driver') {
      return <AmbulanceDriverDashboard />;
    }


    // Strict Patient Module Scope: Patient role gets dedicated Patient Experience
    if (role === 'Patient') {
      return <PatientPortal activeTab={activeTab} setActiveTab={handleTabChange} />;
    }

    // Strict Doctor Module Scope: Doctor role gets dedicated Doctor Experience
    if (role === 'Doctor') {
      return <DoctorPortal activeTab={activeTab} setActiveTab={handleTabChange} />;
    }

    // Strict Nurse Module Scope: Nurse role gets dedicated Nurse Experience
    if (role === 'Nurse') {
      return <NursePortal activeTab={activeTab} setActiveTab={handleTabChange} />;
    }

    // Strict Laboratory Technician Scope: Laboratory Technician role gets dedicated Lab Experience
    if (role === 'Laboratory Technician') {
      return <LabPortal activeTab={activeTab} setActiveTab={handleTabChange} />;
    }

    // Strict Reception Scope: Reception role gets dedicated Receptionist Portal
    if (role === 'Reception' || (role as string) === 'Receptionist') {
      return <ReceptionPortal activeTab={activeTab} setActiveTab={handleTabChange} />;
    }

    // Strict Pharmacist Scope: Pharmacist role gets dedicated Pharmacy Portal
    if (role === 'Pharmacist' || (role as string) === 'Pharmacy') {
      return <PharmacyModule initialTab={activeTab === 'ai-cds' || activeTab === 'ai-assistant' ? 'ai-assistant' : activeTab} />;
    }

    // Staff & Admin Roles
    switch (activeTab) {
      case 'dashboard':
        return <RoleDashboardContainer onNavigate={handleTabChange} />;
      case 'create-staff':
      case 'admin':
        return <AdminDashboard />;   
      case 'patients':
        return <PatientManagement />;
      case 'appointments':
        return <AppointmentBooking />;
      case 'opd':
        return <OPDManagement />;
      case 'ipd':
        return <IPDManagement />;
      case 'nursing':
        return (
          <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm space-y-4 font-['Inter',sans-serif]">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900">👩‍⚕️ Nursing & Inpatient Care Desk</h1>
                <p className="text-xs text-slate-500">Live ward patient vitals, medication administration records (MAR), and shift handover</p>
              </div>
              <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700 border border-teal-200">Active Duty</span>
            </div>
            <NursePortal activeTab="vitals" setActiveTab={() => {}} />
          </div>
        );
      case 'lis':
        return <LISModule />;
      case 'ris':
        return <RISModule />;
      case 'pharmacy':
        return <PharmacyModule />;
      case 'ot':
        return (
          <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm space-y-4 font-['Inter',sans-serif]">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900">✂️ Operation Theatre (OT) Management</h1>
                <p className="text-xs text-slate-500">Surgical suite scheduling, anesthesia consent verification, and intraoperative logging</p>
              </div>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 border border-rose-200">4 Suites Active</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 font-bold">OT 1: Coronary Bypass (In Surgery)</div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 font-bold">OT 2: Knee Replacement (Pre-op)</div>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-bold">OT 3: Laparoscopic Surgery (Scheduled)</div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-bold">OT 4: Sterilization Cleaned</div>
            </div>
          </div>
        );
      case 'billing':
        return <BillingModule />;
      case 'insurance':
        return (
          <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm space-y-4 font-['Inter',sans-serif]">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900">🛡️ Insurance & TPA Claim Desk</h1>
                <p className="text-xs text-slate-500">Cashless pre-authorization, claim settlement, and policyholder coverage verification</p>
              </div>
              <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700 border border-cyan-200 font-mono">TPA Portal Live</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-800">Pre-Auth Approvals: 12 Active</div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-800">Claims Settled Today: ₹4,85,000</div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-800">Pending TPA Review: 3 Files</div>
            </div>
          </div>
        );
      case 'inventory':
        return (
          <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm space-y-4 font-['Inter',sans-serif]">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900">📦 Hospital Inventory & Supply Chain</h1>
                <p className="text-xs text-slate-500">Medical supplies stock, reorder levels, purchase orders, and asset tracking</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">Stock Optimal</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-800">Total Items Cataloged: 1,450 SKU</div>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 font-bold text-amber-900">Low Stock Alerts: 4 Items</div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-800">Purchase Orders: 2 In Transit</div>
            </div>
          </div>
        );
      case 'ehr':
        return <EHRTimeline />;
      case 'bloodbank':
        return <BloodBankModule />;
      case 'ambulance':
        return <RapidoPatientEmergencyFlow />;
      case 'hr':
        return <AdminDashboard />;
      case 'ai-cds':
        if ((role as string) === 'Ambulance Operator' || (role as string) === 'Ambulance Driver') {
          return <AmbulanceOperatorDashboard activeTab="ai-assistant" setActiveTab={handleTabChange} />;
        }
        if ((role as string) === 'Reception' || (role as string) === 'Receptionist') {
          return <ReceptionPortal activeTab="ai-assistant" setActiveTab={handleTabChange} />;
        }
        if ((role as string) === 'Pharmacist' || (role as string) === 'Pharmacy') {
          return <PharmacyModule initialTab="ai-assistant" />;
        }
        if ((role as string) === 'Laboratory Technician') {
          return <LabPortal activeTab="ai-assistant" setActiveTab={handleTabChange} />;
        }
        if ((role as string) === 'Nurse') {
          return <NursePortal activeTab="ai-assistant" setActiveTab={handleTabChange} />;
        }
        if (role === 'Radiologist') {
          return <RISModule />;
        }
        return (
          <div className="space-y-6">
            <h1 className="text-xl font-bold text-slate-900">AI Clinical Decision Support Engine</h1>
            <AIClinicalSuggestionCard symptoms="Chest discomfort, radiating pain to left arm" history="Hypertension (2023), High Cholesterol" allergies="Penicillin" />
          </div>
        );
      case 'reports':
        return <BillingOperatorReportView />;
      default:
        return (
          <div className="rounded-2xl bg-white p-8 text-center border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800">Module: {activeTab.toUpperCase()}</h2>
            <p className="text-xs text-slate-500 mt-1">This module is connected to the backend database API.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter',sans-serif]">
      <Header
        onOpenChat={() => setIsChatOpen(true)}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {renderModuleView()}
        </main>
      </div>

      <AIChatbotModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [screenState, setScreenState] = useState<'welcome' | 'login' | 'register'>('welcome');

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white text-xs font-semibold">
        Initializing Smart Care Enterprise HMIS...
      </div>
    );
  }

  // If user is not authenticated, manage screen flow (Welcome -> Login / Register)
  if (!user) {
    if (screenState === 'login') {
      return (
        <Login
          onLoginSuccess={() => {}}
          onGoToRegister={() => setScreenState('register')}
        />
      );
    }

    if (screenState === 'register') {
      return (
        <RegisterPatientView
          onGoToLogin={() => setScreenState('login')}
          onRegisterSuccess={() => {}}
        />
      );
    }

    // Default first screen: Welcome Page
    return (
      <WelcomePage
        onGoToLogin={() => setScreenState('login')}
        onGoToRegister={() => setScreenState('register')}
      />
    );
  }

  // Authenticated User -> Render Assigned Role Dashboard & Modules Layout
  return <MainLayout />;
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
