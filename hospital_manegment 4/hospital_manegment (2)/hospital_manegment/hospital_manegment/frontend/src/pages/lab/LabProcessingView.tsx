import React, { useState } from 'react';
import { LabTestRequest } from '../../types';
import { Cpu, CheckCircle2, Save, ArrowRight, Clock } from 'lucide-react';

interface LabProcessingViewProps {
  requests: LabTestRequest[];
  onOpenRequest: (request: LabTestRequest, tab?: string) => void;
  onSaveProcessingStatus: (id: string, status: any, notes: string) => void;
}

export const LabProcessingView: React.FC<LabProcessingViewProps> = ({
  requests,
  onOpenRequest,
  onSaveProcessingStatus,
}) => {
  const processingQueue = requests.filter(
    (r) => r.status === 'Sample Collected' || r.status === 'Processing'
  );

  const [selectedId, setSelectedId] = useState(processingQueue[0]?.id || requests[0]?.id || '');
  const [status, setStatus] = useState<any>('Processing');
  const [notes, setNotes] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const selectedReq = requests.find((r) => r.id === selectedId) || requests[0];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;

    onSaveProcessingStatus(selectedReq.id, status, notes);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Cpu className="h-5 w-5 text-purple-700" />
            <span>TEST PROCESSING & AUTOANALYZER WORKSPACE</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track bench execution, reagent loading, centrifuging, and diagnostic processing lifecycle.
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-900 flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>Test processing status saved successfully!</span>
        </div>
      )}

      {/* BENCH PROCESSING FORM (Section 7 requirement) */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">UPDATE TEST BENCH STATUS</h2>
          <span className="text-xs text-slate-400 font-semibold">Laboratory Lifecycle</span>
        </div>

        {selectedReq ? (
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block font-semibold">Select Active Test</span>
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 font-bold text-slate-900 focus:outline-none"
                >
                  {requests.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.request_id} • {r.patient_name} ({r.test_name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold">Sample Barcode ID</span>
                <strong className="text-purple-950 font-mono text-sm block mt-1">
                  {selectedReq.sample_details?.sample_id || 'Pending Collection'}
                </strong>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold">Technician On Duty</span>
                <strong className="text-slate-900 text-xs block mt-1">Alex Mercer (Lab Tech)</strong>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-700">Test Status Lifecycle</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
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
              <label className="font-bold text-slate-700">Processing Notes / Bench Observations</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Record reagent lot number, incubation temperature, or instrument calibration notes..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium focus:outline-none"
              />
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="inline-flex items-center space-x-2 rounded-xl bg-purple-600 hover:bg-purple-700 px-6 py-2.5 text-xs font-bold text-white transition-all shadow-sm"
              >
                <Save className="h-4 w-4" />
                <span>[ SAVE STATUS ]</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 text-center text-slate-400 text-xs">No active test requests in processing queue.</div>
        )}
      </div>

      {/* PROCESSING QUEUE TABLE */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-purple-700" />
            <h3 className="text-sm font-bold text-slate-900">ACTIVE BENCH PROCESSING QUEUE</h3>
          </div>
          <span className="text-xs text-slate-500">{processingQueue.length} tests on bench</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Req ID</th>
                <th className="px-5 py-3.5">Sample ID</th>
                <th className="px-5 py-3.5">Patient</th>
                <th className="px-5 py-3.5">Test Name</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processingQueue.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-purple-950">{r.request_id}</td>
                  <td className="px-5 py-4 font-mono text-slate-600">{r.sample_details?.sample_id || 'N/A'}</td>
                  <td className="px-5 py-4 font-semibold text-slate-900">{r.patient_name}</td>
                  <td className="px-5 py-4 font-bold text-slate-900">{r.test_name}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold px-2.5 py-0.5 border border-purple-200">
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => onOpenRequest(r, 'results')}
                      className="inline-flex items-center space-x-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 px-3.5 py-1.5 text-xs font-bold text-white transition-all shadow-xs"
                    >
                      <span>Enter Results</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {processingQueue.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-6 text-center text-slate-400">
                    No active tests currently in the bench processing queue.
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
