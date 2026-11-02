import React, { useState } from 'react';
import { Activity, UserCheck, Calendar, Hospital, Truck, Bot, LogIn, UserPlus, HelpCircle, Info, X, ShieldCheck } from 'lucide-react';

interface WelcomePageProps {
  onGoToLogin: () => void;
  onGoToRegister: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onGoToLogin, onGoToRegister }) => {
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-800 font-['Inter',sans-serif] flex flex-col justify-between relative overflow-hidden">
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>

      {/* Top Navigation Header */}
      <header className="flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-900/90 px-6 backdrop-blur-md text-white z-20">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 text-white shadow-md">
            <Activity className="h-6 w-6" />
          </div>
          <span className="text-lg font-bold tracking-tight">🏥 SMART CARE HMS</span>
        </div>

        <nav className="flex items-center space-x-6 text-xs font-semibold text-slate-300">
          <button
            onClick={() => setShowAboutModal(true)}
            className="flex items-center space-x-1 hover:text-teal-400 transition-colors"
          >
            <Info className="h-3.5 w-3.5" />
            <span>About</span>
          </button>
          <button
            onClick={() => setShowHelpModal(true)}
            className="flex items-center space-x-1 hover:text-teal-400 transition-colors"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Help</span>
          </button>
          <button
            onClick={onGoToLogin}
            className="flex items-center space-x-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 shadow-sm transition-all"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In</span>
          </button>
        </nav>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12 text-white max-w-4xl mx-auto space-y-8 z-10">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-teal-500/20 to-cyan-500/20 border border-teal-500/30 text-teal-400 shadow-xl backdrop-blur-md">
          <Activity className="h-11 w-11 animate-pulse" />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            SMART CARE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400">
              HOSPITAL MANAGEMENT SYSTEM
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            One connected platform for smarter hospital and patient management.
          </p>
        </div>

        {/* Two Main Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md pt-2">
          <button
            onClick={onGoToLogin}
            className="flex w-full sm:w-1/2 items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-4 text-xs font-bold text-white shadow-xl shadow-teal-500/20 hover:from-teal-500 hover:to-cyan-500 transition-all uppercase tracking-wider transform hover:-translate-y-0.5"
          >
            <LogIn className="h-4 w-4" />
            <span>SIGN IN</span>
          </button>

          <button
            onClick={onGoToRegister}
            className="flex w-full sm:w-1/2 items-center justify-center space-x-2 rounded-2xl border border-teal-500/40 bg-teal-500/10 px-6 py-4 text-xs font-bold text-teal-300 hover:bg-teal-500/20 transition-all uppercase tracking-wider backdrop-blur-md transform hover:-translate-y-0.5"
          >
            <UserPlus className="h-4 w-4" />
            <span>CREATE PATIENT ACCOUNT</span>
          </button>
        </div>

        {/* Capabilities Information Section (5 Simple Cards) */}
        <div className="pt-10 border-t border-slate-800/80 w-full">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-slate-300">
            <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-sm hover:border-teal-500/40 transition-all">
              <UserCheck className="h-5 w-5 text-teal-400 mb-2" />
              <span className="text-[11px] font-bold text-slate-200">👤 Patient Care</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-sm hover:border-cyan-500/40 transition-all">
              <Calendar className="h-5 w-5 text-cyan-400 mb-2" />
              <span className="text-[11px] font-bold text-slate-200">📅 Appointments</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-sm hover:border-emerald-500/40 transition-all">
              <Hospital className="h-5 w-5 text-emerald-400 mb-2" />
              <span className="text-[11px] font-bold text-slate-200">🏥 Hospital Management</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-sm hover:border-rose-500/40 transition-all">
              <Truck className="h-5 w-5 text-rose-400 mb-2" />
              <span className="text-[11px] font-bold text-slate-200">🚑 Emergency Ambulance</span>
            </div>
            <div className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-sm hover:border-amber-500/40 transition-all">
              <Bot className="h-5 w-5 text-amber-400 mb-2" />
              <span className="text-[11px] font-bold text-slate-200">🤖 AI Assistance</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-4 text-center text-xs text-slate-400 z-10 backdrop-blur-md">
        <div className="flex items-center justify-center space-x-2">
          <span>🏥 Smart Healthcare</span>
          <span>•</span>
          <span>Smart Care HMS © 2026</span>
        </div>
      </footer>

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 text-white shadow-2xl relative space-y-4">
            <button onClick={() => setShowAboutModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2 text-teal-400 font-bold text-base border-b border-slate-800 pb-3">
              <Info className="h-5 w-5" />
              <span>About Smart Care HMS</span>
            </div>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong>Smart Care HMS</strong> is a unified Hospital Management Information System designed for modern digital healthcare facilities.
              </p>
              <p>
                Key capabilities include Patient Portals, Doctor Consultations, Nurse Care Units, Laboratory Information Systems (LIS), Pharmacy Dispensing, Billing & PDF Invoices, Ambulance Dispatch, and AI Clinical Decision Support.
              </p>
            </div>
            <button onClick={() => setShowAboutModal(false)} className="w-full rounded-xl bg-teal-600 py-2.5 text-xs font-bold text-white uppercase">Close</button>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 text-white shadow-2xl relative space-y-4">
            <button onClick={() => setShowHelpModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2 text-cyan-400 font-bold text-base border-b border-slate-800 pb-3">
              <HelpCircle className="h-5 w-5" />
              <span>Smart Care Help & Support</span>
            </div>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                <span className="font-bold text-white block">🏥 Patient Registration</span>
                <p>New patients can click <strong>Create Patient Account</strong> to fill out basic medical details and access their health portal.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                <span className="font-bold text-white block">🔐 Hospital Staff & Workers</span>
                <p>Hospital staff (Doctors, Nurses, Reception, Admin, Lab, etc.) can click <strong>Sign In</strong>, select their role, and log in securely.</p>
              </div>
              <p className="text-[11px] text-slate-400 text-center">Need immediate assistance? Contact: <strong>support@smartcare.com</strong></p>
            </div>
            <button onClick={() => setShowHelpModal(false)} className="w-full rounded-xl bg-cyan-600 py-2.5 text-xs font-bold text-white uppercase">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

