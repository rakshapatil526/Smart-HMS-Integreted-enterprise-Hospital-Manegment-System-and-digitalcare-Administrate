import React, { useState } from 'react';
import {
  initialIPDPatients,
  initialIPDBeds,
  initialIPDTimelineEvents,
  initialIPDDoctorNotes,
  initialIPDNursingRecords,
  initialIPDTransfers,
  IPDPatient,
  IPDBed,
  IPDDailyTimelineEvent,
  IPDDoctorNote,
  IPDNursingRecord,
  IPDTransferRecord,
  IPDDischargeRecord
} from './ipdData';
import {
  LayoutDashboard, Users, Bed, Plus, RefreshCw, ClipboardList,
  Stethoscope, FileText, FlaskConical, Image as ImageIcon, Pill,
  LogOut, Bell, Search, CheckCircle2, AlertTriangle, ShieldCheck,
  Download, Clock, ArrowRight, Activity, X, Eye, ChevronRight
} from 'lucide-react';
import { downloadPDFDocument } from '../../utils/pdfDownloader';

interface IPDManagementProps {
  onNavigateTab?: (tab: string, extraData?: any) => void;
}

export const IPDManagement: React.FC<IPDManagementProps> = ({ onNavigateTab }) => {
  // Navigation & View state
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedWardFilter, setSelectedWardFilter] = useState<string>('ALL');

  // Main Data States
  const [patients, setPatients] = useState<IPDPatient[]>(initialIPDPatients);
  const [beds, setBeds] = useState<IPDBed[]>(initialIPDBeds);
  const [timelineEvents, setTimelineEvents] = useState<IPDDailyTimelineEvent[]>(initialIPDTimelineEvents);
  const [doctorNotes, setDoctorNotes] = useState<IPDDoctorNote[]>(initialIPDDoctorNotes);
  const [nursingRecords, setNursingRecords] = useState<IPDNursingRecord[]>(initialIPDNursingRecords);
  const [transfers, setTransfers] = useState<IPDTransferRecord[]>(initialIPDTransfers);

  // Active Patient Profile Modal State
  const [selectedPatient, setSelectedPatient] = useState<IPDPatient | null>(null);
  const [profileSubTab, setProfileSubTab] = useState<string>('overview');

  // Admission Form State
  const [admPatientId, setAdmPatientId] = useState('SC-P006');
  const [admPatientName, setAdmPatientName] = useState('Vikram Malhotra');
  const [admAge, setAdmAge] = useState(48);
  const [admGender, setAdmGender] = useState('Male');
  const [admDoctor, setAdmDoctor] = useState('Dr. Arjun Mehta');
  const [admDepartment, setAdmDepartment] = useState('Cardiology');
  const [admType, setAdmType] = useState<'Emergency' | 'Elective' | 'OPD Transfer'>('Emergency');
  const [admWard, setAdmWard] = useState('Cardiology Ward');
  const [admBed, setAdmBed] = useState('C-103');
  const [admReason, setAdmReason] = useState('Unstable Angina / Continuous Cardiac Telemetry Monitoring');

  // Transfer Form State
  const [transferPatientId, setTransferPatientId] = useState('SC-P001');
  const [transferTargetWard, setTransferTargetWard] = useState('ICU (Intensive Care)');
  const [transferTargetBed, setTransferTargetBed] = useState('I-03');
  const [transferReason, setTransferReason] = useState('Requires intensive monitoring and hemodynamic support');

  // Doctor Note Form State
  const [notePatientId, setNotePatientId] = useState('SC-P001');
  const [noteType, setNoteType] = useState<'Progress Note' | 'Treatment Instruction' | 'Diagnosis Update' | 'Discharge Plan'>('Progress Note');
  const [noteContent, setNoteContent] = useState('');

  // Nurse Vitals Form State
  const [vitalsPatientId, setVitalsPatientId] = useState('SC-P001');
  const [vitalsBp, setVitalsBp] = useState('120/80');
  const [vitalsPulse, setVitalsPulse] = useState('76');
  const [vitalsTemp, setVitalsTemp] = useState('98.6°F');
  const [vitalsSpo2, setVitalsSpo2] = useState('99%');
  const [vitalsNotes, setVitalsNotes] = useState('Patient comfortable, vitals stable.');

  // Discharge Form State
  const [dcPatientId, setDcPatientId] = useState('SC-P001');
  const [dcDiagnosis, setDcDiagnosis] = useState('Acute Coronary Syndrome (Resolved)');
  const [dcSummary, setDcSummary] = useState('Admitted via emergency. Treated with anti-ischemic medications. Cardiac MRI normal.');
  const [dcInstructions, setDcInstructions] = useState('1. Continue oral Beta-blocker.\n2. Rest for 1 week.\n3. Follow up in Cardiology OPD.');
  const [dcFollowupDate, setDcFollowupDate] = useState('25 Aug 2026');

  // Derived Stats
  const totalAdmitted = patients.filter(p => p.status !== 'Discharged').length;
  const occupiedBedsCount = beds.filter(b => b.is_occupied).length;
  const availableBedsCount = beds.filter(b => !b.is_occupied).length;

  // Filtered Patients
  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.patient_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.ward.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWard = selectedWardFilter === 'ALL' || p.ward === selectedWardFilter;
    return matchesSearch && matchesWard;
  });

  // Handle Admission Submission
  const handleConfirmAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `ipd-${Date.now()}`;
    const newAdmId = `IPD-2026-00${patients.length + 1}`;
    
    const newPatient: IPDPatient = {
      id: newId,
      admission_id: newAdmId,
      patient_id: admPatientId,
      name: admPatientName,
      age: admAge,
      gender: admGender,
      doctor_name: admDoctor,
      department: admDepartment,
      admission_date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      admission_type: admType,
      ward: admWard,
      bed_number: admBed,
      reason: admReason,
      status: 'Stable',
    };

    setPatients(prev => [newPatient, ...prev]);

    // Mark bed as occupied
    setBeds(prev => prev.map(b => b.bed_number === admBed ? { ...b, is_occupied: true, status: 'Occupied', patient_name: admPatientName, patient_id: admPatientId } : b));

    // Append event to timeline
    const newEv: IPDDailyTimelineEvent = {
      id: `ev-${Date.now()}`,
      patient_id: admPatientId,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event_type: 'Admission',
      description: `Admitted to ${admWard} Bed ${admBed} under ${admDoctor}. Reason: ${admReason}`,
      author: 'IPD Reception / Admissions Desk',
    };
    setTimelineEvents(prev => [newEv, ...prev]);

    alert(`Patient ${admPatientName} successfully admitted to ${admWard} (${admBed})!\n- Admission ID: ${newAdmId}\n- Bed updated to OCCUPIED.`);
    setActiveTab('admitted');
  };

  // Handle Transfer Submission
  const handleConfirmTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const targetPatient = patients.find(p => p.patient_id === transferPatientId);
    if (!targetPatient) {
      alert('Selected patient not found.');
      return;
    }

    const fromWard = targetPatient.ward;
    const fromBed = targetPatient.bed_number;

    // Update patient ward and bed
    setPatients(prev => prev.map(p => p.patient_id === transferPatientId ? { ...p, ward: transferTargetWard, bed_number: transferTargetBed } : p));

    // Update old bed to available, new bed to occupied
    setBeds(prev => prev.map(b => {
      if (b.bed_number === fromBed) return { ...b, is_occupied: false, status: 'Available', patient_name: undefined, patient_id: undefined };
      if (b.bed_number === transferTargetBed) return { ...b, is_occupied: true, status: 'Occupied', patient_name: targetPatient.name, patient_id: targetPatient.patient_id };
      return b;
    }));

    // Record transfer log
    const newTransfer: IPDTransferRecord = {
      id: `tr-${Date.now()}`,
      patient_id: targetPatient.patient_id,
      patient_name: targetPatient.name,
      from_ward: fromWard,
      from_bed: fromBed,
      to_ward: transferTargetWard,
      to_bed: transferTargetBed,
      transfer_date: `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      reason: transferReason,
      approved_by: targetPatient.doctor_name,
    };
    setTransfers(prev => [newTransfer, ...prev]);

    // Timeline event
    const newEv: IPDDailyTimelineEvent = {
      id: `ev-${Date.now()}`,
      patient_id: targetPatient.patient_id,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event_type: 'Transfer',
      description: `Transferred from ${fromWard} (${fromBed}) ➔ ${transferTargetWard} (${transferTargetBed}). Reason: ${transferReason}`,
      author: targetPatient.doctor_name,
    };
    setTimelineEvents(prev => [newEv, ...prev]);

    alert(`Transfer approved for ${targetPatient.name}:\n${fromWard} (${fromBed}) ➔ ${transferTargetWard} (${transferTargetBed})\nBed availability updated automatically.`);
    setActiveTab('admitted');
  };

  // Handle Add Doctor Note
  const handleAddDoctorNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    const target = patients.find(p => p.patient_id === notePatientId);
    const newNote: IPDDoctorNote = {
      id: `dn-${Date.now()}`,
      patient_id: notePatientId,
      patient_name: target?.name || 'Patient',
      date: `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      doctor_name: target?.doctor_name || 'Dr. Arjun Mehta',
      note_type: noteType,
      content: noteContent,
    };
    setDoctorNotes(prev => [newNote, ...prev]);

    // Add event
    const newEv: IPDDailyTimelineEvent = {
      id: `ev-${Date.now()}`,
      patient_id: notePatientId,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event_type: 'Doctor Assessment',
      description: `Doctor Note (${noteType}): ${noteContent}`,
      author: target?.doctor_name || 'Attending Doctor',
    };
    setTimelineEvents(prev => [newEv, ...prev]);

    setNoteContent('');
    alert('Doctor progress note saved to IPD record & EHR.');
  };

  // Handle Add Nurse Vitals Record
  const handleAddNurseRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const target = patients.find(p => p.patient_id === vitalsPatientId);
    const newRecord: IPDNursingRecord = {
      id: `nr-${Date.now()}`,
      patient_id: vitalsPatientId,
      patient_name: target?.name || 'Patient',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      nurse_name: 'Nurse Sarah Jenkins',
      bp: vitalsBp,
      pulse: vitalsPulse,
      temp: vitalsTemp,
      spo2: vitalsSpo2,
      notes: vitalsNotes,
      medications_status: [
        { name: 'IV Antibiotic / Saline', time: '10:00 AM', given: true },
        { name: 'Oral Cardiac Medication', time: '02:00 PM', given: true },
      ],
    };
    setNursingRecords(prev => [newRecord, ...prev]);

    // Add event
    const newEv: IPDDailyTimelineEvent = {
      id: `ev-${Date.now()}`,
      patient_id: vitalsPatientId,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event_type: 'Nursing Vitals',
      description: `Vitals Logged: BP ${vitalsBp}, Pulse ${vitalsPulse}, Temp ${vitalsTemp}, SpO2 ${vitalsSpo2}. Note: ${vitalsNotes}`,
      author: 'Nurse Sarah Jenkins',
    };
    setTimelineEvents(prev => [newEv, ...prev]);

    alert('Nursing vitals & medication record saved to IPD timeline.');
  };

  // Handle Discharge PDF Generation
  const handleGenerateDischargePDF = async (patientObj?: IPDPatient) => {
    const target = patientObj || patients.find(p => p.patient_id === dcPatientId) || patients[0];
    await downloadPDFDocument(
      'discharge_summary',
      {
        admission_id: target.admission_id || 'IPD-2026-001',
        patient_name: target.name,
        patient_id: target.patient_id,
        doctor_name: target.doctor_name,
        department: target.department,
        ward: target.ward,
        bed_number: target.bed_number,
        admission_date: target.admission_date,
        discharge_date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        diagnosis: dcDiagnosis || target.diagnosis || 'Acute Coronary Syndrome',
        treatment_summary: dcSummary || 'Patient treated with standard clinical protocol. Vitals stable.',
        instructions: dcInstructions || 'Follow up in 7 days.',
        followup_date: dcFollowupDate || '25 Aug 2026',
      },
      `Discharge_Summary_${target.name.replace(/\s+/g, '_')}.pdf`
    );
  };

  // Handle Confirm Discharge
  const handleConfirmDischarge = (e: React.FormEvent) => {
    e.preventDefault();
    const target = patients.find(p => p.patient_id === dcPatientId);
    if (!target) return;

    // Update patient status to Discharged
    setPatients(prev => prev.map(p => p.patient_id === dcPatientId ? { ...p, status: 'Discharged' } : p));

    // Release bed
    setBeds(prev => prev.map(b => b.bed_number === target.bed_number ? { ...b, is_occupied: false, status: 'Available', patient_name: undefined, patient_id: undefined } : b));

    // Add event
    const newEv: IPDDailyTimelineEvent = {
      id: `ev-${Date.now()}`,
      patient_id: target.patient_id,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event_type: 'Admission',
      description: `Patient officially discharged. Bed ${target.bed_number} released. Final charges transmitted to Billing Module.`,
      author: 'Attending Physician & Discharge Desk',
    };
    setTimelineEvents(prev => [newEv, ...prev]);

    alert(`Patient ${target.name} discharged successfully!\n- Bed ${target.bed_number} released to VACANT.\n- Discharge summary PDF generated.\n- Sent final stay charges to Billing Module.`);
    setActiveTab('dashboard');
  };

  return (
    <div className="space-y-6 font-['Inter',sans-serif]">
      {/* Module Title Header & Navigation Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md">
              <Bed className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">🏥 IPD INPATIENT MANAGEMENT</h1>
              <p className="text-xs text-slate-500">
                Complete admitted hospital stay management: Admissions, Bed Matrix, Care, Transfers, & Discharge
              </p>
            </div>
          </div>
        </div>

        {/* Quick Summary Pill Stats */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-slate-900 text-white px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 shadow-sm">
            <Users className="h-4 w-4 text-teal-400" />
            <span>Admitted: <strong>{totalAdmitted}</strong></span>
          </div>
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Available Beds: <strong>{availableBedsCount}</strong></span>
          </div>
          <div className="bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span>Occupied Beds: <strong>{occupiedBedsCount}</strong></span>
          </div>
        </div>
      </div>

      {/* Focused IPD Navigation Toolbar (Section 17 Requirements) */}
      <div className="flex items-center space-x-1 border-b border-slate-200 overflow-x-auto pb-2 custom-scrollbar text-xs font-semibold text-slate-600">
        {[
          { id: 'dashboard', label: '🏠 Dashboard' },
          { id: 'admitted', label: '👥 Admitted Patients' },
          { id: 'beds', label: '🛏️ Bed Management' },
          { id: 'admissions', label: '➕ Admissions' },
          { id: 'transfer', label: '🔄 Patient Transfer' },
          { id: 'daily-care', label: '📋 Daily Patient Care' },
          { id: 'doctor-notes', label: '👨‍⚕️ Doctor Notes' },
          { id: 'nursing-info', label: '👩‍⚕️ Nursing Info' },
          { id: 'lab-reports', label: '🧪 Lab Reports' },
          { id: 'radiology-reports', label: '🩻 Radiology' },
          { id: 'medication', label: '💊 Medication' },
          { id: 'discharge', label: '📄 Discharge' },
          { id: 'notifications', label: '🔔 Notifications' },
        ].map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-teal-600 text-white shadow-sm font-bold'
                  : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* 1. IPD DASHBOARD VIEW */}
      {/* ============================================================ */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* IPD Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Admitted Patients</span>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">{totalAdmitted}</div>
                <span className="text-[11px] text-teal-600 font-semibold">Active in Inpatient Wards</span>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 border border-teal-100">
                <Users className="h-6 w-6" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Beds</span>
                <div className="text-3xl font-extrabold text-emerald-600 mt-1">{availableBedsCount}</div>
                <span className="text-[11px] text-emerald-700 font-semibold">Ready for New Admission</span>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Occupied Beds</span>
                <div className="text-3xl font-extrabold text-amber-600 mt-1">{occupiedBedsCount}</div>
                <span className="text-[11px] text-amber-700 font-semibold">Current Bed Occupancy Rate: {Math.round((occupiedBedsCount / beds.length) * 100)}%</span>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
                <Bed className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search Patient Name / Patient ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-2 text-xs w-full sm:w-auto justify-end">
              <span className="text-slate-500 font-medium">Filter Ward:</span>
              <select
                value={selectedWardFilter}
                onChange={(e) => setSelectedWardFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
              >
                <option value="ALL">All Wards</option>
                <option value="Cardiology Ward">Cardiology Ward</option>
                <option value="ICU (Intensive Care)">ICU (Intensive Care)</option>
                <option value="General Medical Ward">General Medical Ward</option>
                <option value="VIP Executive Suite">VIP Executive Suite</option>
                <option value="Surgical Recovery Ward">Surgical Recovery Ward</option>
              </select>
            </div>
          </div>

          {/* Main IPD Patient Dashboard Table (Section 2 Layout Requirement) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Bed className="h-4 w-4 text-teal-600" />
                <span>ACTIVE ADMITTED INPATIENTS DIRECTORY</span>
              </h3>
              <button
                onClick={() => setActiveTab('admissions')}
                className="flex items-center space-x-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 text-xs font-bold transition-all shadow-sm"
              >
                <Plus className="h-4 w-4" />
                <span>New IPD Admission</span>
              </button>
            </div>

            <div className="overflow-x-auto custom-scrollbar border border-slate-100 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] border-b border-slate-200">
                    <th className="p-3">Patient</th>
                    <th className="p-3">Patient ID</th>
                    <th className="p-3">Ward</th>
                    <th className="p-3">Bed</th>
                    <th className="p-3">Attending Doctor</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {filteredPatients.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-400 italic">
                        No admitted IPD patients match the current query.
                      </td>
                    </tr>
                  ) : (
                    filteredPatients.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-bold text-slate-900 flex items-center space-x-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-100 text-teal-800 text-[10px] font-extrabold">
                            {p.name.charAt(0)}
                          </div>
                          <span>{p.name} ({p.age} yrs, {p.gender})</span>
                        </td>
                        <td className="p-3 font-mono font-bold text-teal-700">{p.patient_id}</td>
                        <td className="p-3 text-slate-700">{p.ward}</td>
                        <td className="p-3 font-bold text-slate-900">{p.bed_number}</td>
                        <td className="p-3 text-slate-700">{p.doctor_name}</td>
                        <td className="p-3">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                              p.status === 'Critical'
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : p.status === 'Recovering'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => { setSelectedPatient(p); setProfileSubTab('overview'); }}
                            className="rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 text-xs font-bold transition-all border border-slate-200 flex items-center space-x-1 ml-auto"
                          >
                            <Eye className="h-3.5 w-3.5 text-slate-600" />
                            <span>[ Open ]</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. ADMITTED PATIENTS LIST VIEW */}
      {/* ============================================================ */}
      {activeTab === 'admitted' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">👥 ADMITTED PATIENTS DIRECTORY</h2>
              <p className="text-xs text-slate-500">Detailed list of all patients currently occupying inpatient beds across all wards</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patients.map(p => (
              <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3 hover:border-teal-500/50 transition-all">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white font-bold text-xs">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{p.name}</h4>
                      <span className="text-[10px] text-slate-500 font-mono">{p.patient_id} • {p.age} yrs</span>
                    </div>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                    p.status === 'Critical' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {p.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div><strong>Ward:</strong> {p.ward}</div>
                  <div><strong>Bed:</strong> <span className="font-bold text-slate-900 font-mono">{p.bed_number}</span></div>
                  <div><strong>Doctor:</strong> {p.doctor_name} ({p.department})</div>
                  <div><strong>Admission:</strong> {p.admission_date} ({p.admission_type})</div>
                  <div className="text-[11px] text-slate-500 italic truncate"><strong>Reason:</strong> {p.reason}</div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => { setSelectedPatient(p); setProfileSubTab('overview'); }}
                    className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white py-2 text-xs font-bold transition-all text-center"
                  >
                    View IPD Dossier & Records ➔
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. BED MANAGEMENT & MATRIX (Section 4 Layout Requirement) */}
      {/* ============================================================ */}
      {activeTab === 'beds' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Bed className="h-5 w-5 text-teal-600" />
                  <span>REAL-TIME BED OCCUPANCY & WARD ALLOCATION MATRIX</span>
                </h2>
                <p className="text-xs text-slate-500">Live ward bed states: Occupied 🔴, Available 🟢, Maintenance 🟡</p>
              </div>
              <div className="flex items-center space-x-3 text-xs font-semibold">
                <span className="flex items-center space-x-1"><span className="h-3 w-3 rounded-full bg-red-500"></span><span>Occupied ({occupiedBedsCount})</span></span>
                <span className="flex items-center space-x-1"><span className="h-3 w-3 rounded-full bg-emerald-500"></span><span>Available ({availableBedsCount})</span></span>
              </div>
            </div>

            {/* Ward Groups Grid */}
            {['Cardiology Ward', 'ICU (Intensive Care)', 'General Medical Ward', 'VIP Executive Suite', 'Surgical Recovery Ward'].map(wardName => {
              const wardBeds = beds.filter(b => b.ward_name === wardName);
              return (
                <div key={wardName} className="space-y-2 border border-slate-100 p-4 rounded-2xl bg-slate-50/50">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                    <span>🏥 {wardName.toUpperCase()}</span>
                    <span className="text-[11px] text-slate-500 font-normal">
                      {wardBeds.filter(b => !b.is_occupied).length} / {wardBeds.length} Available
                    </span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-1">
                    {wardBeds.map(b => (
                      <div
                        key={b.id}
                        className={`rounded-2xl p-3.5 border text-xs text-center transition-all ${
                          b.is_occupied
                            ? 'border-red-300 bg-red-50 text-red-950 shadow-sm'
                            : 'border-emerald-300 bg-emerald-50 text-emerald-950 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span>{b.bed_number}</span>
                          <span>{b.is_occupied ? '🔴' : '🟢'}</span>
                        </div>
                        <div className="mt-1 font-extrabold text-sm tracking-tight">{b.bed_number}</div>
                        <div className="mt-1 font-bold text-[10px] uppercase">
                          {b.is_occupied ? `Occupied (${b.patient_name})` : 'Available'}
                        </div>

                        {!b.is_occupied && (
                          <button
                            onClick={() => { setAdmBed(b.bed_number); setAdmWard(b.ward_name); setActiveTab('admissions'); }}
                            className="mt-2 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-1 text-[10px] font-bold shadow-xs transition-all"
                          >
                            + Allocate
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. ADMISSIONS WORKFLOW FORM (Section 3 Layout Requirement) */}
      {/* ============================================================ */}
      {activeTab === 'admissions' && (
        <div className="max-w-3xl mx-auto rounded-3xl border border-slate-200 bg-white p-8 shadow-md space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <Plus className="h-6 w-6 text-teal-600" />
              <span>IPD ADMISSION REGISTRATION & BED ALLOCATION</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Doctor admission recommendation ➔ Register patient ➔ Assign ward &amp; bed ➔ Patient admitted
            </p>
          </div>

          <form onSubmit={handleConfirmAdmission} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Patient ID</label>
                <input
                  type="text"
                  required
                  value={admPatientId}
                  onChange={(e) => setAdmPatientId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-bold font-mono text-slate-900 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Patient Full Name</label>
                <input
                  type="text"
                  required
                  value={admPatientName}
                  onChange={(e) => setAdmPatientName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-bold text-slate-900 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Age & Gender</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={admAge}
                    onChange={(e) => setAdmAge(Number(e.target.value))}
                    className="w-1/2 rounded-xl border border-slate-200 p-2.5 text-slate-900 focus:outline-none"
                  />
                  <select
                    value={admGender}
                    onChange={(e) => setAdmGender(e.target.value)}
                    className="w-1/2 rounded-xl border border-slate-200 p-2.5 text-slate-900 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Admission Type</label>
                <select
                  value={admType}
                  onChange={(e) => setAdmType(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-bold text-teal-800 focus:outline-none"
                >
                  <option value="Emergency">Emergency</option>
                  <option value="Elective">Elective</option>
                  <option value="OPD Transfer">OPD Transfer</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Attending Doctor</label>
                <input
                  type="text"
                  required
                  value={admDoctor}
                  onChange={(e) => setAdmDoctor(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-semibold text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={admDepartment}
                  onChange={(e) => setAdmDepartment(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Ward</label>
                <select
                  value={admWard}
                  onChange={(e) => setAdmWard(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-bold text-slate-900 focus:outline-none"
                >
                  <option value="Cardiology Ward">Cardiology Ward</option>
                  <option value="ICU (Intensive Care)">ICU (Intensive Care)</option>
                  <option value="General Medical Ward">General Medical Ward</option>
                  <option value="VIP Executive Suite">VIP Executive Suite</option>
                  <option value="Surgical Recovery Ward">Surgical Recovery Ward</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Available Bed</label>
                <select
                  value={admBed}
                  onChange={(e) => setAdmBed(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-bold text-emerald-700 focus:outline-none"
                >
                  {beds.filter(b => !b.is_occupied && (selectedWardFilter === 'ALL' || b.ward_name === admWard)).map(b => (
                    <option key={b.id} value={b.bed_number}>
                      🟢 {b.bed_number} ({b.ward_name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Reason for Admission</label>
              <textarea
                rows={2}
                required
                value={admReason}
                onChange={(e) => setAdmReason(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-slate-900 focus:outline-none"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-3 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-teal-500/20 transition-all"
              >
                [ CONFIRM ADMISSION & ALLOCATE BED ]
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. PATIENT TRANSFER VIEW (Section 11 Requirement) */}
      {/* ============================================================ */}
      {activeTab === 'transfer' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6 max-w-4xl mx-auto">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <RefreshCw className="h-5 w-5 text-teal-600" />
                <span>PATIENT WARD & BED TRANSFER WORKFLOW</span>
              </h2>
              <p className="text-xs text-slate-500">Request & approve room transfer. Auto-updates bed states and logs transfer history.</p>
            </div>

            <form onSubmit={handleConfirmTransfer} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Admitted Patient</label>
                <select
                  value={transferPatientId}
                  onChange={(e) => setTransferPatientId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-bold text-slate-900 focus:outline-none"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.patient_id}>
                      {p.name} ({p.patient_id}) — Currently in {p.ward} [{p.bed_number}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Transfer To Target Ward</label>
                <select
                  value={transferTargetWard}
                  onChange={(e) => setTransferTargetWard(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-bold text-slate-900 focus:outline-none"
                >
                  <option value="ICU (Intensive Care)">ICU (Intensive Care)</option>
                  <option value="Cardiology Ward">Cardiology Ward</option>
                  <option value="General Medical Ward">General Medical Ward</option>
                  <option value="VIP Executive Suite">VIP Executive Suite</option>
                  <option value="Surgical Recovery Ward">Surgical Recovery Ward</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Target Available Bed</label>
                <select
                  value={transferTargetBed}
                  onChange={(e) => setTransferTargetBed(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-bold text-emerald-700 focus:outline-none"
                >
                  {beds.filter(b => !b.is_occupied).map(b => (
                    <option key={b.id} value={b.bed_number}>
                      🟢 {b.bed_number} ({b.ward_name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Transfer</label>
                <input
                  type="text"
                  required
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-slate-900 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 pt-2 flex justify-end">
                <button
                  type="submit"
                  className="rounded-2xl bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 font-bold text-xs shadow-md transition-all uppercase"
                >
                  [ APPROVE TRANSFER & REASSIGN BED ]
                </button>
              </div>
            </form>

            {/* Transfer History Table */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="text-xs font-bold uppercase text-slate-700">📜 Transfer History Log</h3>
              <div className="overflow-x-auto custom-scrollbar border border-slate-100 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px]">
                    <tr>
                      <th className="p-3">Patient</th>
                      <th className="p-3">From Ward/Bed</th>
                      <th className="p-3">To Ward/Bed</th>
                      <th className="p-3">Transfer Date</th>
                      <th className="p-3">Reason</th>
                      <th className="p-3">Approved By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {transfers.map(tr => (
                      <tr key={tr.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{tr.patient_name}</td>
                        <td className="p-3 text-red-700 font-bold">{tr.from_ward} ({tr.from_bed})</td>
                        <td className="p-3 text-emerald-700 font-bold">{tr.to_ward} ({tr.to_bed})</td>
                        <td className="p-3 text-slate-500">{tr.transfer_date}</td>
                        <td className="p-3 text-slate-700 italic">{tr.reason}</td>
                        <td className="p-3 text-slate-600">{tr.approved_by}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 6. DAILY PATIENT CARE & TIMELINE (Section 12 Requirement) */}
      {/* ============================================================ */}
      {activeTab === 'daily-care' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Clock className="h-5 w-5 text-teal-600" />
                <span>DAILY IPD TREATMENT & MONITORING TIMELINE</span>
              </h2>
              <p className="text-xs text-slate-500">Longitudinal event logging for admitted hospital stays</p>
            </div>
          </div>

          <div className="relative border-l-2 border-teal-500/30 ml-4 pl-6 space-y-6 py-2">
            {timelineEvents.map((ev, idx) => (
              <div key={ev.id} className="relative group">
                <div className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full border-2 border-teal-500 bg-white group-hover:bg-teal-500 transition-colors"></div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                    <span className="text-teal-700 font-bold">{ev.date} • {ev.time}</span>
                    <span className="bg-white px-2.5 py-0.5 rounded-full border text-slate-700">{ev.event_type}</span>
                  </div>
                  <p className="text-slate-900 font-semibold text-xs">{ev.description}</p>
                  <span className="text-[10px] text-slate-400 block font-mono">Logged by: {ev.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 7. DOCTOR NOTES VIEW (Section 6 Requirement) */}
      {/* ============================================================ */}
      {activeTab === 'doctor-notes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2">➕ ADD DOCTOR PROGRESS NOTE</h3>
            <form onSubmit={handleAddDoctorNote} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Patient</label>
                <select
                  value={notePatientId}
                  onChange={(e) => setNotePatientId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2 font-bold text-slate-900 focus:outline-none"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.patient_id}>{p.name} ({p.ward})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Note Type</label>
                <select
                  value={noteType}
                  onChange={(e) => setNoteType(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 p-2 font-bold text-teal-800 focus:outline-none"
                >
                  <option value="Progress Note">Progress Note</option>
                  <option value="Treatment Instruction">Treatment Instruction</option>
                  <option value="Diagnosis Update">Diagnosis Update</option>
                  <option value="Discharge Plan">Discharge Plan</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinical Note / Instructions</label>
                <textarea
                  rows={4}
                  required
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Enter detailed progress note..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-slate-900 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white py-2.5 font-bold uppercase text-xs shadow-md transition-all"
              >
                [ SAVE DOCTOR NOTE ]
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2">📋 DOCTOR PROGRESS LOGS</h3>
            <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
              {doctorNotes.map(dn => (
                <div key={dn.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span className="text-teal-700">{dn.patient_name}</span>
                    <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">{dn.note_type}</span>
                  </div>
                  <p className="text-slate-900 font-medium">{dn.content}</p>
                  <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <span>By: {dn.doctor_name}</span>
                    <span>{dn.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 8. NURSING INFO VIEW (Section 7 Requirement) */}
      {/* ============================================================ */}
      {activeTab === 'nursing-info' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2">👩‍⚕️ RECORD NURSING VITALS & CARE</h3>
            <form onSubmit={handleAddNurseRecord} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Patient</label>
                <select
                  value={vitalsPatientId}
                  onChange={(e) => setVitalsPatientId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2 font-bold text-slate-900 focus:outline-none"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.patient_id}>{p.name} ({p.bed_number})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">BP (mmHg)</label>
                  <input type="text" value={vitalsBp} onChange={(e) => setVitalsBp(e.target.value)} className="w-full rounded-xl border border-slate-200 p-2 text-slate-900" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pulse (bpm)</label>
                  <input type="text" value={vitalsPulse} onChange={(e) => setVitalsPulse(e.target.value)} className="w-full rounded-xl border border-slate-200 p-2 text-slate-900" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Temp (°F)</label>
                  <input type="text" value={vitalsTemp} onChange={(e) => setVitalsTemp(e.target.value)} className="w-full rounded-xl border border-slate-200 p-2 text-slate-900" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SpO2 (%)</label>
                  <input type="text" value={vitalsSpo2} onChange={(e) => setVitalsSpo2(e.target.value)} className="w-full rounded-xl border border-slate-200 p-2 text-slate-900" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nursing Shift Notes</label>
                <textarea rows={3} value={vitalsNotes} onChange={(e) => setVitalsNotes(e.target.value)} className="w-full rounded-xl border border-slate-200 p-2 text-slate-900" />
              </div>

              <button type="submit" className="w-full rounded-xl bg-teal-600 hover:bg-teal-700 text-white py-2.5 font-bold uppercase text-xs shadow-md transition-all">
                [ SAVE NURSING RECORD ]
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2">💊 MEDICATION ADMINISTRATION RECORDS (MAR)</h3>
            <div className="space-y-4">
              {nursingRecords.map(nr => (
                <div key={nr.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                  <div className="flex items-center justify-between border-b pb-2 font-bold text-slate-900">
                    <span>{nr.patient_name} — {nr.date}</span>
                    <span className="text-[10px] text-teal-700">By: {nr.nurse_name}</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center text-[11px] bg-white p-2.5 rounded-xl border">
                    <div><span className="text-slate-400 block">BP</span><strong>{nr.bp}</strong></div>
                    <div><span className="text-slate-400 block">Pulse</span><strong>{nr.pulse} bpm</strong></div>
                    <div><span className="text-slate-400 block">Temp</span><strong>{nr.temp}</strong></div>
                    <div><span className="text-slate-400 block">SpO2</span><strong>{nr.spo2}</strong></div>
                  </div>

                  <div>
                    <span className="font-bold text-[11px] text-slate-700 block mb-1">Scheduled Dosage Checklist:</span>
                    <div className="space-y-1">
                      {nr.medications_status.map((med, i) => (
                        <div key={i} className="flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border text-xs">
                          <span>{med.name} ({med.time})</span>
                          <span className={med.given ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                            {med.given ? '✓ Given' : '○ Pending'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 9. LAB / RADIOLOGY / MEDICATION CONNECTED VIEWS */}
      {/* ============================================================ */}
      {activeTab === 'lab-reports' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <FlaskConical className="h-5 w-5 text-purple-600" />
            <span>IPD LABORATORY TEST REQUESTS &amp; LIS CONNECTIVITY</span>
          </h2>
          <p className="text-xs text-slate-500">Doctor orders tests ➔ LIS processes sample ➔ Results attached to IPD EHR.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-2">
              <span className="font-bold text-purple-900 block">Aarav Sharma — CBC &amp; Cardiac Biomarkers</span>
              <p className="text-slate-700">Requested by Dr. Arjun Mehta. Sample collected. Troponin I: Negative (&lt;0.01 ng/mL).</p>
              <span className="inline-block bg-purple-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold">Verified in LIS</span>
            </div>
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-2">
              <span className="font-bold text-purple-900 block">Anika Patel — Dengue NS1 &amp; Platelet Count</span>
              <p className="text-slate-700">Requested by Dr. Sarah Jenkins. Platelets: 85,000 /uL. Daily monitoring active.</p>
              <span className="inline-block bg-purple-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold">Verified in LIS</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'radiology-reports' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <ImageIcon className="h-5 w-5 text-rose-600" />
            <span>IPD RADIOLOGY SCANS &amp; RIS PACS ARCHIVE</span>
          </h2>
          <p className="text-xs text-slate-500">Doctor orders scan ➔ RIS scans patient ➔ Radiologist report stored in EHR.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-2">
              <span className="font-bold text-rose-900 block">Aarav Sharma — Cardiac MRI Scan</span>
              <p className="text-slate-700">Requested by Dr. Arjun Mehta. LVEF 62%. No myocardial scar or ischemic defect.</p>
              <span className="inline-block bg-rose-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold">PACS DICOM Linked</span>
            </div>
            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-2">
              <span className="font-bold text-rose-900 block">Rahul Verma — HRCT Chest Scan</span>
              <p className="text-slate-700">Requested by Dr. Vikram Rao. Bilateral lower lobe consolidation present.</p>
              <span className="inline-block bg-rose-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold">PACS DICOM Linked</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'medication' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Pill className="h-5 w-5 text-teal-600" />
            <span>IPD PRESCRIPTIONS &amp; PHARMACY DISPENSING ROUTE</span>
          </h2>
          <p className="text-xs text-slate-500">Doctor prescribes ➔ Pharmacy dispenses to ward ➔ Nurse administers medication.</p>

          <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 space-y-2 text-xs">
            <span className="font-bold text-teal-900 block">Current Active Inpatient Medication Schedule:</span>
            <ul className="list-disc pl-5 space-y-1 text-slate-700 font-medium">
              <li>Aarav Sharma (Bed C-101): IV Nitroglycerin, Oral Aspirin 75mg, Atorvastatin 40mg</li>
              <li>Anika Patel (Bed W-101): IV Normal Saline 0.9%, Paracetamol 500mg IV</li>
              <li>Rahul Verma (Bed I-01): IV Ceftriaxone 1g, Inhaled Salbutamol, Oxygen 4L/min</li>
            </ul>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 10. DISCHARGE & DISCHARGE SUMMARY PDF (Section 13 & 14) */}
      {/* ============================================================ */}
      {activeTab === 'discharge' && (
        <div className="max-w-3xl mx-auto rounded-3xl border border-slate-200 bg-white p-8 shadow-md space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <FileText className="h-6 w-6 text-emerald-600" />
              <span>IPD DISCHARGE WORKFLOW &amp; SUMMARY GENERATOR</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Discharge decision ➔ Generate Discharge Summary PDF ➔ Settle charges to Billing ➔ Release Bed ➔ Close Stay
            </p>
          </div>

          <form onSubmit={handleConfirmDischarge} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Patient to Discharge</label>
                <select
                  value={dcPatientId}
                  onChange={(e) => {
                    setDcPatientId(e.target.value);
                    const found = patients.find(p => p.patient_id === e.target.value);
                    if (found && found.diagnosis) setDcDiagnosis(found.diagnosis);
                  }}
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-bold text-slate-900 focus:outline-none"
                >
                  {patients.filter(p => p.status !== 'Discharged').map(p => (
                    <option key={p.id} value={p.patient_id}>
                      {p.name} ({p.admission_id}) — {p.ward} [{p.bed_number}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Follow-up Date</label>
                <input
                  type="text"
                  required
                  value={dcFollowupDate}
                  onChange={(e) => setDcFollowupDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-bold text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Clinical Diagnosis at Discharge</label>
              <input
                type="text"
                required
                value={dcDiagnosis}
                onChange={(e) => setDcDiagnosis(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 font-semibold text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Treatment Summary &amp; Hospital Course</label>
              <textarea
                rows={3}
                required
                value={dcSummary}
                onChange={(e) => setDcSummary(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Discharge Instructions &amp; Take-Home Medications</label>
              <textarea
                rows={3}
                required
                value={dcInstructions}
                onChange={(e) => setDcInstructions(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-slate-900 focus:outline-none"
              />
            </div>

            <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleGenerateDischargePDF()}
                className="w-full sm:w-auto rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 px-6 py-3 font-extrabold text-xs border border-slate-300 transition-all flex items-center justify-center space-x-2"
              >
                <Download className="h-4 w-4 text-emerald-600" />
                <span>[ GENERATE DISCHARGE SUMMARY PDF ]</span>
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all uppercase tracking-wider"
              >
                [ CONFIRM DISCHARGE &amp; RELEASE BED ]
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================ */}
      {/* 11. NOTIFICATIONS VIEW */}
      {/* ============================================================ */}
      {activeTab === 'notifications' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 max-w-3xl mx-auto">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Bell className="h-5 w-5 text-amber-500" />
            <span>IPD ALERTS &amp; SYSTEM NOTIFICATIONS</span>
          </h2>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 font-bold text-amber-900">
              🚨 ICU Bed I-01 Alert: Patient Rahul Verma SpO2 decreased to 92%. Nurse notified.
            </div>
            <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 font-bold text-teal-900">
              🏥 Cardiology Bed C-103 status changed to VACANT &amp; Disinfected. Ready for admission.
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 font-bold text-emerald-900">
              📄 Discharge Clearance approved for Aarav Sharma (IPD-2026-001). Final summary generated.
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* PATIENT IPD PROFILE DOSSIER MODAL (Section 5 Requirement) */}
      {/* ============================================================ */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl rounded-3xl bg-white p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar border border-slate-100">
            <button
              onClick={() => setSelectedPatient(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 gap-3">
              <div className="flex items-center space-x-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-white text-xl font-extrabold shadow-md">
                  {selectedPatient.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedPatient.name}</h3>
                  <div className="text-xs text-slate-500 font-mono space-x-2">
                    <span>ID: <strong>{selectedPatient.patient_id}</strong></span>
                    <span>•</span>
                    <span>Adm: <strong>{selectedPatient.admission_id}</strong></span>
                    <span>•</span>
                    <span>{selectedPatient.age} yrs / {selectedPatient.gender}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <div className="bg-slate-100 p-2 rounded-xl text-slate-800 font-bold border">
                  Ward: {selectedPatient.ward} [{selectedPatient.bed_number}]
                </div>
                <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 font-bold">
                  {selectedPatient.status}
                </span>
              </div>
            </div>

            {/* Dossier Tabs */}
            <div className="flex space-x-1 border-b border-slate-200 overflow-x-auto text-xs font-bold text-slate-600">
              {['overview', 'vitals', 'notes', 'lab', 'radiology', 'medication', 'transfer', 'discharge'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setProfileSubTab(tab)}
                  className={`px-3 py-2 uppercase rounded-t-xl transition-all ${
                    profileSubTab === tab ? 'bg-teal-600 text-white font-extrabold' : 'hover:bg-slate-100'
                  }`}
                >
                  [{tab}]
                </button>
              ))}
            </div>

            {/* Sub-tab content */}
            <div className="py-2 text-xs">
              {profileSubTab === 'overview' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border text-slate-800 font-medium">
                    <div><span className="text-slate-400 block text-[10px]">Attending Doctor</span><strong>{selectedPatient.doctor_name}</strong></div>
                    <div><span className="text-slate-400 block text-[10px]">Department</span><strong>{selectedPatient.department}</strong></div>
                    <div><span className="text-slate-400 block text-[10px]">Admission Date</span><strong>{selectedPatient.admission_date}</strong></div>
                    <div><span className="text-slate-400 block text-[10px]">Admission Type</span><strong>{selectedPatient.admission_type}</strong></div>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900">
                    <strong>Primary Clinical Reason / Diagnosis:</strong>
                    <p className="mt-1 font-medium">{selectedPatient.reason}</p>
                  </div>
                </div>
              )}

              {profileSubTab === 'vitals' && (
                <div className="p-4 bg-slate-50 rounded-2xl border space-y-2">
                  <span className="font-bold block text-slate-800">Latest Recorded Vitals:</span>
                  <div className="grid grid-cols-4 gap-2 text-center bg-white p-3 rounded-xl border">
                    <div><span className="text-slate-400 block">BP</span><strong>124/82</strong></div>
                    <div><span className="text-slate-400 block">Pulse</span><strong>78 bpm</strong></div>
                    <div><span className="text-slate-400 block">Temp</span><strong>98.4°F</strong></div>
                    <div><span className="text-slate-400 block">SpO2</span><strong>98%</strong></div>
                  </div>
                </div>
              )}

              {profileSubTab === 'notes' && (
                <div className="space-y-2">
                  {doctorNotes.filter(dn => dn.patient_id === selectedPatient.patient_id).map(dn => (
                    <div key={dn.id} className="p-3 bg-slate-50 rounded-xl border font-medium">
                      <div className="font-bold text-teal-800">{dn.note_type} — {dn.date}</div>
                      <p className="text-slate-800">{dn.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {profileSubTab === 'lab' && (
                <div className="p-4 bg-purple-50 rounded-2xl border text-purple-900 space-y-1">
                  <strong>LIS Connected Lab Investigations:</strong>
                  <p>1. Complete Blood Count (CBC) — Verified Normal</p>
                  <p>2. Serum Cardiac Biomarkers (Trop-I) — Negative</p>
                </div>
              )}

              {profileSubTab === 'radiology' && (
                <div className="p-4 bg-rose-50 rounded-2xl border text-rose-900 space-y-1">
                  <strong>RIS PACS Connected Imaging:</strong>
                  <p>1. Cardiac MRI (Chest / Heart) — EF 62%, Unremarkable</p>
                </div>
              )}

              {profileSubTab === 'medication' && (
                <div className="p-4 bg-teal-50 rounded-2xl border text-teal-900 space-y-1">
                  <strong>Active Inpatient Rx:</strong>
                  <p>• Aspirin 75mg (Given 08:00 AM)</p>
                  <p>• Atorvastatin 40mg (Given 02:00 PM)</p>
                  <p>• Metoprolol 25mg (Scheduled 08:00 PM)</p>
                </div>
              )}

              {profileSubTab === 'transfer' && (
                <div className="p-4 bg-slate-50 rounded-2xl border space-y-2">
                  <span className="font-bold text-slate-800 block">Current Room: {selectedPatient.ward} [{selectedPatient.bed_number}]</span>
                  <button
                    onClick={() => { setSelectedPatient(null); setTransferPatientId(selectedPatient.patient_id); setActiveTab('transfer'); }}
                    className="rounded-xl bg-teal-600 text-white px-4 py-2 font-bold"
                  >
                    Initiate Ward Transfer ➔
                  </button>
                </div>
              )}

              {profileSubTab === 'discharge' && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 space-y-3">
                  <strong>Discharge Summary &amp; Clearance Status:</strong>
                  <p>Vitals stable. Eligible for discharge authorization.</p>
                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={() => handleGenerateDischargePDF(selectedPatient)}
                      className="rounded-xl bg-slate-900 text-white px-4 py-2 font-bold flex items-center space-x-1"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download PDF Summary</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t flex justify-end">
              <button
                onClick={() => setSelectedPatient(null)}
                className="rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 px-5 py-2 font-bold"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IPDManagement;
