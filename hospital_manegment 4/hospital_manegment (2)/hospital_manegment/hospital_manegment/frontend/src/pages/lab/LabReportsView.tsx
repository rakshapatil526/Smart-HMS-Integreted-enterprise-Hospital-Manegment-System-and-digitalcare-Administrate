import React, { useState } from 'react';
import { LabTestRequest } from '../../types';
import { FileText, Search, Printer, ShieldCheck, ArrowRight, Share2 } from 'lucide-react';

interface LabReportsViewProps {
  requests: LabTestRequest[];
  onOpenRequest: (request: LabTestRequest, tab?: string) => void;
}

export const LabReportsView: React.FC<LabReportsViewProps> = ({ requests, onOpenRequest }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const finalizedReports = requests.filter((r) => r.status === 'Verified');

  const filteredReports = finalizedReports.filter(
    (r) =>
      r.request_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.test_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <FileText className="h-5 w-5 text-purple-700" />
            <span>FINALIZED LABORATORY REPORTS</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Verified diagnostic laboratory reports published to Attending Doctor, Patient Portal, and Central EHR.
          </p>
        </div>
      </div>

      {/* EHR Distribution Banner (Section 11 requirement) */}
      <div className="rounded-2xl border border-purple-200 bg-purple-50/70 p-4 text-xs text-purple-950 flex items-start space-x-3">
        <Share2 className="h-5 w-5 text-purple-700 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm text-purple-900">Lab Report Integration & Distribution Channel</h4>
          <p className="mt-0.5 text-purple-800">
            Finalized laboratory reports are automatically published to <strong>Attending Doctor</strong>, <strong>Patient Portal</strong>, and stored in the <strong>Central EHR Timeline</strong>.
          </p>
        </div>
      </div>

      {/* Search Bar & Reports Grid/Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between p-5 border-b border-slate-100 bg-slate-50/50 gap-3">
          <h3 className="text-sm font-bold text-slate-900">PUBLISHED REPORTS DIRECTORY</h3>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Request ID, Patient Name, Test..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Report / Req ID</th>
                <th className="px-5 py-3.5">Patient Name</th>
                <th className="px-5 py-3.5">Test Name</th>
                <th className="px-5 py-3.5">Attending Doctor</th>
                <th className="px-5 py-3.5">Verified By</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-purple-950">{r.request_id}</td>
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900">{r.patient_name}</div>
                    <div className="text-[11px] text-slate-400 font-normal">{r.patient_id}</div>
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-900">{r.test_name}</td>
                  <td className="px-5 py-4 text-slate-600 font-medium">{r.doctor_name}</td>
                  <td className="px-5 py-4 font-bold text-emerald-800 flex items-center space-x-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{r.verification?.verified_by || 'Dr. Neha Shah'}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onOpenRequest(r, 'report')}
                        className="inline-flex items-center space-x-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 px-3.5 py-1.5 text-xs font-bold text-white transition-all shadow-xs"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        <span>View / Print PDF</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                    No finalized reports found matching search criteria.
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
