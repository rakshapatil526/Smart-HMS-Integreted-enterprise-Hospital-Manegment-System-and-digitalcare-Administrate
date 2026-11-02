import React, { useState } from 'react';
import { NursePatient, ShiftHandoverNote } from '../../types';
import { RefreshCw, Save, Clock, CheckCircle2, AlertCircle, FileSpreadsheet } from 'lucide-react';

interface NurseHandoverViewProps {
  patients: NursePatient[];
  handovers: ShiftHandoverNote[];
  onSaveHandover: (note: Omit<ShiftHandoverNote, 'id'>) => void;
}

export const NurseHandoverView: React.FC<NurseHandoverViewProps> = ({
  patients,
  handovers,
  onSaveHandover,
}) => {
  const [shiftFrom, setShiftFrom] = useState('Morning Shift');
  const [shiftTo, setShiftTo] = useState('Evening Shift');
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [currentCondition, setCurrentCondition] = useState('Stable. Patient rested comfortably without fever spikes.');
  const [importantNotes, setImportantNotes] = useState('Medication at 8 PM. Keep IV saline running at 75ml/hr.');
  const [pendingTasks, setPendingTasks] = useState('Check BP at 12:00 PM and monitor oxygen saturation.');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const dateStr = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    onSaveHandover({
      shift_from: shiftFrom,
      shift_to: shiftTo,
      patient_id: selectedPatient.id,
      patient_name: selectedPatient.name,
      bed_number: selectedPatient.bed_number,
      current_condition: currentCondition,
      important_notes: importantNotes,
      pending_tasks: pendingTasks,
      created_at: dateStr,
      created_by: 'Nurse Sarah Jenkins',
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <RefreshCw className="h-5 w-5 text-teal-600" />
            <span>SHIFT HANDOVER WORKSPACE</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Hand over active nursing care details to incoming shift staff cleanly and safely.
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-900 flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold">Shift Handover Note Recorded!</span>
            <span className="text-emerald-700 ml-1">
              Incoming shift nurses will see this entry under Pending Handovers.
            </span>
          </div>
        </div>
      )}

      {/* CREATE SHIFT HANDOVER FORM */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">NEW SHIFT HANDOVER NOTE</h2>
          <span className="text-xs text-slate-400 font-semibold">End of Shift Record</span>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Shift Direction */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">From Shift</label>
              <select
                value={shiftFrom}
                onChange={(e) => setShiftFrom(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 focus:outline-none"
              >
                <option value="Morning Shift">Morning Shift (07:00 AM - 03:30 PM)</option>
                <option value="Evening Shift">Evening Shift (03:00 PM - 11:30 PM)</option>
                <option value="Night Shift">Night Shift (11:00 PM - 07:30 AM)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">To Shift</label>
              <select
                value={shiftTo}
                onChange={(e) => setShiftTo(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 focus:outline-none"
              >
                <option value="Evening Shift">Evening Shift (03:00 PM - 11:30 PM)</option>
                <option value="Night Shift">Night Shift (11:00 PM - 07:30 AM)</option>
                <option value="Morning Shift">Morning Shift (07:00 AM - 03:30 PM)</option>
              </select>
            </div>

            {/* Patient Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Select Patient / Bed</label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 focus:outline-none"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.bed_number}) - {p.status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Current Condition */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Current Condition</label>
            <input
              type="text"
              value={currentCondition}
              onChange={(e) => setCurrentCondition(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium focus:border-teal-500 focus:outline-none"
              required
            />
          </div>

          {/* Important Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Important Notes</label>
            <input
              type="text"
              value={importantNotes}
              onChange={(e) => setImportantNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium focus:border-teal-500 focus:outline-none"
              required
            />
          </div>

          {/* Pending Tasks */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Pending Tasks for Next Shift</label>
            <input
              type="text"
              value={pendingTasks}
              onChange={(e) => setPendingTasks(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium focus:border-teal-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="inline-flex items-center space-x-2 rounded-xl bg-teal-600 hover:bg-teal-700 px-6 py-2.5 text-xs font-bold text-white transition-all shadow-sm"
            >
              <Save className="h-4 w-4" />
              <span>CREATE HANDOVER NOTE</span>
            </button>
          </div>
        </form>
      </div>

      {/* PENDING HANDOVER LIST (Section 13 requirement) */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">PENDING HANDOVER LOG</h3>
          </div>
          <span className="text-xs text-slate-500">Incoming Shift Review</span>
        </div>

        <div className="divide-y divide-slate-100 p-6 space-y-4">
          {handovers.map((h) => (
            <div key={h.id} className="rounded-2xl border border-slate-200 p-5 bg-slate-50/40 text-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200/60 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-sm text-slate-900">{h.patient_name}</span>
                  <span className="rounded-lg bg-teal-50 px-2 py-0.5 text-[11px] font-bold text-teal-800 border border-teal-200">
                    Bed {h.bed_number}
                  </span>
                </div>
                <div className="text-slate-500 font-medium">
                  {h.shift_from} → <strong className="text-teal-700">{h.shift_to}</strong> ({h.created_at})
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-xl bg-white p-3 border border-slate-200">
                  <strong className="text-slate-700 block mb-0.5">Current Condition:</strong>
                  <p className="text-slate-900">{h.current_condition}</p>
                </div>

                <div className="rounded-xl bg-amber-50/70 p-3 border border-amber-200">
                  <strong className="text-amber-900 block mb-0.5">Important Notes:</strong>
                  <p className="text-amber-950 font-medium">{h.important_notes}</p>
                </div>

                <div className="rounded-xl bg-blue-50/70 p-3 border border-blue-200">
                  <strong className="text-blue-900 block mb-0.5">Pending Tasks:</strong>
                  <p className="text-blue-950 font-medium">{h.pending_tasks}</p>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 pt-1">Handed over by {h.created_by}</div>
            </div>
          ))}

          {handovers.length === 0 && (
            <p className="text-center text-slate-400 text-xs py-6">No shift handover notes logged yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};
