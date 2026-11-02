import React, { useState } from 'react';
import { NursePatient, NursingNoteEntry } from '../../types';
import { FileText, Save, CheckCircle2, Lock, History, ShieldAlert } from 'lucide-react';

interface NurseNotesViewProps {
  patient: NursePatient;
  notesHistory: NursingNoteEntry[];
  onSaveNote: (newNote: Omit<NursingNoteEntry, 'id'>) => void;
}

export const NurseNotesView: React.FC<NurseNotesViewProps> = ({
  patient,
  notesHistory,
  onSaveNote,
}) => {
  const [observation, setObservation] = useState('Patient resting comfortably. No immediate complaints.');
  const [patientCondition, setPatientCondition] = useState('Stable, alert and oriented x3.');
  const [careProvided, setCareProvided] = useState('Administered prescribed morning medications and checked vital signs.');
  const [additionalNote, setAdditionalNote] = useState('Elevated head of bed. Patient encouraged to take oral fluids.');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const patientNotes = notesHistory.filter((n) => n.patient_id === patient.id);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedDateStr = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    onSaveNote({
      patient_id: patient.id,
      patient_name: patient.name,
      bed_number: patient.bed_number,
      observation,
      patient_condition: patientCondition,
      care_provided: careProvided,
      additional_note: additionalNote,
      recorded_at: formattedDateStr,
      recorded_by: 'Nurse Sarah Jenkins',
      is_finalized: true,
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Save Alert */}
      {saveSuccess && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-900 flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold">Nursing Note Finalized & Saved to EHR!</span>
            <span className="text-emerald-700 ml-1">
              Authorized attending physician ({patient.doctor_name}) can now access this clinical entry.
            </span>
          </div>
        </div>
      )}

      {/* Audit Lock Banner */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900 flex items-start space-x-3">
        <Lock className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Note Immutability Policy:</span> Saved nursing notes are signed and finalized into the EHR.
          <span className="text-amber-800 ml-1">
            Nurse cannot edit a finalized old note without triggering an official clinical addendum audit log.
          </span>
        </div>
      </div>

      {/* NURSING NOTE ENTRY FORM */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center space-x-2">
            <div className="rounded-xl bg-teal-50 p-2 text-teal-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">NURSING NOTES</h2>
              <p className="text-xs text-slate-500">Record daily clinical observations & nursing interventions</p>
            </div>
          </div>

          <div className="text-right text-xs">
            <span className="text-slate-400">Patient:</span> <strong className="text-slate-900">{patient.name}</strong>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Observation */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Observation</label>
            <textarea
              rows={2}
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Record direct clinical observation..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-medium text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
              required
            />
          </div>

          {/* Patient Condition */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Patient Condition</label>
            <textarea
              rows={2}
              value={patientCondition}
              onChange={(e) => setPatientCondition(e.target.value)}
              placeholder="State patient condition..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-medium text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
              required
            />
          </div>

          {/* Care Provided */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Care Provided</label>
            <textarea
              rows={2}
              value={careProvided}
              onChange={(e) => setCareProvided(e.target.value)}
              placeholder="Describe care provided during shift..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-medium text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
              required
            />
          </div>

          {/* Additional Note */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Additional Note</label>
            <input
              type="text"
              value={additionalNote}
              onChange={(e) => setAdditionalNote(e.target.value)}
              placeholder="Additional comments or instructions..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-medium text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              type="submit"
              className="inline-flex items-center space-x-2 rounded-xl bg-teal-600 hover:bg-teal-700 px-6 py-2.5 text-xs font-bold text-white transition-all shadow-sm"
            >
              <Save className="h-4 w-4" />
              <span>SAVE NOTE</span>
            </button>
          </div>
        </form>
      </div>

      {/* FINALIZED NURSING NOTES HISTORY */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <History className="h-4 w-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-900">FINALIZED NURSING NOTES LOG</h3>
          </div>
          <span className="text-xs text-slate-500">Immutable EHR Audit Trail</span>
        </div>

        <div className="divide-y divide-slate-100 p-5 space-y-4">
          {patientNotes.map((note) => (
            <div key={note.id} className="rounded-xl border border-slate-200 p-4 bg-slate-50/40 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-900">{note.recorded_at}</span>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 border border-emerald-200">
                    <Lock className="h-3 w-3" />
                    <span>Finalized</span>
                  </span>
                  <span>{note.recorded_by}</span>
                </div>
              </div>

              <div>
                <strong className="text-slate-700">Observation:</strong>
                <p className="text-slate-900 font-medium mt-0.5">{note.observation}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div>
                  <strong className="text-slate-700">Patient Condition:</strong>
                  <p className="text-slate-800 mt-0.5">{note.patient_condition}</p>
                </div>
                <div>
                  <strong className="text-slate-700">Care Provided:</strong>
                  <p className="text-slate-800 mt-0.5">{note.care_provided}</p>
                </div>
              </div>

              {note.additional_note && (
                <div className="pt-1 text-slate-500 italic">
                  Note: "{note.additional_note}"
                </div>
              )}
            </div>
          ))}

          {patientNotes.length === 0 && (
            <p className="text-center text-slate-400 text-xs py-4">No previous nursing notes recorded for this patient.</p>
          )}
        </div>
      </div>
    </div>
  );
};
