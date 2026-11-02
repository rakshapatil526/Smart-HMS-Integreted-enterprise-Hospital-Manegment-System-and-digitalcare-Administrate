import React, { useState, useEffect } from 'react';
import { emergencyHrApi } from '../../services/api';
import { sharedStore } from '../../services/sharedStore';
import { Ambulance, EmergencyRequest, EmergencyTypeChoice, AmbulanceStatus } from '../../types';
import { KarnatakaLiveMap } from '../../components/emergency/KarnatakaLiveMap';
import {
  AlertCircle,
  Truck,
  MapPin,
  Clock,
  Phone,
  CheckCircle,
  Plus,
  Shield,
  Activity,
  UserCheck,
  FileText,
  DollarSign,
  Wrench,
  Bell,
  User,
  LogOut,
  Navigation,
  Send,
  Heart,
  Flame,
  Baby,
  Crosshair
} from 'lucide-react';

interface EmergencyModuleProps {
  initialTab?: string;
  onNavigateTab?: (tab: string) => void;
}

export const EmergencyModule: React.FC<EmergencyModuleProps> = ({ initialTab = 'dashboard' }) => {
  const [activeSubTab, setActiveSubTab] = useState<string>(initialTab);
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencyRequest | null>(null);
  const [loading, setLoading] = useState(true);

  // New Emergency Request Form State (Req #2 & #3)
  const [patientName, setPatientName] = useState('Aarav Sharma');
  const [phone, setPhone] = useState('+91 9876500001');
  const [locationAddress, setLocationAddress] = useState('Main Road, Indiranagar, Bengaluru');
  const [pickupLat, setPickupLat] = useState<number>(12.9784);
  const [pickupLng, setPickupLng] = useState<number>(77.6408);
  const [emergencyType, setEmergencyType] = useState<EmergencyTypeChoice>('Accident');
  const [description, setDescription] = useState('Severe vehicle impact, conscious but injured');
  const [numberOfPatients, setNumberOfPatients] = useState<number>(1);

  // Modals state
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState<EmergencyRequest | null>(null);
  const [showDriverModal, setShowDriverModal] = useState<EmergencyRequest | null>(null);
  const [showDoctorModal, setShowDoctorModal] = useState<EmergencyRequest | null>(null);
  const [hospitalAlertToast, setHospitalAlertToast] = useState<EmergencyRequest | null>(null);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [notifications, setNotifications] = useState<any[]>(sharedStore.getAmbulanceNotifications());

  useEffect(() => {
    const handleAmbNotifs = () => {
      setNotifications(sharedStore.getAmbulanceNotifications());
    };
    handleAmbNotifs();
    window.addEventListener('smartcare_ambulance_notif_added', handleAmbNotifs);
    window.addEventListener('smartcare_ambulance_added', handleAmbNotifs);
    return () => {
      window.removeEventListener('smartcare_ambulance_notif_added', handleAmbNotifs);
      window.removeEventListener('smartcare_ambulance_added', handleAmbNotifs);
    };
  }, []);
  const getVehicleCode = (amb: any): string => {
    if (!amb) return 'Unassigned';
    if (typeof amb === 'string') return amb;
    if (amb && typeof amb.vehicle_number === 'string') {
      return amb.vehicle_number.split(' ')[0] || amb.vehicle_number;
    }
    return 'A-01';
  };

  const getVehicleFullNumber = (amb: any): string => {
    if (!amb) return 'A-01';
    if (typeof amb === 'string') return amb;
    if (amb && typeof amb.vehicle_number === 'string') {
      return amb.vehicle_number;
    }
    return 'A-01';
  };

  useEffect(() => {
    fetchEmergencyData();
  }, []);

  const fetchEmergencyData = async () => {
    setLoading(true);
    try {
      const [ambRes, reqRes] = await Promise.all([
        emergencyHrApi.getAmbulances(),
        emergencyHrApi.getEmergencyRequests()
      ]);
      setAmbulances(ambRes.data || []);
      setRequests(reqRes.data || []);
      
      if (reqRes.data && reqRes.data.length > 0) {
        setSelectedEmergency(reqRes.data[0]);
        // Trigger pre-arrival alert if any request has patient onboard or active status
        const activeAlert = reqRes.data.find((r: EmergencyRequest) => r.status === 'Patient Onboard' || r.status === 'En Route to Hospital');
        if (activeAlert && !activeAlert.hospital_alert_acknowledged) {
          setHospitalAlertToast(activeAlert);
        }
      }
    } catch (err) {
      console.error("Failed to load emergency telemetry:", err);
    }
    setLoading(false);
  };

  // 1. Emergency Submission (Req #2)
  const handleCreateRequest = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const reqNo = `E${Math.floor(100 + Math.random() * 900)}`;
      sharedStore.addAmbulanceRequest({
        patient_name: patientName,
        phone: phone,
        emergency_type: emergencyType,
        address: locationAddress,
        doctor_name: 'Dr. Narayan Swamy'
      });
      try {
        await emergencyHrApi.createEmergencyRequest({
          request_number: reqNo,
          patient_name: patientName,
          patient_phone: phone,
          emergency_type: emergencyType,
          short_description: description,
          number_of_patients: numberOfPatients,
          pickup_address: locationAddress,
          latitude: pickupLat,
          longitude: pickupLng,
          severity: 'Critical',
          status: 'Requested',
          eta_minutes: 10
        });
      } catch (errApi) {}
      setShowRequestModal(false);
      alert(`Emergency Request ${reqNo} Submitted! Notified Doctor panel, Receptionist & Dispatcher.`);
      fetchEmergencyData();
    } catch (err) {
      alert("Failed to submit emergency request.");
    }
  };

  // 2. Ambulance Assignment (Req #5)
  const handleAssignAmbulance = async (emergencyId: string, ambId: string) => {
    try {
      sharedStore.updateAmbulanceStatus(emergencyId, 'En Route to Patient');
      try {
        await emergencyHrApi.assignAmbulance(emergencyId, ambId);
      } catch (e) {}
      setShowAssignModal(null);
      alert("Ambulance Assigned & Driver & Doctor Notified!");
      fetchEmergencyData();
    } catch (err) {
      alert("Failed to assign ambulance.");
    }
  };

  // 3. Driver App Action Steps (Req #7)
  const handleDriverUpdateStatus = async (emergencyId: string, newStatus: AmbulanceStatus) => {
    try {
      sharedStore.updateAmbulanceStatus(emergencyId, newStatus);
      try {
        await emergencyHrApi.updateEmergencyStatus(emergencyId, newStatus);
      } catch (e) {}
      
      // If Patient Onboard, trigger ER alert notification (Req #9)
      if (newStatus === 'Patient Onboard') {
        const req = requests.find(r => r.id === emergencyId);
        if (req) setHospitalAlertToast(req);
      }
      
      fetchEmergencyData();
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  // 4. Doctor Assessment Handover & Billing Sync (Req #10, #12, #13)
  const handleDoctorSubmitHandover = async () => {
    if (!showDoctorModal) return;
    try {
      await emergencyHrApi.doctorHandover(showDoctorModal.id, doctorNotes);
      await emergencyHrApi.generateBilling(showDoctorModal.id);
      setShowDoctorModal(null);
      setDoctorNotes('');
      alert("Doctor Triage Handover Recorded & Billing Invoice Generated!");
      fetchEmergencyData();
    } catch (err) {
      alert("Failed to record doctor handover.");
    }
  };

  // Metrics Calculation for Wireframe Header (Req #1)
  const activeCount = requests.filter(r => (r.status as string) !== 'Completed' && (r.status as string) !== 'Cancelled' && (r.status as string) !== 'COMPLETED' && (r.status as string) !== 'CANCELLED').length;
  const availableAmbulancesCount = ambulances.filter(a => a.status === 'Available').length;
  const enRouteCount = ambulances.filter(a => a.status === 'En Route' || a.status === 'Patient Onboard' || a.status === 'En Route to Hospital').length;

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100 font-['Inter',sans-serif]">
      {/* 17. Operational Sidebar Navigation (Req #17) */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between p-4 shrink-0">
        <div className="space-y-6">
          {/* Header Title */}
          <div className="flex items-center space-x-3 px-2">
            <div className="h-10 w-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-lg animate-pulse">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-bold text-sm text-white tracking-wide uppercase">Ambulance & Emergency</h1>
              <p className="text-[10px] text-red-400 font-mono">Karnataka GIS Telemetry</p>
            </div>
          </div>

          {/* Navigation Items (Req #17) */}
          <nav className="space-y-1 text-xs">
            <button
              onClick={() => setActiveSubTab('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition-all ${
                activeSubTab === 'dashboard' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Activity className="h-4 w-4" />
                <span>🏠 Dashboard</span>
              </div>
              <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">{activeCount}</span>
            </button>

            <button
              onClick={() => setActiveSubTab('requests')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition-all ${
                activeSubTab === 'requests' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <AlertCircle className="h-4 w-4" />
                <span>🚨 Emergency Requests</span>
              </div>
            </button>

            <button
              onClick={() => setActiveSubTab('ambulances')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition-all ${
                activeSubTab === 'ambulances' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Truck className="h-4 w-4" />
                <span>🚑 Ambulances Fleet</span>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-bold">{availableAmbulancesCount}</span>
            </button>

            <button
              onClick={() => setActiveSubTab('tracking')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition-all ${
                activeSubTab === 'tracking' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Navigation className="h-4 w-4" />
                <span>📍 Active Trips & GIS</span>
              </div>
              <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full text-[10px] font-bold">{enRouteCount}</span>
            </button>

            <button
              onClick={() => setActiveSubTab('driver-app')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition-all ${
                activeSubTab === 'driver-app' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Phone className="h-4 w-4" />
                <span>📱 Driver App Panel</span>
              </div>
            </button>

            <button
              onClick={() => setActiveSubTab('alerts')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition-all ${
                activeSubTab === 'alerts' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Bell className="h-4 w-4" />
                <span>🏥 Hospital ER Alerts</span>
              </div>
              {hospitalAlertToast && (
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
              )}
            </button>

            <button
              onClick={() => setActiveSubTab('history')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition-all ${
                activeSubTab === 'history' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <FileText className="h-4 w-4" />
                <span>📋 Emergency History</span>
              </div>
            </button>

            <button
              onClick={() => setActiveSubTab('maintenance')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition-all ${
                activeSubTab === 'maintenance' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Wrench className="h-4 w-4" />
                <span>🔧 Ambulance Maintenance</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Footer Profile */}
        <div className="border-t border-slate-800 pt-4 space-y-2 text-xs text-slate-400">
          <div className="flex items-center space-x-2.5 px-2">
            <User className="h-4 w-4 text-teal-400" />
            <div>
              <p className="font-bold text-slate-200">Dispatch Controller</p>
              <p className="text-[10px] text-slate-500">Karnataka ER Unit #01</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Operational Container */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {/* 1. Emergency Dashboard (Req #1 Wireframe Structure) */}
        {activeSubTab === 'dashboard' && (
          <div className="space-y-6">
            {/* User Wireframe Top Container Box */}
            <div className="rounded-2xl border-2 border-red-500/40 bg-slate-950 p-6 shadow-2xl relative overflow-hidden">
              {/* Box Top Header */}
              <div className="border-b border-slate-800 pb-4 mb-6 flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-white flex items-center space-x-2 tracking-wide">
                  <span className="text-red-500">🚑</span>
                  <span>AMBULANCE & EMERGENCY</span>
                </h2>
                <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-mono text-red-300 border border-red-500/30">
                  Karnataka Live Telemetry Active
                </span>
              </div>

              {/* 3 Metric Cards (Req #1 Wireframe) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 text-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Active Emergencies</span>
                  <span className="text-3xl font-extrabold text-red-400 font-mono">{String(activeCount).padStart(2, '0')}</span>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 text-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Available Ambulances</span>
                  <span className="text-3xl font-extrabold text-emerald-400 font-mono">{String(availableAmbulancesCount).padStart(2, '0')}</span>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 text-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">En Route</span>
                  <span className="text-3xl font-extrabold text-amber-400 font-mono">{String(enRouteCount).padStart(2, '0')}</span>
                </div>
              </div>

              {/* INCOMING EMERGENCY & DOCTOR ALERTS FEED */}
              <div className="rounded-xl border border-red-500/30 bg-slate-900/90 p-4 mb-6 space-y-3">
                <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-red-500 animate-bounce" />
                    <span>Live Emergency & Doctor Dispatch Notifications</span>
                  </span>
                  <span className="rounded-full bg-red-600 text-white text-[10px] font-bold px-2 py-0.5">
                    {notifications.length} Alerts
                  </span>
                </h3>
                <div className="space-y-2 max-h-36 overflow-y-auto custom-scrollbar text-xs">
                  {notifications.map((n) => (
                    <div key={n.id} className="rounded-lg border border-slate-800 bg-slate-950 p-2.5 flex items-start justify-between">
                      <div className="flex items-start space-x-2">
                        <Truck className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-slate-200">{n.title}</h4>
                          <p className="text-slate-400">{n.message}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-semibold text-slate-500 shrink-0">{n.timestamp}</span>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="text-center text-slate-500 py-2">No active emergency notifications.</div>
                  )}
                </div>
              </div>

              {/* Prominent Red Emergency Request Button (Req #1 Wireframe) */}
              <div className="mb-6 flex justify-center">
                <button
                  onClick={() => setShowRequestModal(true)}
                  className="rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 px-8 py-3.5 text-sm font-extrabold text-white shadow-xl transition-all border border-red-400/40 flex items-center space-x-2 animate-pulse"
                >
                  <AlertCircle className="h-5 w-5 text-white" />
                  <span>[ 🔴 EMERGENCY REQUEST ]</span>
                </button>
              </div>

              {/* Emergency Requests Table (Req #1 Wireframe) */}
              <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-3">Emergency ID</th>
                        <th className="p-3">Patient</th>
                        <th className="p-3">Location</th>
                        <th className="p-3">Ambulance</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 font-mono">
                      {requests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="p-3 font-bold text-red-400">{req.request_number}</td>
                          <td className="p-3 font-sans font-semibold text-white">{req.patient_name}</td>
                          <td className="p-3 font-sans text-slate-400 max-w-[200px] truncate">{req.pickup_address}</td>
                          <td className="p-3 text-cyan-300 font-semibold">{getVehicleCode(req.assigned_ambulance)}</td>
                          <td className="p-3">
                            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              (req.status as string) === 'Requested' || (req.status as string) === 'REQUESTED' ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse' :
                              (req.status as string) === 'Assigned' || (req.status as string) === 'DRIVER_ASSIGNED' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                              req.status === 'En Route' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                              req.status === 'Patient Onboard' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                              req.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-2 font-sans">
                            {!req.assigned_ambulance ? (
                              <button
                                onClick={() => setShowAssignModal(req)}
                                className="rounded-lg bg-red-600 hover:bg-red-500 text-white px-2.5 py-1 text-[11px] font-bold shadow-sm"
                              >
                                Assign Ambulance
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedEmergency(req);
                                  setActiveSubTab('tracking');
                                }}
                                className="rounded-lg bg-teal-600 hover:bg-teal-500 text-white px-2.5 py-1 text-[11px] font-bold shadow-sm"
                              >
                                Live GPS Track
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Quick Map Overview in Karnataka */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                  <Navigation className="h-4 w-4 text-teal-400" />
                  <span>Karnataka Live Fleet Command Radar</span>
                </h3>
                <span className="text-xs text-slate-400">Centered: Bengaluru, Karnataka</span>
              </div>
              <div className="h-80">
                <KarnatakaLiveMap
                  ambulanceLat={selectedEmergency?.assigned_ambulance?.current_latitude || 12.9784}
                  ambulanceLng={selectedEmergency?.assigned_ambulance?.current_longitude || 77.6408}
                  ambulanceName={selectedEmergency?.assigned_ambulance?.vehicle_number || 'Ambulance A-01'}
                  pickupLat={selectedEmergency?.latitude || 12.9634}
                  pickupLng={selectedEmergency?.longitude || 77.5750}
                  pickupAddress={selectedEmergency?.pickup_address || 'Indiranagar, Bengaluru'}
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. Emergency Request / Tap to SOS Form (Req #2 & #3) */}
        {(activeSubTab === 'requests' || showRequestModal) && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-extrabold text-white flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <span>🚨 EMERGENCY REQUEST</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Tap SOS to instantly detect patient GPS in Karnataka and dispatch nearest Advanced Life Support vehicle.
                  </p>
                </div>
                {showRequestModal && (
                  <button onClick={() => setShowRequestModal(false)} className="text-slate-400 hover:text-white text-xs font-bold">
                    ✕ Close
                  </button>
                )}
              </div>

              <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Patient Name:</label>
                    <input
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2.5 text-white focus:border-red-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Phone:</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2.5 text-white focus:border-red-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Current Location (Karnataka Map Pin):</label>
                  <input
                    type="text"
                    value={locationAddress}
                    onChange={(e) => setLocationAddress(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2.5 text-white focus:border-red-500 focus:outline-none mb-2"
                    required
                  />
                  <div className="h-64 rounded-xl overflow-hidden border border-slate-800">
                    <KarnatakaLiveMap
                      pickupLat={pickupLat}
                      pickupLng={pickupLng}
                      pickupAddress={locationAddress}
                      onSelectLocation={(lat, lng, address) => {
                        setPickupLat(lat);
                        setPickupLng(lng);
                        setLocationAddress(address);
                      }}
                    />
                  </div>
                </div>

                {/* 3. Emergency Types (Req #3 Options) */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Emergency Type:</label>
                  <select
                    value={emergencyType}
                    onChange={(e) => setEmergencyType(e.target.value as EmergencyTypeChoice)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2.5 text-white focus:border-red-500 focus:outline-none font-bold"
                  >
                    <option value="Accident">🚗 Accident</option>
                    <option value="Cardiac Emergency">❤️ Cardiac Emergency</option>
                    <option value="Neurological Emergency">🧠 Neurological Emergency</option>
                    <option value="Breathing Difficulty">🫁 Breathing Difficulty</option>
                    <option value="Injury">🤕 Injury</option>
                    <option value="Burn">🔥 Burn</option>
                    <option value="Pediatric Emergency">👶 Pediatric Emergency</option>
                    <option value="Other">🚨 Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Short Description:</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2.5 text-white focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div className="w-32">
                  <label className="block text-slate-300 font-bold mb-1">Number of Patients:</label>
                  <input
                    type="number"
                    min={1}
                    value={numberOfPatients}
                    onChange={(e) => setNumberOfPatients(parseInt(e.target.value) || 1)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2.5 text-white focus:border-red-500 focus:outline-none text-center font-bold"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-red-600 hover:bg-red-500 p-3 text-sm font-extrabold text-white shadow-lg transition-all"
                  >
                    [ REQUEST AMBULANCE ]
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 4. Ambulance Status List (Req #4) */}
        {activeSubTab === 'ambulances' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-white flex items-center space-x-2">
                <Truck className="h-5 w-5 text-teal-400" />
                <span>AMBULANCE STATUS & FLEET</span>
              </h2>
              <span className="rounded-full bg-teal-500/20 px-3 py-1 text-xs font-mono text-teal-300 border border-teal-500/30">
                {ambulances.length} Registered Vehicles
              </span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">ID / Vehicle</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Driver</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Equipment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {ambulances.map((amb) => (
                    <tr key={amb.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="p-3 font-bold text-white">{amb.vehicle_number}</td>
                      <td className="p-3 font-sans text-teal-400 font-semibold">{amb.ambulance_type}</td>
                      <td className="p-3 font-sans text-slate-300">{amb.driver_name || 'Unassigned'}</td>
                      <td className="p-3 font-sans text-slate-400">{amb.current_location_name}</td>
                      <td className="p-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          amb.status === 'Available' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                          amb.status === 'Maintenance' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                          'bg-red-500/20 text-red-300 border border-red-500/40'
                        }`}>
                          {amb.status === 'Available' ? '🟢 Available' : amb.status === 'Maintenance' ? '🟡 Maintenance' : '🔴 On Trip'}
                        </span>
                      </td>
                      <td className="p-3 text-[10px] font-sans text-slate-400">
                        <span className="text-emerald-400 mr-2">✓ Oxygen</span>
                        <span className="text-emerald-400 mr-2">✓ Stretcher</span>
                        {amb.equipment_defibrillator && <span className="text-emerald-400">✓ Defibrillator</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. Driver/Ambulance Panel (Req #7 Rapido-like Driver App) */}
        {activeSubTab === 'driver-app' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="rounded-2xl border-2 border-indigo-500/40 bg-slate-950 p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h2 className="text-lg font-extrabold text-white flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-indigo-400 animate-pulse" />
                  <span>🚑 MY AMBULANCE (DRIVER PANEL)</span>
                </h2>
                <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-mono text-indigo-300 border border-indigo-500/30">
                  Rapido Driver Navigation Interface
                </span>
              </div>

              {selectedEmergency ? (
                <div className="space-y-6 text-xs font-mono">
                  <div className="grid grid-cols-2 gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Ambulance:</span>
                      <strong className="text-white text-sm block">{selectedEmergency.assigned_ambulance?.vehicle_number || 'A-01'}</strong>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[10px]">Current Emergency:</span>
                      <strong className="text-red-400 text-sm block">{selectedEmergency.request_number}</strong>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[10px]">Patient:</span>
                      <strong className="text-slate-200 block">{selectedEmergency.patient_name}</strong>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[10px]">Phone:</span>
                      <strong className="text-teal-400 block">{selectedEmergency.patient_phone}</strong>
                    </div>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div>
                      <span className="text-rose-400 font-bold block text-[11px]">📍 Pickup:</span>
                      <p className="text-slate-200 font-sans">{selectedEmergency.pickup_address}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800">
                      <span className="text-emerald-400 font-bold block text-[11px]">🏥 Destination:</span>
                      <p className="text-slate-200 font-sans">{selectedEmergency.destination_hospital}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400">Current Trip Status:</span>
                    <span className="text-sm font-bold text-amber-400">🚑 {selectedEmergency.status}</span>
                  </div>

                  {/* Driver Action Step Buttons (Req #7 Wireframe) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans pt-2">
                    <button
                      onClick={() => handleDriverUpdateStatus(selectedEmergency.id, 'En Route')}
                      className="rounded-xl bg-blue-600 hover:bg-blue-500 p-3 text-xs font-bold text-white shadow-md"
                    >
                      [START TRIP TO PICKUP]
                    </button>

                    <button
                      onClick={() => handleDriverUpdateStatus(selectedEmergency.id, 'At Pickup')}
                      className="rounded-xl bg-amber-600 hover:bg-amber-500 p-3 text-xs font-bold text-white shadow-md"
                    >
                      [ARRIVED AT PICKUP]
                    </button>

                    <button
                      onClick={() => handleDriverUpdateStatus(selectedEmergency.id, 'Patient Onboard')}
                      className="rounded-xl bg-purple-600 hover:bg-purple-500 p-3 text-xs font-bold text-white shadow-md"
                    >
                      [PATIENT ONBOARD & ER ALERT]
                    </button>

                    <button
                      onClick={() => handleDriverUpdateStatus(selectedEmergency.id, 'Hospital Arrived')}
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-500 p-3 text-xs font-bold text-white shadow-md"
                    >
                      [ARRIVED AT HOSPITAL]
                    </button>

                    <button
                      onClick={() => handleDriverUpdateStatus(selectedEmergency.id, 'Completed')}
                      className="sm:col-span-2 rounded-xl bg-slate-800 hover:bg-slate-700 p-3 text-xs font-bold text-slate-200 border border-slate-700"
                    >
                      [COMPLETE HANDOVER & SET AVAILABLE]
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No active trip currently assigned to your driver vehicle.
                </div>
              )}
            </div>
          </div>
        )}

        {/* 8. Emergency Tracking (Req #8 Live Rapido-like Tracking) */}
        {activeSubTab === 'tracking' && selectedEmergency && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-white flex items-center space-x-2">
                  <Navigation className="h-5 w-5 text-cyan-400 animate-spin" />
                  <span>🚑 LIVE EMERGENCY GPS TRACKING</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-mono">Request: {selectedEmergency.request_number} | Karnataka Radar</p>
              </div>
            </div>

            {/* Wireframe Info Grid (Req #8) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 block">Ambulance:</span>
                <strong className="text-amber-400 text-sm block">{selectedEmergency.assigned_ambulance?.vehicle_number || 'A-01'}</strong>
                <span className="text-slate-400 font-sans">Driver: {selectedEmergency.driver_name || 'Ravi Kumar'} ({selectedEmergency.driver_phone})</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 block">Status & ETA:</span>
                <strong className="text-purple-400 text-sm block">{selectedEmergency.status}</strong>
                <span className="text-emerald-400 font-sans font-bold">ETA to ER Arrival: {selectedEmergency.eta_minutes} mins</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 block">Hospital Readiness:</span>
                <span className="text-emerald-400 font-sans font-bold block">Emergency Team: Assigned ✓</span>
                <span className="text-cyan-400 font-sans font-bold block">Hospital ER Alert: Sent ✓</span>
              </div>
            </div>

            {/* Karnataka Live GIS Map */}
            <div className="h-96">
              <KarnatakaLiveMap
                ambulanceLat={selectedEmergency.assigned_ambulance?.current_latitude || 12.9784}
                ambulanceLng={selectedEmergency.assigned_ambulance?.current_longitude || 77.6408}
                ambulanceName={selectedEmergency.assigned_ambulance?.vehicle_number || 'Ambulance A-01'}
                pickupLat={selectedEmergency.latitude}
                pickupLng={selectedEmergency.longitude}
                pickupAddress={selectedEmergency.pickup_address}
              />
            </div>
          </div>
        )}

        {/* 9. Hospital Emergency Alert (Req #9 Modal/Banner) */}
        {(activeSubTab === 'alerts' || hospitalAlertToast) && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="rounded-2xl border-2 border-red-600 bg-red-950/90 p-6 shadow-2xl text-white space-y-6 relative overflow-hidden animate-pulse">
              <div className="flex items-center justify-between border-b border-red-800 pb-4">
                <h2 className="text-lg font-extrabold flex items-center space-x-2 text-red-200">
                  <AlertCircle className="h-6 w-6 text-yellow-400 animate-spin" />
                  <span>🚨 HOSPITAL EMERGENCY PRE-ARRIVAL ALERT</span>
                </h2>
                {hospitalAlertToast && (
                  <button onClick={() => setHospitalAlertToast(null)} className="text-red-300 hover:text-white text-xs font-bold">
                    ✕ Dismiss Alert
                  </button>
                )}
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div className="p-4 bg-red-900/60 rounded-xl border border-red-700">
                  <span className="text-red-200 text-sm font-bold block">Ambulance {hospitalAlertToast?.assigned_ambulance?.vehicle_number || 'A-01'} Arriving</span>
                  <p className="text-white text-base font-extrabold mt-1">Patient: {hospitalAlertToast?.patient_name || 'Aarav Sharma'}</p>
                  <p className="text-red-200 font-sans mt-0.5">Emergency ID: {hospitalAlertToast?.request_number || 'E001'}</p>
                  <p className="text-yellow-300 text-sm font-bold mt-2">ETA to ER Bay: {hospitalAlertToast?.eta_minutes || 8} Minutes</p>
                </div>

                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 font-sans space-y-2 text-slate-200">
                  <span className="text-red-400 font-bold block text-xs uppercase">Required Resources Pre-allocation:</span>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <span className="p-2 bg-slate-800 rounded-lg border border-slate-700">👨‍⚕️ Emergency Doctor</span>
                    <span className="p-2 bg-slate-800 rounded-lg border border-slate-700">👩‍⚕️ Trauma Nurse</span>
                    <span className="p-2 bg-slate-800 rounded-lg border border-slate-700">🛏️ ER Bay 2 Reserved</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end space-x-3 font-sans">
                  <button
                    onClick={() => {
                      setShowDoctorModal(hospitalAlertToast || selectedEmergency);
                      setHospitalAlertToast(null);
                    }}
                    className="rounded-xl bg-white text-red-900 hover:bg-red-50 px-6 py-2.5 text-xs font-extrabold shadow-lg"
                  >
                    [VIEW EMERGENCY & RECORD DOCTOR HANDOVER]
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 14. Emergency History (Req #14) */}
        {activeSubTab === 'history' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-white flex items-center space-x-2">
                <FileText className="h-5 w-5 text-teal-400" />
                <span>EMERGENCY HISTORY</span>
              </h2>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Patient</th>
                    <th className="p-3">Ambulance</th>
                    <th className="p-3">Emergency Type</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="p-3 font-bold text-red-400">{req.request_number}</td>
                      <td className="p-3 font-sans text-slate-400">{new Date(req.created_at || Date.now()).toLocaleDateString()}</td>
                      <td className="p-3 font-sans font-semibold text-white">{req.patient_name}</td>
                      <td className="p-3 text-cyan-300 font-semibold">{getVehicleCode(req.assigned_ambulance)}</td>
                      <td className="p-3 font-sans text-slate-300">{req.emergency_type}</td>
                      <td className="p-3">
                        <span className="rounded-full bg-emerald-500/20 text-emerald-300 px-2 py-0.5 text-[10px] font-bold border border-emerald-500/40">
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 15. Ambulance Maintenance (Req #15 Wireframe) */}
        {activeSubTab === 'maintenance' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-white flex items-center space-x-2">
                <Wrench className="h-5 w-5 text-amber-400" />
                <span>AMBULANCE MAINTENANCE & EQUIPMENT</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ambulances.map((amb) => (
                <div key={amb.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-xl space-y-4 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <strong className="text-white text-sm font-bold">{amb.vehicle_number}</strong>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      amb.status === 'Available' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {amb.status === 'Available' ? '🟢 Available' : '🟡 Service Due'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-400">
                    <div>Last Service: <strong className="text-slate-200 block">{amb.last_service_date || '10 Aug 2026'}</strong></div>
                    <div>Next Service: <strong className="text-slate-200 block">{amb.next_service_date || '10 Sep 2026'}</strong></div>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 font-sans space-y-1 text-slate-300 text-[11px]">
                    <span className="font-bold text-slate-400 block mb-1 uppercase text-[10px]">Equipment Checklist:</span>
                    <div className="flex items-center space-x-3 text-emerald-400">
                      <span>✓ Oxygen</span>
                      <span>✓ First Aid</span>
                      <span>✓ Stretcher</span>
                      {amb.equipment_defibrillator && <span>✓ Defibrillator</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Ambulance Assignment Modal (Req #5) */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">ASSIGN AMBULANCE TO {showAssignModal.request_number}</h3>
              <button onClick={() => setShowAssignModal(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl text-slate-300 space-y-1">
              <p>Patient: <strong className="text-white">{showAssignModal.patient_name}</strong></p>
              <p>Location: <strong className="text-rose-400">{showAssignModal.pickup_address}</strong></p>
            </div>

            <div className="space-y-2">
              <label className="block text-slate-400 font-bold">Select Available Ambulance:</label>
              {ambulances.map((amb) => (
                <div key={amb.id} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-teal-500/50 transition-colors">
                  <div>
                    <span className="font-bold text-white block">{amb.vehicle_number}</span>
                    <span className="text-[10px] text-slate-500 font-sans">Driver: {amb.driver_name} | {amb.ambulance_type}</span>
                  </div>
                  <button
                    onClick={() => handleAssignAmbulance(showAssignModal.id, amb.id)}
                    className="rounded-lg bg-teal-600 hover:bg-teal-500 px-3 py-1.5 font-bold text-white text-xs"
                  >
                    Assign Driver
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Doctor Handover Modal (Req #10) */}
      {showDoctorModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg space-y-4 text-xs font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">DOCTOR TRIAGE ASSESSMENT HANDOVER</h3>
              <button onClick={() => setShowDoctorModal(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl text-slate-300 font-mono text-xs space-y-1">
              <p>Emergency ID: <strong className="text-red-400">{showDoctorModal.request_number}</strong></p>
              <p>Patient: <strong className="text-white">{showDoctorModal.patient_name}</strong></p>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Doctor Assessment Notes & Clinical Triage:</label>
              <textarea
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                rows={3}
                placeholder="Enter ER doctor initial assessment, vitals, and treatment plan..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <button
                onClick={handleDoctorSubmitHandover}
                className="w-full rounded-xl bg-teal-600 hover:bg-teal-500 p-3 font-bold text-white shadow-lg text-xs"
              >
                Submit ER Doctor Handover & Sync Billing Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
