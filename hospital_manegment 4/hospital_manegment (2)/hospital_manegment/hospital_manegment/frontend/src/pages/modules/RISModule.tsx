import React, { useState, useEffect } from 'react';
import { sharedStore } from '../../services/sharedStore';
import {
  initialRISRequests,
  initialRISSchedules,
  initialRISStudies,
  initialRISReports,
  RISRequest,
  RISSchedule,
  RISImagingStudy,
  RISReport
} from './risData';
import {
  LayoutDashboard, ClipboardList, Calendar, Image as ImageIcon,
  FileText, Bell, User, Search, Plus, CheckCircle2, AlertTriangle,
  Download, Clock, Eye, X, ArrowRight, Sparkles, ShieldCheck, Filter
} from 'lucide-react';
import { downloadPDFDocument } from '../../utils/pdfDownloader';
import { AIRadiologySuggestionCard } from '../../components/ai/AIRadiologySuggestionCard';

interface RISModuleProps {
  onNavigateTab?: (tab: string, extraData?: any) => void;
}

export const RISModule: React.FC<RISModuleProps> = ({ onNavigateTab }) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('ALL');

  // Main Data States
  const [requests, setRequests] = useState<RISRequest[]>(initialRISRequests);
  const [schedules, setSchedules] = useState<RISSchedule[]>(initialRISSchedules);
  const [studies, setStudies] = useState<RISImagingStudy[]>(initialRISStudies);
  const [reports, setReports] = useState<RISReport[]>(initialRISReports);
  const [notifications, setNotifications] = useState<any[]>(sharedStore.getRadiologyNotifications());

  React.useEffect(() => {
    const handleRadUpdate = () => {
      setNotifications(sharedStore.getRadiologyNotifications());
    };
    handleRadUpdate();
    window.addEventListener('smartcare_radiology_added', handleRadUpdate);
    window.addEventListener('smartcare_radiology_notif_added', handleRadUpdate);
    return () => {
      window.removeEventListener('smartcare_radiology_added', handleRadUpdate);
      window.removeEventListener('smartcare_radiology_notif_added', handleRadUpdate);
    };
  }, []);

  // Active Request Modal State
  const [selectedRequest, setSelectedRequest] = useState<RISRequest | null>(null);

  // Schedule Modal / Form State
  const [schRequestId, setSchRequestId] = useState<string>('RAD-2026-001');
  const [schDate, setSchDate] = useState<string>('20 Aug 2026');
  const [schTime, setSchTime] = useState<string>('10:30 AM');
  const [schMachine, setSchMachine] = useState<string>('MRI-3T-SUITE-01');
  const [schTechnician, setSchTechnician] = useState<string>('Tech Marcus Brody');

  // PACS Viewer Modal State
  const [activePACSStudy, setActivePACSStudy] = useState<RISImagingStudy | null>(null);

  // Report Writer Form State
  const [repRequestId, setRepRequestId] = useState<string>('RAD-2026-001');
  const [repFindings, setRepFindings] = useState<string>('Multi-planar cine and late gadolinium enhancement (LGE) MRI sequences performed. Left ventricular end-diastolic volume is normal. LVEF is 62%. No transmural or subendocardial myocardial infarction scar.');
  const [repImpression, setRepImpression] = useState<string>('1. Unremarkable Cardiac MRI examination with normal LV systolic function.\n2. No structural myocardial scar or ischemic perfusion defect identified.');
  const [repRecommendations, setRepRecommendations] = useState<string>('Routine outpatient clinical cardiology follow-up as clinically indicated.');
  const [repRadiologist, setRepRadiologist] = useState<string>('Dr. Robert Vance, MD (Radiology)');
  const [repStatus, setRepStatus] = useState<'Draft' | 'Reviewed' | 'Finalized'>('Draft');

  // Derived Metrics
  const pendingRequestsCount = requests.filter(r => r.status === 'Pending' || r.status === 'Accepted').length;
  const todaysScansCount = schedules.length;
  const reportsPendingCount = requests.filter(r => r.status === 'Scan Completed' || r.status === 'Report Drafted').length;
  const scheduledScansCount = requests.filter(r => r.status === 'Scheduled').length;
  const completedScansCount = requests.filter(r => r.status === 'Finalized').length;

  // Filtered Requests
  const filteredRequests = requests.filter(r => {
    const matchesQuery = r.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         r.request_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         r.patient_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'ALL' || r.investigation === filterType;
    return matchesQuery && matchesType;
  });

  // Handle Accept Request
  const handleAcceptRequest = (reqId: string) => {
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'Accepted' } : r));
    alert('Radiology Request accepted. Ready for machine slot scheduling.');
  };

  // Handle Schedule Confirmation
  const handleConfirmSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const req = requests.find(r => r.request_id === schRequestId);
    if (!req) {
      alert('Selected radiology request not found.');
      return;
    }

    // Update request status to Scheduled
    setRequests(prev => prev.map(r => r.request_id === schRequestId ? { ...r, status: 'Scheduled' } : r));

    // Add to schedule queue
    const newSch: RISSchedule = {
      id: `sch-${Date.now()}`,
      request_id: schRequestId,
      patient_name: req.patient_name,
      investigation: `${req.investigation} (${req.body_part})`,
      scheduled_date: schDate,
      scheduled_time: schTime,
      machine_id: schMachine,
      technician_name: schTechnician,
      status: 'Scheduled',
    };
    setSchedules(prev => [newSch, ...prev]);

    alert(`Scan slot scheduled for ${req.patient_name}:\n- Date: ${schDate} at ${schTime}\n- Machine: ${schMachine}\n- Technician: ${schTechnician}`);
    setActiveTab('schedule');
  };

  // Handle Queue Status Advancement
  const handleAdvanceQueueStatus = (schId: string, currentStatus: RISSchedule['status']) => {
    let nextStatus: RISSchedule['status'] = 'Patient Arrived';
    if (currentStatus === 'Scheduled') nextStatus = 'Patient Arrived';
    else if (currentStatus === 'Patient Arrived') nextStatus = 'In Progress';
    else if (currentStatus === 'In Progress') nextStatus = 'Completed';

    setSchedules(prev => prev.map(s => s.id === schId ? { ...s, status: nextStatus } : s));

    if (nextStatus === 'Completed') {
      const sch = schedules.find(s => s.id === schId);
      if (sch) {
        setRequests(prev => prev.map(r => r.request_id === sch.request_id ? { ...r, status: 'Scan Completed' } : r));

        // Create mock PACS study entry
        const newStudy: RISImagingStudy = {
          id: `std-${Date.now()}`,
          request_id: sch.request_id,
          patient_id: 'SC-P001',
          patient_name: sch.patient_name,
          investigation: sch.investigation,
          study_date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          image_urls: [
            'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80'
          ],
          total_series: 3,
          total_images: 96,
          pacs_accession_no: `ACC-2026-${Math.floor(Math.random() * 9000) + 1000}`,
          status: 'Archived in PACS',
        };
        setStudies(prev => [newStudy, ...prev]);
        alert(`Scan completed for ${sch.patient_name}!\n- DICOM series archived in PACS Storage.\n- Status updated to Scan Completed.`);
      }
    }
  };

  // Handle Save / Finalize Radiologist Report
  const handleSaveReport = (statusToSet: 'Draft' | 'Finalized') => {
    const req = requests.find(r => r.request_id === repRequestId);
    if (!req) {
      alert('Selected radiology request not found.');
      return;
    }

    const newReport: RISReport = {
      id: `rep-${Date.now()}`,
      report_id: `REP-2026-${Math.floor(Math.random() * 800) + 100}`,
      request_id: repRequestId,
      patient_id: req.patient_id,
      patient_name: req.patient_name,
      investigation: `${req.investigation} (${req.body_part})`,
      doctor_name: req.doctor_name,
      radiologist_name: repRadiologist,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      clinical_history: req.clinical_reason,
      findings: repFindings,
      impression: repImpression,
      recommendations: repRecommendations,
      status: statusToSet,
      pdf_ref: `RAD_REP_${req.patient_id}.pdf`,
    };

    setReports(prev => [newReport, ...prev.filter(rep => rep.request_id !== repRequestId)]);
    setRequests(prev => prev.map(r => r.request_id === repRequestId ? { ...r, status: statusToSet === 'Finalized' ? 'Finalized' : 'Report Drafted' } : r));

    if (statusToSet === 'Finalized') {
      sharedStore.completeRadiologyReport(repRequestId, repRadiologist, repFindings);
      alert(`Radiology Report FINALIZED for ${req.patient_name}!\n- Locked against non-authorized editing.\n- Dispatched notification to Dr. ${req.doctor_name}.\n- Pushed event to Central EHR Timeline.\n- Transmitted $${req.cost} charge to Billing Module.`);
      setActiveTab('finalized');
    } else {
      alert('Radiology Report draft saved successfully.');
    }
  };

  // Handle Generate Radiology PDF Document
  const handleGeneratePDF = async (reportObj?: RISReport) => {
    const target = reportObj || reports[0];
    await downloadPDFDocument(
      'radiology_report',
      {
        request_number: target.request_id,
        patient_name: target.patient_name,
        patient_id: target.patient_id,
        doctor_name: target.doctor_name,
        modality: target.investigation,
        body_part: target.investigation,
        date: target.date,
        radiologist: target.radiologist_name,
        findings: target.findings,
        impression: target.impression,
        recommendations: target.recommendations,
      },
      `Radiology_Report_${target.patient_name.replace(/\s+/g, '_')}.pdf`
    );
  };

  return (
    <div className="space-y-6 font-['Inter',sans-serif]">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-teal-400 shadow-md">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">🩻 RADIOLOGY INFORMATION SYSTEM (RIS)</h1>
              <p className="text-xs text-slate-500">
                Medical Imaging Workflow: Request ➔ Schedule ➔ Perform Scan ➔ PACS Storage ➔ Radiologist Review ➔ Final Report
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="rounded-full bg-rose-50 text-rose-800 border border-rose-200 px-3 py-1 font-bold">
            PACS Connected
          </span>
          <span className="rounded-full bg-teal-50 text-teal-800 border border-teal-200 px-3 py-1 font-bold">
            DICOM Archiving Active
          </span>
        </div>
      </div>

      {/* DOCTOR RADIOLOGY SCAN ORDERS NOTIFICATION FEED */}
      <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-rose-900 flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <Bell className="h-4 w-4 text-rose-600 animate-bounce" />
            <span>INCOMING DOCTOR RADIOLOGY IMAGING NOTIFICATIONS & SCAN REQUESTS</span>
          </span>
          <span className="rounded-full bg-rose-600 text-white text-[11px] font-bold px-2.5 py-0.5">
            {notifications.length} Alerts
          </span>
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
          {notifications.map((n) => (
            <div key={n.id} className="rounded-xl border border-rose-100 bg-white p-3 shadow-2xs flex items-start justify-between">
              <div className="flex items-start space-x-2.5">
                <ImageIcon className="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                  <p className="text-xs text-slate-600">{n.message}</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-semibold text-slate-400 shrink-0">{n.timestamp}</span>
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="text-center text-xs text-slate-400 py-3">No incoming doctor radiology notifications.</div>
          )}
        </div>
      </div>

      {/* Navigation Toolbar (Section 16 Requirement) */}
      <div className="flex items-center space-x-1 border-b border-slate-200 overflow-x-auto pb-2 custom-scrollbar text-xs font-semibold text-slate-600">
        {[
          { id: 'dashboard', label: '🏠 Dashboard' },
          { id: 'requests', label: '📋 Imaging Requests' },
          { id: 'schedule', label: '📅 Scan Schedule' },
          { id: 'queue', label: '🩻 Today\'s Scans' },
          { id: 'pacs', label: '🖼️ Imaging Studies' },
          { id: 'reports', label: '📝 Reports' },
          { id: 'finalized', label: '📄 Final Reports / PDF' },
          { id: 'ai-assistant', label: '🤖 AI Diagnostic Assist' },
          { id: 'notifications', label: '🔔 Notifications' },
          { id: 'profile', label: '👤 My Profile' },
        ].map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-rose-600 text-white shadow-sm font-bold'
                  : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Metrics Bar (Section 1 Requirement) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 block font-bold uppercase text-[10px]">Pending Requests</span>
          <strong className="text-2xl text-amber-600 font-extrabold">{pendingRequestsCount}</strong>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 block font-bold uppercase text-[10px]">Scheduled Scans</span>
          <strong className="text-2xl text-blue-600 font-extrabold">{scheduledScansCount}</strong>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 block font-bold uppercase text-[10px]">Today's Scans</span>
          <strong className="text-2xl text-slate-900 font-extrabold">{todaysScansCount}</strong>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 block font-bold uppercase text-[10px]">Reports Pending</span>
          <strong className="text-2xl text-rose-600 font-extrabold">{reportsPendingCount}</strong>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 block font-bold uppercase text-[10px]">Completed &amp; Finalized</span>
          <strong className="text-2xl text-emerald-600 font-extrabold">{completedScansCount}</strong>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 1. RADIOLOGY DASHBOARD VIEW */}
      {/* ============================================================ */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Search & Filter */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search Patient Name / Request ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-2 text-xs w-full sm:w-auto justify-end">
              <span className="text-slate-500 font-medium">Imaging Type:</span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
              >
                <option value="ALL">All Modalities</option>
                <option value="X-Ray">🩻 X-Ray</option>
                <option value="MRI">🧠 MRI</option>
                <option value="CT Scan">🖥️ CT Scan</option>
                <option value="Ultrasound">🩺 Ultrasound</option>
                <option value="Echocardiography">🫀 Echocardiography</option>
              </select>
            </div>
          </div>

          {/* Main Radiology Requests Directory Table (Section 1 Layout Requirement) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <ImageIcon className="h-4 w-4 text-rose-600" />
                <span>RADIOLOGY WORKLIST &amp; REQUEST DIRECTORY</span>
              </h3>
            </div>

            <div className="overflow-x-auto custom-scrollbar border border-slate-100 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] border-b border-slate-200">
                    <th className="p-3">Request ID</th>
                    <th className="p-3">Patient</th>
                    <th className="p-3">Investigation Scan</th>
                    <th className="p-3">Requested By (Doctor)</th>
                    <th className="p-3">Priority</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-400 italic">
                        No radiology requests match the current search filter.
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono font-bold text-rose-700">{r.request_id}</td>
                        <td className="p-3 font-bold text-slate-900">{r.patient_name} ({r.patient_id})</td>
                        <td className="p-3 font-bold text-slate-800">{r.investigation} — {r.body_part}</td>
                        <td className="p-3 text-slate-700">{r.doctor_name}</td>
                        <td className="p-3">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              r.priority === 'STAT Emergency'
                                ? 'bg-red-100 text-red-800'
                                : r.priority === 'Urgent'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {r.priority}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="rounded-full bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 text-[10px] font-bold">
                            {r.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setSelectedRequest(r)}
                            className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 text-xs font-bold transition-all border shadow-xs"
                          >
                            [ OPEN REQUEST ]
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
      {/* 2. IMAGING REQUESTS VIEW (Section 2 & 3 Requirement) */}
      {/* ============================================================ */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="border-b pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">📋 INCOMING DOCTOR RADIOLOGY REQUESTS</h2>
                <p className="text-xs text-slate-500">Doctor orders ➔ Staff reviews &amp; accepts ➔ Slot scheduling</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {requests.map(req => (
                <div key={req.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-mono font-bold text-rose-700 text-sm">{req.request_id}</span>
                    <span className="rounded-full bg-rose-100 text-rose-800 px-2.5 py-0.5 text-[10px] font-bold">
                      {req.investigation}
                    </span>
                  </div>

                  <div className="space-y-1 text-slate-700">
                    <div><strong>Patient:</strong> {req.patient_name} ({req.patient_id})</div>
                    <div><strong>Requested By:</strong> {req.doctor_name} ({req.department})</div>
                    <div><strong>Body Part / Scan:</strong> {req.body_part}</div>
                    <div><strong>Priority:</strong> <span className="font-bold text-red-600">{req.priority}</span></div>
                    <div><strong>Clinical Reason:</strong> <span className="italic text-slate-600">{req.clinical_reason}</span></div>
                  </div>

                  <div className="pt-2 border-t flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500">Estimated Cost: ${req.cost}</span>
                    <div className="flex space-x-2">
                      {req.status === 'Pending' && (
                        <button
                          onClick={() => handleAcceptRequest(req.id)}
                          className="rounded-xl bg-teal-600 text-white px-3 py-1.5 font-bold hover:bg-teal-700"
                        >
                          [ ACCEPT REQUEST ]
                        </button>
                      )}
                      <button
                        onClick={() => { setSchRequestId(req.request_id); setActiveTab('schedule'); }}
                        className="rounded-xl bg-slate-900 text-white px-3 py-1.5 font-bold hover:bg-slate-800"
                      >
                        [ SCHEDULE SCAN ]
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. SCAN SCHEDULE VIEW (Section 4 Requirement) */}
      {/* ============================================================ */}
      {activeTab === 'schedule' && (
        <div className="max-w-3xl mx-auto rounded-3xl border border-slate-200 bg-white p-8 shadow-md space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-rose-600" />
              <span>SCHEDULE RADIOLOGY SCAN SLOT</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select accepted request ➔ Choose machine suite &amp; technician ➔ Confirm appointment
            </p>
          </div>

          <form onSubmit={handleConfirmSchedule} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Select Radiology Request</label>
              <select
                value={schRequestId}
                onChange={(e) => setSchRequestId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 font-bold text-slate-900 focus:outline-none"
              >
                {requests.map(r => (
                  <option key={r.id} value={r.request_id}>
                    {r.request_id} — {r.patient_name} [{r.investigation} ({r.body_part})]
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Available Date</label>
                <input
                  type="text"
                  required
                  value={schDate}
                  onChange={(e) => setSchDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Available Time Slot</label>
                <input
                  type="text"
                  required
                  value={schTime}
                  onChange={(e) => setSchTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Machine / Suite</label>
                <select
                  value={schMachine}
                  onChange={(e) => setSchMachine(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-bold text-rose-800 focus:outline-none"
                >
                  <option value="MRI-3T-SUITE-01">MRI-3T-SUITE-01 (High Field MRI)</option>
                  <option value="CT-64-SLICE-02">CT-64-SLICE-02 (Multi-detector CT)</option>
                  <option value="XRAY-ROOM-01">XRAY-ROOM-01 (Digital Radiography)</option>
                  <option value="USG-ROOM-03">USG-ROOM-03 (High Res Doppler Ultrasound)</option>
                  <option value="ECHO-ROOM-02">ECHO-ROOM-02 (2D Echocardiography)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Radiographer / Tech</label>
                <input
                  type="text"
                  required
                  value={schTechnician}
                  onChange={(e) => setSchTechnician(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="rounded-2xl bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 font-extrabold text-xs uppercase tracking-wider shadow-md transition-all"
              >
                [ CONFIRM SCHEDULE ]
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. TODAY'S SCAN QUEUE (Section 5 & 6 Requirement) */}
      {/* ============================================================ */}
      {activeTab === 'queue' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="border-b pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">🩻 TODAY'S RADIOLOGY WORKLIST &amp; QUEUE</h2>
              <p className="text-xs text-slate-500">Live patient arrival ➔ Scan performance ➔ Image acquisition</p>
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar border border-slate-100 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] border-b">
                  <th className="p-3">Time</th>
                  <th className="p-3">Request ID</th>
                  <th className="p-3">Patient Name</th>
                  <th className="p-3">Investigation</th>
                  <th className="p-3">Machine &amp; Tech</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {schedules.map(sch => (
                  <tr key={sch.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold font-mono text-slate-900">{sch.scheduled_time}</td>
                    <td className="p-3 font-mono font-bold text-rose-700">{sch.request_id}</td>
                    <td className="p-3 font-bold text-slate-900">{sch.patient_name}</td>
                    <td className="p-3 text-slate-800">{sch.investigation}</td>
                    <td className="p-3 text-slate-600">{sch.machine_id} ({sch.technician_name})</td>
                    <td className="p-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                        sch.status === 'Completed' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                        sch.status === 'Patient Arrived' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                        'bg-blue-50 text-blue-800 border-blue-200'
                      }`}>
                        {sch.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {sch.status !== 'Completed' ? (
                        <button
                          onClick={() => handleAdvanceQueueStatus(sch.id, sch.status)}
                          className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-3 py-1 text-xs font-bold shadow-xs"
                        >
                          {sch.status === 'Scheduled' ? 'Mark Patient Arrived ➔' :
                           sch.status === 'Patient Arrived' ? 'Start Scan ➔' : 'Complete Scan ➔'}
                        </button>
                      ) : (
                        <span className="text-emerald-600 font-bold text-[11px]">✓ DICOM PACS Stored</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. PACS IMAGING STUDIES (Section 7 Requirement) */}
      {/* ============================================================ */}
      {activeTab === 'pacs' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="border-b pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">🖼️ PACS DICOM IMAGING ARCHIVE</h2>
                <p className="text-xs text-slate-500">Object storage URLs &amp; DICOM series viewer</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {studies.map(std => (
                <div key={std.id} className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-rose-400">{std.investigation}</span>
                    <span className="font-mono text-[10px] text-slate-400">{std.pacs_accession_no}</span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-white">{std.patient_name} ({std.patient_id})</h4>
                    <span className="text-[11px] text-slate-400">Acquired on {std.study_date} • {std.total_series} Series / {std.total_images} Images</span>
                  </div>

                  <div className="flex space-x-2 pt-1">
                    {std.image_urls.map((url, i) => (
                      <div key={i} className="h-16 w-20 rounded-lg overflow-hidden border border-slate-700 bg-slate-800">
                        <img src={url} alt="DICOM Frame" className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-between items-center text-[11px]">
                    <span className="text-emerald-400 font-bold">{std.status}</span>
                    <button
                      onClick={() => setActivePACSStudy(std)}
                      className="rounded-xl bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 font-bold"
                    >
                      [ OPEN DICOM VIEWER ]
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 6. RADIOLOGIST REPORTS VIEW (Section 8, 9, 10 Requirement) */}
      {/* ============================================================ */}
      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2">📝 RADIOLOGIST REPORT EDITOR</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Completed Request</label>
                <select
                  value={repRequestId}
                  onChange={(e) => setRepRequestId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2 font-bold text-slate-900 focus:outline-none"
                >
                  {requests.map(r => (
                    <option key={r.id} value={r.request_id}>{r.request_id} — {r.patient_name} ({r.investigation})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Findings</label>
                <textarea
                  rows={4}
                  value={repFindings}
                  onChange={(e) => setRepFindings(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Impression</label>
                <textarea
                  rows={3}
                  value={repImpression}
                  onChange={(e) => setRepImpression(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Recommendations</label>
                <input
                  type="text"
                  value={repRecommendations}
                  onChange={(e) => setRepRecommendations(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2 text-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleSaveReport('Draft')}
                  className="w-1/2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 font-bold uppercase text-xs transition-all border"
                >
                  Save Draft
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveReport('Finalized')}
                  className="w-1/2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white py-2.5 font-bold uppercase text-xs shadow-md transition-all"
                >
                  FINALIZE REPORT
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2">📋 RADIOLOGY REPORTS LOG</h3>
            <div className="space-y-4">
              {reports.map(rep => (
                <div key={rep.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                  <div className="flex items-center justify-between border-b pb-2 font-bold text-slate-900">
                    <span>{rep.patient_name} ({rep.patient_id}) — {rep.investigation}</span>
                    <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold">
                      {rep.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-slate-700 font-medium">
                    <div><strong>Findings:</strong> {rep.findings}</div>
                    <div><strong>Impression:</strong> <span className="font-bold text-slate-900">{rep.impression}</span></div>
                    <div><strong>Recommendations:</strong> {rep.recommendations}</div>
                  </div>

                  <div className="pt-2 border-t flex justify-between items-center text-[10px] text-slate-500 font-mono">
                    <span>Radiologist: {rep.radiologist_name}</span>
                    <button
                      onClick={() => handleGeneratePDF(rep)}
                      className="rounded-xl bg-slate-900 text-white px-3 py-1 font-bold flex items-center space-x-1"
                    >
                      <Download className="h-3 w-3" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 7. FINAL REPORTS / PDF VIEW */}
      {/* ============================================================ */}
      {activeTab === 'finalized' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 max-w-4xl mx-auto">
          <div className="border-b pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">📄 FINALIZED OFFICIAL RADIOLOGY REPORTS</h2>
              <p className="text-xs text-slate-500">Locked clinical records connected to EHR, Doctor, &amp; Patient Portal</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {reports.filter(r => r.status === 'Finalized').map(rep => (
              <div key={rep.id} className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                  <span className="font-bold text-emerald-950 text-sm">{rep.investigation} ({rep.patient_name})</span>
                  <span className="font-mono text-emerald-800 font-bold">{rep.report_id}</span>
                </div>

                <div className="space-y-1 text-slate-800 font-medium">
                  <div><strong>Findings:</strong> {rep.findings}</div>
                  <div><strong>Impression:</strong> {rep.impression}</div>
                </div>

                <div className="pt-2 border-t border-emerald-200 flex justify-between items-center">
                  <span className="text-[11px] text-emerald-900 font-semibold">Signed: {rep.radiologist_name}</span>
                  <button
                    onClick={() => handleGeneratePDF(rep)}
                    className="rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 font-extrabold flex items-center space-x-1.5 shadow-md"
                  >
                    <Download className="h-4 w-4" />
                    <span>[ DOWNLOAD RADIOLOGY PDF ]</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 8. NOTIFICATIONS VIEW */}
      {/* ============================================================ */}
      {activeTab === 'notifications' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 max-w-3xl mx-auto">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Bell className="h-5 w-5 text-rose-500" />
            <span>RADIOLOGY ALERTS &amp; NOTIFICATIONS</span>
          </h2>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-red-50 rounded-xl border border-red-200 font-bold text-red-900">
              🚨 STAT Emergency Order: HRCT Chest for Rahul Verma (ICU). Machine CT-64 prepped.
            </div>
            <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 font-bold text-teal-900">
              🩻 MRI Brain for Aarav Sharma completed. DICOM images archived in PACS.
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 font-bold text-emerald-900">
              📄 Final Report signed by Dr. Robert Vance for Rajesh Kumar (Ultrasound Abdomen).
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 10. AI DIAGNOSTIC ASSISTANT VIEW */}
      {/* ============================================================ */}
      {activeTab === 'ai-assistant' && (
        <AIRadiologySuggestionCard
          requestId={requests[0]?.request_id}
          patientName={requests[0]?.patient_name}
          investigation={requests[0]?.investigation}
        />
      )}

      {/* ============================================================ */}
      {/* 9. MY PROFILE VIEW */}
      {/* ============================================================ */}
      {activeTab === 'profile' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm max-w-xl mx-auto space-y-4 text-xs">
          <div className="flex items-center space-x-3 border-b pb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-600 text-white font-bold text-lg">
              RV
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Dr. Robert Vance, MD</h3>
              <span className="text-slate-500">Senior Radiologist &amp; PACS Imaging Director</span>
            </div>
          </div>

          <div className="space-y-2 text-slate-700 font-medium">
            <div><strong>Medical Registration No:</strong> RAD-REG-2026-8809</div>
            <div><strong>Department:</strong> Radiology Information System (RIS / PACS)</div>
            <div><strong>Assigned Modalities:</strong> MRI, CT, X-Ray, Ultrasound, Echo</div>
            <div><strong>Authorized Role:</strong> Final Report Verification &amp; Clinical Sign-off</div>
          </div>
        </div>
      )}

      {/* PACS DICOM Viewer Modal */}
      {activePACSStudy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl rounded-3xl bg-slate-900 text-white p-6 shadow-2xl relative space-y-4 border border-slate-800 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button
              onClick={() => setActivePACSStudy(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-rose-400">DICOM PACS VIEWER — {activePACSStudy.investigation}</h3>
              <p className="text-xs text-slate-400">Patient: {activePACSStudy.patient_name} ({activePACSStudy.patient_id}) • Accession: {activePACSStudy.pacs_accession_no}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activePACSStudy.image_urls.map((url, idx) => (
                <div key={idx} className="bg-slate-950 p-2 rounded-2xl border border-slate-800 text-center space-y-2">
                  <img src={url} alt="DICOM Slice" className="w-full h-64 object-cover rounded-xl" />
                  <span className="text-[10px] text-slate-400 block font-mono">DICOM Slice #{idx + 1} • Window Width/Level: 350/40</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActivePACSStudy(null)}
                className="rounded-xl bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 text-xs font-bold"
              >
                Close PACS Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl relative space-y-4 border border-slate-100 text-xs">
            <button onClick={() => setSelectedRequest(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>

            <div className="border-b pb-3 font-bold text-base text-slate-900">
              Radiology Request: {selectedRequest.request_id}
            </div>

            <div className="space-y-2 text-slate-700">
              <div><strong>Patient Name:</strong> {selectedRequest.patient_name} ({selectedRequest.patient_id})</div>
              <div><strong>Requested By:</strong> {selectedRequest.doctor_name}</div>
              <div><strong>Investigation:</strong> {selectedRequest.investigation} ({selectedRequest.body_part})</div>
              <div><strong>Priority:</strong> <span className="font-bold text-red-600">{selectedRequest.priority}</span></div>
              <div><strong>Clinical Reason:</strong> {selectedRequest.clinical_reason}</div>
              <div><strong>Status:</strong> {selectedRequest.status}</div>
            </div>

            <div className="pt-3 border-t flex justify-end space-x-2">
              <button onClick={() => setSelectedRequest(null)} className="rounded-xl bg-slate-100 px-4 py-2 font-bold">Close</button>
              <button onClick={() => { setSchRequestId(selectedRequest.request_id); setSelectedRequest(null); setActiveTab('schedule'); }} className="rounded-xl bg-rose-600 text-white px-4 py-2 font-bold">Schedule Scan ➔</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RISModule;
