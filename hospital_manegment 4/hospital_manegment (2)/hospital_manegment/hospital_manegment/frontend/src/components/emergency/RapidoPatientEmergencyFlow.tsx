import React, { useState, useEffect } from 'react';
import { emergencyHrApi, connectEmergencyWebSocket } from '../../services/api';
import { EmergencyRequest, EmergencyTypeChoice, AmbulanceStatus, Hospital } from '../../types';
import { downloadPDFDocument } from '../../utils/pdfDownloader';
import {
  AlertCircle,
  Truck,
  MapPin,
  Clock,
  Phone,
  CheckCircle,
  X,
  Navigation,
  Shield,
  Star,
  RotateCw,
  FileText,
  DollarSign,
  Building2,
  Users,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  Play,
  Check
} from 'lucide-react';

import { KarnatakaLiveMap, KARNATAKA_HOSPITALS } from './KarnatakaLiveMap';

interface RapidoPatientEmergencyFlowProps {
  onBackToDashboard?: () => void;
  initialScreen?: 'BUTTON' | 'CONFIRM_MODAL' | 'LOCATION_FORM' | 'SEARCHING' | 'AMBULANCE_FOUND' | 'LIVE_TRACKING' | 'HISTORY';
  patientName?: string;
  patientPhone?: string;
}

const POPULAR_HOSPITALS = [
  'Smart Care Super Specialty Hospital (Recommended)',
  'Apollo Emergency Care & Heart Institute',
  'Manipal Super Specialty Hospital',
  'Fortis Emergency & Trauma Center',
  'Columbia Asia Emergency Ward'
];

