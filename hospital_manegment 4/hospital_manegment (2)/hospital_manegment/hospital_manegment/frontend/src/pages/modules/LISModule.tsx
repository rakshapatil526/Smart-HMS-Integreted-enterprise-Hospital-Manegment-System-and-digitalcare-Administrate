import React, { useState, useEffect } from 'react';
import { diagnosticsApi, authApi } from '../../services/api';
import { sharedStore } from '../../services/sharedStore';
import { LabTestRequest, LabNotificationItem } from '../../types';
import { FlaskConical, CheckCircle2, Download, FileText, Plus, Send, Bell, User, AlertCircle } from 'lucide-react';

export const LISModule: React.FC = () => {
  const [requests, setRequests] = useState<LabTestRequest[]>([]);
  const [notifications, setNotifications] = useState<LabNotificationItem[]>(sharedStore.getLabNotifications());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLab();
    const handleLabUpdate = () => {
      setRequests(sharedStore.getLabRequests());
      setNotifications(sharedStore.getLabNotifications());
    };
    handleLabUpdate();
    window.addEventListener('smartcare_lab_request_added', handleLabUpdate);
    window.addEventListener('smartcare_lab_notif_added', handleLabUpdate);
    return () => {
      window.removeEventListener('smartcare_lab_request_added', handleLabUpdate);
      window.removeEventListener('smartcare_lab_notif_added', handleLabUpdate);
    };
  }, []);

  const fetchLab = async () => {
    setLoading(true);
    try {
      const storeReqs = sharedStore.getLabRequests();
      if (storeReqs && storeReqs.length > 0) {
        setRequests(storeReqs);
      } else {
        const res = await diagnosticsApi.getLabRequests();
        setRequests(res.data || []);
      }
    } catch (err) {
      console.error(err);
      setRequests(sharedStore.getLabRequests());
    }
    setLoading(false);
  };

  const handleVerifyResult = (req: LabTestRequest) => {
    const reqId = req.id || req.request_id;
    sharedStore.completeLabResult(reqId, 'Lab Tech Alex', 'All test parameters within normal physiological limits.');
    setRequests(sharedStore.getLabRequests());
    alert(`Lab result for ${req.patient_name} (${req.test_name}) verified & report transmitted to Doctor ${req.doctor_name}!`);
  };

  const handleDownloadLabPDF = async (req: LabTestRequest) => {
    try {
      const reqNo = req.request_id || req.id;
      const patName = req.patient_name || 'Patient Report';
      const res = await authApi.generatePDF('prescription', {
        prescription_number: reqNo,
        patient_name: patName,
        doctor_name: req.doctor_name || 'Dr. Narayan Swamy',
        medicines: [
          { medicine_name: req.test_name || 'Complete Blood Count (CBC)', dosage: 'Hemoglobin: 14.2 g/dL', frequency: 'Normal (13.5-17.5)', duration: 'Verified' },
          { medicine_name: 'Serum Creatinine', dosage: '0.9 mg/dL', frequency: 'Normal (0.6-1.2)', duration: 'Verified' }
        ]
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Lab_Report_${reqNo}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert("Failed to download PDF lab report.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Laboratory Information System (LIS)</h1>
          <p className="text-xs text-slate-500">Sample collection, diagnostic processing, verification, and PDF reports linked to Doctor & Patient EHR</p>
        </div>
      </div>

      {/* DOCTOR LAB ORDERS NOTIFICATION FEED */}
      <div className="rounded-2xl border border-teal-200 bg-teal-50/40 p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-teal-900 flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <Bell className="h-4 w-4 text-teal-600 animate-bounce" />
            <span>INCOMING DOCTOR LAB NOTIFICATIONS & ORDERS</span>
          </span>
          <span className="rounded-full bg-teal-600 text-white text-[11px] font-bold px-2.5 py-0.5">
            {notifications.length} Alerts
          </span>
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
          {notifications.map((n) => (
            <div key={n.id} className="rounded-xl border border-teal-100 bg-white p-3 shadow-2xs flex items-start justify-between">
              <div className="flex items-start space-x-2.5">
                <FlaskConical className="h-4 w-4 text-teal-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                  <p className="text-xs text-slate-600">{n.message}</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-semibold text-slate-400 shrink-0">{n.timestamp}</span>
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="text-center text-xs text-slate-400 py-3">No incoming doctor lab notifications.</div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
          <FlaskConical className="h-4 w-4 text-teal-600" />
          <span>Diagnostic Test Orders & Results</span>
        </h3>

        {loading ? (
          <div className="py-6 text-center text-xs text-slate-400">Loading lab orders...</div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Req No</th>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Doctor</th>
                  <th className="p-3">Test Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-mono font-bold text-teal-700">{r.request_id || r.id}</td>
                    <td className="p-3 font-semibold text-slate-900">{r.patient_name}</td>
                    <td className="p-3 text-slate-600">{r.doctor_name || 'Dr. Narayan Swamy'}</td>
                    <td className="p-3 font-semibold text-slate-800">{r.test_name}</td>
                    <td className="p-3">{r.category || 'Pathology'}</td>
                    <td className="p-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${r.priority === 'Urgent' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}`}>
                        {r.priority || 'Normal'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${r.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-cyan-100 text-cyan-800'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3 flex items-center space-x-2">
                      {r.status !== 'Verified' && (
                        <button
                          onClick={() => handleVerifyResult(r)}
                          className="flex items-center space-x-1 rounded-lg bg-emerald-600 text-white px-2.5 py-1 text-[11px] font-bold hover:bg-emerald-700 transition-all shadow-2xs"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Verify & Send</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleDownloadLabPDF(r)}
                        className="flex items-center space-x-1 rounded-lg bg-teal-50 px-2.5 py-1 text-[11px] font-bold text-teal-700 hover:bg-teal-100 border border-teal-200 transition-all"
                      >
                        <Download className="h-3 w-3" />
                        <span>PDF Report</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

