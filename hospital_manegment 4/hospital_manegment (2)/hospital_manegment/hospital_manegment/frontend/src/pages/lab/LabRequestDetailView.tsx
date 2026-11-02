import React, { useState } from 'react';
import { LabTestRequest, LabTestParameter } from '../../types';
import { testParameterTemplates } from './labData';
import { ArrowLeft, CheckCircle2, TestTube, Cpu, BarChart2, FileText, AlertTriangle, ShieldCheck, Save, Printer, XCircle } from 'lucide-react';
import { AILabResultAnalyzerCard } from '../../components/ai/AILabResultAnalyzerCard';

interface LabRequestDetailViewProps {
  request: LabTestRequest;
  initialTab?: string;
  onBack: () => void;
  onAcceptRequest: (id: string) => void;
  onMarkSampleCollected: (id: string, sampleType: string, sampleId: string) => void;
  onSaveProcessingStatus: (id: string, status: any, notes: string) => void;
  onSaveResults: (id: string, parameters: LabTestParameter[], remarks: string) => void;
  onVerifyResult: (id: string, status: 'Verified' | 'Correction Requested', notes?: string) => void;
  onMarkSampleIssue: (id: string, reason: string, remarks: string) => void;
}

export const LabRequestDetailView: React.FC<LabRequestDetailViewProps> = ({
  request,
  initialTab = 'detail',
  onBack,
  onAcceptRequest,
  onMarkSampleCollected,
  onSaveProcessingStatus,
  onSaveResults,
  onVerifyResult,
  onMarkSampleIssue,
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Sample Collection Form State
  const [sampleType, setSampleType] = useState('Blood');
  const [customSampleId, setCustomSampleId] = useState(
    request.sample_details?.sample_id || `LAB-S-${Math.floor(100 + Math.random() * 900)}`
  );

  // Processing Form State
  const [processingStatus, setProcessingStatus] = useState<any>(
    request.status === 'Accepted' ? 'Sample Collected' : request.status
  );
  const [processingNotes, setProcessingNotes] = useState(request.processing_notes || '');

  // Result Entry Form State
  const defaultTemplate = testParameterTemplates[request.test_name] || [
    { name: 'Parameter 1', unit: 'mg/dL', ref: 'Normal Range' },
    { name: 'Parameter 2', unit: 'U/L', ref: 'Normal Range' },
  ];

  const [parameters, setParameters] = useState<LabTestParameter[]>(
    request.result?.parameters ||
      defaultTemplate.map((t, idx) => ({
        id: `param-${idx + 1}`,
        parameter_name: t.name,
        value: '',
        unit: t.unit,
        reference_range: t.ref,
        status: 'Normal',
      }))
  );
  const [resultRemarks, setResultRemarks] = useState(request.result?.remarks || '');
  const [validationError, setValidationError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  // Sample Issue Modal State
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueReason, setIssueReason] = useState('Insufficient sample');
  const [issueRemarks, setIssueRemarks] = useState('');

  const handleUpdateParameter = (id: string, value: string, status: 'Normal' | 'High' | 'Low' | 'Abnormal') => {
    setParameters((prev) =>
      prev.map((p) => (p.id === id ? { ...p, value, status } : p))
    );
  };

  const handleSaveResultForm = (e: React.FormEvent) => {
    e.preventDefault();

    // System Validation (Section 8 requirement: don't allow invalid non-numeric values in numeric fields)
    for (const p of parameters) {
      if (!p.value.trim()) {
        setValidationError(`Value is required for parameter: ${p.parameter_name}`);
        return;
      }
      // Check if reference range implies numeric (e.g. contains numbers or units like mg/dL, g/dL, %, /µL)
      if (p.unit && p.unit !== '' && isNaN(Number(p.value.replace(/,/g, '')))) {
        setValidationError(`Invalid numeric format for ${p.parameter_name}: "${p.value}". Please enter a valid number.`);
        return;
      }
    }

    setValidationError('');
    onSaveResults(request.id, parameters, resultRemarks);
    setSaveSuccess('Lab results saved and submitted for verification!');
    setTimeout(() => setSaveSuccess(''), 4000);
  };

  const handleConfirmSampleIssue = (e: React.FormEvent) => {
    e.preventDefault();
    onMarkSampleIssue(request.id, issueReason, issueRemarks);
    setShowIssueModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 rounded-xl bg-white border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>← Back to Lab Requests Queue</span>
        </button>

        <span className="text-xs text-slate-400 font-medium">
          Lab Request • <strong className="text-purple-900">{request.request_id}</strong>
        </span>
      </div>

      {/* REQUEST SUMMARY CARD (Section 4 requirement) */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-4">
            <div className="h-14 w-14 rounded-2xl bg-purple-800 text-white flex items-center justify-center font-extrabold text-xl shadow-md">
              🧪
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-slate-900">{request.request_id} • {request.test_name}</h1>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    request.priority === 'Urgent'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {request.priority === 'Urgent' ? '⚠️ URGENT' : 'Normal'}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    request.status === 'Verified'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : request.status === 'Sample Issue'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}
                >
                  Status: {request.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Patient: <strong className="text-slate-800">{request.patient_name}</strong> ({request.patient_id}) • Age: {request.patient_age} yrs • Gender: {request.patient_gender}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-400 block font-semibold">Requested By</span>
              <span className="font-extrabold text-slate-900 mt-0.5">{request.doctor_name}</span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <span className="text-slate-400 block font-semibold">Date Requested</span>
              <span className="font-bold text-slate-800 mt-0.5">{request.requested_date}</span>
            </div>
          </div>
        </div>

        {/* Clinical Reason Banner */}
        <div className="flex items-center justify-between text-xs bg-purple-50/70 border border-purple-200 p-3 rounded-xl text-purple-950 font-medium">
          <div>
            <span className="font-bold text-purple-900">Clinical Reason / Indication:</span> {request.clinical_reason}
          </div>

          {request.status !== 'Sample Issue' && request.status !== 'Verified' && (
            <button
              onClick={() => setShowIssueModal(true)}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 hover:underline flex items-center space-x-1"
            >
              <XCircle className="h-3.5 w-3.5" />
              <span>[ Report Sample Issue ]</span>
            </button>
          )}
        </div>

        {/* WORKSPACE SUB-NAVIGATION TABS */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          {[
            { id: 'detail', label: 'REQUEST DETAIL', icon: <FileText className="h-4 w-4" /> },
            { id: 'collection', label: 'SAMPLE COLLECTION', icon: <TestTube className="h-4 w-4" /> },
            { id: 'processing', label: 'TEST PROCESSING', icon: <Cpu className="h-4 w-4" /> },
            { id: 'results', label: 'ENTER / VERIFY RESULTS', icon: <BarChart2 className="h-4 w-4" /> },
            { id: 'report', label: 'FINAL LAB REPORT', icon: <Printer className="h-4 w-4" /> },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-purple-700 text-white shadow-sm shadow-purple-600/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>[ {tab.label} ]</span>
              </button>
            );
          })}
        </div>
      </div>

      {saveSuccess && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-900 flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* SUB-TAB 1: REQUEST DETAIL */}
      {activeTab === 'detail' && (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-6">
          <h2 className="text-base font-bold text-slate-900 border-b pb-3">LAB REQUEST INFORMATION</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
              <span className="text-slate-400 font-semibold block mb-1">Request ID</span>
              <span className="text-sm font-extrabold text-purple-950 font-mono">{request.request_id}</span>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
              <span className="text-slate-400 font-semibold block mb-1">Patient Name & ID</span>
              <span className="text-sm font-extrabold text-slate-900">{request.patient_name} ({request.patient_id})</span>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
              <span className="text-slate-400 font-semibold block mb-1">Test Ordered</span>
              <span className="text-sm font-extrabold text-slate-900">{request.test_name}</span>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
              <span className="text-slate-400 font-semibold block mb-1">Category / Discipline</span>
              <span className="text-sm font-extrabold text-slate-900">{request.category}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              Status: <strong className="text-purple-900">{request.status}</strong>
            </span>

            {request.status === 'Pending' && (
              <button
                onClick={() => onAcceptRequest(request.id)}
                className="inline-flex items-center space-x-2 rounded-xl bg-purple-600 hover:bg-purple-700 px-6 py-2.5 text-xs font-bold text-white transition-all shadow-sm"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>[ ACCEPT REQUEST ]</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: SAMPLE COLLECTION (Section 5 requirement) */}
      {activeTab === 'collection' && (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <TestTube className="h-5 w-5 text-purple-700" />
            <h2 className="text-base font-bold text-slate-900">SAMPLE COLLECTION FORM</h2>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onMarkSampleCollected(request.id, sampleType, customSampleId);
              setSaveSuccess('Sample marked as collected & recorded in Laboratory log!');
              setTimeout(() => setSaveSuccess(''), 4000);
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Sample Type</label>
                <select
                  value={sampleType}
                  onChange={(e) => setSampleType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-900 focus:outline-none"
                >
                  <option value="Blood">Blood (Whole / Serum)</option>
                  <option value="Urine">Urine</option>
                  <option value="Sputum">Sputum</option>
                  <option value="Swab">Nasopharyngeal Swab</option>
                  <option value="Tissue">Biopsy / Tissue</option>
                  <option value="CSF">Cerebrospinal Fluid (CSF)</option>
                  <option value="Stool">Stool Sample</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Sample ID / Barcode</label>
                <input
                  type="text"
                  value={customSampleId}
                  onChange={(e) => setCustomSampleId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-mono font-bold text-purple-950 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Collected By</label>
                <input
                  type="text"
                  readOnly
                  value="Alex Mercer (Lab Tech)"
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 p-2.5 font-semibold text-slate-600"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="inline-flex items-center space-x-2 rounded-xl bg-purple-600 hover:bg-purple-700 px-6 py-2.5 text-xs font-bold text-white transition-all shadow-sm"
              >
                <TestTube className="h-4 w-4" />
                <span>[ MARK SAMPLE COLLECTED ]</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUB-TAB 3: TEST PROCESSING (Section 7 requirement) */}
      {activeTab === 'processing' && (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <Cpu className="h-5 w-5 text-purple-700" />
            <h2 className="text-base font-bold text-slate-900">TEST PROCESSING & BENCH LOG</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-400 block font-semibold">Patient Name</span>
              <strong className="text-slate-900">{request.patient_name}</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">Sample ID</span>
              <strong className="text-purple-950 font-mono">{request.sample_details?.sample_id || 'Not Collected'}</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">Test Name</span>
              <strong className="text-slate-900">{request.test_name}</strong>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSaveProcessingStatus(request.id, processingStatus, processingNotes);
              setSaveSuccess('Processing status updated successfully!');
              setTimeout(() => setSaveSuccess(''), 4000);
            }}
            className="space-y-5"
          >
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-700">Test Status Lifecycle</label>
              <select
                value={processingStatus}
                onChange={(e) => setProcessingStatus(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-900 focus:outline-none"
              >
                <option value="Pending">Pending</option>
                <option value="Sample Collected">Sample Collected</option>
                <option value="Processing">Processing (Bench / Autoanalyzer)</option>
                <option value="Result Entered">Result Entered</option>
                <option value="Verified">Verified</option>
              </select>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-700">Processing Notes / Reagent Batch</label>
              <textarea
                rows={3}
                value={processingNotes}
                onChange={(e) => setProcessingNotes(e.target.value)}
                placeholder="Enter autoanalyzer batch details, calibration notes, or incubation time..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-900 focus:outline-none"
              />
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="submit"
                className="inline-flex items-center space-x-2 rounded-xl bg-purple-600 hover:bg-purple-700 px-6 py-2.5 text-xs font-bold text-white transition-all shadow-sm"
              >
                <Save className="h-4 w-4" />
                <span>[ SAVE STATUS ]</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUB-TAB 4: ENTER / VERIFY RESULTS (Section 8 & 9 requirement) */}
      {activeTab === 'results' && (
        <div className="space-y-6">
          {validationError && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-900 flex items-center space-x-2 font-semibold">
              <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* RESULT ENTRY FORM */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <BarChart2 className="h-5 w-5 text-purple-700" />
                <h2 className="text-base font-bold text-slate-900">LAB RESULT ENTRY</h2>
              </div>
              <span className="text-xs text-slate-400">Test: <strong>{request.test_name}</strong></span>
            </div>

            <form onSubmit={handleSaveResultForm} className="space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-400 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Parameter Name</th>
                      <th className="px-4 py-3">Observed Value</th>
                      <th className="px-4 py-3">Unit</th>
                      <th className="px-4 py-3">Reference Range</th>
                      <th className="px-4 py-3">Parameter Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parameters.map((param) => (
                      <tr key={param.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-bold text-slate-900">{param.parameter_name}</td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={param.value}
                            onChange={(e) => handleUpdateParameter(param.id, e.target.value, param.status)}
                            placeholder="Enter result value..."
                            className="w-36 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 font-bold text-purple-950 focus:border-purple-500 focus:bg-white focus:outline-none"
                            required
                          />
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-500">{param.unit || 'N/A'}</td>
                        <td className="px-4 py-3 text-slate-600 font-mono">{param.reference_range}</td>
                        <td className="px-4 py-3">
                          <select
                            value={param.status}
                            onChange={(e) => handleUpdateParameter(param.id, param.value, e.target.value as any)}
                            className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 font-bold text-xs focus:outline-none"
                          >
                            <option value="Normal">Normal</option>
                            <option value="High">High</option>
                            <option value="Low">Low</option>
                            <option value="Abnormal">Abnormal</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-slate-700">Pathologist / Technician Remarks</label>
                <input
                  type="text"
                  value={resultRemarks}
                  onChange={(e) => setResultRemarks(e.target.value)}
                  placeholder="Clinical remarks or specimen notes..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="inline-flex items-center space-x-2 rounded-xl bg-purple-600 hover:bg-purple-700 px-6 py-2.5 text-xs font-bold text-white transition-all shadow-sm"
                >
                  <Save className="h-4 w-4" />
                  <span>[ SAVE RESULT ]</span>
                </button>
              </div>
            </form>
          </div>

          {/* AI DIAGNOSTIC & DELTA CHECK ANALYSIS */}
          <AILabResultAnalyzerCard
            requestId={request.request_id}
            patientName={request.patient_name}
            testName={request.test_name}
            sampleType={request.sample_details?.sample_type || 'Blood'}
          />

          {/* RESULT VERIFICATION SECTION (Section 9 requirement) */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">RESULT VERIFICATION WORKFLOW</h3>
              <span className="text-xs text-slate-400">Pathology Sign-off</span>
            </div>

            <p className="text-xs text-slate-500">
              Review entered parameter values before publishing finalized report to Attending Doctor & Patient EHR.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-3">
              <button
                onClick={() => onVerifyResult(request.id, 'Correction Requested', 'Sample re-run requested by pathologist.')}
                className="rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 px-4 py-2 text-xs font-bold transition-all"
              >
                [ SEND BACK FOR CORRECTION ]
              </button>
              <button
                onClick={() => {
                  onVerifyResult(request.id, 'Verified');
                  setSaveSuccess('Lab report verified and published to Doctor & EHR timeline!');
                  setTimeout(() => setSaveSuccess(''), 4000);
                }}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 text-xs font-bold shadow-sm transition-all"
              >
                [ VERIFY RESULT ]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: FINAL LAB REPORT (Section 10 requirement) */}
      {activeTab === 'report' && (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-lg p-8 max-w-3xl mx-auto space-y-6">
          {/* Printable Report Header */}
          <div className="border-b-2 border-slate-900 pb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center space-x-2">
                <span>🏥 SMART CARE HMS</span>
              </h1>
              <p className="text-xs font-bold uppercase tracking-wider text-purple-900 mt-0.5">
                Central Diagnostic Laboratory Report
              </p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <div className="font-mono font-bold text-slate-900">{request.request_id}</div>
              <div>Date: {request.requested_date}</div>
            </div>
          </div>

          {/* Patient & Doctor Banner */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-400 font-semibold block">Patient Name & ID</span>
              <strong className="text-slate-900 text-sm">{request.patient_name}</strong>
              <div className="text-slate-500">ID: {request.patient_id} • {request.patient_gender}, {request.patient_age} yrs</div>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">Requested By</span>
              <strong className="text-slate-900 text-sm">{request.doctor_name}</strong>
              <div className="text-slate-500">Test: <strong>{request.test_name}</strong></div>
            </div>
          </div>

          {/* Report Results Table */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Diagnostic Findings</h3>
            <table className="w-full text-left text-xs text-slate-800 border-collapse">
              <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px] border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Test Parameter</th>
                  <th className="py-2.5 px-3">Result Observed</th>
                  <th className="py-2.5 px-3">Reference Range</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {(request.result?.parameters || parameters).map((p) => (
                  <tr key={p.id}>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{p.parameter_name}</td>
                    <td className="py-2.5 px-3 font-bold text-purple-950">{p.value || '13.2'} {p.unit}</td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono">{p.reference_range}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`font-bold ${
                          p.status === 'High' || p.status === 'Low' || p.status === 'Abnormal'
                            ? 'text-rose-600'
                            : 'text-emerald-700'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Remarks & Signatures */}
          <div className="pt-4 border-t border-slate-200 space-y-4 text-xs">
            <div>
              <strong className="text-slate-700 block mb-1">Pathologist Remarks:</strong>
              <p className="text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium">
                {request.result?.remarks || 'Specimen evaluated under standard ISO 15189 laboratory protocols. Values verified.'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-6">
              <div>
                <div className="text-[11px] text-slate-400 font-medium">Processed By</div>
                <div className="font-bold text-slate-900">{request.result?.entered_by || 'Alex Mercer (Lab Tech)'}</div>
              </div>

              <div className="text-right">
                <div className="text-[11px] text-slate-400 font-medium">Verified By</div>
                <div className="font-bold text-emerald-800 flex items-center space-x-1 justify-end">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>{request.verification?.verified_by || 'Dr. Neha Shah (Senior Pathologist)'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Print / View PDF Action */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={() => alert('Opening printable PDF Laboratory Report preview...')}
              className="inline-flex items-center space-x-2 rounded-xl bg-purple-700 hover:bg-purple-800 px-6 py-2.5 text-xs font-bold text-white transition-all shadow-md"
            >
              <Printer className="h-4 w-4" />
              <span>[ VIEW PDF / PRINT REPORT ]</span>
            </button>
          </div>
        </div>
      )}

      {/* SAMPLE ISSUE MODAL (Section 14 requirement) */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-rose-600" />
              <span>MARK SAMPLE ISSUE / REJECTED</span>
            </h3>
            <p className="text-xs text-slate-500">
              Document reason why specimen cannot be processed (Notifies Attending Doctor):
            </p>

            <form onSubmit={handleConfirmSampleIssue} className="space-y-4">
              <div className="space-y-2 text-xs">
                {[
                  'Insufficient sample',
                  'Incorrect container',
                  'Damaged sample / Hemolyzed',
                  'Wrong labeling',
                  'Contaminated specimen',
                ].map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setIssueReason(reason)}
                    className={`w-full text-left rounded-xl p-2.5 font-semibold border transition-all ${
                      issueReason === reason
                        ? 'border-rose-500 bg-rose-50 text-rose-900'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    • {reason}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-slate-700">Remarks for Attending Ward</label>
                <textarea
                  rows={2}
                  value={issueRemarks}
                  onChange={(e) => setIssueRemarks(e.target.value)}
                  placeholder="Specify re-collection instructions..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2 text-xs font-bold text-white shadow-xs"
                >
                  Submit Sample Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
