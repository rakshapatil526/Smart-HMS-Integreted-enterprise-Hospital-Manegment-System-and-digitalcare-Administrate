import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, User, Calendar, HeartPulse, Pill, FlaskConical,
  Image, FileText, Video, Truck, Sparkles, Mic, Bell, Settings,
  LogOut, Users, Stethoscope, Bed, ClipboardList, Scissors,
  ShieldCheck, Boxes, Droplet, UserCheck, BarChart3, RefreshCw,
  UserPlus, Search, Receipt, CreditCard, AlertTriangle, Building2
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles: string[];
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { role, logout } = useAuth();

  const patientNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" />, roles: ['Patient'] },
    { id: 'profile', label: 'My Profile', icon: <User className="h-4 w-4" />, roles: ['Patient'] },
    { id: 'appointments', label: 'Appointments', icon: <Calendar className="h-4 w-4" />, roles: ['Patient'] },
    { id: 'ehr', label: 'My EHR', icon: <HeartPulse className="h-4 w-4" />, roles: ['Patient'] },
    { id: 'prescriptions', label: 'Prescriptions', icon: <Pill className="h-4 w-4" />, roles: ['Patient'] },
    { id: 'lab-reports', label: 'Lab Reports', icon: <FlaskConical className="h-4 w-4" />, roles: ['Patient'] },
    { id: 'radiology-reports', label: 'Radiology Reports', icon: <Image className="h-4 w-4" />, roles: ['Patient'] },
    { id: 'bills', label: 'Bills & Payments', icon: <FileText className="h-4 w-4" />, roles: ['Patient'] },
    { id: 'ambulance', label: 'Emergency Ambulance 🚨', icon: <Truck className="h-4 w-4 text-red-500" />, roles: ['Patient'] },
    { id: 'ai-suggestions', label: 'Health Suggestions 💡', icon: <Sparkles className="h-4 w-4 text-amber-500" />, roles: ['Patient'] },
    { id: 'ai-chatbot', label: 'AI Assistant 🤖', icon: <Sparkles className="h-4 w-4 text-teal-600" />, roles: ['Patient'] },
    { id: 'notifications', label: 'Notifications 🔔', icon: <Bell className="h-4 w-4" />, roles: ['Patient'] },
    { id: 'settings', label: 'Settings ⚙️', icon: <Settings className="h-4 w-4" />, roles: ['Patient'] },
  ];

  const nurseNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" />, roles: ['Nurse'] },
    { id: 'patients', label: 'My Patients', icon: <Users className="h-4 w-4" />, roles: ['Nurse'] },
    { id: 'ipd', label: 'IPD Patients', icon: <Bed className="h-4 w-4" />, roles: ['Nurse'] },
    { id: 'vitals', label: 'Vital Signs', icon: <HeartPulse className="h-4 w-4" />, roles: ['Nurse'] },
    { id: 'notes', label: 'Nursing Notes', icon: <FileText className="h-4 w-4" />, roles: ['Nurse'] },
    { id: 'medications', label: 'Medication Administration', icon: <Pill className="h-4 w-4" />, roles: ['Nurse'] },
    { id: 'care-plans', label: 'Care Plans', icon: <ClipboardList className="h-4 w-4" />, roles: ['Nurse'] },
    { id: 'handover', label: 'Shift Handover', icon: <RefreshCw className="h-4 w-4" />, roles: ['Nurse'] },
    { id: 'ai-assistant', label: 'AI Care Assistant 🤖', icon: <Sparkles className="h-4 w-4 text-amber-500" />, roles: ['Nurse'] },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" />, roles: ['Nurse'] },
    { id: 'profile', label: 'My Profile', icon: <User className="h-4 w-4" />, roles: ['Nurse'] },
  ];

  const labNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" />, roles: ['Laboratory Technician'] },
    { id: 'requests', label: 'Test Requests', icon: <ClipboardList className="h-4 w-4" />, roles: ['Laboratory Technician'] },
    { id: 'collection', label: 'Sample Collection', icon: <FlaskConical className="h-4 w-4" />, roles: ['Laboratory Technician'] },
    { id: 'processing', label: 'Processing', icon: <Settings className="h-4 w-4" />, roles: ['Laboratory Technician'] },
    { id: 'results', label: 'Results', icon: <BarChart3 className="h-4 w-4" />, roles: ['Laboratory Technician'] },
    { id: 'reports', label: 'Reports', icon: <FileText className="h-4 w-4" />, roles: ['Laboratory Technician'] },
    { id: 'ai-assistant', label: 'AI Lab Assistant 🤖', icon: <Sparkles className="h-4 w-4 text-amber-500" />, roles: ['Laboratory Technician'] },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" />, roles: ['Laboratory Technician'] },
    { id: 'profile', label: 'My Profile', icon: <User className="h-4 w-4" />, roles: ['Laboratory Technician'] },
  ];


  const staffNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" />, roles: ['ALL'] },
    { id: 'patients', label: 'Patient Management', icon: <Users className="h-4 w-4" />, roles: ['Reception', 'Doctor', 'Admin'] },
    { id: 'appointments', label: 'Appointments', icon: <Calendar className="h-4 w-4" />, roles: ['Reception', 'Doctor', 'Admin'] },
    { id: 'opd', label: 'OPD Consultation', icon: <Stethoscope className="h-4 w-4" />, roles: ['Doctor', 'Reception', 'Admin'] },
    { id: 'ipd', label: 'IPD Admissions & Beds', icon: <Bed className="h-4 w-4" />, roles: ['Doctor', 'Reception', 'Admin'] },
    { id: 'nursing', label: 'Nursing & Care', icon: <ClipboardList className="h-4 w-4" />, roles: ['Doctor', 'Admin'] },
    { id: 'lis', label: 'Lab Info System (LIS)', icon: <FlaskConical className="h-4 w-4" />, roles: ['Laboratory Technician', 'Doctor', 'Admin'] },
    { id: 'ris', label: 'Radiology (RIS)', icon: <Image className="h-4 w-4" />, roles: ['Radiologist', 'Doctor', 'Admin'] },
    { id: 'pharmacy', label: 'Pharmacy & Stock', icon: <Pill className="h-4 w-4" />, roles: ['Pharmacist', 'Doctor', 'Admin'] },
    { id: 'ot', label: 'Operation Theatre', icon: <Scissors className="h-4 w-4" />, roles: ['OT Staff', 'Doctor', 'Admin'] },
    { id: 'billing', label: 'Billing & Invoices', icon: <FileText className="h-4 w-4" />, roles: ['Billing Staff', 'Reception', 'Admin'] },
    { id: 'insurance', label: 'Insurance / TPA', icon: <ShieldCheck className="h-4 w-4" />, roles: ['Insurance Staff', 'Billing Staff', 'Admin'] },
    { id: 'inventory', label: 'Inventory & Stock', icon: <Boxes className="h-4 w-4" />, roles: ['Inventory Manager', 'Pharmacist', 'Admin'] },
    { id: 'ehr', label: 'Central EHR Timeline', icon: <HeartPulse className="h-4 w-4" />, roles: ['Doctor', 'Admin'] },
    { id: 'bloodbank', label: 'Blood Bank', icon: <Droplet className="h-4 w-4" />, roles: ['Blood Bank Staff', 'Doctor', 'Admin'] },
    { id: 'ambulance', label: 'Ambulance Fleet', icon: <Truck className="h-4 w-4" />, roles: ['Ambulance Operator', 'Ambulance Driver', 'Reception', 'Admin'] },
    { id: 'hr', label: 'HR & Payroll', icon: <UserCheck className="h-4 w-4" />, roles: ['HR Staff', 'Admin'] },
    { id: 'ai-cds', label: 'AI Clinical Suggestions', icon: <Sparkles className="h-4 w-4 text-amber-500" />, roles: ['Doctor', 'Admin'] },
    { id: 'reports', label: 'Reports & Analytics', icon: <BarChart3 className="h-4 w-4" />, roles: ['Admin', 'HR Staff', 'Billing Staff'] },
  ];

  const doctorNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" />, roles: ['Doctor'] },
    { id: 'ambulance', label: 'Emergency Ambulance 🚨', icon: <Truck className="h-4 w-4 text-red-500" />, roles: ['Doctor'] },
    { id: 'appointments', label: 'My Appointments', icon: <Calendar className="h-4 w-4" />, roles: ['Doctor'] },
    { id: 'patients', label: 'My Patients', icon: <Users className="h-4 w-4" />, roles: ['Doctor'] },
    { id: 'opd', label: 'OPD', icon: <Stethoscope className="h-4 w-4" />, roles: ['Doctor'] },
    { id: 'ipd', label: 'IPD', icon: <Bed className="h-4 w-4" />, roles: ['Doctor'] },
    { id: 'ehr', label: 'EHR', icon: <HeartPulse className="h-4 w-4" />, roles: ['Doctor'] },
    { id: 'prescriptions', label: 'Prescriptions', icon: <Pill className="h-4 w-4" />, roles: ['Doctor'] },
    { id: 'lab-requests', label: 'Lab Requests', icon: <FlaskConical className="h-4 w-4" />, roles: ['Doctor'] },
    { id: 'radiology', label: 'Radiology', icon: <Image className="h-4 w-4" />, roles: ['Doctor'] },
    { id: 'ot', label: 'OT', icon: <Scissors className="h-4 w-4" />, roles: ['Doctor'] },
    { id: 'ai-assistant', label: 'AI Clinical Assistant', icon: <Sparkles className="h-4 w-4 text-amber-500" />, roles: ['Doctor'] },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" />, roles: ['Doctor'] },
  ];

  const receptionNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard 🏠', icon: <LayoutDashboard className="h-4 w-4" />, roles: ['Reception'] },
    { id: 'ambulance', label: 'Emergency Ambulance 🚨', icon: <Truck className="h-4 w-4 text-red-500" />, roles: ['Reception'] },
    { id: 'registration', label: 'Patient Registration 👤', icon: <UserPlus className="h-4 w-4" />, roles: ['Reception'] },
    { id: 'search', label: 'Patient Search 🔎', icon: <Search className="h-4 w-4" />, roles: ['Reception'] },
    { id: 'appointments', label: 'Appointments 📅', icon: <Calendar className="h-4 w-4" />, roles: ['Reception'] },
    { id: 'opd-queue', label: 'OPD Queue 🧾', icon: <ClipboardList className="h-4 w-4" />, roles: ['Reception'] },
    { id: 'doctors', label: 'Doctors & Availability 👨‍⚕️', icon: <Stethoscope className="h-4 w-4" />, roles: ['Reception'] },
    { id: 'admissions', label: 'Admissions 🏥', icon: <Building2 className="h-4 w-4" />, roles: ['Reception'] },
    { id: 'beds', label: 'Bed Availability 🛏️', icon: <Bed className="h-4 w-4" />, roles: ['Reception'] },
    { id: 'billing', label: 'Basic Billing 💳', icon: <Receipt className="h-4 w-4" />, roles: ['Reception'] },
    { id: 'emergency', label: 'Emergency Alerts 🚨', icon: <AlertTriangle className="h-4 w-4 text-red-500" />, roles: ['Reception'] },
    { id: 'ai-assistant', label: 'AI Reception Assist 🤖', icon: <Sparkles className="h-4 w-4 text-amber-500" />, roles: ['Reception'] },
    { id: 'notifications', label: 'Notifications 🔔', icon: <Bell className="h-4 w-4" />, roles: ['Reception'] },
    { id: 'profile', label: 'My Profile 👤', icon: <User className="h-4 w-4" />, roles: ['Reception'] },
  ];

  const pharmacistNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard 🏠', icon: <LayoutDashboard className="h-4 w-4" />, roles: ['Pharmacist'] },
    { id: 'pharmacy', label: 'Pharmacy & Stock 💊', icon: <Pill className="h-4 w-4" />, roles: ['Pharmacist'] },
    { id: 'prescriptions', label: 'Prescriptions Queue 📋', icon: <ClipboardList className="h-4 w-4" />, roles: ['Pharmacist'] },
    { id: 'inventory', label: 'Medicine Inventory 📦', icon: <Boxes className="h-4 w-4" />, roles: ['Pharmacist'] },
    { id: 'ai-assistant', label: 'AI Pharmacy Assist 🤖', icon: <Sparkles className="h-4 w-4 text-amber-500" />, roles: ['Pharmacist'] },
    { id: 'notifications', label: 'Notifications 🔔', icon: <Bell className="h-4 w-4" />, roles: ['Pharmacist'] },
    { id: 'profile', label: 'My Profile 👤', icon: <User className="h-4 w-4" />, roles: ['Pharmacist'] },
  ];

  const isPatient = role === 'Patient';
  const isDoctor = role === 'Doctor';
  const isNurse = role === 'Nurse';
  const isLabTech = role === 'Laboratory Technician';
  const isPharmacist = role === 'Pharmacist' || (role as string) === 'Pharmacy';
  const isReception = (role as string) === 'Reception' || (role as string) === 'Receptionist';

  const navList = isPatient
    ? patientNavItems
    : isDoctor
    ? doctorNavItems
    : isNurse
    ? nurseNavItems
    : isLabTech
    ? labNavItems
    : isPharmacist
    ? pharmacistNavItems
    : isReception
    ? receptionNavItems
    : staffNavItems.filter(item => item.roles.includes('ALL') || item.roles.includes(role) || role === 'Admin');

  return (
    <aside className="flex w-64 flex-col justify-between border-r border-slate-200 bg-white p-4 h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">
      <div>
        <div className="mb-3 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {isPatient
            ? '👤 Patient Menu'
            : isDoctor
            ? '👨‍⚕️ DOCTOR MODULE'
            : isNurse
            ? '👩‍⚕️ NURSE MODULE'
            : isLabTech
            ? '🧪 LABORATORY'
            : isPharmacist
            ? '💊 PHARMACY MODULE'
            : isReception
            ? '🏥 RECEPTION DESK'
            : `Staff Navigation (${role})`}
        </div>

        <nav className="space-y-1">
          {navList.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center space-x-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-sm shadow-teal-500/20 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout button at bottom of sidebar */}
      <div className="pt-4 border-t border-slate-100 mt-4">
        <button
          onClick={logout}
          className="flex w-full items-center space-x-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};