export const RapidoPatientEmergencyFlow: React.FC<RapidoPatientEmergencyFlowProps> = ({
  onBackToDashboard,
  initialScreen = 'BUTTON',
  patientName = 'Aarav Sharma',
  patientPhone = '+91 98765 00001'
}) => {
  // Screen state machine: 'BUTTON' | 'CONFIRM_MODAL' | 'LOCATION_FORM' | 'SEARCHING' | 'AMBULANCE_FOUND' | 'LIVE_TRACKING' | 'HISTORY'
  const [currentScreen, setCurrentScreen] = useState<
    'BUTTON' | 'CONFIRM_MODAL' | 'LOCATION_FORM' | 'SEARCHING' | 'AMBULANCE_FOUND' | 'LIVE_TRACKING' | 'HISTORY'
  >(initialScreen);

  // Sync initialScreen prop changes
  useEffect(() => {
    if (initialScreen && initialScreen !== 'BUTTON') {
      setCurrentScreen(initialScreen);
    }
  }, [initialScreen]);

  // Location detection state
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [pickupAddress, setPickupAddress] = useState('MG Road, Bengaluru');
  const [lat, setLat] = useState(12.9716);
  const [lng, setLng] = useState(77.5946);
  const [selectedHospital, setSelectedHospital] = useState(POPULAR_HOSPITALS[0]);
  const [emergencyType, setEmergencyType] = useState<EmergencyTypeChoice>('Cardiac Emergency');
  const [numberOfPatients, setNumberOfPatients] = useState(1);
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Active Emergency & Tracking State
  const [activeEmergency, setActiveEmergency] = useState<EmergencyRequest | null>(null);
  const [showCallModal, setShowCallModal] = useState(false);
  const [pastTrips, setPastTrips] = useState<EmergencyRequest[]>([]);
  const [allAmbulances, setAllAmbulances] = useState<any[]>([]);
  const [demoStepMsg, setDemoStepMsg] = useState<string>('');

  // Fetch initial active/past requests & subscribe to WebSockets
  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 3000);

    const disconnectWS = connectEmergencyWebSocket((message) => {
      if (['ambulance_assigned', 'status_update', 'location_update'].includes(message.type)) {
        fetchRequests();
      }
    });

    return () => {
      clearInterval(interval);
      disconnectWS();
    };
  }, []);

  const fetchRequests = async () => {
    try {
      const ambRes = await emergencyHrApi.getAmbulances();
      if (ambRes.data) {
        setAllAmbulances(ambRes.data);
      }

      const res = await emergencyHrApi.getEmergencyRequests();
      const list: EmergencyRequest[] = res.data || [];
      setPastTrips(list.filter(r => (r.status as string) === 'COMPLETED' || (r.status as string) === 'Completed' || (r.status as string) === 'PATIENT_HANDOVER'));
      
      const active = list.find(r => (r.status as string) !== 'COMPLETED' && (r.status as string) !== 'Completed' && (r.status as string) !== 'CANCELLED' && (r.status as string) !== 'Cancelled');
      if (active) {
        setActiveEmergency(active);
        if (currentScreen === 'BUTTON' || currentScreen === 'SEARCHING') {
          if (active.status === 'DRIVER_ACCEPTED' || active.status === 'EN_ROUTE_TO_PICKUP' || active.status === 'ARRIVED_AT_PICKUP' || active.status === 'PATIENT_ONBOARD' || active.status === 'EN_ROUTE_TO_HOSPITAL' || active.status === 'ARRIVED_AT_HOSPITAL') {
            setCurrentScreen('LIVE_TRACKING');
          }
        }
      }
    } catch (err) {
      console.error('Error fetching emergency requests:', err);
    }
  };

  // Dynamic Nearby Hospitals & Geocoding State
  const [searchRadius, setSearchRadius] = useState<number>(10);
  const [nearbyHospitals, setNearbyHospitals] = useState<Hospital[]>([]);
  const [isLoadingHospitals, setIsLoadingHospitals] = useState<boolean>(false);
  const [hospitalFetchError, setHospitalFetchError] = useState<string>('');
  const [selectedHospitalObj, setSelectedHospitalObj] = useState<Hospital | null>(null);

  const LOCATION_PRESETS = [
    { label: '📍 Bidadi', address: 'Bidadi Town, Mysore Main Road, Ramanagara', lat: 12.7980, lng: 77.3820 },
    { label: '📍 Kengeri', address: 'Kengeri Satellite Town, Mysore Road, Bengaluru', lat: 12.8990, lng: 77.4820 },
    { label: '📍 RR Nagar', address: 'Rajarajeshwari Nagar (RR Nagar), Bengaluru', lat: 12.9250, lng: 77.5150 },
    { label: '📍 Nayandahalli', address: 'Nayandahalli Junction, Mysore Road, Bengaluru', lat: 12.9550, lng: 77.5350 },
    { label: '📍 Vijayanagar', address: 'Vijayanagar Metro Station, Bengaluru', lat: 12.9680, lng: 77.5380 },
    { label: '📍 MG Road', address: 'MG Road, Richmond Town, Bengaluru', lat: 12.9716, lng: 77.5946 },
    { label: '📍 Koramangala', address: 'Koramangala 5th Block, Bengaluru', lat: 12.9350, lng: 77.6200 },
    { label: '📍 Indiranagar', address: '100ft Road, Indiranagar, Bengaluru', lat: 12.9784, lng: 77.6408 },
  ];

  const [isGeocoding, setIsGeocoding] = useState<boolean>(false);
  const [geocodeError, setGeocodeError] = useState<string>('');

  const [routeGeometry, setRouteGeometry] = useState<[number, number][]>([]);
  const [routeInfo, setRouteInfo] = useState<{ distanceKm: number; durationMins: number } | null>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState<boolean>(false);

  // Fetch nearby hospitals automatically whenever pickup coordinates (lat, lng) or search radius changes
  useEffect(() => {
    if (lat && lng) {
      fetchNearbyHospitalsForCoords(lat, lng, searchRadius);
    }
  }, [lat, lng, searchRadius]);

  const calcHaversineKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(2));
  };

  const fetchNearbyHospitalsForCoords = async (latitude: number, longitude: number, radius: number = 25) => {
    setIsLoadingHospitals(true);
    setHospitalFetchError('');
    let hospitalList: Hospital[] = [];

    try {
      const res = await emergencyHrApi.getNearbyHospitals(latitude, longitude, radius);
      if (res.data?.hospitals && Array.isArray(res.data.hospitals)) {
        hospitalList = res.data.hospitals;
      }
    } catch (err) {
      console.warn("Backend nearby-hospitals endpoint unreachable, calculating client-side fallback:", err);
    }

    // If backend returns empty or fails, compute from local catalog
    if (!hospitalList || hospitalList.length === 0) {
      hospitalList = KARNATAKA_HOSPITALS.map((h: any, idx: number) => {
        const hLat = h.latitude ?? h.lat;
        const hLng = h.longitude ?? h.lng;
        const dist = calcHaversineKm(latitude, longitude, hLat, hLng);
        return {
          id: h.id || `hosp-${idx}`,
          name: h.name,
          address: h.address || 'Karnataka',
          latitude: hLat,
          longitude: hLng,
          phone: h.phone,
          facility_type: h.facility_type || h.type,
          emergency_available: true,
          distance_km: dist
        };
      })
      .filter((h: Hospital) => (h.distance_km || 0) <= radius)
      .sort((a: Hospital, b: Hospital) => (a.distance_km || 0) - (b.distance_km || 0));
    }

    setNearbyHospitals(hospitalList);
    setIsLoadingHospitals(false);

    if (hospitalList.length > 0) {
      const firstHosp = hospitalList[0];
      setSelectedHospitalObj(firstHosp);
      setSelectedHospital(firstHosp.name);
      calculateRoadRoute(latitude, longitude, firstHosp.latitude, firstHosp.longitude);
    } else {
      setSelectedHospitalObj(null);
      setSelectedHospital('');
      setRouteGeometry([]);
      setRouteInfo(null);
    }
  };

  // Address Geocoding using Nominatim with Local Keyword Fallback
  const handleGeocodeAddress = async (addrToGeocode?: string) => {
    const addr = addrToGeocode || pickupAddress;
    if (!addr || addr.trim().length < 2) return;

    setIsGeocoding(true);
    setGeocodeError('');

    const lowerAddr = addr.toLowerCase();
    const matchedPreset = LOCATION_PRESETS.find(p => 
      lowerAddr.includes(p.label.replace('📍 ', '').toLowerCase()) ||
      lowerAddr.includes(p.address.toLowerCase().split(',')[0])
    );

    if (matchedPreset) {
      setLat(matchedPreset.lat);
      setLng(matchedPreset.lng);
      setSearchRadius(10);
      setIsGeocoding(false);
      return;
    }

    try {
      const query = encodeURIComponent(addr.trim());
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) {
        const newLat = parseFloat(data[0].lat);
        const newLng = parseFloat(data[0].lon);
        const formatted = data[0].display_name || addr;
        setLat(newLat);
        setLng(newLng);
        setPickupAddress(formatted);
        setSearchRadius(10);
        setIsGeocoding(false);
      } else {
        setGeocodeError(`Invalid or unknown pickup address: "${addr}". Please enter a valid city, locality, or landmark.`);
        setIsGeocoding(false);
      }
    } catch (err) {
      console.error("Geocoding API error:", err);
      setGeocodeError("Address geocoding service error. Please check your address or pin on map.");
      setIsGeocoding(false);
    }
  };

  // OSRM Real Road Route Calculation
  const calculateRoadRoute = async (pLat: number, pLng: number, dLat: number, dLng: number) => {
    if (!pLat || !pLng || !dLat || !dLng) return;
    setIsCalculatingRoute(true);
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${pLng},${pLat};${dLng},${dLat}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const coords: [number, number][] = route.geometry.coordinates.map((pt: [number, number]) => [pt[1], pt[0]]);
        const distKm = parseFloat((route.distance / 1000).toFixed(1));
        const durationMins = Math.max(1, Math.round(route.duration / 60));

        setRouteGeometry(coords);
        setRouteInfo({ distanceKm: distKm, durationMins: durationMins });
        setIsCalculatingRoute(false);
      } else {
        fallbackStraightRoute(pLat, pLng, dLat, dLng);
      }
    } catch (err) {
      console.warn("OSRM routing error, using fallback straight line route:", err);
      fallbackStraightRoute(pLat, pLng, dLat, dLng);
    }
  };

  const fallbackStraightRoute = (pLat: number, pLng: number, dLat: number, dLng: number) => {
    setRouteGeometry([[pLat, pLng], [dLat, dLng]]);
    const R = 6371;
    const dLatRad = (dLat - pLat) * Math.PI / 180;
    const dLngRad = (dLng - pLng) * Math.PI / 180;
    const a = Math.sin(dLatRad / 2) * Math.sin(dLatRad / 2) +
              Math.cos(pLat * Math.PI / 180) * Math.cos(dLat * Math.PI / 180) *
              Math.sin(dLngRad / 2) * Math.sin(dLngRad / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distKm = parseFloat((R * c * 1.25).toFixed(1));
    const durationMins = Math.max(2, Math.round(distKm * 2.2));
    setRouteInfo({ distanceKm: distKm, durationMins: durationMins });
    setIsCalculatingRoute(false);
  };

  // 1. Location Detection using Geolocation API
  const handleDetectLocation = () => {
    setDetectingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
          setPickupAddress(`GPS Location (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
          setDetectingLocation(false);
        },
        () => {
          setPickupAddress('MG Road, Indiranagar, Bengaluru');
          setDetectingLocation(false);
        },
        { timeout: 5000 }
      );
    } else {
      setPickupAddress('MG Road, Indiranagar, Bengaluru');
      setDetectingLocation(false);
    }
  };

  // 2. Submit Request -> Searching Screen
  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (geocodeError) {
      alert("Please specify a valid pickup address before submitting an ambulance request.");
      return;
    }
    if (!selectedHospitalObj && !selectedHospital) {
      alert("Please select a destination hospital.");
      return;
    }
    setCurrentScreen('SEARCHING');

    try {
      const reqNo = `AMB-${Math.floor(100 + Math.random() * 900)}`;
      const destHospitalStr = selectedHospitalObj ? `${selectedHospitalObj.name} — ${selectedHospitalObj.address}` : selectedHospital;
      const res = await emergencyHrApi.createEmergencyRequest({
        request_number: reqNo,
        patient_name: patientName,
        patient_phone: patientPhone,
        emergency_type: emergencyType,
        short_description: additionalNotes || `${emergencyType} reported at ${pickupAddress}`,
        number_of_patients: numberOfPatients,
        pickup_address: pickupAddress,
        latitude: lat,
        longitude: lng,
        destination_hospital: destHospitalStr,
        distance_km: routeInfo?.distanceKm || 2.1,
        eta_minutes: routeInfo?.durationMins || 6,
        severity: 'Critical',
        status: 'SEARCHING',
      });

      const createdReq: EmergencyRequest = res.data;
      setActiveEmergency(createdReq);

      setTimeout(() => {
        setCurrentScreen('AMBULANCE_FOUND');
      }, 2500);
    } catch (err) {
      alert('Failed to request ambulance. Please try again.');
      setCurrentScreen('LOCATION_FORM');
    }
  };

  // Cancel Request
  const handleCancelRequest = async () => {
    if (!activeEmergency) return;
    if (window.confirm('Are you sure you want to cancel this emergency ambulance request?')) {
      try {
        await emergencyHrApi.updateEmergencyStatus(activeEmergency.id, 'CANCELLED');
        setActiveEmergency(null);
        setCurrentScreen('BUTTON');
        alert('Ambulance request cancelled.');
      } catch (err) {
        alert('Failed to cancel request.');
      }
    }
  };

  // --- DEMO SIMULATION QUICK CONTROL ACTIONS ---
  const handleSimulateStatus = async (statusValue: AmbulanceStatus, message?: string) => {
    if (!activeEmergency) return;
    try {
      await emergencyHrApi.updateEmergencyStatus(activeEmergency.id, statusValue);
      if (statusValue === 'COMPLETED' || statusValue === 'PATIENT_HANDOVER') {
        await emergencyHrApi.generateBilling(activeEmergency.id);
      }
      if (message) {
        setDemoStepMsg(message);
        setTimeout(() => setDemoStepMsg(''), 5000);
      }
      fetchRequests();
    } catch (err) {
      console.error("Simulation error:", err);
    }
  };

  // Helper status color badge
  const getStatusBadge = (status: AmbulanceStatus | string) => {
    switch (status) {
      case 'SEARCHING':
      case 'Requested':
        return <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center gap-1.5"><RotateCw className="h-3.5 w-3.5 animate-spin" /> Searching Nearby</span>;
      case 'DRIVER_ASSIGNED':
      case 'Assigned':
        return <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center gap-1.5"><Truck className="h-3.5 w-3.5" /> Driver Assigned</span>;
      case 'DRIVER_ACCEPTED':
      case 'EN_ROUTE_TO_PICKUP':
      case 'En Route':
        return <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center gap-1.5"><Navigation className="h-3.5 w-3.5 animate-pulse" /> En Route to Pickup</span>;
      case 'ARRIVED_AT_PICKUP':
      case 'At Pickup':
        return <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 font-bold text-xs flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Ambulance Arrived at Pickup</span>;
      case 'PATIENT_ONBOARD':
      case 'Patient Onboard':
        return <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> Patient Onboard</span>;
      case 'EN_ROUTE_TO_HOSPITAL':
      case 'En Route to Hospital':
        return <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 font-bold text-xs flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5 animate-pulse" /> En Route to Hospital</span>;
      case 'ARRIVED_AT_HOSPITAL':
      case 'Hospital Arrived':
        return <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> Arrived at Hospital ER</span>;
      case 'PATIENT_HANDOVER':
      case 'COMPLETED':
      case 'Completed':
        return <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5" /> Handover Complete</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs">{status}</span>;
    }
  };

  // Download PDF Receipt
  const handleDownloadReceipt = async (trip: EmergencyRequest) => {
    await downloadPDFDocument(
      'invoice',
      {
        invoice_number: `INV-AMB-${trip.request_number}`,
        patient_name: trip.patient_name || 'Aarav Sharma',
        patient_id: 'PAT-2026-8942',
        doctor_name: trip.assigned_doctor_name || 'Dr. Mehta',
        department: 'Emergency & Trauma Care',
        diagnosis: `Emergency Response for ${trip.emergency_type}`,
        instructions: `Dispatched ${trip.assigned_ambulance?.vehicle_number || 'A-102'} to ${trip.pickup_address}. Arrived at ${trip.destination_hospital}.`,
        title: `Ambulance Dispatch Receipt (${trip.request_number})`
      },
      `Ambulance_Receipt_${trip.request_number}.pdf`
    );
  };

  return (
    <div className="space-y-6 font-['Inter',sans-serif]">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-slate-900 p-5 text-white shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 shadow-md">
            <Truck className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-white flex items-center gap-2">
              🚑 RAPIDO EMERGENCY AMBULANCE
            </h1>
            <p className="text-xs text-slate-300">
              Instant dispatch • Real-time GPS Telemetry • ER Pre-Arrival Sync
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentScreen('HISTORY')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentScreen === 'HISTORY'
                ? 'bg-red-600 text-white shadow'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Trip History</span>
          </button>
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700"
            >
              Back to Portal
            </button>
          )}
        </div>
      </div>

      {/* SCREEN 1: DASHBOARD EMERGENCY BUTTON */}
      {currentScreen === 'BUTTON' && (
        <div className="space-y-6">
          <div className="rounded-3xl border-2 border-red-200 bg-gradient-to-br from-red-50 via-rose-50 to-orange-50 p-8 shadow-md text-center space-y-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-600 text-white shadow-xl animate-pulse">
              <AlertCircle className="h-10 w-10" />
            </div>

            <div>
              <span className="inline-block rounded-full bg-red-100 px-4 py-1.5 text-xs font-extrabold tracking-wider text-red-700 uppercase mb-2">
                🚨 EMERGENCY AMBULANCE
              </span>
              <h2 className="text-2xl font-black text-slate-900">Need Immediate Emergency Transport?</h2>
              <p className="mx-auto max-w-md text-xs text-slate-600 mt-1">
                Tap below to dispatch an Advanced Life Support (ALS) ambulance to your location with real-time GPS tracking.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setCurrentScreen('CONFIRM_MODAL')}
                className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 text-white font-black text-lg shadow-xl hover:from-red-700 hover:to-rose-800 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 mx-auto"
              >
                <Truck className="h-6 w-6" />
                <span>[ REQUEST AMBULANCE ]</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              ⚠️ Safety First: You will be asked to confirm before an ambulance is dispatched.
            </p>
          </div>

          {/* Active Emergency Request Banner if any */}
          {activeEmergency && (
            <div className="rounded-2xl bg-indigo-900 p-5 text-white shadow-lg flex items-center justify-between">
              <div>
                <span className="text-xs text-indigo-300 font-bold uppercase tracking-wider">Active Trip In Progress</span>
                <h3 className="text-sm font-bold mt-0.5">{activeEmergency.request_number} - {activeEmergency.emergency_type}</h3>
                <div className="mt-2">{getStatusBadge(activeEmergency.status)}</div>
              </div>
              <button
                onClick={() => setCurrentScreen('LIVE_TRACKING')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white shadow transition-all flex items-center gap-2"
              >
                <Navigation className="h-4 w-4" />
                <span>Track Live Ambulance</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* SAFETY CONFIRMATION MODAL */}
      {currentScreen === 'CONFIRM_MODAL' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-5 border border-red-100">
            <div className="flex items-center space-x-3 text-red-600 border-b border-slate-100 pb-4">
              <div className="p-3 bg-red-100 rounded-2xl">
                <AlertTriangle className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Confirm Emergency Dispatch</h3>
                <p className="text-xs text-slate-500">Prevent accidental triggers</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to request an emergency ambulance? This will instantly contact nearest drivers and alert hospital emergency response units.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setCurrentScreen('BUTTON')}
                className="w-full py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
              >
                No, Cancel
              </button>
              <button
                onClick={() => {
                  setCurrentScreen('LOCATION_FORM');
                  handleDetectLocation();
                }}
                className="w-full py-3 rounded-xl bg-red-600 text-xs font-bold text-white shadow-md hover:bg-red-700 transition-all"
              >
                Yes, Proceed 🚑
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 2: LOCATION & EMERGENCY FORM */}
      {currentScreen === 'LOCATION_FORM' && (
        <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                🚑 REQUEST AMBULANCE
              </h2>
              <p className="text-xs text-slate-500">
                Verify pickup location on Karnataka live map ({allAmbulances.length > 0 ? allAmbulances.length : 22} Nearby Ambulances Available)
              </p>
            </div>
            <button
              onClick={() => setCurrentScreen('BUTTON')}
              className="p-2 rounded-xl text-slate-400 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form Column */}
            <div className="lg:col-span-7 space-y-5">
              <form onSubmit={handleRequestSubmit} className="space-y-5 text-xs">
            {/* Quick Location Presets Bar (Bidadi, Kengeri, RR Nagar, etc.) */}
            <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                ⚡ Quick Pickup Location Presets (Auto-Filters Nearest Hospitals within 10 km):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {LOCATION_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPickupAddress(preset.address);
                      setLat(preset.lat);
                      setLng(preset.lng);
                      setSearchRadius(10);
                      if (geocodeError) setGeocodeError('');
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all border ${
                      pickupAddress.includes(preset.label.replace('📍 ', '')) || (Math.abs(lat - preset.lat) < 0.01 && Math.abs(lng - preset.lng) < 0.01)
                        ? 'bg-red-600 text-white border-red-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-red-50 hover:text-red-700 hover:border-red-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Geolocation Pickup Field */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 flex items-center justify-between">
                <span>Pickup Address (Patient Location):</span>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  className="text-red-600 hover:underline flex items-center gap-1 text-[11px] font-bold"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  {detectingLocation ? '📍 Detecting GPS...' : 'Auto-Detect GPS'}
                </button>
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    required
                    value={pickupAddress}
                    onChange={(e) => {
                      setPickupAddress(e.target.value);
                      if (geocodeError) setGeocodeError('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleGeocodeAddress();
                      }
                    }}
                    className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-3 text-slate-900 font-medium focus:border-red-500 focus:outline-none"
                    placeholder="Enter pickup address, city, pincode, or landmark..."
                  />
                  <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-red-500" />
                </div>
                <button
                  type="button"
                  onClick={() => handleGeocodeAddress()}
                  disabled={isGeocoding}
                  className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition-all flex items-center gap-1.5 min-w-[100px] justify-center"
                >
                  {isGeocoding ? <RotateCw className="h-4 w-4 animate-spin" /> : '🔍 Geocode'}
                </button>
              </div>

              {geocodeError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 font-semibold text-xs flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
                  <span>{geocodeError}</span>
                </div>
              )}
            </div>

            {/* Radius Filter Bar */}
            <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-700">Search Radius:</span>
              <div className="flex gap-1.5">
                {[10, 25, 50].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSearchRadius(r)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      searchRadius === r
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {r} km
                  </button>
                ))}
              </div>
            </div>

            {/* Destination Hospital Selection */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 flex items-center justify-between">
                <span>Destination Hospital (Sorted by Nearest Distance):</span>
                {isLoadingHospitals && (
                  <span className="text-[11px] font-semibold text-teal-600 flex items-center gap-1">
                    <RotateCw className="h-3 w-3 animate-spin" /> Finding nearby hospitals...
                  </span>
                )}
              </label>

              {hospitalFetchError ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
                  {hospitalFetchError}
                </div>
              ) : nearbyHospitals.length === 0 && !isLoadingHospitals ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-semibold flex items-center justify-between">
                  <span>No nearby hospitals found within {searchRadius} km.</span>
                  <button
                    type="button"
                    onClick={() => setSearchRadius(50)}
                    className="text-red-600 underline font-bold"
                  >
                    Expand to 50 km
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={selectedHospitalObj?.id || ''}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const foundHosp = nearbyHospitals.find(h => String(h.id) === String(selectedId));
                      if (foundHosp) {
                        setSelectedHospitalObj(foundHosp);
                        setSelectedHospital(foundHosp.name);
                        calculateRoadRoute(lat, lng, foundHosp.latitude, foundHosp.longitude);
                      }
                    }}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 font-bold focus:border-red-500 focus:outline-none appearance-none bg-white pr-10"
                  >
                    {nearbyHospitals.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name} — {h.distance_km} km ({h.address})
                      </option>
                    ))}
                  </select>
                  <Building2 className="absolute right-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              )}
            </div>

            {/* OSRM Real Road Route Summary Card */}
            {routeInfo && selectedHospitalObj && (
              <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl border border-slate-800 space-y-2 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                    <Navigation className="h-3.5 w-3.5" /> Real Road Route Summary
                  </span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">OSRM Road Telemetry</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Road Distance</div>
                    <div className="text-base font-black text-white mt-0.5">{routeInfo.distanceKm} km</div>
                  </div>
                  <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Estimated Travel Time</div>
                    <div className="text-base font-black text-rose-400 mt-0.5">{routeInfo.durationMins} mins</div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-300 font-medium pt-1">
                  Selected Destination: <strong>{selectedHospitalObj.name}</strong> ({selectedHospitalObj.address})
                </div>
              </div>
            )}

            {/* Emergency Type & Patients Count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Emergency Type:</label>
                <select
                  value={emergencyType}
                  onChange={(e) => setEmergencyType(e.target.value as EmergencyTypeChoice)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 font-medium focus:border-red-500 focus:outline-none"
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

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Number of Patients:</label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={numberOfPatients}
                    onChange={(e) => setNumberOfPatients(parseInt(e.target.value) || 1)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 font-medium focus:border-red-500 focus:outline-none"
                  />
                  <Users className="absolute right-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Additional Information (Optional):</label>
              <textarea
                rows={2}
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="E.g., 2nd Floor apartment, landmark near Metro station, patient conscious..."
                className="w-full rounded-xl border border-slate-300 p-3 text-slate-900 focus:border-red-500 focus:outline-none"
              />
            </div>

            {/* Submit Request Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Truck className="h-5 w-5" />
              <span>[ REQUEST AMBULANCE ]</span>
            </button>
          </form>
          </div>

            {/* Live Map Column */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-red-600" />
                  SmartCare Emergency GIS Map
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {allAmbulances.length > 0 ? allAmbulances.length : 22} Ambulances Live
                </span>
              </div>
              <div className="h-[460px] rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                <KarnatakaLiveMap
                  pickupLat={lat}
                  pickupLng={lng}
                  pickupAddress={pickupAddress}
                  hospitals={nearbyHospitals}
                  selectedHospital={selectedHospitalObj}
                  routeGeometry={routeGeometry}
                  availableAmbulances={allAmbulances}
                  onSelectHospital={(h) => {
                    setSelectedHospitalObj(h);
                    setSelectedHospital(h.name);
                    calculateRoadRoute(lat, lng, h.latitude || h.lat, h.longitude || h.lng);
                  }}
                  onSelectLocation={(l, g, addr) => {
                    setLat(l);
                    setLng(g);
                    setPickupAddress(addr);
                    setGeocodeError('');
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 3: SEARCHING AMBULANCE (RAPIDO RADAR PULSE) */}
      {currentScreen === 'SEARCHING' && (
        <div className="rounded-3xl bg-slate-900 p-10 text-center text-white shadow-2xl space-y-6">
          <div className="relative mx-auto flex h-36 w-36 items-center justify-center">
            {/* Animated Radar Pulse Rings */}
            <div className="absolute inset-0 rounded-full border-4 border-red-500/30 animate-ping" />
            <div className="absolute inset-2 rounded-full border-2 border-red-500/50 animate-pulse" />
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-600 shadow-xl text-white">
              <Truck className="h-10 w-10 animate-bounce" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-white flex items-center justify-center gap-2">
              🚑 FINDING NEAREST AMBULANCE...
            </h2>
            <p className="text-xs text-slate-300">
              Searching nearby available Advanced Life Support (ALS) ambulances based on GPS location & ETA...
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-xs font-bold text-red-400 border border-slate-700">
            <RotateCw className="h-4 w-4 animate-spin" />
            <span>Matching Driver & Checking Route Telemetry...</span>
          </div>
        </div>
      )}

      {/* SCREEN 4: AMBULANCE FOUND (RAPIDO CONFIRMED CARD) */}
      {currentScreen === 'AMBULANCE_FOUND' && activeEmergency && (
        <div className="rounded-3xl bg-white border-2 border-emerald-200 p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 font-bold">
                ✓
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">Ambulance Confirmed</span>
                <h2 className="text-lg font-black text-slate-900">🚑 AMBULANCE FOUND</h2>
              </div>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
              Matched in 2.8s
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Vehicle & Driver Details */}
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {activeEmergency.assigned_ambulance?.vehicle_number || 'A-102'}
                  </h3>
                  <p className="text-xs text-slate-500">Advanced Ambulance (ALS ICU Unit)</p>
                </div>
                <span className="rounded-lg bg-red-100 px-2.5 py-1 font-bold text-red-700 text-[11px]">
                  Emergency Mode
                </span>
              </div>

              <div className="flex items-center space-x-3 pt-2 border-t border-slate-200">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-700 text-sm">
                  👨‍✈️
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    Driver: {activeEmergency.driver_name || 'Raj Kumar'}
                  </div>
                  <div className="flex items-center space-x-1 text-amber-500 font-bold">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span>{activeEmergency.driver_rating || 4.8} Rating</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Distance & ETA Telemetry */}
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Distance</div>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">
                    {activeEmergency.distance_km || 2.1} km
                  </div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">ETA</div>
                  <div className="text-base font-extrabold text-red-600 mt-0.5">
                    {activeEmergency.eta_minutes || 6} min
                  </div>
                </div>
              </div>

              <div className="text-slate-600 text-xs">
                <span className="font-bold text-slate-800">Hospital: </span>
                {activeEmergency.destination_hospital || 'Smart Care Hospital'}
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentScreen('LIVE_TRACKING')}
            className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Navigation className="h-5 w-5 text-red-400" />
            <span>[ TRACK AMBULANCE ]</span>
          </button>
        </div>
      )}

      {/* SCREEN 5: RAPIDO-LIKE LIVE TRACKING SCREEN */}
      {currentScreen === 'LIVE_TRACKING' && (
        <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xl space-y-0">
          {/* Top Map Leaflet Visualizer */}
          <div className="h-80 w-full relative">
            <KarnatakaLiveMap
              ambulanceLat={lat + 0.003}
              ambulanceLng={lng + 0.003}
              ambulanceName={activeEmergency?.assigned_ambulance?.vehicle_number || 'A-102'}
              pickupLat={lat}
              pickupLng={lng}
              pickupAddress={pickupAddress}
              availableAmbulances={allAmbulances}
            />
          </div>

          {/* DEMO SIMULATION QUICK ACTION BAR FOR EASY TESTING */}
          <div className="bg-slate-900 p-4 border-t border-slate-800 text-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>DEMO SIMULATION CONTROLS (Test Driver & Hospital Flow Steps)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Rapido Simulation Mode</span>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => handleSimulateStatus('DRIVER_ACCEPTED', 'Driver Accepted Request!')}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white shadow"
              >
                1. Driver Accepts
              </button>
              <button
                onClick={() => handleSimulateStatus('ARRIVED_AT_PICKUP', 'Ambulance Arrived at Pickup!')}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-white shadow"
              >
                2. Arrived at Pickup
              </button>
              <button
                onClick={() => handleSimulateStatus('PATIENT_ONBOARD', 'Patient Onboard Ambulance!')}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white shadow"
              >
                3. Patient Onboard
              </button>
              <button
                onClick={() => handleSimulateStatus('ARRIVED_AT_HOSPITAL', 'Ambulance Arrived at Hospital ER!')}
                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 font-bold text-white shadow"
              >
                4. Arrived at Hospital
              </button>
              <button
                onClick={() => handleSimulateStatus('COMPLETED', 'Handover & Billing Completed!')}
                className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 font-bold text-white shadow"
              >
                5. Complete Handover
              </button>
            </div>

            {demoStepMsg && (
              <div className="p-2 bg-emerald-900/80 rounded-xl text-xs font-bold text-emerald-200 flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400" />
                <span>{demoStepMsg}</span>
              </div>
            )}
          </div>

          {/* Bottom Tracking Card */}
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-base font-extrabold text-slate-900">
                    🚑 {activeEmergency?.assigned_ambulance?.vehicle_number || 'A-102'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">Advanced ALS ICU Unit</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Driver: <span className="font-bold text-slate-900">{activeEmergency?.driver_name || 'Raj Kumar'}</span> • 4.8 ⭐
                </p>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold text-slate-400">ESTIMATED ARRIVAL</div>
                <div className="text-xl font-black text-red-600">
                  Arriving in {activeEmergency?.eta_minutes || 6} mins
                </div>
              </div>
            </div>

            {/* Live Status Bar */}
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Current Ambulance Status</div>
                <div className="mt-1">{getStatusBadge(activeEmergency?.status || 'EN_ROUTE_TO_PICKUP')}</div>
              </div>

              <div className="text-xs text-slate-500 text-right">
                <div>Trip ID: <span className="font-mono font-bold text-slate-800">{activeEmergency?.request_number || 'AMB-101'}</span></div>
                <div>Destination: <span className="font-bold text-slate-800">Smart Care Hospital</span></div>
              </div>
            </div>

            {/* Notification alert message if ambulance arrived at pickup (Req #9) */}
            {(activeEmergency?.status === 'ARRIVED_AT_PICKUP' || activeEmergency?.status === 'At Pickup') && (
              <div className="rounded-2xl bg-purple-100 border border-purple-300 p-4 text-purple-900 font-bold text-xs flex items-center space-x-3 shadow-md animate-bounce">
                <AlertCircle className="h-6 w-6 text-purple-700 flex-shrink-0" />
                <div>
                  🚑 Your ambulance has arrived! Ambulance: {activeEmergency?.assigned_ambulance?.vehicle_number || 'A-102'}, Driver: {activeEmergency?.driver_name || 'Raj Kumar'}. Please proceed to the ambulance.
                </div>
              </div>
            )}

            {/* Notification alert message if patient onboard (Req #10) */}
            {(activeEmergency?.status === 'PATIENT_ONBOARD' || activeEmergency?.status === 'EN_ROUTE_TO_HOSPITAL' || activeEmergency?.status === 'Patient Onboard') && (
              <div className="rounded-2xl bg-emerald-100 border border-emerald-300 p-4 text-emerald-900 font-bold text-xs space-y-1 shadow-md">
                <div className="flex items-center space-x-2 text-emerald-900 font-extrabold text-sm">
                  <span>🟢 Patient Onboard</span>
                </div>
                <div>Destination: <strong>{activeEmergency?.destination_hospital || 'Smart Care Hospital'}</strong></div>
                <div>ETA: <strong>{activeEmergency?.eta_minutes || 12} minutes</strong></div>
              </div>
            )}

            {/* Action Buttons: [ CALL ] & [ CANCEL ] */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowCallModal(true)}
                className="py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Phone className="h-4 w-4" />
                <span>[ CALL DRIVER ]</span>
              </button>

              <button
                onClick={handleCancelRequest}
                className="py-3.5 rounded-2xl border-2 border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                <X className="h-4 w-4" />
                <span>[ CANCEL TRIP ]</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TRIP HISTORY SCREEN */}
      {currentScreen === 'HISTORY' && (
        <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                🚑 AMBULANCE TRIP HISTORY
              </h2>
              <p className="text-xs text-slate-500">View past emergency dispatches, charges, and download PDF receipts</p>
            </div>
            <button
              onClick={() => setCurrentScreen('BUTTON')}
              className="p-2 rounded-xl text-slate-400 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {pastTrips.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <FileText className="h-10 w-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-500">No completed ambulance trips recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pastTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="rounded-2xl border border-slate-200 p-5 space-y-4 hover:shadow-md transition-all bg-slate-50/50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        {trip.request_number}
                      </span>
                      <span className="text-xs font-bold text-slate-700">{trip.emergency_type}</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-extrabold text-emerald-800">
                        ✓ Completed
                      </span>
                      <span className="text-xs font-black text-slate-900">
                        ₹{trip.billing_amount || 850}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px]">PICKUP LOCATION</span>
                      <span className="font-medium text-slate-800">{trip.pickup_address}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px]">DESTINATION HOSPITAL</span>
                      <span className="font-medium text-slate-800">{trip.destination_hospital}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px]">AMBULANCE & DRIVER</span>
                      <span className="font-medium text-slate-800">
                        {trip.assigned_ambulance?.vehicle_number || 'A-102'} ({trip.driver_name || 'Raj Kumar'})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-2">
                    <button
                      onClick={() => handleDownloadReceipt(trip)}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition-all flex items-center gap-1.5"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>[ VIEW RECEIPT ]</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CALL DRIVER SIMULATION MODAL */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 text-white p-6 shadow-2xl text-center space-y-6 border border-slate-700">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl animate-pulse">
              <Phone className="h-9 w-9" />
            </div>

            <div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Calling Ambulance Driver...</div>
              <h3 className="text-xl font-extrabold mt-1">{activeEmergency?.driver_name || 'Raj Kumar'}</h3>
              <p className="text-xs text-emerald-400 font-mono mt-1">+91 98765 11111</p>
            </div>

            <div className="p-3 bg-slate-800 rounded-xl text-xs text-slate-300">
              Ambulance Code: <span className="font-bold text-white">{activeEmergency?.assigned_ambulance?.vehicle_number || 'A-102'}</span>
            </div>

            <button
              onClick={() => setShowCallModal(false)}
              className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-700 font-bold text-xs text-white transition-all"
            >
              End Simulation Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
