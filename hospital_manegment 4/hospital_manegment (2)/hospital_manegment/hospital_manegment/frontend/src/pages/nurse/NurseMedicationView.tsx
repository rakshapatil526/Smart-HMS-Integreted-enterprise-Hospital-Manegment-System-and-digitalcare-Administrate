import React, { useState } from 'react';
import { NursePatient, MedicationAdminEntry } from '../../types';
import { Pill, CheckCircle2, XCircle, Clock, AlertCircle, ShieldAlert, Flag } from 'lucide-react';

interface NurseMedicationViewProps {
  patient: NursePatient;
  medications: MedicationAdminEntry[];
  onUpdateMedStatus: (
    id: string,
    status: 'Given' | 'Pending' | 'Not Given',
    reason?: string
  ) => void;
}

export const NurseMedicationView: React.FC<NurseMedicationViewProps> = ({
  patient,
  medications,
  onUpdateMedStatus,
}) => {
  const [selectedNotGivenId, setSelectedNotGivenId] = useState<string | null>(null);
  const [reasonInput, setReasonInput] = useState('');
  const [flagModalId, setFlagModalId] = useState<string | null>(null);
  const [flagMessage, setFlagMessage] = useState('');

  const patientMeds = medications.filter((m) => m.patient_id === patient.id);

  const handleMarkGiven = (id: string) => {
    onUpdateMedStatus(id, 'Given');
  };

  const handleConfirmNotGiven = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedNotGivenId && reasonInput.trim()) {
      onUpdateMedStatus(selectedNotGivenId, 'Not Given', reasonInput);
      setSelectedNotGivenId(null);
      setReasonInput('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Role Boundary Notice */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-xs text-blue-950 flex items-start space-x-3">
        <ShieldAlert className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm text-blue-900">Medication Administration Record (MAR) Scope</h4>
          <p className="mt-0.5 text-blue-800">
            Attending physician creates the prescription. Nurse records administration details (Time & Status).
            <span className="font-semibold text-rose-700 ml-1">
              Nurse cannot alter medicine name, dose, or frequency.
            </span>
          </p>
        </div>
      </div>

      {/* MEDICATION ADMINISTRATION TABLE */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
              <Pill className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">MEDICATION ADMINISTRATION</h2>
              <p className="text-xs text-slate-500">Prescribed regimen for {patient.name} ({patient.bed_number})</p>
            </div>
          </div>

          <div className="text-right text-xs text-slate-500">
            Attending Doctor: <strong className="text-slate-900">{patient.doctor_name}</strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Medicine Name</th>
                <th className="px-5 py-3.5">Dose</th>
                <th className="px-5 py-3.5">Scheduled Time</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Nurse Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patientMeds.map((med) => (
                <tr key={med.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900">{med.medicine_name}</div>
                    <div className="text-[11px] text-slate-400 font-normal">
                      Ref: {med.doctor_prescription_ref}
                    </div>
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-700">{med.dosage}</td>
                  <td className="px-5 py-4 font-medium text-slate-600 flex items-center space-x-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{med.scheduled_time}</span>
                  </td>
                  <td className="px-5 py-4">
                    {med.status === 'Given' ? (
                      <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 border border-emerald-200">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>✓ Given ({med.administered_at || 'Recorded'})</span>
                      </span>
                    ) : med.status === 'Not Given' ? (
                      <div>
                        <span className="inline-flex items-center space-x-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold px-2.5 py-0.5 border border-rose-200">
                          <XCircle className="h-3.5 w-3.5" />
                          <span>❌ Not Given</span>
                        </span>
                        {med.reason_not_given && (
                          <div className="text-[11px] text-rose-700 italic mt-0.5">
                            Reason: {med.reason_not_given}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center space-x-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 border border-amber-200">
                        <Clock className="h-3.5 w-3.5" />
                        <span>○ Pending</span>
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleMarkGiven(med.id)}
                        disabled={med.status === 'Given'}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all shadow-2xs ${
                          med.status === 'Given'
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        [ MARK AS GIVEN ]
                      </button>

                      <button
                        onClick={() => {
                          setSelectedNotGivenId(med.id);
                          setReasonInput('');
                        }}
                        disabled={med.status === 'Given'}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all shadow-2xs ${
                          med.status === 'Given'
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                        }`}
                      >
                        [ RECORD NOT GIVEN ]
                      </button>

                      <button
                        onClick={() => {
                          setFlagModalId(med.id);
                          setFlagMessage('');
                        }}
                        title="Flag doctor regarding medication issue"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                      >
                        <Flag className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {patientMeds.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-6 text-center text-slate-400 text-xs">
                    No active prescriptions assigned for this patient.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Not Given Modal */}
      {selectedNotGivenId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-rose-600" />
              <span>Record Medication Not Given</span>
            </h3>
            <p className="text-xs text-slate-500">
              Please document the clinical reason why the prescribed dose was withheld or not administered:
            </p>

            <form onSubmit={handleConfirmNotGiven} className="space-y-4">
              <div className="space-y-2">
                {['Patient Refused', 'NPO (Nothing by Mouth)', 'Nausea / Vomiting', 'Doctor Instructed Hold', 'Allergic Symptom Observed'].map(
                  (reason) => (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => setReasonInput(reason)}
                      className={`w-full text-left rounded-xl p-2.5 text-xs font-semibold border transition-all ${
                        reasonInput === reason
                          ? 'border-rose-500 bg-rose-50 text-rose-900'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      • {reason}
                    </button>
                  )
                )}
                <input
                  type="text"
                  placeholder="Or enter custom reason..."
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium focus:border-teal-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedNotGivenId(null)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2 text-xs font-bold text-white shadow-xs"
                >
                  Submit Reason
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Flag Doctor Modal */}
      {flagModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Flag className="h-5 w-5 text-amber-600" />
              <span>Flag Medication Issue to Doctor</span>
            </h3>
            <p className="text-xs text-slate-500">
              Notify {patient.doctor_name} regarding dosage clarification or prescription issue:
            </p>

            <textarea
              rows={3}
              placeholder="Describe issue (e.g. Patient reports allergy history to this brand)..."
              value={flagMessage}
              onChange={(e) => setFlagMessage(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium focus:border-teal-500 focus:outline-none"
            />

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setFlagModalId(null)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Flag sent to ${patient.doctor_name} successfully!`);
                  setFlagModalId(null);
                }}
                className="rounded-xl bg-amber-600 hover:bg-amber-700 px-4 py-2 text-xs font-bold text-white shadow-xs"
              >
                Send Flag Notification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
