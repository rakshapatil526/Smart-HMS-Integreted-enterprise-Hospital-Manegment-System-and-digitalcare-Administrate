import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { AmbulanceDriverDashboard } from '../../components/emergency/AmbulanceDriverDashboard';
import { AmbulanceOperatorDashboard } from '../../components/emergency/AmbulanceOperatorDashboard';
import { HospitalEmergencyAlertBanner } from '../../components/emergency/HospitalEmergencyAlertBanner';
import {
  Users,
  Stethoscope,
  Bed,
  Activity,
  Pill,
  FlaskConical,
  Image,
  FileText,
  ShieldCheck,
  Truck,
  Droplet,
  UserCheck,
  UserPlus,
  Sparkles,
  DollarSign
} from 'lucide-react';

interface RoleDashboardContainerProps {
  onNavigate: (tab: string) => void;
}

export const RoleDashboardContainer: React.FC<RoleDashboardContainerProps> = ({
  onNavigate
}) => {
  const { user, role } = useAuth();

  if (role === 'Ambulance Operator') {
    return <AmbulanceOperatorDashboard />;
  }

  if (role === 'Ambulance Driver') {
    return <AmbulanceDriverDashboard />;
  }


  return (
    <div className="space-y-6">
      {/* Live Hospital Emergency Pre-Arrival Alert Banner */}
      <HospitalEmergencyAlertBanner onOpenIPD={() => onNavigate('ipd')} />

      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 p-6 text-white shadow-lg relative overflow-hidden">

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">

          <div>

            <div className="flex items-center space-x-2 text-teal-200 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="h-4 w-4 text-cyan-300" />

              <span>
                Smart Care Enterprise Portal
              </span>
            </div>

            <h1 className="text-2xl font-bold">
              Welcome back, {user?.first_name || role}!
            </h1>

            <p className="text-xs text-teal-100 mt-1">
              Logged in as:{' '}
              <strong className="underline decoration-cyan-400">
                {role}
              </strong>{' '}
              | Department:{' '}
              {user?.department_name || 'Hospital Operations'}
            </p>

          </div>

          <div className="flex items-center space-x-2">

            <button
              onClick={() => onNavigate('ehr')}
              className="rounded-xl bg-white/20 px-4 py-2 text-xs font-bold text-white hover:bg-white/30 backdrop-blur-md transition-all border border-white/20"
            >
              Central EHR
            </button>

            <button
              onClick={() => onNavigate('ambulance')}
              className="rounded-xl bg-red-500/90 px-4 py-2 text-xs font-bold text-white hover:bg-red-600 shadow-sm transition-all"
            >
              Emergency Dispatch
            </button>

          </div>

        </div>
      </div>


      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

        {/* Active Patients */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="flex items-center justify-between">

            <span className="text-xs font-semibold text-slate-500">
              Active Patients
            </span>

            <Users className="h-4 w-4 text-teal-600" />

          </div>

          <div className="mt-2 text-xl font-bold text-slate-900">
            32
          </div>

          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
            30+ Seeded Profiles Ready
          </div>

        </div>


        {/* Specialists */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="flex items-center justify-between">

            <span className="text-xs font-semibold text-slate-500">
              Total Specialists
            </span>

            <Stethoscope className="h-4 w-4 text-cyan-600" />

          </div>

          <div className="mt-2 text-xl font-bold text-slate-900">
            200
          </div>

          <div className="text-[10px] text-cyan-600 font-semibold mt-0.5">
            20 Doctors x 10 Depts
          </div>

        </div>


        {/* Beds */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="flex items-center justify-between">

            <span className="text-xs font-semibold text-slate-500">
              Bed Occupancy
            </span>

            <Bed className="h-4 w-4 text-amber-600" />

          </div>

          <div className="mt-2 text-xl font-bold text-slate-900">
            18 / 25
          </div>

          <div className="text-[10px] text-amber-600 font-semibold mt-0.5">
            7 Vacant Beds
          </div>

        </div>


        {/* Ambulance */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="flex items-center justify-between">

            <span className="text-xs font-semibold text-slate-500">
              Ambulance Fleet
            </span>

            <Truck className="h-4 w-4 text-red-600" />

          </div>

          <div className="mt-2 text-xl font-bold text-slate-900">
            5 ALS Fleet
          </div>

          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
            4 Available, 1 En Route
          </div>

        </div>

      </div>


      {/* Role-Specific Shortcuts */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h3 className="text-sm font-bold text-slate-800 mb-4">
          Recommended Actions for {role}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">


          {/* ================================================== */}
          {/* ADMIN ONLY - CREATE STAFF ACCOUNT */}
          {/* ================================================== */}

          {role === 'Admin' && (

            <button
              onClick={() => onNavigate('create-staff')}
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-teal-200 bg-teal-50 hover:bg-teal-100 hover:border-teal-300 transition-all"
            >

              <UserPlus className="h-6 w-6 text-teal-600 mb-2" />

              <span className="font-semibold text-slate-800 text-center">
                Create Staff Account
              </span>

            </button>

          )}


          {/* ================================================== */}
          {/* PATIENT DIRECTORY */}
          {/* ================================================== */}

          <button
            onClick={() => onNavigate('patients')}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-teal-50 hover:border-teal-200 transition-all"
          >

            <Users className="h-6 w-6 text-teal-600 mb-2" />

            <span className="font-semibold text-slate-800">
              Patient Directory
            </span>

          </button>


          {/* ================================================== */}
          {/* APPOINTMENTS */}
          {/* ================================================== */}

          <button
            onClick={() => onNavigate('appointments')}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-teal-50 hover:border-teal-200 transition-all"
          >

            <Stethoscope className="h-6 w-6 text-cyan-600 mb-2" />

            <span className="font-semibold text-slate-800">
              Appointments
            </span>

          </button>


          {/* ================================================== */}
          {/* OPD */}
          {/* ================================================== */}

          <button
            onClick={() => onNavigate('opd')}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-teal-50 hover:border-teal-200 transition-all"
          >

            <Activity className="h-6 w-6 text-emerald-600 mb-2" />

            <span className="font-semibold text-slate-800">
              OPD Consultation
            </span>

          </button>


          {/* ================================================== */}
          {/* LAB */}
          {/* ================================================== */}

          <button
            onClick={() => onNavigate('lis')}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-teal-50 hover:border-teal-200 transition-all"
          >

            <FlaskConical className="h-6 w-6 text-purple-600 mb-2" />

            <span className="font-semibold text-slate-800">
              Lab Info System
            </span>

          </button>


          {/* ================================================== */}
          {/* PHARMACY */}
          {/* ================================================== */}

          <button
            onClick={() => onNavigate('pharmacy')}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-teal-50 hover:border-teal-200 transition-all"
          >

            <Pill className="h-6 w-6 text-rose-600 mb-2" />

            <span className="font-semibold text-slate-800">
              Pharmacy Dispensing
            </span>

          </button>


          {/* ================================================== */}
          {/* BILLING */}
          {/* ================================================== */}

          <button
            onClick={() => onNavigate('billing')}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-teal-50 hover:border-teal-200 transition-all"
          >

            <FileText className="h-6 w-6 text-blue-600 mb-2" />

            <span className="font-semibold text-slate-800">
              Billing & PDF Invoice
            </span>

          </button>


          {/* ================================================== */}
          {/* AMBULANCE */}
          {/* ================================================== */}

          <button
            onClick={() => onNavigate('ambulance')}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-teal-50 hover:border-teal-200 transition-all"
          >

            <Truck className="h-6 w-6 text-red-600 mb-2" />

            <span className="font-semibold text-slate-800">
              Ambulance Emergency
            </span>

          </button>


          {/* ================================================== */}
          {/* AI CLINICAL SUPPORT */}
          {/* ================================================== */}

          <button
            onClick={() => onNavigate('ai-cds')}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/60 transition-all"
          >

            <Sparkles className="h-6 w-6 text-amber-600 mb-2" />

            <span className="font-semibold text-amber-900">
              AI Clinical Support
            </span>

          </button>

        </div>

      </div>

    </div>
  );
};