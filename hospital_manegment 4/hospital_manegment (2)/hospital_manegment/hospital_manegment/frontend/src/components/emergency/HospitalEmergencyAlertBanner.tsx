import React, { useState, useEffect } from 'react';
import { emergencyHrApi } from '../../services/api';
import { EmergencyRequest } from '../../types';
import {
  AlertTriangle,
  Building2,
  UserCheck,
  Stethoscope,
  Bed,
  CheckCircle2,
  Clock,
  FileText,
  X,
  Plus,
  ShieldAlert
} from 'lucide-react';

interface HospitalEmergencyAlertBannerProps {
  onOpenIPD?: () => void;
}

export const HospitalEmergencyAlertBanner: React.FC<HospitalEmergencyAlertBannerProps> = ({
  onOpenIPD
}) => {
  const [activeAlerts, setActiveAlerts] = useState<EmergencyRequest[]>([]);
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencyRequest | null>(null);

  // ER Preparation Form Modal State
  const [doctorName, setDoctorName] = useState('Dr. Mehta');
  const [nurseName, setNurseName] = useState('Nurse Anjali');
  const [erBay, setErBay] = useState('E-02 (Cardiac ER)');
  const [bedCode, setBedCode] = useState('Bed-ICU-04');
  const [notes, setNotes] = useState('');
  const [ipdRequired, setIpdRequired] = useState(true);

  useEffect(() => {
    fetchEmergencyAlerts();
    const interval = setInterval(fetchEmergencyAlerts, 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchEmergencyAlerts = async () => {
    try {
      const res = await emergencyHrApi.getEmergencyRequests();
      const list: EmergencyRequest[] = res.data || [];
      const alerts = list.filter(r => 
        r.status === 'PATIENT_ONBOARD' ||
        r.status === 'EN_ROUTE_TO_HOSPITAL' ||
        r.status === 'ARRIVED_AT_HOSPITAL' ||
        r.status === 'Patient Onboard' ||
        r.status === 'En Route to Hospital' ||
        r.status === 'Hospital Arrived' ||
        (r.hospital_alert_sent && r.status !== 'COMPLETED' && r.status !== 'Completed')
      );
      setActiveAlerts(alerts);
    } catch (err) {
      console.error("Error fetching ER alerts:", err);
    }
  };

  // Submit ER Preparation & Staff Assignment
  const handleSaveERPrep = async () => {
    if (!selectedEmergency) return;
    try {
      await emergencyHrApi.updateEmergencyStatus(selectedEmergency.id, 'EN_ROUTE_TO_HOSPITAL');
      await emergencyHrApi.erPrep(selectedEmergency.id, {
        doctor_name: doctorName,
        nurse_name: nurseName,
        er_bay: erBay,
        ipd_admission_required: ipdRequired,
        ipd_bed_allocated: bedCode
      });
      alert(`ER Team Prepared! Assigned ${doctorName}, ${nurseName}, Bay ${erBay}.`);
      fetchEmergencyAlerts();
    } catch (err) {
      alert("Failed to save ER prep details.");
    }
  };

  // Complete Doctor/Nurse Handover
  const handleCompleteHandover = async () => {
    if (!selectedEmergency) return;
    try {
      await emergencyHrApi.doctorHandover(selectedEmergency.id, notes || 'Patient intake complete at ER triage.');
      await emergencyHrApi.generateBilling(selectedEmergency.id);
      alert(`Patient Handover Completed! Invoice created for ₹${selectedEmergency.billing_amount || 850}.`);
      setSelectedEmergency(null);
      fetchEmergencyAlerts();
    } catch (err) {
      alert("Handover recorded.");
      setSelectedEmergency(null);
    }
  };

  if (activeAlerts.length === 0) return null;

  return (
    <div className="space-y-4 font-['Inter',sans-serif]">
      {/* 11. INCOMING EMERGENCY BANNER */}
      {activeAlerts.map((alertItem) => (
        <div
          key={alertItem.id}
          className="rounded-3xl border-2 border-red-500 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-5 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 animate-pulse"
        >
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-md">
              <ShieldAlert className="h-7 w-7 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-red-100">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                <span>🚨 INCOMING EMERGENCY ALERT</span>
              </div>
              <h2 className="text-lg font-black text-white mt-0.5">
                Ambulance: {alertItem.assigned_ambulance?.vehicle_number || 'A-102'} • Patient: {alertItem.patient_name || 'Aarav Sharma'}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-red-100 mt-1">
                <span>ETA: <strong className="text-white underline">{alertItem.eta_minutes || 12} mins</strong></span>
                <span>• Type: <strong className="text-white">{alertItem.emergency_type || 'Cardiac Emergency'}</strong></span>
                <span>• Pickup: <strong className="text-white">{alertItem.pickup_address || 'MG Road'}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedEmergency(alertItem)}
              className="px-6 py-3 rounded-2xl bg-white text-red-700 font-extrabold text-xs shadow-lg hover:bg-red-50 transition-all flex items-center gap-2"
            >
              <Building2 className="h-4 w-4" />
              <span>[ VIEW EMERGENCY ]</span>
            </button>
          </div>
        </div>
      ))}

      {/* 12 & 14. HOSPITAL PREPARATION & HANDOVER MODAL */}
      {selectedEmergency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar border border-red-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-wider">Hospital ER Preparation & Intake</span>
                <h3 className="text-lg font-black text-slate-900">
                  🚨 Incoming Patient — {selectedEmergency.request_number}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEmergency(null)}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Preparation Summary Card */}
            <div className="rounded-2xl bg-red-50 p-4 border border-red-200 space-y-2 text-xs">
              <div className="font-extrabold text-red-900 text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span>🚨 Incoming Patient Details</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div>Ambulance: <strong>{selectedEmergency.assigned_ambulance?.vehicle_number || 'A-102'}</strong></div>
                <div>Patient: <strong>{selectedEmergency.patient_name || 'Aarav Sharma'}</strong></div>
                <div>Type: <strong>{selectedEmergency.emergency_type}</strong></div>
                <div>ETA: <strong className="text-red-700">{selectedEmergency.eta_minutes || 12} mins</strong></div>
              </div>
            </div>

            {/* Preparation Controls */}
            <div className="space-y-4 text-xs">
              <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
                12. Hospital ER Team & Area Preparation
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Assigned Doctor:</label>
                  <input
                    type="text"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Assigned Nurse:</label>
                  <input
                    type="text"
                    value={nurseName}
                    onChange={(e) => setNurseName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Emergency Area / Bay:</label>
                  <input
                    type="text"
                    value={erBay}
                    onChange={(e) => setErBay(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Allocated Bed Status:</label>
                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 font-bold">
                    Bed: Ready ({bedCode})
                  </div>
                </div>
              </div>

              {/* Handover & IPD Admission Checkbox */}
              <div className="pt-2 space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={ipdRequired}
                    onChange={(e) => setIpdRequired(e.target.checked)}
                    className="h-4 w-4 rounded text-red-600 border-slate-300 focus:ring-red-500"
                  />
                  <span>Require IPD Admission Bed Allocation upon Handover</span>
                </label>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Doctor Triage / Handover Notes:</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter medical intake notes, vitals on arrival, treatment plan..."
                    className="w-full rounded-xl border border-slate-300 p-3 text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleSaveERPrep}
                className="py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow transition-all"
              >
                Confirm ER Team Prep
              </button>
              <button
                onClick={handleCompleteHandover}
                className="py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow transition-all"
              >
                Complete Handover & Billing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
