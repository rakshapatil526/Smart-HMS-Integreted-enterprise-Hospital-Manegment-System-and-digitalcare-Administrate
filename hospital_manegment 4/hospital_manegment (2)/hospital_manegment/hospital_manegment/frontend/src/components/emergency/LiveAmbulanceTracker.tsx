import React, { useState, useEffect } from 'react';
import { emergencyHrApi } from '../../services/api';
import { Ambulance, EmergencyRequest } from '../../types';
import { Truck, Navigation, AlertCircle, CheckCircle, MapPin, Phone, Clock } from 'lucide-react';

export const LiveAmbulanceTracker: React.FC = () => {
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [selectedAmbulance, setSelectedAmbulance] = useState<Ambulance | null>(null);
  const [loading, setLoading] = useState(true);

  const [sosAddress, setSosAddress] = useState('742 Evergreen Terrace, Sector 4, Tech District');
  const [sosSeverity, setSosSeverity] = useState<'Critical' | 'Moderate' | 'Minor'>('Critical');
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ambRes, reqRes] = await Promise.all([
        emergencyHrApi.getAmbulances(),
        emergencyHrApi.getEmergencyRequests()
      ]);
      setAmbulances(ambRes.data);
      setRequests(reqRes.data);
      if (ambRes.data.length > 0) {
        setSelectedAmbulance(ambRes.data[0]);
      }
    } catch (err) {
      console.error("Failed to load emergency fleet data:", err);
    }
    setLoading(false);
  };

  const handleTriggerSOS = async () => {
    try {
      await emergencyHrApi.createEmergencyRequest({
        pickup_address: sosAddress,
        latitude: 28.6139,
        longitude: 77.2090,
        severity: sosSeverity,
        eta_minutes: 8
      });
      setRequestSent(true);
      fetchData();
    } catch (err) {
      alert("Failed to send SOS request.");
    }
  };

  return (
    <div id="emergency" className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 p-6 text-white shadow-lg">
        <div>
          <div className="flex items-center space-x-2 text-red-100 text-xs font-bold uppercase tracking-wider mb-1">
            <AlertCircle className="h-4 w-4 text-amber-300" />
            <span>24/7 Smart Care Emergency Dispatch System</span>
          </div>
          <h2 className="text-xl font-bold">Ambulance GPS Location & Dispatch Center</h2>
          <p className="text-xs text-red-100 mt-1 max-w-xl">
            Live GPS monitoring of Advanced Life Support (ALS) ambulances, emergency SOS request dispatch, driver navigation sync, and immediate Hospital ER pre-arrival notification.
          </p>
        </div>

        {/* Instant SOS Button */}
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          {requestSent ? (
            <div className="flex items-center space-x-2 rounded-xl bg-white/20 px-4 py-3 text-xs font-bold text-white border border-white/30 backdrop-blur-md">
              <CheckCircle className="h-5 w-5 text-emerald-300 animate-bounce" />
              <span>AMBULANCE DISPATCHED! ETA: 8 MINS</span>
            </div>
          ) : (
            <button
              onClick={handleTriggerSOS}
              className="flex items-center space-x-2 rounded-xl bg-white px-5 py-3 text-xs font-bold text-red-700 hover:bg-red-50 shadow-md transition-all animate-pulse"
            >
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span>REQUEST EMERGENCY AMBULANCE NOW</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-[#0] gap-6 lg:grid-cols-3">
        {/* Fleet List */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
              <Truck className="h-4 w-4 text-teal-600" />
              <span>Ambulance Fleet Status</span>
            </h3>
            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-bold text-teal-700">
              {ambulances.length} Active Vehicles
            </span>
          </div>

          {loading ? (
            <div className="text-center py-6 text-xs text-slate-400">Loading fleet telemetry...</div>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-y-auto custom-scrollbar">
              {ambulances.map((amb) => (
                <div
                  key={amb.id}
                  onClick={() => setSelectedAmbulance(amb)}
                  className={`cursor-pointer rounded-xl p-3 border transition-all ${
                    selectedAmbulance?.id === amb.id
                      ? 'border-teal-500 bg-teal-50/50 shadow-sm'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{amb.vehicle_number}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      amb.status === 'Available' ? 'bg-emerald-100 text-emerald-800' :
                      amb.status === 'Dispatched' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {amb.status}
                    </span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500 space-y-1">
                    <div>Model: <strong className="text-slate-700">{amb.vehicle_model}</strong></div>
                    <div>Equipment: <strong className="text-teal-700">{amb.equipment_level}</strong></div>
                    <div>Driver: <strong className="text-slate-700">{amb.driver_name || 'Assigned Driver'}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live GIS Map Visualizer Simulator */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-slate-900 p-5 shadow-sm text-white flex flex-col justify-between relative overflow-hidden min-h-[420px]">
          {/* Radar background graphic */}
          <div className="absolute inset-0 bg-[radial-gradient(#0f766e_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>

          <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Navigation className="h-5 w-5 text-cyan-400 animate-spin" />
              <div>
                <h3 className="text-sm font-bold text-slate-100">Live GPS Location Radar</h3>
                <p className="text-[10px] text-slate-400">Tracking Vehicle: {selectedAmbulance?.vehicle_number || 'AMB-2026-01'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center space-x-1 text-emerald-400 font-mono">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>GPS Live Telemetry Sync</span>
              </span>
            </div>
          </div>

          {/* Simulated Map Markers */}
          <div className="relative z-10 my-auto grid grid-cols-2 gap-4 py-8">
            <div className="rounded-xl border border-slate-800 bg-slate-800/80 p-4 backdrop-blur-md">
              <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold mb-2">
                <MapPin className="h-4 w-4" />
                <span>Vehicle Location</span>
              </div>
              <div className="text-xs space-y-1 font-mono text-slate-300">
                <div>LAT: {selectedAmbulance?.current_latitude || 28.6139}</div>
                <div>LONG: {selectedAmbulance?.current_longitude || 77.2090}</div>
                <div className="text-emerald-400 font-sans font-semibold mt-2">Speed: 48 km/h (En Route)</div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-800/80 p-4 backdrop-blur-md">
              <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold mb-2">
                <Clock className="h-4 w-4" />
                <span>Hospital ER Alert Status</span>
              </div>
              <div className="text-xs space-y-1 text-slate-300">
                <div>Destination: Smart Care Main ER</div>
                <div>ETA to ER Arrival: <strong className="text-amber-400 text-sm">8 Minutes</strong></div>
                <div className="text-cyan-300 text-[11px] mt-2">Trauma Bay 2 Reserved & Prepared</div>
              </div>
            </div>
          </div>

          {/* Footer Callout */}
          <div className="relative z-10 flex items-center justify-between rounded-xl bg-slate-800/90 px-4 py-3 border border-slate-700 text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-teal-400" />
              <span>Driver Helpline Hotline: <strong>+1-800-AMBULANCE-01</strong></span>
            </div>
            <span className="text-slate-400">Encrypted Satellite Channel</span>
          </div>
        </div>
      </div>
    </div>
  );
};
