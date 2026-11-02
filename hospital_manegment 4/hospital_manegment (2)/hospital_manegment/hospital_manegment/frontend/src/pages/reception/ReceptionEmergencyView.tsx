import React from 'react';
import { AlertTriangle, Truck, Clock, Phone, MapPin, CheckCircle2 } from 'lucide-react';

export const ReceptionEmergencyView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-rose-600" />
            <span>🚨 EMERGENCY FRONT-DESK ALERTS</span>
          </h1>
          <p className="text-xs text-slate-500">Ambulance dispatch tracking & ER trauma bay reception coordination</p>
        </div>
      </div>

      {/* Emergency Card (Section 18 Blueprint) */}
      <div className="rounded-2xl bg-gradient-to-br from-rose-50 via-white to-amber-50 border-2 border-rose-300 p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-rose-200 pb-3">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-600 text-white animate-pulse">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-rose-950">Emergency Request #E001</h3>
              <p className="text-xs text-rose-700 font-semibold">Trauma / STAT Ambulance Arrival Notice</p>
            </div>
          </div>
          <span className="rounded-full bg-rose-600 text-white font-extrabold text-xs px-3 py-1 animate-pulse">
            ETA: 8 mins
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white rounded-xl border border-rose-100 space-y-0.5">
            <span className="text-slate-400 font-semibold block text-[10px] uppercase">Patient</span>
            <strong className="text-slate-900 font-bold">Patient A (Unidentified Male)</strong>
          </div>
          <div className="p-3 bg-white rounded-xl border border-rose-100 space-y-0.5">
            <span className="text-slate-400 font-semibold block text-[10px] uppercase">Pickup Location</span>
            <strong className="text-slate-900 font-bold">Main Gate / Expressway</strong>
          </div>
          <div className="p-3 bg-white rounded-xl border border-rose-100 space-y-0.5">
            <span className="text-slate-400 font-semibold block text-[10px] uppercase">Ambulance Unit</span>
            <strong className="text-slate-900 font-mono font-bold">Unit A-102</strong>
          </div>
          <div className="p-3 bg-white rounded-xl border border-rose-100 space-y-0.5">
            <span className="text-slate-400 font-semibold block text-[10px] uppercase">Dispatch Status</span>
            <span className="text-emerald-700 font-extrabold block">Ambulance Assigned</span>
          </div>
        </div>

        <div className="pt-2 border-t border-rose-200 flex items-center justify-end space-x-3">
          <button
            onClick={() => alert("Emergency Triage Bay & Trauma Team Notified at ER Front Desk.")}
            className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 text-xs font-bold shadow-sm transition-all"
          >
            [ VIEW EMERGENCY STATUS ]
          </button>
        </div>
      </div>
    </div>
  );
};
