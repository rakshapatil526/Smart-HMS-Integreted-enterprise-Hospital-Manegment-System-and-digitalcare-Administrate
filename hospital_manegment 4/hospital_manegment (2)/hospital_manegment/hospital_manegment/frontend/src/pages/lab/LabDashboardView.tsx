import React from 'react';
import { LabTestRequest } from '../../types';
import { ClipboardList, TestTube, Cpu, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, FileText, FlaskConical } from 'lucide-react';

interface LabDashboardViewProps {
  requests: LabTestRequest[];
  onOpenRequest: (request: LabTestRequest, tab?: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const LabDashboardView: React.FC<LabDashboardViewProps> = ({
  requests,
  onOpenRequest,
  onNavigateTab,
}) => {
  const pendingRequests = requests.filter((r) => r.status === 'Pending' || r.status === 'Accepted');
  const samplesPendingCollection = requests.filter((r) => r.status === 'Accepted' || (r.status === 'Pending' && !r.sample_details));
  const samplesCollected = requests.filter((r) => r.status === 'Sample Collected');
  const processingCount = requests.filter((r) => r.status === 'Processing');
  const pendingVerificationCount = requests.filter((r) => r.status === 'Result Entered');
  const completedCount = requests.filter((r) => r.status === 'Verified');
  const urgentRequests = requests.filter((r) => r.priority === 'Urgent' && r.status !== 'Verified');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-800 via-indigo-900 to-slate-900 p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 rounded-full bg-purple-600/40 px-3 py-1 text-xs font-semibold text-purple-200 border border-purple-400/30 mb-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Central Diagnostic Pathology & Laboratory Workspace</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Good Morning, Alex Mercer 👋</h1>
            <p className="text-xs text-purple-100/80 mt-1">
              Laboratory queue active: <strong className="text-white">{requests.length} total test orders</strong> registered today.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigateTab('requests')}
              className="inline-flex items-center space-x-2 rounded-xl bg-purple-500 hover:bg-purple-400 px-4 py-2.5 text-xs font-bold text-slate-900 transition-all shadow-sm"
            >
              <span>View All Test Requests</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards (6 Cards as requested in Section 2 Blueprint) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Pending Requests */}
        <div
          onClick={() => onNavigateTab('requests')}
          className="cursor-pointer rounded-2xl bg-white p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pending Requests</span>
            <div className="rounded-xl bg-amber-50 p-2 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <ClipboardList className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{pendingRequests.length}</div>
          <span className="text-[10px] text-amber-600 font-medium">Awaiting acceptance</span>
        </div>

        {/* Card 2: Samples Pending Collection */}
        <div
          onClick={() => onNavigateTab('collection')}
          className="cursor-pointer rounded-2xl bg-white p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pending Collection</span>
            <div className="rounded-xl bg-rose-50 p-2 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <TestTube className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{samplesPendingCollection.length}</div>
          <span className="text-[10px] text-rose-600 font-medium">Sample draw due</span>
        </div>

        {/* Card 3: Samples Collected */}
        <div
          onClick={() => onNavigateTab('collection')}
          className="cursor-pointer rounded-2xl bg-white p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Samples Collected</span>
            <div className="rounded-xl bg-blue-50 p-2 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <FlaskConical className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{samplesCollected.length}</div>
          <span className="text-[10px] text-blue-600 font-medium">Ready for bench</span>
        </div>

        {/* Card 4: Tests Processing */}
        <div
          onClick={() => onNavigateTab('processing')}
          className="cursor-pointer rounded-2xl bg-white p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tests Processing</span>
            <div className="rounded-xl bg-purple-50 p-2 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Cpu className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{processingCount.length}</div>
          <span className="text-[10px] text-purple-600 font-medium">On autoanalyzer</span>
        </div>

        {/* Card 5: Results Pending Verification */}
        <div
          onClick={() => onNavigateTab('results')}
          className="cursor-pointer rounded-2xl bg-white p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pending Verification</span>
            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{pendingVerificationCount.length}</div>
          <span className="text-[10px] text-indigo-600 font-medium">Pathology review</span>
        </div>

        {/* Card 6: Completed Reports */}
        <div
          onClick={() => onNavigateTab('reports')}
          className="cursor-pointer rounded-2xl bg-white p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Completed Reports</span>
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{completedCount.length}</div>
          <span className="text-[10px] text-emerald-600 font-medium">Published to EHR</span>
        </div>
      </div>

      {/* Prominent Urgent Test Alert Section (Section 13 requirement) */}
      {urgentRequests.length > 0 && (
        <div className="rounded-2xl border-2 border-rose-300 bg-rose-50/90 p-4 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="rounded-lg bg-rose-600 p-2 text-white shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-rose-950 flex items-center space-x-2">
                <span>⚠️ URGENT LAB REQUESTS IN QUEUE</span>
                <span className="rounded-full bg-rose-200 text-rose-900 text-[10px] font-extrabold px-2 py-0.5">
                  High Priority Triage
                </span>
              </h3>
              <p className="text-xs text-rose-900 mt-1">
                Attending physicians have marked the following lab orders as <strong>URGENT STAT</strong>. Prioritize sample collection & processing.
              </p>
              <div className="mt-3 space-y-2">
                {urgentRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center justify-between rounded-xl bg-white p-3 border border-rose-200 text-xs shadow-2xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{req.request_id} • {req.test_name}</span>
                      <span className="text-slate-500 ml-2">Patient: <strong>{req.patient_name}</strong> ({req.patient_id})</span>
                      <div className="mt-0.5 text-slate-600">
                        Requested By: <strong>{req.doctor_name}</strong> • Reason: {req.clinical_reason}
                      </div>
                    </div>
                    <button
                      onClick={() => onOpenRequest(req)}
                      className="rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-1.5 transition-colors shadow-2xs"
                    >
                      Prioritize Test
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Today's Lab Requests Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Today's Lab Requests</h2>
            <p className="text-xs text-slate-500 mt-0.5">Incoming clinical laboratory test orders from hospital doctors.</p>
          </div>
          <button
            onClick={() => onNavigateTab('requests')}
            className="text-xs font-semibold text-purple-600 hover:text-purple-700 hover:underline"
          >
            View All ({requests.length}) →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Req ID & Patient</th>
                <th className="px-5 py-3.5">Test Name</th>
                <th className="px-5 py-3.5">Doctor</th>
                <th className="px-5 py-3.5">Priority</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.slice(0, 5).map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-4 font-semibold text-slate-900">
                    <div className="flex items-center space-x-3">
                      <div className="h-9 w-9 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
                        🧪
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{req.request_id}</div>
                        <div className="text-[11px] text-slate-500">{req.patient_name} ({req.patient_id})</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-bold text-purple-950">{req.test_name}</td>
                  <td className="px-5 py-4 text-slate-600">{req.doctor_name}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        req.priority === 'Urgent'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {req.priority === 'Urgent' ? '⚠️ Urgent' : 'Normal'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        req.status === 'Verified'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : req.status === 'Processing'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : req.status === 'Sample Issue'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => onOpenRequest(req)}
                      className="inline-flex items-center space-x-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 px-3.5 py-1.5 text-xs font-bold text-white transition-all shadow-xs"
                    >
                      <span>Open</span>
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
  );
};
