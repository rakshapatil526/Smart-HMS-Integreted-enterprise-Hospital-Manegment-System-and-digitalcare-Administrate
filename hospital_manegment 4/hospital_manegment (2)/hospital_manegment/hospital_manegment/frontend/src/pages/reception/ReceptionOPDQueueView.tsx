import React, { useState } from 'react';
import { ReceptionAppointmentRecord, ReceptionPatientRecord } from '../../types';
import { Clock, UserCheck, CheckCircle2, Megaphone, Filter } from 'lucide-react';

interface ReceptionOPDQueueViewProps {
  appointments: ReceptionAppointmentRecord[];
  patients: ReceptionPatientRecord[];
  onStatusChange: (id: string, newStatus: ReceptionAppointmentRecord['status']) => void;
}

export const ReceptionOPDQueueView: React.FC<ReceptionOPDQueueViewProps> = ({
  appointments,
  patients,
  onStatusChange,
}) => {
  const [selectedDept, setSelectedDept] = useState('Cardiology');
  const [callingToken, setCallingToken] = useState<string | null>(null);

  const deptQueue = appointments.filter((a) => a.department === selectedDept || selectedDept === 'ALL');

  const handleCallNext = () => {
    const nextWaiting = deptQueue.find((a) => a.status === 'Waiting' || a.status === 'Confirmed');
    if (nextWaiting) {
      setCallingToken(`Token #${nextWaiting.token_number} — ${nextWaiting.patient_name}`);
      onStatusChange(nextWaiting.id, 'Checked-in');
      setTimeout(() => setCallingToken(null), 4000);
    } else {
      alert('No more waiting patients in this OPD queue!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">OPD CLINICAL CONSULTATION QUEUE</h1>
          <p className="text-xs text-slate-500">Real-time token management & front-desk patient calling</p>
        </div>
        <button
          onClick={handleCallNext}
          className="inline-flex items-center space-x-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-xs font-bold text-white transition-all shadow-md shrink-0"
        >
          <Megaphone className="h-4 w-4" />
          <span>[ CALL NEXT PATIENT ]</span>
        </button>
      </div>

      {callingToken && (
        <div className="rounded-2xl bg-amber-500 text-white p-4 font-bold text-xs shadow-md flex items-center justify-between animate-bounce">
          <div className="flex items-center space-x-2">
            <Megaphone className="h-5 w-5" />
            <span>NOW CALLING TO OPD CONSULTATION ROOM: {callingToken}</span>
          </div>
        </div>
      )}

      {/* Department Filter Bar */}
      <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Filter className="h-4 w-4 text-blue-600 shrink-0" />
          <span className="text-xs font-bold text-slate-700">Select Department Queue:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold bg-white text-slate-800"
          >
            <option value="ALL">All Departments</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Neurology">Neurology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="General Medicine">General Medicine</option>
            <option value="General Surgery">General Surgery</option>
            <option value="Gynecology & Obstetrics">Gynecology</option>
            <option value="Dermatology">Dermatology</option>
            <option value="ENT">ENT</option>
            <option value="Ophthalmology">Ophthalmology</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-semibold">
          Queue Length: <strong className="text-blue-700 font-mono">{deptQueue.length} Patients</strong>
        </div>
      </div>

      {/* OPD Queue Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Token No</th>
                <th className="px-5 py-3.5">Patient Name</th>
                <th className="px-5 py-3.5">Assigned Doctor</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Queue Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {deptQueue.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-mono font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                      C00{apt.token_number}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-900">{apt.patient_name}</td>
                  <td className="px-5 py-4 text-slate-800 font-semibold">{apt.doctor_name}</td>
                  <td className="px-5 py-4 text-slate-600">{apt.department}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        apt.status === 'Checked-in'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : apt.status === 'Waiting'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {apt.status === 'Checked-in' ? 'With Doctor' : apt.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {apt.status !== 'Checked-in' && (
                      <button
                        onClick={() => onStatusChange(apt.id, 'Checked-in')}
                        className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-bold transition-all shadow-2xs"
                      >
                        Call to Doctor
                      </button>
                    )}
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
