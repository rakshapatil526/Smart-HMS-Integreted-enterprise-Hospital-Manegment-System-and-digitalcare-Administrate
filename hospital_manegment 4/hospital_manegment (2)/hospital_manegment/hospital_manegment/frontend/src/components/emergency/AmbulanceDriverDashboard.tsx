import React, { useState, useEffect } from 'react';
import { emergencyHrApi } from '../../services/api';
import { EmergencyRequest, AmbulanceStatus } from '../../types';
import {
  Truck,
  MapPin,
  Clock,
  Phone,
  CheckCircle,
  Navigation,
  Shield,
  Building2,
  RotateCw,
  AlertTriangle,
  Check,
  X,
  Power
} from 'lucide-react';

export const AmbulanceDriverDashboard: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [activeTrip, setActiveTrip] = useState<EmergencyRequest | null>(null);
  const [incomingRequest, setIncomingRequest] = useState<EmergencyRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDriverRequests();
    const interval = setInterval(fetchDriverRequests, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchDriverRequests = async () => {
    try {
      const res = await emergencyHrApi.getEmergencyRequests();
      const list: EmergencyRequest[] = res.data || [];
      setRequests(list);

      // Check if driver has an active trip
      const active = list.find(r => 
        r.status === 'DRIVER_ACCEPTED' ||
        r.status === 'EN_ROUTE_TO_PICKUP' ||
        r.status === 'ARRIVED_AT_PICKUP' ||
        r.status === 'PATIENT_ONBOARD' ||
        r.status === 'EN_ROUTE_TO_HOSPITAL' ||
        r.status === 'ARRIVED_AT_HOSPITAL' ||
        r.status === 'En Route' ||
        r.status === 'At Pickup' ||
        r.status === 'Patient Onboard'
      );

      if (active) {
        setActiveTrip(active);
        setIncomingRequest(null);
      } else {
        setActiveTrip(null);
        // Look for unassigned or requested emergency
        const incoming = list.find(r => 
          (r.status as string) === 'SEARCHING' || 
          (r.status as string) === 'DRIVER_ASSIGNED' || 
          (r.status as string) === 'Requested'
        );
        if (incoming && isOnline) {
          setIncomingRequest(incoming);
        } else {
          setIncomingRequest(null);
        }
      }
    } catch (err) {
      console.error("Error fetching driver requests:", err);
    }
    setLoading(false);
  };

  // Driver Accepts Request
  const handleAcceptRequest = async (emergencyId: string) => {
    try {
      await emergencyHrApi.updateEmergencyStatus(emergencyId, 'DRIVER_ACCEPTED');
      await emergencyHrApi.updateEmergencyStatus(emergencyId, 'EN_ROUTE_TO_PICKUP');
      alert("Request Accepted! Navigating to Pickup Location.");
      fetchDriverRequests();
    } catch (err) {
      alert("Failed to accept request.");
    }
  };

  // Driver Rejects Request
  const handleRejectRequest = () => {
    setIncomingRequest(null);
    alert("Request Rejected.");
  };

  // Update Trip Status (State Machine Progression)
  const handleStatusProgress = async (newStatus: AmbulanceStatus) => {
    if (!activeTrip) return;
    try {
      await emergencyHrApi.updateEmergencyStatus(activeTrip.id, newStatus);
      fetchDriverRequests();
    } catch (err) {
      alert("Failed to update trip status.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-['Inter',sans-serif]">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-slate-900 p-6 text-white shadow-xl border border-slate-800">
        <div className="flex items-center space-x-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg">
            <Truck className="h-8 w-8" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold tracking-wider text-red-400 uppercase">Emergency Response Dispatch Unit</span>
            <h1 className="text-xl font-black text-white">🚑 AMBULANCE DRIVER APP</h1>
            <p className="text-xs text-slate-300">Vehicle: A-102 (ALS ICU Unit) • Driver: Raj Kumar</p>
          </div>
        </div>

        {/* Online / Offline Status Toggle */}
        <div className="flex items-center space-x-3 bg-slate-800 p-2 rounded-2xl border border-slate-700">
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              isOnline
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-700 text-slate-400'
            }`}
          >
            <Power className="h-4 w-4" />
            <span>{isOnline ? 'You are ONLINE 🟢' : 'OFFLINE 🔴'}</span>
          </button>
        </div>
      </div>

      {/* Online Status Notice */}
      <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-900 text-xs font-bold flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
          <span>Available for emergency requests in Bengaluru Region</span>
        </div>
        <span className="text-[11px] text-emerald-700 font-mono">GPS Active</span>
      </div>

      {/* 1. INCOMING REQUEST ALERT CARD */}
      {incomingRequest && !activeTrip && (
        <div className="rounded-3xl border-4 border-red-500 bg-red-50/90 p-6 shadow-2xl space-y-6 animate-pulse">
          <div className="flex items-center justify-between border-b border-red-200 pb-4">
            <div className="flex items-center space-x-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-600 text-white text-lg">
                🚨
              </span>
              <div>
                <span className="text-xs font-black text-red-700 uppercase tracking-wider">Emergency Dispatch Alert</span>
                <h2 className="text-lg font-black text-slate-900">New Request 🚨</h2>
              </div>
            </div>
            <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-extrabold text-white">
              PRIORITY 1 DISPATCH
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-white rounded-2xl border border-red-100 space-y-2 col-span-1 sm:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Patient Info</span>
                <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-extrabold text-red-700">
                  {incomingRequest.emergency_type || 'Cardiac Emergency'}
                </span>
              </div>
              <div className="font-extrabold text-slate-900 text-base">
                👤 {incomingRequest.patient_name || 'Aarav Sharma'} ({incomingRequest.patient_phone || '+91 98765 00001'})
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-red-100 space-y-2">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Pickup Location</div>
              <div className="font-extrabold text-slate-900 text-sm flex items-start gap-1.5">
                <MapPin className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>{incomingRequest.pickup_address || 'MG Road, Bengaluru'}</span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-red-100 space-y-2">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Destination Hospital</div>
              <div className="font-extrabold text-slate-900 text-sm flex items-start gap-1.5">
                <Building2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{incomingRequest.destination_hospital || 'Smart Care Hospital'}</span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-red-100 space-y-1">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Distance</div>
              <div className="font-extrabold text-slate-900 text-base">
                {incomingRequest.distance_km || 2.1} km
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-red-100 space-y-1">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Estimated Pickup Time (ETA)</div>
              <div className="font-extrabold text-red-600 text-base">
                {incomingRequest.eta_minutes || 6} min
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <button
              onClick={() => handleAcceptRequest(incomingRequest.id)}
              className="py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Check className="h-5 w-5" />
              <span>[ ACCEPT REQUEST ]</span>
            </button>

            <button
              onClick={handleRejectRequest}
              className="py-4 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-sm transition-all flex items-center justify-center gap-2"
            >
              <X className="h-5 w-5" />
              <span>[ REJECT ]</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. ACTIVE TRIP PROGRESSION CONTROL PANEL */}
      {activeTrip && (
        <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-wider">Active Emergency Mission</span>
              <h2 className="text-lg font-black text-slate-900">
                Trip #{activeTrip.request_number} — {activeTrip.emergency_type}
              </h2>
            </div>
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-800 border border-red-200">
              Siren Active
            </span>
          </div>

          {/* Current Status Display */}
          <div className="rounded-2xl bg-slate-900 p-5 text-white space-y-3">
            <div className="text-[11px] text-slate-400 font-bold uppercase">Current Status</div>
            <div className="text-xl font-black text-emerald-400 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
              <span>{activeTrip.status}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs border-t border-slate-800 pt-3 mt-2">
              <div>
                <span className="text-slate-400 block text-[10px]">PICKUP</span>
                <span className="font-bold text-white">{activeTrip.pickup_address}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">DESTINATION</span>
                <span className="font-bold text-white">{activeTrip.destination_hospital}</span>
              </div>
            </div>
          </div>

          {/* Step-by-Step Status Transition Action Buttons */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Update Mission Status</h3>

            {/* Step 1: Arrived at Pickup */}
            {(activeTrip.status === 'EN_ROUTE_TO_PICKUP' || activeTrip.status === 'DRIVER_ACCEPTED' || activeTrip.status === 'En Route') && (
              <button
                onClick={() => handleStatusProgress('ARRIVED_AT_PICKUP')}
                className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <MapPin className="h-5 w-5" />
                <span>[ ARRIVED AT PICKUP ]</span>
              </button>
            )}

            {/* Step 2: Patient Onboard */}
            {(activeTrip.status === 'ARRIVED_AT_PICKUP' || activeTrip.status === 'At Pickup') && (
              <button
                onClick={() => handleStatusProgress('PATIENT_ONBOARD')}
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Shield className="h-5 w-5" />
                <span>[ PATIENT ONBOARD ]</span>
              </button>
            )}

            {/* Step 3: Arrived at Hospital */}
            {(activeTrip.status === 'PATIENT_ONBOARD' || activeTrip.status === 'EN_ROUTE_TO_HOSPITAL' || activeTrip.status === 'Patient Onboard') && (
              <button
                onClick={() => handleStatusProgress('ARRIVED_AT_HOSPITAL')}
                className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Building2 className="h-5 w-5" />
                <span>[ ARRIVED AT HOSPITAL ]</span>
              </button>
            )}

            {/* Step 4: Complete Patient Handover */}
            {(activeTrip.status === 'ARRIVED_AT_HOSPITAL' || activeTrip.status === 'Hospital Arrived') && (
              <button
                onClick={() => handleStatusProgress('COMPLETED')}
                className="w-full py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle className="h-5 w-5" />
                <span>[ COMPLETE HANDOVER & FINISH TRIP ]</span>
              </button>
            )}
          </div>
        </div>
      )}

      {!incomingRequest && !activeTrip && (
        <div className="rounded-3xl bg-white border border-slate-200 p-12 text-center space-y-3">
          <Truck className="h-12 w-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-extrabold text-slate-800">No Active Emergency Requests</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You are online and available. New incoming emergency dispatches will pop up here instantly.
          </p>
        </div>
      )}
    </div>
  );
};
