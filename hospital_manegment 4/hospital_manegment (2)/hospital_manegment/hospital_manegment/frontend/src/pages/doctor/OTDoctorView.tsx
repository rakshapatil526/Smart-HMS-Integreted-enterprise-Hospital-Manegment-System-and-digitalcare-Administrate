import React, { useState } from 'react';
import { Scissors, Plus, Calendar, Clock, CheckCircle2, ShieldAlert, X } from 'lucide-react';
import { MobileNotificationPayload } from '../../components/common/MobileNotificationToast';

interface OTDoctorViewProps {
  onNavigate: (tab: string, extraData?: any) => void;
  onTriggerNotification: (payload: MobileNotificationPayload) => void;
  initialPatientName?: string;
}

export const OTDoctorView: React.FC<OTDoctorViewProps> = ({
  onNavigate,
  onTriggerNotification,
  initialPatientName,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientName, setPatientName] = useState(initialPatientName || 'Patient A (Aarav Sharma)');
  const [procedure, setProcedure] = useState('Coronary Angioplasty (PTCA)');
  const [scheduledDate, setScheduledDate] = useState('2026-08-20');
  const [priority, setPriority] = useState('High');
  const [clinicalNotes, setClinicalNotes] = useState('Significant stenosis in LAD artery. Pre-op cardiac clearance complete.');

  const [surgeryRequests, setSurgeryRequests] = useState([
    {
      id: 'OT-101',
      patient: 'Patient A (Aarav Sharma)',
      procedure: 'Coronary Angioplasty (PTCA)',
      date: '2026-08-20',
      priority: 'High',
      status: 'Scheduled',
      room: 'OT Suite #2',
    },
    {
      id: 'OT-102',
      patient: 'Patient C (Vikram Singh)',
      procedure: 'Laparoscopic Cholecystectomy',
      date: '2026-08-18',
      priority: 'Routine',
      status: 'Completed',
      room: 'OT Suite #1',
    },
  ]);

  const handleCreateRequest = () => {
    if (!procedure) return;
    const newReq = {
      id: 'OT-' + (surgeryRequests.length + 101),
      patient: patientName,
      procedure: procedure,
      date: scheduledDate,
      priority: priority,
      status: 'Scheduled',
      room: 'OT Suite #' + Math.floor(Math.random() * 3 + 1),
    };
    setSurgeryRequests([newReq, ...surgeryRequests]);

    onTriggerNotification({
      id: 'ot_' + Date.now(),
      patientName: patientName,
      mobileNumber: '+1 555-0192',
      emailAddress: 'aarav.sharma@gmail.com',
      actionTitle: 'OT Surgery Booking Requested',
      messageBody: `Smart Care HMS: Dr. Sarah Jenkins submitted OT Surgery Request for ${patientName} (${procedure}). Sent to OT Staff for theater prep.`,
      timestamp: new Date().toLocaleTimeString(),
    });

    setIsModalOpen(false);
    alert('Surgery request created and transmitted to Operation Theatre Manager!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Scissors className="h-5 w-5 text-amber-600" />
            <span>OPERATION THEATRE (OT) — DOCTOR SIDE</span>
          </h1>
          <p className="text-xs text-slate-500">
            Submit surgical requests & monitor operation theatre schedule & post-op status
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 text-xs font-bold shadow-md shadow-amber-500/20 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>[Create Surgery Request]</span>
        </button>
      </div>

      {/* OT REQUESTS TABLE */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 border-b pb-3 flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-amber-600" />
          <span>MY SURGERY REQUESTS & SCHEDULE</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] border-b">
                <th className="p-3">Request ID</th>
                <th className="p-3">Patient</th>
                <th className="p-3">Surgical Procedure</th>
                <th className="p-3">Scheduled Date</th>
                <th className="p-3">OT Room</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {surgeryRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-mono font-bold text-slate-700">{req.id}</td>
                  <td className="p-3 font-bold text-slate-900">{req.patient}</td>
                  <td className="p-3 font-semibold text-amber-900">{req.procedure}</td>
                  <td className="p-3 font-mono text-slate-600">{req.date}</td>
                  <td className="p-3 font-mono text-cyan-700 font-bold">{req.room}</td>
                  <td className="p-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                        req.status === 'Scheduled'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE SURGERY REQUEST MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold text-slate-900">Create Surgery Request</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Patient Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full rounded-xl border p-2.5 font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Procedure Name</label>
                <input
                  type="text"
                  placeholder="e.g. Coronary Angioplasty / Appendectomy"
                  value={procedure}
                  onChange={(e) => setProcedure(e.target.value)}
                  className="w-full rounded-xl border p-2.5 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full rounded-xl border p-2.5 font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full rounded-xl border p-2.5 font-bold text-amber-900 focus:outline-none"
                  >
                    <option value="Routine">Routine</option>
                    <option value="High">High</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinical Notes & Pre-op Instructions</label>
                <textarea
                  rows={3}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  className="w-full rounded-xl border p-2.5 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t">
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl bg-slate-100 text-slate-700 px-4 py-2 text-xs font-bold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRequest}
                className="rounded-xl bg-amber-600 text-white px-5 py-2 text-xs font-bold hover:bg-amber-700 shadow-sm"
              >
                Submit OT Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
