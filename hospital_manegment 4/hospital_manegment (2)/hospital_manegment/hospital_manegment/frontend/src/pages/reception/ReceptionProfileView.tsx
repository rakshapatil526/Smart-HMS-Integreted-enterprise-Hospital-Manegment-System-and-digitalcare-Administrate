import React from 'react';
import { User, ShieldCheck, Mail, Phone, Lock } from 'lucide-react';

export const ReceptionProfileView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">MY RECEPTIONIST PROFILE</h1>
          <p className="text-xs text-slate-500">Front desk staff authentication & administrative account settings</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="h-16 w-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-sm">
            REC
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Front Desk Receptionist</h2>
            <div className="text-xs font-mono font-bold text-blue-700">Staff ID: REC-2026-001</div>
            <div className="text-xs text-slate-500 mt-0.5">Role: RECEPTION • Front Desk & OPD Queue Coordinator</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-400 font-semibold block text-[10px] uppercase flex items-center space-x-1">
              <Mail className="h-3 w-3 text-slate-500" />
              <span>Email Address</span>
            </span>
            <strong className="text-slate-800">reception@smartcare.com</strong>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-400 font-semibold block text-[10px] uppercase flex items-center space-x-1">
              <Phone className="h-3 w-3 text-slate-500" />
              <span>Front Desk Phone Extension</span>
            </span>
            <strong className="text-slate-800 font-mono">+1 (555) 019-1000 (Ext 101)</strong>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 col-span-2">
            <span className="text-slate-400 font-semibold block text-[10px] uppercase flex items-center space-x-1">
              <Lock className="h-3 w-3 text-slate-500" />
              <span>Administrative Role & Permissions</span>
            </span>
            <p className="text-slate-700 leading-relaxed font-medium">
              Authorized for Patient Search, Patient Registration, OPD Appointments & Check-in, OPD Queue Call, IPD Bed Availability Matrix, and Basic Receipt Generation. Clinical diagnosis & detailed EHR notes are strictly masked under RBAC.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
