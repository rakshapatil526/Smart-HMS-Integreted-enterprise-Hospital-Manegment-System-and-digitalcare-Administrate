import React, { useState } from 'react';
import {
  demoOPDPatients50,
  demoOPDPreviousVisits,
  demoOPDLabRequests,
  demoOPDRadiologyRequests,
  demoOPDPrescriptions,
  OPDPatientRecord,
  OPDLabRequest,
  OPDRadiologyRequest,
  OPDPrescriptionItem,
  opdDepartments,
  opdDoctorsList
} from './opdData';
import {
  Stethoscope, Users, Clock, Search, Calendar, FlaskConical, Image as ImageIcon,
  Pill, FileText, CreditCard, Bell, ChevronRight, Eye, Plus, CheckCircle2, X,
  Download, Megaphone, ArrowRight, Activity, Building2, UserCheck, RefreshCw, AlertTriangle
} from 'lucide-react';
import { authApi } from '../../services/api';

export const OPDPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [patients, setPatients] = useState<OPDPatientRecord[]>(demoOPDPatients50);
  const [labRequests, setLabRequests] = useState<OPDLabRequest[]>(demoOPDLabRequests);
  const [radiologyRequests, setRadiologyRequests] = useState<OPDRadiologyRequest[]>(demoOPDRadiologyRequests);
  const [prescriptions, setPrescriptions] = useState<OPDPrescriptionItem[]>(demoOPDPrescriptions);
  
  const [selectedPatient, setSelectedPatient] = useState<OPDPatientRecord>(demoOPDPatients50[0]);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('ALL');
  const [selectedDocFilter, setSelectedDocFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [callingToken, setCallingToken] = useState<string | null>(null);

  // Consultation Form State
  const [chiefComplaint, setChiefComplaint] = useState(selectedPatient.consultation_details?.chief_complaint || '');
  const [symptoms, setSymptoms] = useState(selectedPatient.consultation_details?.symptoms || '');
  const [medicalHistory, setMedicalHistory] = useState(selectedPatient.consultation_details?.medical_history || '');
  const [examination, setExamination] = useState(selectedPatient.consultation_details?.examination || '');
  const [bp, setBp] = useState(selectedPatient.current_vitals?.bp || '120/80');
  const [pulse, setPulse] = useState(selectedPatient.current_vitals?.pulse || '76 bpm');
  const [temp, setTemp] = useState(selectedPatient.current_vitals?.temp || '98.6 °F');
  const [spo2, setSpo2] = useState(selectedPatient.current_vitals?.spo2 || '99%');
  const [diagnosis, setDiagnosis] = useState(selectedPatient.consultation_details?.diagnosis || '');
  const [clinicalNotes, setClinicalNotes] = useState(selectedPatient.consultation_details?.clinical_notes || '');
  const [treatmentPlan, setTreatmentPlan] = useState(selectedPatient.consultation_details?.treatment_plan || '');
  const [followUpDate, setFollowUpDate] = useState('2026-08-24');

  const openPatientConsultation = (p: OPDPatientRecord) => {
    setSelectedPatient(p);
    setChiefComplaint(p.consultation_details?.chief_complaint || `Patient presents with ${p.department.toLowerCase()} symptoms.`);
    setSymptoms(p.consultation_details?.symptoms || 'Discomfort, mild weakness.');
    setMedicalHistory(p.consultation_details?.medical_history || 'No major surgical history.');
    setExamination(p.consultation_details?.examination || 'Vital parameters stable. Normal S1/S2.');
    setBp(p.current_vitals?.bp || '120/80');
    setPulse(p.current_vitals?.pulse || '74 bpm');
    setTemp(p.current_vitals?.temp || '98.4 °F');
    setSpo2(p.current_vitals?.spo2 || '98%');
    setDiagnosis(p.consultation_details?.diagnosis || `OPD Evaluation: ${p.department} Disorder`);
    setClinicalNotes(p.consultation_details?.clinical_notes || 'Advised follow-up and prescribed medication.');
    setTreatmentPlan(p.consultation_details?.treatment_plan || 'Take prescribed drugs after meals. Rest.');
    setActiveTab('consultation');
  };

  const handleSaveConsultation = () => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === selectedPatient.id
          ? {
              ...p,
              status: 'Visit Completed',
              current_vitals: { bp, pulse, temp, spo2 },
              consultation_details: {
                chief_complaint: chiefComplaint,
                symptoms,
                medical_history: medicalHistory,
                examination,
                diagnosis,
                clinical_notes: clinicalNotes,
                treatment_plan: treatmentPlan,
                follow_up_date: followUpDate,
              },
            }
          : p
      )
    );
    alert(`OPD Consultation for ${selectedPatient.name} saved successfully!\n- Clinical Record Pushed to EHR Timeline\n- Visit Status: Visit Completed\n- Follow-up set for ${followUpDate}`);
    setActiveTab('dashboard');
  };

  const handleCallNext = () => {
    const nextWaiting = patients.find((p) => (selectedDeptFilter === 'ALL' || p.department === selectedDeptFilter) && (p.status === 'Waiting' || p.status === 'Checked-In'));
    if (nextWaiting) {
      setCallingToken(`Token ${nextWaiting.token_code} — ${nextWaiting.name}`);
      setPatients((prev) => prev.map((p) => (p.id === nextWaiting.id ? { ...p, status: 'With Doctor' } : p)));
      setSelectedPatient(nextWaiting);
      setTimeout(() => setCallingToken(null), 4000);
    } else {
      alert('No more waiting patients in queue for selected filter!');
    }
  };

  const handleDownloadPDF = async (type: 'summary' | 'prescription' | 'referral') => {
    try {
      let payload: any = {};
      let docType = 'prescription';
      let filename = `OPD_${type}_${selectedPatient.patient_id}.pdf`;

      if (type === 'summary') {
        docType = 'prescription';
        payload = {
          prescription_number: `SUM-${selectedPatient.token_code}`,
          patient_name: selectedPatient.name,
          patient_id: selectedPatient.patient_id,
          doctor_name: selectedPatient.assigned_doctor,
          diagnosis: diagnosis || selectedPatient.consultation_details?.diagnosis || 'OPD Evaluation',
          instructions: `Treatment Plan: ${treatmentPlan}. Follow-up Date: ${followUpDate}`,
          medicines: [
            { medicine_name: `Department: ${selectedPatient.department}`, dosage: `Vitals: ${bp} BP, ${pulse}`, frequency: `Type: ${selectedPatient.visit_type}`, duration: `Date: 17 Aug 2026` }
          ]
        };
      } else if (type === 'prescription') {
        docType = 'prescription';
        payload = {
          prescription_number: `RX-${selectedPatient.token_code}`,
          patient_name: selectedPatient.name,
          patient_id: selectedPatient.patient_id,
          doctor_name: selectedPatient.assigned_doctor,
          diagnosis: diagnosis || 'OPD Consultation Prescription',
          instructions: 'Take medications strictly as instructed after meals.',
          medicines: [
            { medicine_name: 'Paracetamol 500mg', dosage: '500mg', frequency: '1-0-1', duration: '5 Days' },
            { medicine_name: 'Amoxicillin 500mg', dosage: '500mg', frequency: '1-0-1', duration: '7 Days' },
            { medicine_name: 'Pantoprazole 40mg', dosage: '40mg', frequency: '1-0-0', duration: '7 Days' },
          ]
        };
      } else {
        docType = 'prescription';
        payload = {
          prescription_number: `REF-${selectedPatient.token_code}`,
          patient_name: selectedPatient.name,
          patient_id: selectedPatient.patient_id,
          doctor_name: selectedPatient.assigned_doctor,
          diagnosis: `Referral to Specialty Department: ${selectedPatient.department}`,
          instructions: `Reason for Referral: Advanced evaluation and specialized care.`,
          medicines: [
            { medicine_name: `From: ${selectedPatient.department}`, dosage: `To: Advanced Super-Specialty Unit`, frequency: `Urgent`, duration: `17 Aug 2026` }
          ]
        };
      }

      const res = await authApi.generatePDF(docType, payload);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert(`Downloaded ${type.toUpperCase()} PDF document for ${selectedPatient.name} (${selectedPatient.patient_id}).`);
    }
  };

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.token_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDeptFilter === 'ALL' || p.department === selectedDeptFilter;
    const matchesDoc = selectedDocFilter === 'ALL' || p.assigned_doctor === selectedDocFilter;
    return matchesSearch && matchesDept && matchesDoc;
  });

  const waitingCount = patients.filter((p) => p.status === 'Waiting' || p.status === 'Booked' || p.status === 'Checked-In').length;
  const completedCount = patients.filter((p) => p.status === 'Consultation Completed' || p.status === 'Visit Completed').length;
  const inConsultCount = patients.filter((p) => p.status === 'With Doctor').length;

  return (
    <div className="space-y-6 font-['Inter',sans-serif]">
      {/* OPD Header & Module Bar */}
      <div className="rounded-2xl bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 rounded-full bg-teal-600/40 px-3 py-1 text-xs font-semibold text-teal-200 border border-teal-400/30 mb-2">
              <Stethoscope className="h-3.5 w-3.5" />
              <span>Outpatient Department (OPD) Consultation & Clinical Management</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">🩺 OPD MANAGEMENT MODULE</h1>
            <p className="text-xs text-teal-100/80 mt-1">
              Integrated OPD consultation desk linking Patient Records, Appointments, Doctors, LIS, RIS, Pharmacy, and EHR.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCallNext}
              className="inline-flex items-center space-x-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2.5 text-xs font-bold transition-all shadow-sm shrink-0"
            >
              <Megaphone className="h-4 w-4" />
              <span>[ CALL NEXT PATIENT ]</span>
            </button>
          </div>
        </div>
      </div>

      {callingToken && (
        <div className="rounded-2xl bg-amber-500 text-slate-950 p-4 font-extrabold text-xs shadow-md flex items-center justify-between animate-bounce">
          <div className="flex items-center space-x-2">
            <Megaphone className="h-5 w-5" />
            <span>NOW CALLING TO CONSULTATION ROOM: {callingToken}</span>
          </div>
        </div>
      )}

      {/* 13 OPD Navigation Sub-Tabs Bar (Section 16 Blueprint) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm flex flex-wrap gap-1 overflow-x-auto custom-scrollbar">
        {[
          { id: 'dashboard', label: '🏠 Dashboard' },
          { id: 'todays-patients', label: '👥 Today\'s Patients' },
          { id: 'opd-queue', label: '🎫 OPD Queue' },
          { id: 'patient-search', label: '🔎 Patient Search' },
          { id: 'consultation', label: '🩺 Consultation' },
          { id: 'previous-visits', label: '📋 Previous Visits' },
          { id: 'lab-requests', label: '🧪 Lab Requests' },
          { id: 'radiology-requests', label: '🩻 Radiology Requests' },
          { id: 'prescriptions', label: '💊 Prescriptions' },
          { id: 'opd-reports', label: '📄 OPD Reports / PDF' },
          { id: 'billing-status', label: '💳 Billing Status' },
          { id: 'follow-up', label: '📅 Follow-up' },
          { id: 'notifications', label: '🔔 Notifications' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* SUB-VIEW 1: OPD DASHBOARD (Section 2 & 3 Blueprint) */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* KPI Stat Cards (Today's Patients: 48, Waiting: 12, Completed: 30, Cancelled: 6) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Today's Patients</div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900">48</div>
              <span className="text-[10px] text-teal-600 font-semibold">Total Outpatient Visits</span>
            </div>

            <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Waiting Patients</div>
              <div className="mt-2 text-2xl font-extrabold text-amber-600">{waitingCount}</div>
              <span className="text-[10px] text-amber-600 font-semibold">In Waiting Lobby</span>
            </div>

            <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Consultation Completed</div>
              <div className="mt-2 text-2xl font-extrabold text-emerald-600">{completedCount}</div>
              <span className="text-[10px] text-emerald-600 font-semibold">Visit Completed</span>
            </div>

            <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Cancelled / No Show</div>
              <div className="mt-2 text-2xl font-extrabold text-slate-400">6</div>
              <span className="text-[10px] text-slate-400 font-semibold">Rescheduled visits</span>
            </div>
          </div>

          {/* Department & Doctor Filter Bar */}
          <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search Patient Name / Patient ID / Token Code (e.g. OP001)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2 text-xs focus:border-teal-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center space-x-2 w-full md:w-auto">
              <span className="text-xs font-bold text-slate-600 shrink-0">Department:</span>
              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white text-slate-800 font-semibold"
              >
                <option value="ALL">All 10 Departments</option>
                {opdDepartments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <span className="text-xs font-bold text-slate-600 shrink-0">Doctor:</span>
              <select
                value={selectedDocFilter}
                onChange={(e) => setSelectedDocFilter(e.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white text-slate-800 font-semibold"
              >
                <option value="ALL">All Doctors</option>
                {opdDoctorsList.map((doc) => (
                  <option key={doc.name} value={doc.name}>{doc.name} ({doc.department})</option>
                ))}
              </select>
            </div>
          </div>

          {/* OPD Patients Table */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900">Today's OPD Queue & Patient Visits ({filteredPatients.length})</h3>
              <span className="text-[11px] text-slate-500 font-semibold">Active Filter: {selectedDeptFilter}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3.5">Token</th>
                    <th className="px-4 py-3.5">Patient ID & Name</th>
                    <th className="px-4 py-3.5">Department</th>
                    <th className="px-4 py-3.5">Assigned Doctor</th>
                    <th className="px-4 py-3.5">Time</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredPatients.slice(0, 15).map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5 font-mono font-extrabold text-teal-700">
                        <span className="bg-teal-50 px-2 py-1 rounded-md border border-teal-200">{p.token_code}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center space-x-3">
                          <img src={p.photo_url} alt={p.name} className="h-8 w-8 rounded-full object-cover border border-slate-200" />
                          <div>
                            <div className="font-bold text-slate-900">{p.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{p.patient_id} • {p.age} yrs ({p.gender})</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-800">{p.department}</td>
                      <td className="px-4 py-3.5 font-semibold text-slate-700">{p.assigned_doctor}</td>
                      <td className="px-4 py-3.5 font-mono text-slate-600">{p.appointment_time}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          p.status === 'With Doctor'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : p.status === 'Waiting'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : p.status === 'Visit Completed' || p.status === 'Consultation Completed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => openPatientConsultation(p)}
                          className="inline-flex items-center space-x-1 rounded-xl bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 text-xs font-bold transition-all shadow-2xs"
                        >
                          <span>[OPEN PATIENT]</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2 & 4: PATIENT SEARCH / PATIENT OPD RECORD (Section 4 Blueprint) */}
      {(activeTab === 'todays-patients' || activeTab === 'patient-search') && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase">Search Outpatient Directory</h2>
            <input
              type="text"
              placeholder="Search by ID (e.g. OPD-P001), Name, Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-72 rounded-xl border border-slate-200 px-3 py-1.5 text-xs focus:border-teal-500 focus:outline-hidden"
            />
          </div>

          {/* OPD Patient Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPatients.map((p) => (
              <div key={p.id} className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all space-y-3">
                <div className="flex items-center space-x-3">
                  <img src={p.photo_url} alt={p.name} className="h-12 w-12 rounded-full object-cover border border-slate-200" />
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">{p.name}</h3>
                    <div className="text-xs font-mono font-bold text-teal-700">ID: {p.patient_id}</div>
                    <div className="text-[11px] text-slate-500">{p.age} yrs • {p.gender} • Blood: {p.blood_group}</div>
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] space-y-1">
                  <div>Department: <strong className="text-slate-800">{p.department}</strong></div>
                  <div>Doctor: <strong className="text-slate-800">{p.assigned_doctor}</strong></div>
                  <div>Visit Type: <strong className="text-slate-800">{p.visit_type}</strong></div>
                </div>

                <div className="flex items-center space-x-1.5 pt-2 border-t border-slate-100 text-[11px]">
                  <button
                    onClick={() => openPatientConsultation(p)}
                    className="flex-1 rounded-xl bg-teal-600 text-white py-1.5 font-bold hover:bg-teal-700 transition-all text-center"
                  >
                    [Consultation]
                  </button>
                  <button
                    onClick={() => { setSelectedPatient(p); setActiveTab('previous-visits'); }}
                    className="rounded-xl bg-slate-100 text-slate-700 px-2.5 py-1.5 font-semibold hover:bg-slate-200"
                  >
                    Visits
                  </button>
                  <button
                    onClick={() => { setSelectedPatient(p); setActiveTab('prescriptions'); }}
                    className="rounded-xl bg-slate-100 text-slate-700 px-2.5 py-1.5 font-semibold hover:bg-slate-200"
                  >
                    Rx
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: OPD QUEUE (Section 2 & 14 Blueprint) */}
      {activeTab === 'opd-queue' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-2xl bg-white p-4 border border-slate-200 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900">OPD Real-Time Queue & Token Dispatch</h2>
            <button onClick={handleCallNext} className="rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2 text-xs font-bold">
              [ CALL NEXT TOKEN ]
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {['Waiting', 'With Doctor', 'Consultation Completed', 'Visit Completed'].map((qStatus) => {
              const queueList = patients.filter((p) => p.status === qStatus || (qStatus === 'Waiting' && (p.status === 'Booked' || p.status === 'Checked-In')));
              return (
                <div key={qStatus} className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="text-xs font-bold text-slate-800 uppercase">{qStatus}</h3>
                    <span className="rounded-full bg-slate-200 text-slate-800 px-2 py-0.5 text-[10px] font-bold">{queueList.length}</span>
                  </div>

                  <div className="space-y-2">
                    {queueList.slice(0, 8).map((p) => (
                      <div key={p.id} className="rounded-xl bg-white p-3 border border-slate-200 shadow-2xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-teal-700 text-xs">{p.token_code}</span>
                          <span className="text-[10px] text-slate-400">{p.appointment_time}</span>
                        </div>
                        <div className="font-bold text-slate-900 text-xs">{p.name}</div>
                        <div className="text-[10px] text-slate-500">{p.department} • {p.assigned_doctor}</div>
                        <button
                          onClick={() => openPatientConsultation(p)}
                          className="w-full mt-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 py-1 text-[10px] font-bold hover:bg-teal-100"
                        >
                          View Consultation
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 5 & 6: OPD CONSULTATION SCREEN (Section 6 Blueprint) */}
      {activeTab === 'consultation' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl space-y-6">
          {/* Patient Header Banner */}
          <div className="rounded-2xl bg-slate-900 p-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <img src={selectedPatient.photo_url} alt={selectedPatient.name} className="h-12 w-12 rounded-full object-cover border-2 border-teal-500" />
              <div>
                <div className="text-xs text-teal-400 font-mono font-bold">OPD CONSULTATION • {selectedPatient.token_code}</div>
                <h2 className="text-lg font-bold">{selectedPatient.name} ({selectedPatient.patient_id})</h2>
                <div className="text-xs text-slate-400">{selectedPatient.age} yrs • {selectedPatient.gender} • Blood: {selectedPatient.blood_group} • Phone: {selectedPatient.phone}</div>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="rounded-lg bg-rose-900/60 text-rose-300 px-3 py-1 border border-rose-500/40 font-semibold">
                Allergies: {selectedPatient.allergies}
              </span>
            </div>
          </div>

          {/* Vitals Telemetry Row */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Patient Vitals Telemetry</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Blood Pressure</span>
                <input type="text" value={bp} onChange={(e) => setBp(e.target.value)} className="w-full font-extrabold text-slate-900 bg-transparent focus:outline-hidden" />
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Pulse / Heart Rate</span>
                <input type="text" value={pulse} onChange={(e) => setPulse(e.target.value)} className="w-full font-extrabold text-slate-900 bg-transparent focus:outline-hidden" />
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Temperature</span>
                <input type="text" value={temp} onChange={(e) => setTemp(e.target.value)} className="w-full font-extrabold text-slate-900 bg-transparent focus:outline-hidden" />
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Oxygen SpO2</span>
                <input type="text" value={spo2} onChange={(e) => setSpo2(e.target.value)} className="w-full font-extrabold text-slate-900 bg-transparent focus:outline-hidden" />
              </div>
            </div>
          </div>

          {/* Consultation Clinical Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Chief Complaint *</label>
              <textarea rows={3} value={chiefComplaint} onChange={(e) => setChiefComplaint(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 focus:border-teal-500 focus:outline-hidden" />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Symptoms *</label>
              <textarea rows={3} value={symptoms} onChange={(e) => setSymptoms(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 focus:border-teal-500 focus:outline-hidden" />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Medical History</label>
              <textarea rows={3} value={medicalHistory} onChange={(e) => setMedicalHistory(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 focus:border-teal-500 focus:outline-hidden" />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Clinical Examination Findings</label>
              <textarea rows={3} value={examination} onChange={(e) => setExamination(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 focus:border-teal-500 focus:outline-hidden" />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Clinical Diagnosis *</label>
              <textarea rows={3} value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 font-bold text-teal-900 focus:border-teal-500 focus:outline-hidden" />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Treatment Plan & Advice</label>
              <textarea rows={3} value={treatmentPlan} onChange={(e) => setTreatmentPlan(e.target.value)} className="w-full rounded-xl border border-slate-200 p-3 focus:border-teal-500 focus:outline-hidden" />
            </div>
          </div>

          {/* Sub-Module Request Triggers (Section 7, 8, 9, 13 Blueprint) */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveTab('lab-requests')}
                className="inline-flex items-center space-x-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white px-3.5 py-2 text-xs font-bold shadow-sm transition-all"
              >
                <FlaskConical className="h-4 w-4" />
                <span>[ Request Lab ]</span>
              </button>

              <button
                onClick={() => setActiveTab('radiology-requests')}
                className="inline-flex items-center space-x-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 text-xs font-bold shadow-sm transition-all"
              >
                <ImageIcon className="h-4 w-4" />
                <span>[ Request Radiology ]</span>
              </button>

              <button
                onClick={() => setActiveTab('prescriptions')}
                className="inline-flex items-center space-x-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white px-3.5 py-2 text-xs font-bold shadow-sm transition-all"
              >
                <Pill className="h-4 w-4" />
                <span>[ Create Prescription ]</span>
              </button>

              <button
                onClick={() => alert(`IPD Admission recommended for ${selectedPatient.name}. Sent to Reception/IPD admission desk.`)}
                className="inline-flex items-center space-x-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2 text-xs font-bold shadow-sm transition-all"
              >
                <Building2 className="h-4 w-4" />
                <span>[ Recommend IPD Admission ]</span>
              </button>
            </div>

            <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>Follow-up Date:</span>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="rounded-xl border border-slate-300 p-1.5 text-xs text-slate-900"
              />
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button onClick={() => setActiveTab('dashboard')} className="text-xs font-bold text-slate-500 hover:underline">
              ← Back to OPD Dashboard
            </button>

            <button
              onClick={handleSaveConsultation}
              className="inline-flex items-center space-x-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 text-xs font-extrabold shadow-lg shadow-teal-500/20 transition-all"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>[ SAVE CONSULTATION & VISIT COMPLETED ]</span>
            </button>
          </div>
        </div>
      )}

      {/* SUB-VIEW 6: PREVIOUS VISITS (Section 5 Blueprint) */}
      {activeTab === 'previous-visits' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">HISTORIC OPD CONSULTATION VISITS</h2>
              <p className="text-xs text-slate-500">Patient: <strong>{selectedPatient.name} ({selectedPatient.patient_id})</strong></p>
            </div>
          </div>

          <div className="space-y-4">
            {(demoOPDPreviousVisits[selectedPatient.patient_id] || demoOPDPreviousVisits['OPD-P001']).map((visit) => (
              <div key={visit.visit_id} className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-teal-600" />
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">{visit.date} — {visit.visit_type}</h3>
                      <div className="text-xs text-slate-500">{visit.department} • {visit.doctor_name}</div>
                    </div>
                  </div>
                  <span className="rounded-full bg-teal-50 text-teal-700 px-3 py-1 text-xs font-mono font-bold border border-teal-200">
                    {visit.visit_id}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-bold block uppercase text-[9px]">Diagnosis</span>
                    <strong className="text-slate-900">{visit.diagnosis}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-bold block uppercase text-[9px]">Treatment Plan</span>
                    <strong className="text-slate-900">{visit.treatment_plan}</strong>
                  </div>
                </div>

                <div className="text-xs">
                  <span className="font-bold text-slate-700 block mb-1">Prescribed Medicines:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {visit.prescribed_medicines.map((m, i) => (
                      <span key={i} className="rounded-lg bg-slate-100 px-2.5 py-1 text-slate-700 font-semibold text-[11px] border border-slate-200">
                        💊 {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 7 & 8: LAB & RADIOLOGY REQUESTS (Section 7 & 8 Blueprint) */}
      {(activeTab === 'lab-requests' || activeTab === 'radiology-requests') && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              {activeTab === 'lab-requests' ? 'OPD LABORATORY TEST ORDERS (LIS)' : 'OPD RADIOLOGY IMAGING ORDERS (RIS)'}
            </h2>
            <button
              onClick={() => alert('New request sent directly to diagnostic processing department.')}
              className="rounded-xl bg-teal-600 text-white px-4 py-2 text-xs font-bold hover:bg-teal-700"
            >
              + Create New Request
            </button>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b">
                <tr>
                  <th className="p-4">Req No</th>
                  <th className="p-4">Patient</th>
                  <th className="p-4">Doctor & Dept</th>
                  <th className="p-4">Tests / Modality</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Report</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {activeTab === 'lab-requests'
                  ? labRequests.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50">
                        <td className="p-4 font-mono font-bold text-purple-700">{l.request_number}</td>
                        <td className="p-4 font-bold text-slate-900">{l.patient_name} ({l.patient_id})</td>
                        <td className="p-4">{l.doctor_name} • {l.department}</td>
                        <td className="p-4 text-slate-700">{l.test_names.join(', ')}</td>
                        <td className="p-4 font-bold text-emerald-700">🟢 {l.status}</td>
                        <td className="p-4 text-right">
                          <button onClick={() => alert(l.report_summary || 'Report in process')} className="rounded-lg bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-200">
                            View Report
                          </button>
                        </td>
                      </tr>
                    ))
                  : radiologyRequests.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="p-4 font-mono font-bold text-rose-700">{r.request_number}</td>
                        <td className="p-4 font-bold text-slate-900">{r.patient_name} ({r.patient_id})</td>
                        <td className="p-4">{r.doctor_name} • {r.department}</td>
                        <td className="p-4 text-slate-700">{r.modality} — {r.body_part}</td>
                        <td className="p-4 font-bold text-emerald-700">🟢 {r.status}</td>
                        <td className="p-4 text-right">
                          <button onClick={() => alert(r.findings || 'Findings pending')} className="rounded-lg bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-200">
                            View Findings
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-VIEW 9: PRESCRIPTIONS (Section 9 Blueprint) */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">OPD PRESCRIPTION DIRECTORY</h2>
              <p className="text-xs text-slate-500">Automatically synchronized with Pharmacy dispensing queue</p>
            </div>
            <button onClick={() => handleDownloadPDF('prescription')} className="rounded-xl bg-teal-600 text-white px-4 py-2 text-xs font-bold hover:bg-teal-700">
              Download Active Prescription PDF
            </button>
          </div>

          <div className="space-y-4">
            {prescriptions.map((rx) => (
              <div key={rx.id} className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="font-mono font-bold text-teal-700 text-sm">{rx.prescription_number} • {rx.patient_name} ({rx.patient_id})</div>
                  <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${rx.status === 'Dispensed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {rx.status === 'Dispensed' ? '🟢 Dispensed' : '🟡 Pending Pharmacy'}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400">
                      <tr>
                        <th className="p-2">Medicine Name</th>
                        <th className="p-2">Dosage</th>
                        <th className="p-2">Frequency</th>
                        <th className="p-2">Duration</th>
                        <th className="p-2">Instructions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                      {rx.medicines.map((m, idx) => (
                        <tr key={idx}>
                          <td className="p-2 font-bold text-slate-900">{m.name}</td>
                          <td className="p-2">{m.dosage}</td>
                          <td className="p-2">{m.frequency}</td>
                          <td className="p-2">{m.duration}</td>
                          <td className="p-2 text-slate-500">{m.instructions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 10: OPD PDF REPORTS GENERATOR (Section 11 Blueprint) */}
      {activeTab === 'opd-reports' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900">OPD OFFICIAL PDF DOCUMENTS GENERATOR</h2>
            <p className="text-xs text-slate-500">Generate, view, and download digital PDF summaries, prescriptions, and departmental referrals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* PDF A: Visit Summary */}
            <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-teal-700 font-bold text-sm">
                  <FileText className="h-5 w-5" />
                  <span>OPD Visit Summary PDF</span>
                </div>
                <p className="text-xs text-slate-500">Includes chief complaint, symptoms, examination, diagnosis, treatment plan, follow-up date, and doctor digital signature.</p>
              </div>
              <button onClick={() => handleDownloadPDF('summary')} className="w-full rounded-xl bg-teal-600 text-white py-2 text-xs font-bold hover:bg-teal-700">
                [ Download Summary PDF ]
              </button>
            </div>

            {/* PDF B: Prescription PDF */}
            <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-blue-700 font-bold text-sm">
                  <Pill className="h-5 w-5" />
                  <span>Prescription PDF</span>
                </div>
                <p className="text-xs text-slate-500">Detailed Rx prescription with medicine table, dosage, frequency, duration, instructions, and doctor signature.</p>
              </div>
              <button onClick={() => handleDownloadPDF('prescription')} className="w-full rounded-xl bg-blue-600 text-white py-2 text-xs font-bold hover:bg-blue-700">
                [ Download Prescription PDF ]
              </button>
            </div>

            {/* PDF C: Referral PDF */}
            <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-purple-700 font-bold text-sm">
                  <ArrowRight className="h-5 w-5" />
                  <span>Departmental Referral PDF</span>
                </div>
                <p className="text-xs text-slate-500">Inter-departmental referral slip detailing referring doctor, target specialty, clinical rationale, and signature.</p>
              </div>
              <button onClick={() => handleDownloadPDF('referral')} className="w-full rounded-xl bg-purple-600 text-white py-2 text-xs font-bold hover:bg-purple-700">
                [ Download Referral PDF ]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 11: BILLING STATUS (Section 12 Blueprint) */}
      {activeTab === 'billing-status' && (
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
                <CreditCard className="h-5 w-5 text-teal-600" />
                <span>OPD BILLING & INVOICE LINK</span>
              </div>
              <span className="rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1">
                🟢 {selectedPatient.billing?.payment_status || 'Paid'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>Patient: <strong className="text-slate-900">{selectedPatient.name} ({selectedPatient.patient_id})</strong></div>
              <div>Invoice Number: <strong className="text-teal-700 font-mono">{selectedPatient.billing?.invoice_number}</strong></div>
              <div>Registration Fee: <strong className="text-slate-900">₹{selectedPatient.billing?.registration_fee || 200}</strong></div>
              <div>Consultation Fee: <strong className="text-slate-900">₹{selectedPatient.billing?.consultation_fee || 500}</strong></div>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-teal-50 p-4 border border-teal-200">
              <span className="text-xs font-bold text-slate-700 uppercase">Total OPD Charge:</span>
              <span className="text-xl font-extrabold text-teal-900 font-mono">₹{selectedPatient.billing?.total_amount || 700}</span>
            </div>

            <button
              onClick={() => alert(`Invoice ${selectedPatient.billing?.invoice_number} verified. Paid in full via Billing module.`)}
              className="w-full rounded-xl bg-teal-600 hover:bg-teal-700 text-white py-2.5 text-xs font-bold"
            >
              [ VIEW INVOICE RECEIPT ]
            </button>
          </div>
        </div>
      )}

      {/* SUB-VIEW 12 & 13: FOLLOW-UP & NOTIFICATIONS */}
      {(activeTab === 'follow-up' || activeTab === 'notifications') && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-900">
              {activeTab === 'follow-up' ? 'SCHEDULED FOLLOW-UP CALENDAR' : 'OPD SYSTEM NOTIFICATIONS'}
            </h2>
            <div className="text-xs text-slate-600 space-y-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span>✓ Follow-up for Aarav Sharma (Cardiology) scheduled for 24 Aug 2026</span>
                <span className="font-bold text-teal-700">Confirmed</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span>🧪 LIS Report Finalized for Rohan Verma (OPD-P003) — CBC Assay Complete</span>
                <span className="font-bold text-purple-700">Report Ready</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span>💊 Pharmacy Dispensed Rx for Anika Rao (OPD-P002)</span>
                <span className="font-bold text-emerald-700">Dispensed</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
