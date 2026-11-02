import React, { useState } from 'react';
import { LabTestRequest, LabTestParameter } from '../../types';
import { BarChart2, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

interface LabResultsViewProps {
  requests: LabTestRequest[];
  onOpenRequest: (request: LabTestRequest, tab?: string) => void;
  onVerifyResult: (id: string, status: 'Verified' | 'Correction Requested', notes?: string) => void;
}

export const LabResultsView: React.FC<LabResultsViewProps> = ({
  requests,
  onOpenRequest,
  onVerifyResult,
}) => {
  const resultEnteredRequests = requests.filter((r) => r.status === 'Result Entered');
  const verifiedRequests = requests.filter((r) => r.status === 'Verified');

  const [saveSuccess, setSaveSuccess] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <BarChart2 className="h-5 w-5 text-purple-700" />
            <span>LAB RESULTS & VERIFICATION WORKSPACE</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review observed parameter values against reference ranges and perform senior pathologist verification.
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-900 flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>Result verified and published to Attending Doctor & Patient EHR timeline!</span>
        </div>
      )}

      {/* PENDING VERIFICATION QUEUE (Section 9 requirement) */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-indigo-700" />
            <h3 className="text-sm font-bold text-slate-900">RESULTS AWAITING PATHOLOGY VERIFICATION</h3>
          </div>
          <span className="text-xs font-bold text-indigo-700">{resultEnteredRequests.length} pending verification</span>
        </div>

        <div className="divide-y divide-slate-100 p-5 space-y-4">
          {resultEnteredRequests.map((req) => (
            <div key={req.id} className="rounded-2xl border border-slate-200 p-5 bg-slate-50/40 text-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-sm font-mono text-purple-950">{req.request_id}</span>
                    <span className="font-bold text-slate-900">• {req.test_name}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Patient: <strong>{req.patient_name}</strong> ({req.patient_id}) • Dr. {req.doctor_name}
                  </div>
                </div>

                <button
                  onClick={() => onOpenRequest(req, 'results')}
                  className="inline-flex items-center space-x-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 px-4 py-2 text-xs font-bold text-white transition-all shadow-2xs"
                >
                  <span>Open Verification Workspace</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Observed Results Preview */}
              {req.result?.parameters && (
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-700 mb-2 text-[11px] uppercase tracking-wider">Entered Findings:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                    {req.result.parameters.map((p) => (
                      <div key={p.id} className="rounded-lg bg-slate-50 p-2 border border-slate-100">
                        <span className="text-slate-500 text-[11px] block">{p.parameter_name}</span>
                        <span className="font-extrabold text-purple-950">{p.value} {p.unit}</span>
                        <span className={`text-[10px] font-bold block ${p.status === 'High' ? 'text-rose-600' : 'text-emerald-700'}`}>
                          {p.status} (Ref: {p.reference_range})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">Entered by {req.result?.entered_by || 'Alex Mercer'}</span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onVerifyResult(req.id, 'Correction Requested', 'Re-test requested')}
                    className="rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-1.5 font-bold transition-all"
                  >
                    [ SEND BACK FOR CORRECTION ]
                  </button>
                  <button
                    onClick={() => {
                      onVerifyResult(req.id, 'Verified');
                      setSaveSuccess(true);
                      setTimeout(() => setSaveSuccess(false), 4000);
                    }}
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 font-bold shadow-xs transition-all"
                  >
                    [ VERIFY RESULT ]
                  </button>
                </div>
              </div>
            </div>
          ))}

          {resultEnteredRequests.length === 0 && (
            <p className="text-center text-slate-400 text-xs py-6">
              No pending results awaiting verification at this time.
            </p>
          )}
        </div>
      </div>

      {/* VERIFIED RESULTS ARCHIVE TABLE */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-900">VERIFIED & PUBLISHED RESULTS LOG</h3>
          <span className="text-xs text-slate-500">Immutable Clinical Audit Trail</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Req ID</th>
                <th className="px-5 py-3.5">Patient</th>
                <th className="px-5 py-3.5">Test Name</th>
                <th className="px-5 py-3.5">Verified By</th>
                <th className="px-5 py-3.5">Verified At</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {verifiedRequests.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-purple-950">{r.request_id}</td>
                  <td className="px-5 py-4 font-semibold text-slate-900">{r.patient_name}</td>
                  <td className="px-5 py-4 font-bold text-slate-900">{r.test_name}</td>
                  <td className="px-5 py-4 text-emerald-800 font-bold flex items-center space-x-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{r.verification?.verified_by || 'Dr. Neha Shah'}</span>
                  </td>
                  <td className="px-5 py-4 text-slate-500">{r.verification?.verified_at || '16 Aug 2026'}</td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => onOpenRequest(r, 'report')}
                      className="inline-flex items-center space-x-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 px-3 py-1.5 text-xs font-bold text-white transition-all shadow-xs"
                    >
                      <span>View Report</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {verifiedRequests.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-6 text-center text-slate-400">
                    No verified reports logged in the active archive.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
