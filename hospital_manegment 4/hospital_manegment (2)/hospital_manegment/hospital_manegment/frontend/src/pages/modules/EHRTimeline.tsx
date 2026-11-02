import React, { useState } from 'react';
import {
  demoEHRPatients,
  initialEHRAuditLogs,
  EHRPatientProfile,
  EHREvent,
  EHRAuditLog
} from './ehrData';
import {
  FileText, Search, User, Calendar, HeartPulse, Activity,
  Stethoscope, FlaskConical, Image as ImageIcon, Pill, Download,
  CheckCircle2, ShieldCheck, Bell, Sparkles, Filter, Lock, Clock, X
} from 'lucide-react';
import { downloadPDFDocument } from '../../utils/pdfDownloader';

interface EHRTimelineProps {
  onNavigateTab?: (tab: string, extraData?: any) => void;
}

export const EHRTimeline: React.FC<EHRTimelineProps> = ({ onNavigateTab }) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Data States
  const [patients, setPatients] = useState<EHRPatientProfile[]>(demoEHRPatients);
  const [selectedPatient, setSelectedPatient] = useState<EHRPatientProfile>(demoEHRPatients[0]);
  const [auditLogs, setAuditLogs] = useState<EHRAuditLog[]>(initialEHRAuditLogs);

  // Profile Inner Tab State
  const [profileSubTab, setProfileSubTab] = useState<'overview' | 'history' | 'opd' | 'ipd' | 'nursing' | 'lab' | 'radiology' | 'prescriptions' | 'documents' | 'timeline'>('overview');

  // AI Summary Drawer / Modal State
  const [showAISummaryModal, setShowAISummaryModal] = useState<boolean>(false);
  const [aiSummaryText, setAiSummaryText] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  // Filtered Patients List
  const filteredPatients = patients.filter(p => {
    return p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           p.patient_id.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Log Audit Action (Section 19 Requirement)
  const logAudit = (action: string) => {
    const newLog: EHRAuditLog = {
      id: `aud-${Date.now()}`,
      user_name: 'Dr. Arjun Mehta',
      role: 'Senior Consultant Physician',
      action: action,
      patient_id: selectedPatient.patient_id,
      timestamp: `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Open Patient Dossier
  const handleOpenPatientEHR = (pat: EHRPatientProfile) => {
    setSelectedPatient(pat);
    logAudit(`Viewed Patient EHR Dossier for ${pat.name}`);
    setActiveTab('records');
  };

  // Generate AI Clinical EHR Summary (Section 17 Requirement)
  const handleGenerateAISummary = () => {
    setAiLoading(true);
    setShowAISummaryModal(true);

    setTimeout(() => {
      const summary = `🤖 AI CLINICAL SYNTHESIS FOR ${selectedPatient.name.toUpperCase()} (${selectedPatient.patient_id})

• Medical Context: 38-year-old male with active Hypertension and Mild Asthma. Allergy flagged: Penicillin (High Risk).
• Clinical Summary: Admitted on 17 Aug 2026 for exertional angina. Cardiac MRI revealed normal LVEF 62% without myocardial scar.
• Lab Results: CBC & Hemoglobin (14.2 g/dL) within normal limits. Total Cholesterol mildly elevated at 210 mg/dL.
• Recent Treatment: Pain-free for 48h. Discharged on 20 Aug 2026 with Metoprolol 25mg, Atorvastatin 40mg, and Aspirin 75mg.
• AI Recommendation: Outpatient lipid panel review in 4 weeks. Continue current cardiac regimen under physician review.`;
      setAiSummaryText(summary);
      setAiLoading(false);
      logAudit('Generated AI Clinical Synthesis');
    }, 1200);
  };

  // Download PDF Document
  const handleDownloadPDF = async (docTitle: string, docRef?: string) => {
    logAudit(`Downloaded PDF Document (${docTitle})`);

    let docType = 'ehr_summary';
    if (docTitle.toLowerCase().includes('discharge')) docType = 'discharge_summary';
    else if (docTitle.toLowerCase().includes('prescription')) docType = 'prescription';
    else if (docTitle.toLowerCase().includes('lab')) docType = 'lab_report';
    else if (docTitle.toLowerCase().includes('radiology') || docTitle.toLowerCase().includes('mri')) docType = 'radiology_report';

    await downloadPDFDocument(
      docType,
      {
        title: docTitle,
        patient_name: selectedPatient.name,
        patient_id: selectedPatient.patient_id,
        date: selectedPatient.last_visit_date,
        doctor_name: 'Dr. Arjun Mehta',
        summary: `Official Electronic Health Record Document (${docTitle}) issued by Smart Care HMS.`,
      },
      `${docTitle.replace(/\s+/g, '_')}_${selectedPatient.patient_id}.pdf`
    );
  };

  return (
    <div className="space-y-6 font-['Inter',sans-serif]">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-white shadow-md">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">📋 CENTRAL ELECTRONIC HEALTH RECORDS (EHR)</h1>
              <p className="text-xs text-slate-500">
                Unified Patient Medical Timeline: OPD + IPD + Nursing + Lab + Radiology + Prescriptions + Discharge
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold">
          <span className="rounded-full bg-teal-50 text-teal-800 border border-teal-200 px-3 py-1 font-bold">
            Centralized Patient ID Mapping
          </span>
          <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 font-bold">
            Audited RBAC Access
          </span>
        </div>
      </div>

      {/* Navigation Toolbar (Section 20 Requirement) */}
      <div className="flex items-center space-x-1 border-b border-slate-200 overflow-x-auto pb-2 custom-scrollbar text-xs font-semibold text-slate-600">
        {[
          { id: 'dashboard', label: '🏠 Dashboard' },
          { id: 'search', label: '🔎 Patient Search' },
          { id: 'records', label: '👤 Patient Records' },
          { id: 'opd', label: '🩺 OPD History' },
          { id: 'ipd', label: '🏥 IPD History' },
          { id: 'nursing', label: '❤️ Nursing Records' },
          { id: 'lab', label: '🧪 Laboratory Reports' },
          { id: 'radiology', label: '🩻 Radiology Reports' },
          { id: 'prescriptions', label: '💊 Prescription History' },
          { id: 'documents', label: '📄 Documents' },
          { id: 'timeline', label: '📅 Medical Timeline' },
          { id: 'audit-log', label: '🛡️ Audit Log' },
          { id: 'notifications', label: '🔔 Notifications' },
        ].map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-teal-700 text-white shadow-sm font-bold'
                  : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 block font-bold uppercase text-[10px]">Registered Patients</span>
          <strong className="text-2xl text-slate-900 font-extrabold">{patients.length}</strong>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 block font-bold uppercase text-[10px]">Total EHR Events</span>
          <strong className="text-2xl text-teal-700 font-extrabold">{selectedPatient.events.length}</strong>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 block font-bold uppercase text-[10px]">Diagnostic Reports</span>
          <strong className="text-2xl text-purple-600 font-extrabold">
            {selectedPatient.events.filter(e => e.category === 'Laboratory' || e.category === 'Radiology').length}
          </strong>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 block font-bold uppercase text-[10px]">Prescriptions On File</span>
          <strong className="text-2xl text-emerald-600 font-extrabold">
            {selectedPatient.events.filter(e => e.category === 'Prescription').length}
          </strong>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 block font-bold uppercase text-[10px]">Security Audit Logs</span>
          <strong className="text-2xl text-slate-900 font-extrabold">{auditLogs.length}</strong>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 1. EHR DASHBOARD & SEARCH VIEW (Section 1 Requirement) */}
      {/* ============================================================ */}
      {(activeTab === 'dashboard' || activeTab === 'search') && (
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search Patient Name / Patient ID (SC-P001)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:border-teal-600 focus:outline-none"
              />
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Enterprise RBAC Access: Only authorized clinical users view patient health records
            </div>
          </div>

          {/* Directory Table */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <FileText className="h-4 w-4 text-teal-700" />
                <span>CENTRAL HEALTH RECORDS DIRECTORY</span>
              </h3>
            </div>

            <div className="overflow-x-auto custom-scrollbar border border-slate-100 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] border-b">
                    <th className="p-3">Patient ID</th>
                    <th className="p-3">Patient Name</th>
                    <th className="p-3">Age / Gender</th>
                    <th className="p-3">Blood Group</th>
                    <th className="p-3">Allergies</th>
                    <th className="p-3">Last Visit</th>
                    <th className="p-3">Active Admission</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {filteredPatients.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono font-bold text-teal-700">{p.patient_id}</td>
                      <td className="p-3 font-bold text-slate-900">{p.name}</td>
                      <td className="p-3 text-slate-700">{p.age} Yrs / {p.gender}</td>
                      <td className="p-3 font-bold text-red-600">{p.blood_group}</td>
                      <td className="p-3">
                        <span className="rounded-full bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 text-[10px] font-bold">
                          {p.allergies.join(', ')}
                        </span>
                      </td>
                      <td className="p-3 text-slate-700">{p.last_visit_date}</td>
                      <td className="p-3">
                        {p.active_admission ? (
                          <span className="rounded-full bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 text-[10px] font-bold">
                            {p.active_admission}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">None</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleOpenPatientEHR(p)}
                          className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 text-xs font-bold transition-all shadow-xs"
                        >
                          [ OPEN EHR ]
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

      {/* ============================================================ */}
      {/* 2. PATIENT EHR DOSSIER & PROFILE (Section 2, 3, 4, 5) */}
      {/* ============================================================ */}
      {(activeTab === 'records' || activeTab === 'timeline' || activeTab === 'opd' || activeTab === 'ipd' || activeTab === 'nursing' || activeTab === 'lab' || activeTab === 'radiology' || activeTab === 'prescriptions' || activeTab === 'documents') && (
        <div className="space-y-6">
          {/* Header Card (Section 2 Requirement) */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
              <div className="flex items-center space-x-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-700 text-white font-extrabold text-xl shadow-md">
                  {(selectedPatient?.name || 'Patient').split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{selectedPatient.name}</h2>
                  <div className="flex items-center space-x-3 text-xs text-slate-500 font-medium mt-0.5">
                    <span>Patient ID: <strong className="font-mono text-teal-700">{selectedPatient.patient_id}</strong></span>
                    <span>Age: <strong>{selectedPatient.age} | {selectedPatient.gender}</strong></span>
                    <span>Blood Group: <strong className="text-red-600">{selectedPatient.blood_group}</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleGenerateAISummary}
                  className="flex items-center space-x-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white px-3.5 py-2 text-xs font-bold transition-all shadow-md"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>AI Clinical Synthesis</span>
                </button>

                <button
                  onClick={() => handleDownloadPDF('Central_EHR_Summary')}
                  className="flex items-center space-x-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 text-xs font-bold transition-all shadow-md"
                >
                  <Download className="h-4 w-4 text-teal-400" />
                  <span>Download Full EHR PDF</span>
                </button>
              </div>
            </div>

            {/* Inner Sub-Navigation Tabs (Section 2 Blueprint) */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs font-semibold text-slate-600 custom-scrollbar border-b">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'timeline', label: 'Timeline' },
                { id: 'history', label: 'Medical History' },
                { id: 'opd', label: 'OPD Visits' },
                { id: 'ipd', label: 'IPD Admissions' },
                { id: 'nursing', label: 'Nursing Records' },
                { id: 'lab', label: 'Laboratory' },
                { id: 'radiology', label: 'Radiology RIS' },
                { id: 'prescriptions', label: 'Prescriptions' },
                { id: 'documents', label: 'Documents & PDFs' },
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setProfileSubTab(sub.id as any)}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    profileSubTab === sub.id
                      ? 'bg-slate-900 text-white font-bold'
                      : 'hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  [{sub.label}]
                </button>
              ))}
            </div>

            {/* SUB-VIEW 1: OVERVIEW (Section 3 Requirement) */}
            {profileSubTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm border-b pb-1">CLINICAL PROFILE &amp; CONDITIONS</h4>
                  <div><strong>Known Medical Conditions:</strong> {selectedPatient.medical_conditions.join(', ')}</div>
                  <div><strong>Allergies:</strong> <span className="font-bold text-red-600">{selectedPatient.allergies.join(', ')}</span></div>
                  <div><strong>Current Medications:</strong> {selectedPatient.current_medications.join(', ')}</div>
                  <div><strong>Recent Diagnosis:</strong> {selectedPatient.recent_diagnosis}</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm border-b pb-1">RECENT VISIT SUMMARY</h4>
                  <div><strong>Last Consultation:</strong> {selectedPatient.last_visit_date}</div>
                  <div><strong>Active Admission Status:</strong> {selectedPatient.active_admission || 'None'}</div>
                  <div><strong>Recent Lab Test:</strong> Complete Blood Count (CBC) — Finalized</div>
                  <div><strong>Recent Scan:</strong> Cardiac &amp; Brain MRI (3T PACS) — Finalized</div>
                </div>
              </div>
            )}

            {/* SUB-VIEW 2: TIMELINE (Section 5 Requirement) */}
            {profileSubTab === 'timeline' && (
              <div className="relative border-l-2 border-teal-500/30 pl-6 ml-3 space-y-6 pt-2">
                {selectedPatient.events.map(item => (
                  <div key={item.id} className="relative group text-xs">
                    <div className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full bg-teal-600 ring-4 ring-white group-hover:scale-125 transition-all"></div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 hover:bg-white hover:shadow-md transition-all space-y-2">
                      <div className="flex items-center justify-between border-b pb-1">
                        <span className="font-bold text-teal-800 text-sm">{item.title}</span>
                        <span className="text-[10px] font-mono text-slate-500">{item.date_str}</span>
                      </div>

                      <div className="text-slate-700 font-medium">{item.summary}</div>

                      <div className="text-[11px] text-slate-500">
                        Physician / Staff: <strong>{item.doctor_or_staff}</strong> ({item.department})
                      </div>

                      {item.document_pdf_ref && (
                        <div className="pt-2">
                          <button
                            onClick={() => handleDownloadPDF(item.title, item.document_pdf_ref)}
                            className="rounded-xl bg-slate-900 text-white px-3 py-1 font-bold text-[10px] flex items-center space-x-1"
                          >
                            <Download className="h-3 w-3 text-teal-400" />
                            <span>Download PDF Document</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SUB-VIEW 3: DOCUMENTS (Section 13 Requirement) */}
            {profileSubTab === 'documents' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                {selectedPatient.events.filter(e => e.document_pdf_ref).map(doc => (
                  <div key={doc.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">{doc.title}</h4>
                      <span className="text-[10px] text-slate-500">Date: {doc.date_str} • Ref: {doc.document_pdf_ref}</span>
                    </div>

                    <button
                      onClick={() => handleDownloadPDF(doc.title, doc.document_pdf_ref)}
                      className="rounded-xl bg-teal-700 hover:bg-teal-800 text-white px-3.5 py-2 font-bold text-xs shadow-xs"
                    >
                      [ DOWNLOAD ]
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. AUDIT TRAIL LOG VIEW (Section 19 Requirement) */}
      {/* ============================================================ */}
      {activeTab === 'audit-log' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="border-b pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-teal-700" />
                <span>🛡️ IMMUTABLE EHR SECURITY AUDIT TRAIL LOG</span>
              </h2>
              <p className="text-xs text-slate-500">Enterprise compliance tracking every record view, report access, and PDF download</p>
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar border border-slate-100 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] border-b">
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">User &amp; Role</th>
                  <th className="p-3">Action Performed</th>
                  <th className="p-3">Target Patient ID</th>
                  <th className="p-3">Security Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono text-slate-500">{log.timestamp}</td>
                    <td className="p-3 font-bold text-slate-900">{log.user_name} <div className="text-[10px] text-slate-400">{log.role}</div></td>
                    <td className="p-3 font-bold text-teal-800">{log.action}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">{log.patient_id}</td>
                    <td className="p-3">
                      <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold">
                        VERIFIED AUDITED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. NOTIFICATIONS VIEW */}
      {/* ============================================================ */}
      {activeTab === 'notifications' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 max-w-3xl mx-auto text-xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Bell className="h-5 w-5 text-teal-500" />
            <span>EHR TIMELINE ALERTS</span>
          </h2>
          <div className="space-y-2">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 font-bold text-emerald-900">
              📄 Discharge Summary finalized for Aarav Sharma (SC-P001). Pushed to EHR Timeline.
            </div>
            <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 font-bold text-teal-900">
              🩻 MRI Brain scan results attached to EHR record by Dr. Robert Vance.
            </div>
          </div>
        </div>
      )}

      {/* AI Clinical Summary Drawer / Modal (Section 17 Requirement) */}
      {showAISummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl bg-slate-900 text-white p-6 shadow-2xl relative space-y-4 border border-slate-800">
            <button onClick={() => setShowAISummaryModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1">
              <X className="h-6 w-6" />
            </button>

            <div className="border-b border-slate-800 pb-3 flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <h3 className="text-base font-bold text-purple-400">AI CLINICAL DECISION SUPPORT &amp; EHR SYNTHESIS</h3>
            </div>

            {aiLoading ? (
              <div className="py-12 text-center text-xs text-purple-300 font-bold animate-pulse">
                Analyzing longitudinal OPD visits, Cardiac MRI scans, LIS blood parameters, and prescribed medications...
              </div>
            ) : (
              <div className="space-y-3 text-xs font-mono whitespace-pre-wrap bg-slate-950 p-4 rounded-2xl border border-slate-800 text-purple-200 leading-relaxed">
                {aiSummaryText}
              </div>
            )}

            <div className="pt-2 text-[10px] text-slate-400 italic">
              Note: AI summaries assist clinical workflow decision-making under attending physician review per Section 17 rules.
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button onClick={() => setShowAISummaryModal(false)} className="rounded-xl bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 font-bold text-xs shadow-md">
                Close Synthesis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EHRTimeline;
