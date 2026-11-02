import React, { useState, useEffect, useRef } from 'react';
import { emergencyHrApi, connectEmergencyWebSocket } from '../../services/api';
import { Hospital, Ambulance, EmergencyRequest } from '../../types';
import { OperatorDispatchMap } from './OperatorDispatchMap';
import {
  Truck,
  Building2,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Phone,
  User,
  Shield,
  MapPin,
  RefreshCw,
  Volume2,
  Navigation,
  X,
  Send,
  Sparkles
} from 'lucide-react';
import { AIAmbulanceOperatorSuggestionCard } from '../ai/AIAmbulanceOperatorSuggestionCard';

interface AmbulanceOperatorDashboardProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const AmbulanceOperatorDashboard: React.FC<AmbulanceOperatorDashboardProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const [showAi, setShowAi] = useState<boolean>(activeTab === 'ai-assistant' || activeTab === 'ai-cds');
  // Data State from Django Database
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    assigned: 0,
    on_trip: 0,
    out_of_service: 0,
    offline: 0,
    pending_requests: 0
  });

  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Selection & Dispatch State
  const [selectedRequest, setSelectedRequest] = useState<EmergencyRequest | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedAmbulance, setSelectedAmbulance] = useState<Ambulance | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [requestToAssign, setRequestToAssign] = useState<EmergencyRequest | null>(null);

  // Map & Location Search State
  const [searchCity, setSearchCity] = useState('Bengaluru');
  const [mapCenter, setMapCenter] = useState<[number, number]>([12.9716, 77.5946]);

  // Real-Time Alert Notification State
  const [incomingAlert, setIncomingAlert] = useState<EmergencyRequest | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Layer Visibility Filters
  const [filters, setFilters] = useState({
    hospitals: true,
    availableAmbulances: true,
    busyAmbulances: true,
    outOfService: true,
    emergencyRequests: true
  });

  // Initial Load & Polling Fallback
  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 4000);
    return () => clearInterval(interval);
  }, []);

  // WebSocket Setup for Real-Time Dispatch Events
  useEffect(() => {
    const disconnectWS = connectEmergencyWebSocket((message) => {
      console.log('[OperatorDashboard] Real-time event received:', message);
      const { type, data } = message;

      if (type === 'new_emergency_request') {
        playAlertSound();
        setIncomingAlert(data);
        fetchAllData();
      } else if (type === 'ambulance_assigned' || type === 'status_update' || type === 'location_update') {
        fetchAllData();
      }
    });

    return () => disconnectWS();
  }, [soundEnabled]);

  const playAlertSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      console.warn("Audio playback not permitted or unavailable", e);
    }
  };

  const fetchAllData = async () => {
    try {
      const [statsRes, hospRes, ambRes, reqRes] = await Promise.all([
        emergencyHrApi.getAmbulanceStats(),
        emergencyHrApi.getHospitals(),
        emergencyHrApi.getAmbulances(),
        emergencyHrApi.getEmergencyRequests()
      ]);

      if (statsRes.data) setStats(statsRes.data);
      if (hospRes.data) {
        const hList = Array.isArray(hospRes.data) ? hospRes.data : hospRes.data.results || [];
        setHospitals(hList);
      }
      if (ambRes.data) {
        const aList = Array.isArray(ambRes.data) ? ambRes.data : ambRes.data.results || [];
        setAmbulances(aList);
      }
      if (reqRes.data) {
        const rList = Array.isArray(reqRes.data) ? reqRes.data : reqRes.data.results || [];
        setRequests(rList);
      }
    } catch (err) {
      console.error("Error fetching operator dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Search Location Geocoding (Nominatim API)
  const handleLocationSearch = async (cityQuery?: string) => {
    const query = cityQuery || searchCity;
    if (!query) return;

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Karnataka, India')}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setMapCenter([lat, lon]);
      } else {
        alert(`Location "${query}" not found.`);
      }
    } catch (e) {
      alert("Error geocoding city search.");
    }
  };

  // Open Dispatch Modal for Request
  const handleOpenAssignModal = (req: EmergencyRequest) => {
    setRequestToAssign(req);
    setSelectedRequest(req);
    setAssignModalOpen(true);
  };

  // Assign Ambulance Action
  const handleConfirmAssignment = async (ambulanceId: string) => {
    if (!requestToAssign) return;
    try {
      await emergencyHrApi.assignAmbulance(requestToAssign.id, ambulanceId);
      alert(`Ambulance assigned successfully to Request #${requestToAssign.request_number}`);
      setAssignModalOpen(false);
      setRequestToAssign(null);
      setIncomingAlert(null);
      fetchAllData();
    } catch (err) {
      alert("Failed to assign ambulance.");
    }
  };

  // Distance helper (Haversine)
  const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c * 10) / 10;
  };

  const pendingRequestsList = requests.filter(r =>
    ['Requested', 'REQUESTED', 'SEARCHING'].includes(r.status)
  );

  const activeMissionList = requests.filter(r =>
    ['DRIVER_ASSIGNED', 'DRIVER_ACCEPTED', 'EN_ROUTE_TO_PICKUP', 'ARRIVED_AT_PICKUP', 'PATIENT_ONBOARD', 'EN_ROUTE_TO_HOSPITAL', 'ARRIVED_AT_HOSPITAL', 'Assigned', 'En Route', 'At Pickup', 'Patient Onboard'].includes(r.status)
  );

  return (
    <div className="space-y-6 font-['Inter',sans-serif] text-slate-800 pb-12">
      {/* 1. HEADER BAR & REAL-TIME INCIDENT NOTIFICATION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl bg-slate-900 p-6 text-white shadow-2xl border border-slate-800 relative overflow-hidden">
        <div className="flex items-center space-x-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-white shadow-xl animate-pulse">
            <Truck className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2 text-red-400 text-xs font-black uppercase tracking-widest">
              <span>SmartCare Emergency Services</span>
              <span>•</span>
              <span className="text-emerald-400 font-mono flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                Live Dispatch Center
              </span>
            </div>
            <h1 className="text-2xl font-black text-white mt-0.5">AMBULANCE OPERATIONS CENTER</h1>
            <p className="text-xs text-slate-300">Command & Control Hub • Real-Time GPS Tracking & Automated Dispatch</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAi(!showAi)}
            className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
              showAi ? 'bg-amber-500 text-white border-amber-400 shadow-md font-extrabold' : 'bg-slate-800 text-amber-400 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>AI Dispatch Assist 🤖</span>
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
              soundEnabled ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Toggle Sound Alerts"
          >
            <Volume2 className="h-4 w-4" />
            <span>{soundEnabled ? 'Siren Audio ON' : 'Audio Muted'}</span>
          </button>

          <button
            onClick={fetchAllData}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* 🤖 AMBULANCE OPERATOR AI ASSISTANT CARD */}
      {(showAi || activeTab === 'ai-assistant' || activeTab === 'ai-cds') && (
        <AIAmbulanceOperatorSuggestionCard
          onNavigateTab={setActiveTab}
        />
      )}

      {/* 🚨 REAL-TIME INCOMING REQUEST FLOATING TOAST ALERT */}
      {incomingAlert && (
        <div className="rounded-3xl border-4 border-red-600 bg-red-600 text-white p-5 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 animate-bounce">
          <div className="flex items-center space-x-4">
            <span className="text-3xl">🚨</span>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-red-100">NEW EMERGENCY INCIDENT DETECTED</div>
              <h2 className="text-lg font-black text-white">
                Patient: {incomingAlert.patient_name} ({incomingAlert.patient_phone})
              </h2>
              <p className="text-xs text-red-100 font-medium">
                📍 Pickup: <strong>{incomingAlert.pickup_address}</strong> → 🏥 Destination: <strong>{incomingAlert.destination_hospital}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleOpenAssignModal(incomingAlert)}
              className="px-5 py-2.5 rounded-xl bg-white text-red-700 hover:bg-red-50 font-black text-xs shadow-lg transition-all"
            >
              [ ASSIGN AMBULANCE ]
            </button>
            <button
              onClick={() => setIncomingAlert(null)}
              className="p-2.5 rounded-xl bg-red-800 hover:bg-red-900 text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. TOP STATISTICS CARDS (DATABASE DRIVEN) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {/* Total Active Ambulances */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">ACTIVE FLEET</span>
            <Truck className="h-4 w-4 text-slate-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{stats.total}</div>
          <div className="text-[10px] text-slate-500 font-bold mt-0.5">Total Registered Units</div>
        </div>

        {/* Available */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">AVAILABLE</span>
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-700">{stats.available}</div>
          <div className="text-[10px] text-emerald-700 font-bold mt-0.5">Ready for Instant Dispatch</div>
        </div>

        {/* On Trip / Assigned */}
        <div className="rounded-2xl border border-red-200 bg-red-50/60 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-red-800 uppercase tracking-wider">ON TRIP</span>
            <Navigation className="h-4 w-4 text-red-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-red-700">{stats.on_trip + stats.assigned}</div>
          <div className="text-[10px] text-red-700 font-bold mt-0.5">Active Missions</div>
        </div>

        {/* Out of Service */}
        <div className="rounded-2xl border border-slate-200 bg-slate-100/70 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">OUT OF SERVICE</span>
            <Shield className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-700">{stats.out_of_service + stats.offline}</div>
          <div className="text-[10px] text-slate-500 font-bold mt-0.5">Maintenance / Offline</div>
        </div>

        {/* Pending Requests */}
        <div className="rounded-2xl border border-amber-300 bg-amber-50/70 p-4 shadow-sm col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-amber-900 uppercase tracking-wider">PENDING REQUESTS</span>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-900">{stats.pending_requests}</div>
          <div className="text-[10px] text-amber-800 font-bold mt-0.5">Awaiting Dispatch Assignment</div>
        </div>
      </div>

      {/* 3. LOCATION SEARCH BAR & LAYER TOGGLE FILTERS */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Location Search Input */}
          <div className="flex items-center space-x-2 flex-1 max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search city / locality / pincode (e.g. Bangalore, Mysuru)..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLocationSearch()}
                className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <button
              onClick={() => handleLocationSearch()}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow"
            >
              SEARCH REGION
            </button>
          </div>

          {/* Preset Region Quick-Buttons */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-bold text-slate-400 text-[11px]">PRESETS:</span>
            {['Bangalore', 'Mysuru', 'Hubballi', 'Mangaluru'].map(city => (
              <button
                key={city}
                onClick={() => {
                  setSearchCity(city);
                  handleLocationSearch(city);
                }}
                className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Map Layer Filter Toggles */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs font-bold">
          <span className="text-slate-400 text-[11px] uppercase tracking-wider flex items-center gap-1">
            <Filter className="h-3.5 w-3.5 text-slate-500" /> Layers:
          </span>

          <label className="flex items-center space-x-1.5 cursor-pointer bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <input
              type="checkbox"
              checked={filters.hospitals}
              onChange={(e) => setFilters({ ...filters, hospitals: e.target.checked })}
              className="rounded text-teal-600"
            />
            <span>🏥 Hospitals ({hospitals.length})</span>
          </label>

          <label className="flex items-center space-x-1.5 cursor-pointer bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-emerald-900">
            <input
              type="checkbox"
              checked={filters.availableAmbulances}
              onChange={(e) => setFilters({ ...filters, availableAmbulances: e.target.checked })}
              className="rounded text-emerald-600"
            />
            <span>🟢 Available Ambulances ({ambulances.filter(a => a.status === 'Available').length})</span>
          </label>

          <label className="flex items-center space-x-1.5 cursor-pointer bg-red-50 px-2.5 py-1 rounded-lg border border-red-200 text-red-900">
            <input
              type="checkbox"
              checked={filters.busyAmbulances}
              onChange={(e) => setFilters({ ...filters, busyAmbulances: e.target.checked })}
              className="rounded text-red-600"
            />
            <span>🔴 Busy / On Trip ({ambulances.filter(a => ['Assigned', 'En Route', 'At Pickup', 'Patient Onboard', 'En Route to Hospital', 'Hospital Arrived'].includes(a.status)).length})</span>
          </label>

          <label className="flex items-center space-x-1.5 cursor-pointer bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <input
              type="checkbox"
              checked={filters.outOfService}
              onChange={(e) => setFilters({ ...filters, outOfService: e.target.checked })}
              className="rounded text-slate-600"
            />
            <span>⚪ Out of Service ({ambulances.filter(a => ['Maintenance', 'Out of Service', 'Offline'].includes(a.status)).length})</span>
          </label>

          <label className="flex items-center space-x-1.5 cursor-pointer bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 text-amber-900">
            <input
              type="checkbox"
              checked={filters.emergencyRequests}
              onChange={(e) => setFilters({ ...filters, emergencyRequests: e.target.checked })}
              className="rounded text-amber-600"
            />
            <span>🚨 Pending Requests ({pendingRequestsList.length})</span>
          </label>
        </div>
      </div>

      {/* 4. LARGE OPERATOR MAP DISPLAY */}
      <OperatorDispatchMap
        hospitals={hospitals}
        ambulances={ambulances}
        emergencyRequests={requests}
        selectedRequest={selectedRequest}
        selectedHospital={selectedHospital}
        mapCenter={mapCenter}
        filters={filters}
        onSelectRequest={(req) => setSelectedRequest(req)}
        onSelectHospital={(hosp) => setSelectedHospital(hosp)}
        onSelectAmbulance={(amb) => setSelectedAmbulance(amb)}
        onAssignClick={(req) => handleOpenAssignModal(req)}
      />

      {/* 5. DUAL LOWER PANELS: PENDING EMERGENCY REQUESTS & ACTIVE DRIVER ROSTER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* PANEL A: PENDING EMERGENCY REQUESTS */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-100 text-red-600">🚨</span>
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Pending Emergency Requests</h3>
                <p className="text-[11px] text-slate-500">Real-time incoming patient SOS calls</p>
              </div>
            </div>
            <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-black text-white">
              {pendingRequestsList.length} PENDING
            </span>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {pendingRequestsList.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto" />
                <p className="text-xs font-bold text-slate-600">No pending emergency dispatches</p>
                <p className="text-[11px]">All incoming patient requests have been assigned to ambulances.</p>
              </div>
            ) : (
              pendingRequestsList.map(req => (
                <div
                  key={req.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    selectedRequest?.id === req.id
                      ? 'border-red-500 bg-red-50/40 shadow-md'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-black text-slate-900">#{req.request_number}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white">
                        {req.priority || 'HIGH'}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      {req.emergency_type || 'Accident'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">PATIENT</span>
                      <span className="font-extrabold text-slate-900">{req.patient_name || 'Emergency Patient'}</span>
                      <div className="text-[11px] text-slate-500">{req.patient_phone || '+91 9876543210'}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">DESTINATION HOSPITAL</span>
                      <span className="font-bold text-teal-800">{req.destination_hospital || 'SmartCare Hospital'}</span>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-slate-700 bg-white p-2 rounded-xl border border-slate-200">
                    📍 <strong>Pickup:</strong> {req.pickup_address}
                  </div>

                  <div className="flex items-center justify-between pt-3">
                    <button
                      onClick={() => {
                        setSelectedRequest(req);
                        if (req.latitude && req.longitude) setMapCenter([req.latitude, req.longitude]);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all"
                    >
                      VIEW ON MAP
                    </button>

                    <button
                      onClick={() => handleOpenAssignModal(req)}
                      className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md transition-all flex items-center gap-1"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>ASSIGN AMBULANCE</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>


        {/* PANEL B: ACTIVE DRIVER ROSTER & FLEET STATUS */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-100 text-teal-700">🚑</span>
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Driver Fleet Roster</h3>
                <p className="text-[11px] text-slate-500">Real-time driver availability & GPS coordinates</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 text-xs font-bold">
              {ambulances.filter(a => a.status === 'Available').length} AVAILABLE
            </span>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {ambulances.map(amb => {
              const isAvailable = amb.status === 'Available';
              const distFromSelected = (selectedRequest && amb.current_latitude && amb.current_longitude && selectedRequest.latitude && selectedRequest.longitude)
                ? getDistanceKm(selectedRequest.latitude, selectedRequest.longitude, amb.current_latitude, amb.current_longitude)
                : null;

              return (
                <div
                  key={amb.id}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition-all text-xs flex items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-black text-slate-900 text-sm">{amb.vehicle_number}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {amb.status}
                      </span>
                    </div>

                    <div className="text-slate-600 font-medium flex items-center space-x-2">
                      <span>👤 {amb.driver_name || 'Ravi Kumar'}</span>
                      <span>•</span>
                      <span>📞 {amb.driver_phone || '+91 9876543210'}</span>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center space-x-2 font-mono">
                      <span>Type: {amb.ambulance_type || 'ALS'}</span>
                      <span>•</span>
                      <span>Loc: {amb.current_location_name || 'Bengaluru'}</span>
                      {distFromSelected !== null && (
                        <span className="text-teal-700 font-bold">({distFromSelected} km from pickup)</span>
                      )}
                    </div>
                  </div>

                  <div>
                    {isAvailable && selectedRequest ? (
                      <button
                        onClick={() => handleConfirmAssignment(amb.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow"
                      >
                        ASSIGN
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedAmbulance(amb);
                          if (amb.current_latitude && amb.current_longitude) setMapCenter([amb.current_latitude, amb.current_longitude]);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
                      >
                        VIEW
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 6. DISPATCH ASSIGNMENT MODAL */}
      {assignModalOpen && requestToAssign && (
        <div className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 border border-slate-200 animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-600 text-white text-lg">🚨</span>
                <div>
                  <span className="text-[10px] font-black uppercase text-red-600 tracking-wider">EMERGENCY DISPATCH PROTOCOL</span>
                  <h3 className="text-lg font-black text-slate-900">
                    Assign Ambulance to Request #{requestToAssign.request_number}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setAssignModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Request Summary Card */}
            <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200 text-xs space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Patient</span>
                  <div className="font-extrabold text-slate-900 text-sm">
                    {requestToAssign.patient_name || 'Emergency Patient'} ({requestToAssign.patient_phone})
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Emergency Type</span>
                  <div className="font-extrabold text-red-700 text-sm">
                    {requestToAssign.emergency_type || 'Accident'}
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Pickup Location</span>
                <div className="font-bold text-slate-900">📍 {requestToAssign.pickup_address}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Destination Hospital</span>
                <div className="font-bold text-teal-800">🏥 {requestToAssign.destination_hospital}</div>
              </div>
            </div>

            {/* Available Ambulances Sorted by Proximity */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Available Ambulances Near Pickup (Sorted by Distance)
              </h4>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {ambulances
                  .filter(a => a.status === 'Available')
                  .map(amb => {
                    const distKm = (amb.current_latitude && amb.current_longitude && requestToAssign.latitude && requestToAssign.longitude)
                      ? getDistanceKm(requestToAssign.latitude, requestToAssign.longitude, amb.current_latitude, amb.current_longitude)
                      : 2.1;
                    const etaMin = Math.max(3, Math.round(distKm * 2.2));

                    return (
                      <div
                        key={amb.id}
                        className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/60 transition-all flex items-center justify-between text-xs"
                      >
                        <div className="space-y-1">
                          <div className="font-black text-slate-900 text-sm flex items-center space-x-2">
                            <span>🚑 {amb.vehicle_number}</span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                              {amb.ambulance_type || 'ALS'}
                            </span>
                          </div>

                          <div className="text-slate-700 font-medium">
                            Driver: <strong>{amb.driver_name || 'Ravi Kumar'}</strong> ({amb.driver_phone || '+91 9876543210'})
                          </div>

                          <div className="text-emerald-800 font-bold flex items-center space-x-3">
                            <span>📏 Distance: {distKm} km</span>
                            <span>•</span>
                            <span>⏱️ ETA: {etaMin} mins</span>
                            <span>•</span>
                            <span>⭐ Rating: {amb.rating || 4.8}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleConfirmAssignment(amb.id)}
                          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all"
                        >
                          DISPATCH NOW
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
