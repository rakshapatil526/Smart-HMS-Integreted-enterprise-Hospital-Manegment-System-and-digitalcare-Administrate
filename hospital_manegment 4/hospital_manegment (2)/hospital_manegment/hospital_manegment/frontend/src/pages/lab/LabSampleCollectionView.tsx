import React, { useState } from 'react';
import { LabTestRequest } from '../../types';
import { TestTube, Search, CheckCircle2, FlaskConical, AlertTriangle, ArrowRight } from 'lucide-react';

interface LabSampleCollectionViewProps {
  requests: LabTestRequest[];
  onOpenRequest: (request: LabTestRequest, tab?: string) => void;
  onMarkSampleCollected: (id: string, sampleType: string, sampleId: string) => void;
}

export const LabSampleCollectionView: React.FC<LabSampleCollectionViewProps> = ({
  requests,
  onOpenRequest,
  onMarkSampleCollected,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReqId, setSelectedReqId] = useState(requests[0]?.id || '');
  const [sampleType, setSampleType] = useState('Blood');
  const [sampleId, setSampleId] = useState(`LAB-S-${Math.floor(100 + Math.random() * 900)}`);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const pendingCollectionRequests = requests.filter((r) => r.status === 'Pending' || r.status === 'Accepted');
  const collectedSamples = requests.filter((r) => r.sample_details !== undefined);

  const selectedReq = requests.find((r) => r.id === selectedReqId) || requests[0];

  const filteredCollected = collectedSamples.filter(
    (r) =>
      r.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.request_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.sample_details?.sample_id && r.sample_details.sample_id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmitCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;

    onMarkSampleCollected(selectedReq.id, sampleType, sampleId);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <TestTube className="h-5 w-5 text-purple-700" />
            <span>SAMPLE COLLECTION & TRACKING WORKSPACE</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Draw, label, and log clinical specimens for laboratory testing.
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-900 flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>Specimen collection recorded! Status updated from Pending → Sample Collected.</span>
        </div>
      )}

      {/* SAMPLE COLLECTION FORM (Section 5 requirement) */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">NEW SAMPLE COLLECTION</h2>
          <span className="text-xs text-slate-400 font-semibold">Phlebotomy / Specimen Log</span>
        </div>

        {pendingCollectionRequests.length > 0 ? (
          <form onSubmit={handleSubmitCollection} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Request Select */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Select Test Order</label>
                <select
                  value={selectedReqId}
                  onChange={(e) => setSelectedReqId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-900 focus:outline-none"
                >
                  {pendingCollectionRequests.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.request_id} • {r.patient_name} ({r.test_name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Sample Type */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Sample Type</label>
                <select
                  value={sampleType}
                  onChange={(e) => setSampleType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-900 focus:outline-none"
                >
                  <option value="Blood">Blood (Serum / EDTA)</option>
                  <option value="Urine">Urine</option>
                  <option value="Sputum">Sputum</option>
                  <option value="Swab">Nasopharyngeal Swab</option>
                  <option value="Tissue">Biopsy / Tissue</option>
                  <option value="CSF">CSF</option>
                  <option value="Stool">Stool</option>
                </select>
              </div>

              {/* Sample Barcode ID */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Sample ID Barcode</label>
                <input
                  type="text"
                  value={sampleId}
                  onChange={(e) => setSampleId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-mono font-bold text-purple-950 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="inline-flex items-center space-x-2 rounded-xl bg-purple-600 hover:bg-purple-700 px-6 py-2.5 text-xs font-bold text-white transition-all shadow-sm"
              >
                <TestTube className="h-4 w-4" />
                <span>[ MARK SAMPLE COLLECTED ]</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 text-center text-slate-400 text-xs">
            No pending test orders awaiting sample collection.
          </div>
        )}
      </div>

      {/* SAMPLE TRACKING TABLE (Section 6 requirement) */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between p-5 border-b border-slate-100 bg-slate-50/50 gap-3">
          <div className="flex items-center space-x-2">
            <FlaskConical className="h-4 w-4 text-purple-700" />
            <h3 className="text-sm font-bold text-slate-900">SAMPLE TRACKING REGISTER</h3>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Sample ID, Patient..."
              className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-xs focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Sample ID</th>
                <th className="px-5 py-3.5">Patient Name</th>
                <th className="px-5 py-3.5">Test Name</th>
                <th className="px-5 py-3.5">Collection Time</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCollected.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-purple-950">
                    {r.sample_details?.sample_id}
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-900">{r.patient_name}</td>
                  <td className="px-5 py-4 text-slate-800 font-bold">{r.test_name}</td>
                  <td className="px-5 py-4 text-slate-500">{r.sample_details?.collection_date}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        r.status === 'Sample Issue'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {r.sample_details?.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => onOpenRequest(r, 'processing')}
                      className="inline-flex items-center space-x-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 px-3 py-1.5 text-xs font-bold text-white transition-all shadow-xs"
                    >
                      <span>Process</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredCollected.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-6 text-center text-slate-400">
                    No samples logged in the tracking register yet.
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
