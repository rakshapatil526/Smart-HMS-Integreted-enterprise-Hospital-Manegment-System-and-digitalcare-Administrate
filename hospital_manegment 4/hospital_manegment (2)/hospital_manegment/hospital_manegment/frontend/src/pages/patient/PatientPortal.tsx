import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, User, Calendar, HeartPulse, Pill, FlaskConical,
  Image, FileText, Video, Truck, Sparkles, Mic, Bell, Settings,
  LogOut, Clock, CheckCircle2, AlertCircle, Phone, MapPin, Search,
  Download, Eye, Plus, ArrowRight, ShieldCheck, ChevronRight, X, MessageSquare, VideoOff, MicOff, Send
} from 'lucide-react';
import { downloadPDFDocument } from '../../utils/pdfDownloader';
import { KarnatakaLiveMap, KARNATAKA_HOSPITALS } from '../../components/emergency/KarnatakaLiveMap';
import { RapidoPatientEmergencyFlow } from '../../components/emergency/RapidoPatientEmergencyFlow';
import { AIPatientSuggestionCard } from '../../components/ai/AIPatientSuggestionCard';
import { sharedStore } from '../../services/sharedStore';

interface PatientPortalProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const PatientPortal: React.FC<PatientPortalProps> = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const patientName = user?.first_name || 'Patient';

  // --- LOCAL STATES ---
  const [emergencyScreen, setEmergencyScreen] = useState<'BUTTON' | 'CONFIRM_MODAL' | 'LOCATION_FORM'>('BUTTON');
  // Profile edit modal
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: `${user?.first_name || 'Alex'} ${user?.last_name || 'Smith'}`,
    email: user?.email || 'patient@smartcare.com',
    phone: user?.phone || '+1 555-0199',
    dob: '1992-05-14',
    gender: 'Male',
    address: '742 Evergreen Terrace, Springfield',
    bloodGroup: 'O+',
    allergies: 'Penicillin, Dust',
    emergencyContact: 'John Smith (+1 555-0199)'
  });

  // Helper function to handle PDF download
  const handleDownloadPDF = async (title: string) => {
    let docType = 'prescription';
    if (title.toLowerCase().includes('invoice') || title.toLowerCase().includes('receipt') || title.toLowerCase().includes('bill')) {
      docType = 'invoice';
    } else if (title.toLowerCase().includes('lab') || title.toLowerCase().includes('cbc') || title.toLowerCase().includes('blood')) {
      docType = 'lab_report';
    } else if (title.toLowerCase().includes('radiology') || title.toLowerCase().includes('mri') || title.toLowerCase().includes('xray')) {
      docType = 'radiology_report';
    } else if (title.toLowerCase().includes('ehr') || title.toLowerCase().includes('record')) {
      docType = 'ehr_summary';
    }

    await downloadPDFDocument(
      docType,
      {
        prescription_number: 'RX-2026-889',
        invoice_number: 'INV-2026-001',
        request_number: 'REF-2026-901',
        patient_name: profileData.name,
        patient_id: 'PAT-2026-8942',
        doctor_name: 'Dr. Sarah Jenkins',
        department: 'Cardiology & Clinical Operations',
        diagnosis: 'Stable Angina / Clinical Observation',
        instructions: 'Take prescribed medicines after meals. Drink plenty of fluids.',
        title: title
      },
      `${title.replace(/\s+/g, '_')}.pdf`
    );
  };

  // Appointments State
  const [appointments, setAppointments] = useState([
    {
      id: 'APT-101',
      doctor: 'Dr. Sarah Jenkins',
      department: 'Cardiology',
      date: '2026-08-20',
      time: '10:30 AM',
      status: 'Confirmed',
      reason: 'Regular Heart Checkup'
    },
    {
      id: 'APT-100',
      doctor: 'Dr. Michael Chen',
      department: 'General Medicine',
      date: '2026-08-12',
      time: '02:00 PM',
      status: 'Completed',
      reason: 'Fever & General Consultation'
    }
  ]);
  const [showBookAppointmentModal, setShowBookAppointmentModal] = useState(false);
  const [bookForm, setBookForm] = useState({
    department: 'ALL',
    doctor: 'Dr. Narayan Swamy',
    date: new Date().toISOString().split('T')[0],
    time: '10:30 AM',
    reason: ''
  });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [, setBookingRefresh] = useState(0);

  useEffect(() => {
    const handleDoctorAdded = () => setBookingRefresh((prev) => prev + 1);
    window.addEventListener('smartcare_doctor_added', handleDoctorAdded);
    return () => window.removeEventListener('smartcare_doctor_added', handleDoctorAdded);
  }, []);

  // Lab Report Modal state
  const [selectedLabReport, setSelectedLabReport] = useState<any>(null);

  // Radiology Report / DICOM Modal state
  const [selectedRadiologyReport, setSelectedRadiologyReport] = useState<any>(null);

  // Bills & Payment state
  const [pendingBill, setPendingBill] = useState(600);
  const [paidAmount, setPaidAmount] = useState(1000);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Emergency Ambulance Flow State (Req #1 - #17)
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [ambulanceStep, setAmbulanceStep] = useState<'form' | 'searching' | 'found' | 'tracking' | 'history'>('form');
  const [emergencyType, setEmergencyType] = useState('❤️ Cardiac Emergency');
  const [emergencyNotes, setEmergencyNotes] = useState('Severe retrosternal chest pain');
  const [destinationHospital, setDestinationHospital] = useState('Smart Care Super Specialty Hospital');
  const [numberOfPatients, setNumberOfPatients] = useState<number>(1);
  const [pickupLat, setPickupLat] = useState<number>(12.9784);
  const [pickupLng, setPickupLng] = useState<number>(77.6408);
  const [locationAddress, setLocationAddress] = useState('MG Road, Indiranagar, Bengaluru');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [tripStatus, setTripStatus] = useState<string>('EN_ROUTE_TO_PICKUP');
  const [foundAmbulance, setFoundAmbulance] = useState({
    vehicle_number: 'A-102',
    ambulance_type: 'Advanced Ambulance (ALS)',
    driver_name: 'Raj Kumar',
    driver_phone: '+91 9845012341',
    rating: '4.8 ⭐',
    distance: '2.1 km',
    eta: '6 min',
    amount: 850
  });
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [pastTrips, setPastTrips] = useState([
    { id: 'AMB-001', date: '20 Aug 2026', pickup: 'MG Road, Indiranagar', hospital: 'Smart Care Hospital', ambulance: 'A-102', status: '✓ Completed', amount: 850 },
    { id: 'AMB-002', date: '15 Jul 2026', pickup: 'City Road, Koramangala', hospital: 'Victoria Trauma Center', ambulance: 'A-03', status: '✓ Completed', amount: 650 },
  ]);

  const detectUserLocation = () => {
    setIsDetectingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPickupLat(position.coords.latitude);
          setPickupLng(position.coords.longitude);
          setLocationAddress(`GPS Location (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}), Bengaluru`);
          setIsDetectingLocation(false);
        },
        (err) => {
          console.warn("Browser GPS permission error/fallback:", err);
          setPickupLat(12.9784);
          setPickupLng(77.6408);
          setLocationAddress("MG Road, Indiranagar, Bengaluru");
          setIsDetectingLocation(false);
        }
      );
    } else {
      setPickupLat(12.9784);
      setPickupLng(77.6408);
      setLocationAddress("MG Road, Indiranagar, Bengaluru");
      setIsDetectingLocation(false);
    }
  };

  // Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Appointment Confirmed', desc: 'Cardiology with Dr. Sarah Jenkins on Aug 20, 10:30 AM', time: '10 mins ago', type: 'apt' },
    { id: 2, title: 'Lab Report Ready', desc: 'CBC Blood Count report has been finalized by Dr. Miller', time: '2 hours ago', type: 'lab' },
    { id: 3, title: 'Prescription Added', desc: 'Dr. Sarah added Amoxicillin 500mg prescription', time: '1 day ago', type: 'rx' },
    { id: 4, title: 'Payment Confirmed', desc: 'Received ₹1,000 for OPD Invoice #INV001', time: '2 days ago', type: 'bill' }
  ]);

  // Settings State
  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' });
  const [passSuccess, setPassSuccess] = useState('');

  // --- RENDER SECTIONS ---

  // 1. DASHBOARD VIEW
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-200">Patient Care Portal</span>
            <h1 className="text-2xl font-extrabold mt-1">Good Morning, {patientName}! 👋</h1>
            <p className="text-xs text-teal-100 mt-1">
              Patient ID: <strong>PAT-2026-8942</strong> | Blood Group: <strong>{profileData.bloodGroup}</strong>
            </p>
          </div>
          <button
            onClick={() => {
              setEmergencyScreen('CONFIRM_MODAL');
              setActiveTab('ambulance');
            }}
            className="flex items-center justify-center space-x-2 rounded-2xl bg-red-600 hover:bg-red-700 px-6 py-3.5 text-xs font-extrabold text-white shadow-xl shadow-red-500/30 transition-all uppercase tracking-wider animate-pulse border-2 border-white/20"
          >
            <AlertCircle className="h-5 w-5 text-white" />
            <span>🚨 EMERGENCY [ REQUEST AMBULANCE ]</span>
          </button>
        </div>
      </div>

      {/* 4 Quick Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div onClick={() => setActiveTab('appointments')} className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-teal-500 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Upcoming Appointments</span>
            <Calendar className="h-4 w-4 text-teal-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">1</div>
          <div className="text-[10px] text-teal-600 font-semibold mt-0.5">Aug 20 • 10:30 AM</div>
        </div>

        <div onClick={() => setActiveTab('prescriptions')} className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-cyan-500 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Prescriptions</span>
            <Pill className="h-4 w-4 text-cyan-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">2</div>
          <div className="text-[10px] text-cyan-600 font-semibold mt-0.5">2 Active Prescriptions</div>
        </div>

        <div onClick={() => setActiveTab('lab-reports')} className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-emerald-500 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Lab Reports</span>
            <FlaskConical className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">3</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">2 Finalized, 1 Pending</div>
        </div>

        <div onClick={() => setActiveTab('bills')} className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-amber-500 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Bills</span>
            <FileText className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">₹{pendingBill}</div>
          <div className="text-[10px] text-amber-600 font-semibold mt-0.5">OPD & Lab Balance</div>
        </div>
      </div>

      {/* Upcoming Appointment & Recent Activity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Appointment Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-teal-600" />
              <h3 className="font-bold text-sm text-slate-900">Upcoming Appointment</h3>
            </div>
            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold text-teal-700 border border-teal-200">
              Confirmed
            </span>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-2 text-xs">
            <div className="font-bold text-slate-900 text-sm">Dr. Sarah Jenkins</div>
            <div className="text-slate-600 font-medium">Department: Cardiology</div>
            <div className="flex items-center space-x-4 text-slate-500 font-semibold pt-1">
              <span>📅 Tomorrow (Aug 20, 2026)</span>
              <span>⏰ 10:30 AM</span>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setActiveTab('appointments')}
              className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 shadow-sm transition-all"
            >
              View Appointment
            </button>
          </div>
        </div>

        {/* Recent Reports & Activity */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-cyan-600" />
              <h3 className="font-bold text-sm text-slate-900">Recent Reports & Activity</h3>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <div className="font-bold text-slate-800">CBC Blood Report</div>
                <div className="text-[11px] text-slate-500">Available • Finalized Aug 18</div>
              </div>
              <button
                onClick={() => setActiveTab('lab-reports')}
                className="rounded-lg bg-teal-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-teal-700"
              >
                View
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <div className="font-bold text-slate-800">Prescription #P1024</div>
                <div className="text-[11px] text-slate-500">Added by Dr. Sarah • 2 Medicines</div>
              </div>
              <button
                onClick={() => setActiveTab('prescriptions')}
                className="rounded-lg bg-teal-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-teal-700"
              >
                View
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <div className="font-bold text-slate-800">OPD Consultation Payment</div>
                <div className="text-[11px] text-slate-500">Paid ₹1,000 • Invoice #INV001</div>
              </div>
              <button
                onClick={() => setActiveTab('bills')}
                className="rounded-lg bg-teal-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-teal-700"
              >
                View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 2. MY PROFILE VIEW
  const renderProfile = () => (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">MY PROFILE</h2>
        <button
          onClick={() => setShowEditProfileModal(true)}
          className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 shadow-sm transition-all"
        >
          Edit Profile
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <div className="flex items-center space-x-4 border-b pb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-500 text-white font-extrabold text-2xl shadow-md">
            {profileData.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{profileData.name}</h3>
            <p className="text-xs text-slate-500">Patient ID: <strong className="text-slate-800">PAT-2026-8942</strong> (Read-Only)</p>
            <span className="mt-1 inline-block rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold text-teal-700 border border-teal-200">
              Active Patient Account
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Full Name</span>
            <span className="font-bold text-slate-800 text-sm">{profileData.name}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Email Address</span>
            <span className="font-bold text-slate-800 text-sm">{profileData.email}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Phone Number</span>
            <span className="font-bold text-slate-800 text-sm">{profileData.phone}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Date of Birth / Gender</span>
            <span className="font-bold text-slate-800 text-sm">{profileData.dob} • {profileData.gender}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Blood Group</span>
            <span className="font-bold text-rose-600 text-sm">{profileData.bloodGroup}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Known Allergies</span>
            <span className="font-bold text-amber-600 text-sm">{profileData.allergies}</span>
          </div>
          <div className="sm:col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Residential Address</span>
            <span className="font-bold text-slate-800 text-sm">{profileData.address}</span>
          </div>
          <div className="sm:col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Emergency Contact</span>
            <span className="font-bold text-slate-800 text-sm">{profileData.emergencyContact}</span>
          </div>
        </div>
      </div>
    </div>
  );

  // 3. APPOINTMENTS VIEW
  const renderAppointments = () => (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">MY APPOINTMENTS</h2>
        <button
          onClick={() => { setShowBookAppointmentModal(true); setBookingConfirmed(false); }}
          className="flex items-center space-x-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 shadow-sm transition-all uppercase"
        >
          <Plus className="h-4 w-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Upcoming Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Upcoming Appointments</h3>
        {appointments.filter(a => a.status === 'Confirmed').map((apt) => (
          <div key={apt.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 text-base">{apt.doctor}</span>
                <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold text-teal-700 border border-teal-200">
                  {apt.department}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">Reason: {apt.reason}</p>
              <div className="text-xs font-semibold text-slate-500 flex items-center space-x-3 pt-1">
                <span>📅 Date: {apt.date}</span>
                <span>⏰ Time: {apt.time}</span>
                <span className="text-teal-600 font-bold">Status: {apt.status}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => alert(`Appointment Details for ${apt.id}`)} className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200">View</button>
              <button onClick={() => alert("Reschedule request sent to hospital reception.")} className="rounded-xl bg-teal-50 px-3 py-2 text-xs font-bold text-teal-700 hover:bg-teal-100">Reschedule</button>
              <button onClick={() => {
                if (confirm("Are you sure you want to cancel this appointment?")) {
                  setAppointments(appointments.filter(a => a.id !== apt.id));
                }
              }} className="rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100">Cancel</button>
            </div>
          </div>
        ))}
      </div>

      {/* Past Section */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Past Appointments</h3>
        {appointments.filter(a => a.status === 'Completed').map((apt) => (
          <div key={apt.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between opacity-80">
            <div>
              <div className="font-bold text-slate-800 text-sm">{apt.doctor} ({apt.department})</div>
              <div className="text-xs text-slate-500">{apt.date} • Status: <span className="font-bold text-slate-700">{apt.status}</span></div>
            </div>
            <button onClick={() => alert(`Viewing record for past appointment ${apt.id}`)} className="rounded-xl bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-700">View</button>
          </div>
        ))}
      </div>
    </div>
  );

  // 4. MY EHR VIEW
  const renderEHR = () => (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">MY HEALTH RECORD (EHR Timeline)</h2>
          <p className="text-xs text-slate-500">Personal longitudinal medical timeline & verified records</p>
        </div>
        <button onClick={() => handleDownloadPDF('Central_EHR_Record')} className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700">
          Download PDF
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <div className="relative border-l-2 border-teal-500 ml-4 pl-6 space-y-8">
          {/* Timeline Entry 1 */}
          <div className="relative">
            <div className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-teal-600 border-4 border-white shadow"></div>
            <div className="text-xs font-bold text-teal-700 mb-1">20 Aug 2026</div>
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-2 text-xs">
              <div className="font-bold text-slate-900 text-sm">🩺 Doctor Consultation</div>
              <p className="text-slate-600">Consultation with Dr. Sarah Jenkins (Cardiology). Symptoms: Mild chest tightness. Prescribed Amoxicillin & Paracetamol.</p>
              <div className="flex space-x-2 pt-1">
                <button onClick={() => setActiveTab('prescriptions')} className="font-bold text-teal-600 hover:underline">View Prescription</button>
                <span>•</span>
                <button onClick={() => setActiveTab('lab-reports')} className="font-bold text-teal-600 hover:underline">View Ordered Lab Test</button>
              </div>
            </div>
          </div>

          {/* Timeline Entry 2 */}
          <div className="relative">
            <div className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-cyan-600 border-4 border-white shadow"></div>
            <div className="text-xs font-bold text-cyan-700 mb-1">18 Aug 2026</div>
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-2 text-xs">
              <div className="font-bold text-slate-900 text-sm">🧪 Laboratory Diagnostic Report</div>
              <p className="text-slate-600">CBC Complete Blood Count & Fasting Blood Sugar tests completed by LIS Lab Team.</p>
              <button onClick={() => setActiveTab('lab-reports')} className="font-bold text-teal-600 hover:underline">View Full CBC Report</button>
            </div>
          </div>

          {/* Timeline Entry 3 */}
          <div className="relative">
            <div className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-emerald-600 border-4 border-white shadow"></div>
            <div className="text-xs font-bold text-emerald-700 mb-1">15 Aug 2026</div>
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-2 text-xs">
              <div className="font-bold text-slate-900 text-sm">🩻 Radiology Scan (Chest X-Ray)</div>
              <p className="text-slate-600">Chest PA View Radiology Scan verified by Dr. Robert Miller. Clear lung fields.</p>
              <button onClick={() => setActiveTab('radiology-reports')} className="font-bold text-teal-600 hover:underline">View Scan Report</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 5. PRESCRIPTIONS VIEW
  const renderPrescriptions = () => (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">MY PRESCRIPTIONS</h2>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-2">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Prescription #P1024</h3>
            <p className="text-xs text-slate-500">Doctor: <strong>Dr. Sarah Jenkins</strong> | Date: <strong>20 Aug 2026</strong></p>
          </div>
          <button onClick={() => handleDownloadPDF('Prescription_P1024')} className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700">
            Download PDF
          </button>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b bg-slate-50 text-slate-600">
              <th className="p-3 font-semibold">Medicine</th>
              <th className="p-3 font-semibold">Dose</th>
              <th className="p-3 font-semibold">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y text-slate-800">
            <tr>
              <td className="p-3 font-bold">Amoxicillin 500mg</td>
              <td className="p-3 font-medium">1-0-1 (Morning & Night)</td>
              <td className="p-3">5 Days</td>
            </tr>
            <tr>
              <td className="p-3 font-bold">Paracetamol 650mg</td>
              <td className="p-3 font-medium">0-1-0 (Afternoon)</td>
              <td className="p-3">7 Days</td>
            </tr>
          </tbody>
        </table>

        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
          <strong>Doctor Instructions:</strong> Take medications after food. Drink plenty of water and rest well.
        </div>
      </div>
    </div>
  );

  // 6. LAB REPORTS VIEW
  const renderLabReports = () => (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">LAB REPORTS</h2>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b bg-slate-50 text-slate-600">
              <th className="p-3 font-semibold">Test Name</th>
              <th className="p-3 font-semibold">Date</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-slate-800">
            <tr>
              <td className="p-3 font-bold">CBC (Complete Blood Count)</td>
              <td className="p-3">18 Aug 2026</td>
              <td className="p-3"><span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">Completed</span></td>
              <td className="p-3 text-right space-x-2">
                <button onClick={() => setSelectedLabReport({ title: 'CBC Report', date: '18 Aug 2026', wbc: '6.5 x10^3/uL', rbc: '4.8 x10^6/uL', hemoglobin: '14.2 g/dL', platelets: '250 x10^3/uL', remarks: 'Normal CBC counts.' })} className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-bold text-white">View Report</button>
                <button onClick={() => handleDownloadPDF('CBC_Report')} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">Download PDF</button>
              </td>
            </tr>
            <tr>
              <td className="p-3 font-bold">Fasting Blood Sugar</td>
              <td className="p-3">18 Aug 2026</td>
              <td className="p-3"><span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">Completed</span></td>
              <td className="p-3 text-right space-x-2">
                <button onClick={() => setSelectedLabReport({ title: 'Blood Sugar Report', date: '18 Aug 2026', result: '95 mg/dL', ref: '70 - 100 mg/dL', remarks: 'Normal fasting blood glucose.' })} className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-bold text-white">View Report</button>
                <button onClick={() => handleDownloadPDF('Blood_Sugar_Report')} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">Download PDF</button>
              </td>
            </tr>
            <tr>
              <td className="p-3 font-bold">Lipid Profile</td>
              <td className="p-3">19 Aug 2026</td>
              <td className="p-3"><span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">Pending</span></td>
              <td className="p-3 text-right">
                <span className="text-slate-400 italic text-[11px]">Processing in LIS</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Lab Report Details Modal */}
      {selectedLabReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl relative space-y-4">
            <button onClick={() => setSelectedLabReport(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-bold text-base text-slate-900 border-b pb-3">{selectedLabReport.title}</h3>
            <p className="text-xs text-slate-500">Patient: <strong>{profileData.name}</strong> | Date: <strong>{selectedLabReport.date}</strong></p>

            <div className="space-y-2 text-xs">
              {selectedLabReport.wbc && (
                <div className="p-3 rounded-xl bg-slate-50 border space-y-1">
                  <div>WBC: <strong>{selectedLabReport.wbc}</strong> (Ref: 4.0 - 11.0)</div>
                  <div>RBC: <strong>{selectedLabReport.rbc}</strong> (Ref: 4.5 - 5.9)</div>
                  <div>Hemoglobin: <strong>{selectedLabReport.hemoglobin}</strong> (Ref: 13.5 - 17.5)</div>
                  <div>Platelets: <strong>{selectedLabReport.platelets}</strong> (Ref: 150 - 450)</div>
                </div>
              )}
              {selectedLabReport.result && (
                <div className="p-3 rounded-xl bg-slate-50 border space-y-1">
                  <div>Result: <strong>{selectedLabReport.result}</strong></div>
                  <div>Reference Range: <strong>{selectedLabReport.ref}</strong></div>
                </div>
              )}
              <div className="p-3 rounded-xl bg-teal-50 text-teal-800 border border-teal-200">
                <strong>Remarks:</strong> {selectedLabReport.remarks}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button onClick={() => setSelectedLabReport(null)} className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600">Close</button>
              <button onClick={() => handleDownloadPDF(selectedLabReport.title)} className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white">Download PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // 7. RADIOLOGY REPORTS VIEW
  const renderRadiologyReports = () => (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">RADIOLOGY REPORTS</h2>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="font-bold text-slate-900 text-sm">MRI Brain Scan</div>
            <div className="text-xs text-slate-500">Date: 18 Aug 2026 | Status: <span className="font-bold text-emerald-700">Completed</span></div>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => setSelectedRadiologyReport({ title: 'MRI Brain Scan', date: '18 Aug 2026', findings: 'Normal brain parenchyma. No acute ischemic change or hemorrhage detected.', imageType: 'MRI' })} className="rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white">View Report</button>
            <button onClick={() => alert("Opening Radiology DICOM Image Viewer...")} className="rounded-xl bg-teal-50 px-3.5 py-2 text-xs font-bold text-teal-700">View Image</button>
            <button onClick={() => handleDownloadPDF('MRI_Brain_Scan')} className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700">Download PDF</button>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="font-bold text-slate-900 text-sm">Chest X-Ray PA View</div>
            <div className="text-xs text-slate-500">Date: 15 Aug 2026 | Status: <span className="font-bold text-emerald-700">Completed</span></div>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => setSelectedRadiologyReport({ title: 'Chest X-Ray PA View', date: '15 Aug 2026', findings: 'Clear lung fields. Normal cardiac size and contour.', imageType: 'XRAY' })} className="rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white">View Report</button>
            <button onClick={() => alert("Opening Chest X-Ray DICOM Image Viewer...")} className="rounded-xl bg-teal-50 px-3.5 py-2 text-xs font-bold text-teal-700">View Image</button>
            <button onClick={() => handleDownloadPDF('Chest_XRay')} className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700">Download PDF</button>
          </div>
        </div>
      </div>

      {/* Radiology Report Modal */}
      {selectedRadiologyReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl relative space-y-4">
            <button onClick={() => setSelectedRadiologyReport(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-bold text-base text-slate-900 border-b pb-3">{selectedRadiologyReport.title}</h3>
            <div className="p-4 rounded-xl bg-slate-900 text-teal-400 text-center font-bold text-xs py-8">
              📷 [ DICOM Scan Image Viewer Preview Active ]
            </div>
            <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-800 space-y-1">
              <strong>Radiologist Findings:</strong> {selectedRadiologyReport.findings}
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button onClick={() => setSelectedRadiologyReport(null)} className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600">Close</button>
              <button onClick={() => handleDownloadPDF(selectedRadiologyReport.title)} className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white">Download PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // 8. BILLS & PAYMENTS VIEW
  const renderBills = () => (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">MY BILLS & PAYMENTS</h2>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-2">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Invoice #INV001</h3>
            <p className="text-xs text-slate-500">Date: 20 Aug 2026</p>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => handleDownloadPDF('Invoice_INV001')} className="rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700">Download Invoice</button>
            <button onClick={() => handleDownloadPDF('Receipt_INV001')} className="rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700">Download Receipt</button>
            {pendingBill > 0 && (
              <button onClick={() => { setShowPaymentModal(true); setPaymentSuccess(false); }} className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700">
                Pay Pending ₹{pendingBill}
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between p-2.5 rounded-lg bg-slate-50"><span>OPD Consultation Fee</span><span className="font-bold">₹500</span></div>
          <div className="flex justify-between p-2.5 rounded-lg bg-slate-50"><span>Laboratory Diagnostic Fee</span><span className="font-bold">₹800</span></div>
          <div className="flex justify-between p-2.5 rounded-lg bg-slate-50"><span>Pharmacy Medicines</span><span className="font-bold">₹300</span></div>
          <div className="flex justify-between p-3 rounded-xl bg-slate-100 font-bold text-sm text-slate-900"><span>Total Hospital Charges</span><span>₹1,600</span></div>
          <div className="flex justify-between p-2 text-xs text-emerald-700 font-bold"><span>Amount Paid</span><span>₹{paidAmount}</span></div>
          <div className="flex justify-between p-2 text-xs text-amber-700 font-bold"><span>Pending Balance</span><span>₹{pendingBill}</span></div>
        </div>
      </div>

      {/* Online Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl relative space-y-4">
            <button onClick={() => setShowPaymentModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-bold text-base text-slate-900 border-b pb-3">Online Bill Payment</h3>

            {paymentSuccess ? (
              <div className="space-y-4 text-center py-4">
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div className="font-bold text-slate-900 text-sm">Payment Successful!</div>
                <p className="text-xs text-slate-500">₹{pendingBill} paid successfully via UPI Gateway. Receipt issued.</p>
                <button onClick={() => setShowPaymentModal(false)} className="w-full rounded-xl bg-teal-600 py-2 text-xs font-bold text-white uppercase">Close</button>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border font-semibold text-slate-800">
                  Amount to Pay: <strong>₹{pendingBill}</strong>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Select Payment Method</label>
                  <select className="w-full rounded-xl border p-2.5">
                    <option>UPI / Google Pay / PhonePe</option>
                    <option>Credit / Debit Card</option>
                    <option>Net Banking</option>
                  </select>
                </div>
                <button onClick={() => {
                  setPaidAmount(paidAmount + pendingBill);
                  setPendingBill(0);
                  setPaymentSuccess(true);
                }} className="w-full rounded-xl bg-teal-600 py-3 text-xs font-bold text-white uppercase shadow-md shadow-teal-500/20">
                  Confirm Payment ₹{pendingBill}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );



  // 10. EMERGENCY AMBULANCE VIEW (Full Rapido-like Experience)
  const renderAmbulance = () => (
    <RapidoPatientEmergencyFlow
      initialScreen={emergencyScreen}
      patientName={patientName}
      patientPhone={profileData.phone}
      onBackToDashboard={() => {
        setEmergencyScreen('BUTTON');
        setActiveTab('dashboard');
      }}
    />
  );

  // 11. NOTIFICATIONS VIEW
  const renderNotifications = () => (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">NOTIFICATIONS 🔔</h2>
        <button onClick={() => setNotifications([])} className="text-xs font-semibold text-slate-500 hover:text-slate-800">Clear All</button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => {
              if (n.type === 'apt') setActiveTab('appointments');
              else if (n.type === 'lab') setActiveTab('lab-reports');
              else if (n.type === 'rx') setActiveTab('prescriptions');
              else if (n.type === 'bill') setActiveTab('bills');
            }}
            className="cursor-pointer p-3 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-100 transition-all flex items-start justify-between"
          >
            <div className="space-y-0.5">
              <div className="font-bold text-xs text-slate-900">{n.title}</div>
              <div className="text-xs text-slate-600">{n.desc}</div>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold">{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // 12. SETTINGS VIEW
  const renderSettings = () => (
    <div className="max-w-3xl space-y-6">
      <h2 className="text-xl font-bold text-slate-900">SETTINGS ⚙️</h2>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6 text-xs">
        {/* Account Info */}
        <div className="space-y-3 border-b pb-4">
          <h3 className="font-bold text-sm text-slate-900">Account & Privacy</h3>
          <p className="text-slate-500">Logged in as {profileData.email} (Patient Role Access Only)</p>
        </div>

        {/* Change Password */}
        <form onSubmit={(e) => {
          e.preventDefault();
          if (passForm.newPass !== passForm.confirm) {
            alert("New passwords do not match!");
            return;
          }
          setPassSuccess("Password updated successfully!");
          setPassForm({ current: '', newPass: '', confirm: '' });
        }} className="space-y-3 max-w-md">
          <h3 className="font-bold text-sm text-slate-900">Change Password</h3>
          {passSuccess && <div className="p-2.5 rounded-xl bg-teal-50 text-teal-800 font-bold">{passSuccess}</div>}
          <div>
            <label className="block font-semibold mb-1">Current Password</label>
            <input type="password" required value={passForm.current} onChange={(e) => setPassForm({ ...passForm, current: e.target.value })} className="w-full rounded-xl border p-2.5" />
          </div>
          <div>
            <label className="block font-semibold mb-1">New Password</label>
            <input type="password" required value={passForm.newPass} onChange={(e) => setPassForm({ ...passForm, newPass: e.target.value })} className="w-full rounded-xl border p-2.5" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Confirm New Password</label>
            <input type="password" required value={passForm.confirm} onChange={(e) => setPassForm({ ...passForm, confirm: e.target.value })} className="w-full rounded-xl border p-2.5" />
          </div>
          <button type="submit" className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white uppercase">Update Password</button>
        </form>
      </div>
    </div>
  );

  // SWITCH RENDERING BASED ON TAB
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'profile':
        return renderProfile();
      case 'appointments':
        return renderAppointments();
      case 'ehr':
        return renderEHR();
      case 'prescriptions':
        return renderPrescriptions();
      case 'lab-reports':
        return renderLabReports();
      case 'radiology-reports':
        return renderRadiologyReports();
      case 'bills':
        return renderBills();
      case 'ai-suggestions':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 uppercase">HEALTH & CARE SUGGESTIONS</h2>
            <AIPatientSuggestionCard
              patientName={profileData.name}
              bloodGroup={profileData.bloodGroup}
              allergies={profileData.allergies}
              onAskAI={(prompt) => setActiveTab('ai-chatbot')}
            />
          </div>
        );
      case 'ambulance':
        return renderAmbulance();
      case 'notifications':
        return renderNotifications();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  return (
    <div>
      {renderActiveView()}

      {/* Book Appointment Modal */}
      {showBookAppointmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl relative space-y-4 border border-slate-100">
            <button onClick={() => setShowBookAppointmentModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-bold text-base text-slate-900 border-b pb-3">BOOK APPOINTMENT</h3>

            {bookingConfirmed ? (
              <div className="space-y-4 text-center py-4">
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div className="font-bold text-slate-900 text-sm">Appointment Confirmed ✓</div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div>Doctor: <strong>{bookForm.doctor}</strong></div>
                  <div>Department: <strong>{bookForm.department}</strong></div>
                  <div>Date & Time: <strong>{bookForm.date} • {bookForm.time}</strong></div>
                </div>
                <button onClick={() => setShowBookAppointmentModal(false)} className="w-full rounded-xl bg-teal-600 py-2.5 text-xs font-bold text-white uppercase">Close</button>
              </div>
            ) : (
              <form onSubmit={async (e) => {
                e.preventDefault();
                const selectedDocObj = sharedStore.getDoctors().find(d => d.name === bookForm.doctor);
                const targetDept = selectedDocObj ? selectedDocObj.department : (bookForm.department === 'ALL' ? 'Cardiology' : bookForm.department);
                const newApt = await sharedStore.addAppointment({
                  patient_name: profileData.name || patientName || 'Rakshitha',
                  patient_id: 'PAT-2026-8942',
                  doctor_name: bookForm.doctor,
                  department: targetDept,
                  date: bookForm.date,
                  time_slot: bookForm.time,
                  reason: bookForm.reason || 'General Consultation'
                });
                setAppointments([
                  {
                    id: newApt.appointment_number,
                    doctor: newApt.doctor_name,
                    department: newApt.department,
                    date: newApt.date,
                    time: newApt.time_slot,
                    status: newApt.status,
                    reason: bookForm.reason || 'General Consultation'
                  },
                  ...appointments
                ]);
                setBookingConfirmed(true);
              }} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Select Department</label>
                  <select
                    value={bookForm.department}
                    onChange={(e) => {
                      const newDept = e.target.value;
                      const docsInDept = newDept === 'ALL'
                        ? sharedStore.getDoctors()
                        : sharedStore.getDoctors().filter(d => d.department === newDept);
                      setBookForm({
                        ...bookForm,
                        department: newDept,
                        doctor: docsInDept.length > 0 ? docsInDept[0].name : 'Dr. Narayan Swamy'
                      });
                    }}
                    className="w-full rounded-xl border p-2.5 text-xs font-semibold text-slate-900 bg-white"
                  >
                    <option value="ALL">All Departments (Show All {sharedStore.getDoctors().length} Doctors)</option>
                    {Array.from(new Set(sharedStore.getDoctors().map(d => d.department))).map(dept => (
                      <option key={dept} value={dept}>
                        {dept} ({sharedStore.getDoctors().filter(d => d.department === dept).length} Doctors)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">
                    Select Available Doctor ({
                      bookForm.department === 'ALL'
                        ? `All ${sharedStore.getDoctors().length} Doctors`
                        : `${sharedStore.getDoctors().filter(d => d.department === bookForm.department).length} Doctors in ${bookForm.department}`
                    })
                  </label>
                  <select
                    value={bookForm.doctor}
                    onChange={(e) => setBookForm({ ...bookForm, doctor: e.target.value })}
                    className="w-full rounded-xl border p-2.5 text-xs font-semibold text-slate-900 bg-white"
                  >
                    {(bookForm.department === 'ALL'
                      ? sharedStore.getDoctors()
                      : sharedStore.getDoctors().filter(d => d.department === bookForm.department)
                    ).map(d => (
                      <option key={d.id} value={d.name}>
                        {d.name} — {d.department} ({d.specialization} • {d.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Select Date</label>
                  <input
                    type="date"
                    required
                    value={bookForm.date}
                    onChange={(e) => setBookForm({ ...bookForm, date: e.target.value })}
                    className="w-full rounded-xl border p-2.5 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Available Slots</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '02:30 PM'].map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setBookForm({ ...bookForm, time: slot })}
                        className={`p-2 rounded-xl text-[11px] font-bold border ${
                          bookForm.time === slot ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {(slot || '').split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Reason for Visit</label>
                  <input
                    type="text"
                    required
                    value={bookForm.reason}
                    onChange={(e) => setBookForm({ ...bookForm, reason: e.target.value })}
                    placeholder="e.g. Chest pain, Routine Checkup"
                    className="w-full rounded-xl border p-2.5 text-xs text-slate-900"
                  />
                </div>

                <button type="submit" className="w-full rounded-xl bg-teal-600 py-3 text-xs font-bold text-white uppercase shadow-md shadow-teal-500/20 mt-2">
                  CONFIRM APPOINTMENT
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl relative space-y-4 border border-slate-100">
            <button onClick={() => setShowEditProfileModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-bold text-base text-slate-900 border-b pb-3">Edit Personal Profile</h3>

            <form onSubmit={(e) => {
              e.preventDefault();
              setShowEditProfileModal(false);
            }} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Full Name</label>
                <input type="text" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} className="w-full rounded-xl border p-2.5" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Phone Number</label>
                <input type="text" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} className="w-full rounded-xl border p-2.5" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Email Address</label>
                <input type="email" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} className="w-full rounded-xl border p-2.5" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Address</label>
                <input type="text" value={profileData.address} onChange={(e) => setProfileData({ ...profileData, address: e.target.value })} className="w-full rounded-xl border p-2.5" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Emergency Contact</label>
                <input type="text" value={profileData.emergencyContact} onChange={(e) => setProfileData({ ...profileData, emergencyContact: e.target.value })} className="w-full rounded-xl border p-2.5" />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowEditProfileModal(false)} className="rounded-xl bg-slate-100 px-4 py-2 font-bold text-slate-600">Cancel</button>
                <button type="submit" className="rounded-xl bg-teal-600 px-4 py-2 font-bold text-white uppercase">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
