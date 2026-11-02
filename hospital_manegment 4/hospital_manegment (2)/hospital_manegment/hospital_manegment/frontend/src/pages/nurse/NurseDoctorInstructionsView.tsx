import React from 'react';
import { NursePatient, DoctorInstructionItem } from '../../types';
import { Stethoscope, CheckCircle2, Clock, Lock, ShieldCheck } from 'lucide-react';

interface NurseDoctorInstructionsViewProps {
  patient: NursePatient;
  instructions: DoctorInstructionItem[];
  onAcknowledgeInstruction: (id: string) => void;
}

export const NurseDoctorInstructionsView: React.FC<NurseDoctorInstructionsViewProps> = ({
  patient,
  instructions,
  onAcknowledgeInstruction,
}) => {
  const patientInstructions = instructions.filter((i) => i.patient_id === patient.id);

  return (
    <div className="space-y-6">
      {/* Immutability Banner */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-xs text-blue-950 flex items-start space-x-3">
        <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm text-blue-900">Doctor Clinical Directive Scope</h4>
          <p className="mt-0.5 text-blue-800">
            Instructions are issued directly by attending physician ({patient.doctor_name}).
            <span className="font-semibold text-rose-700 ml-1">
              Nurse can acknowledge and execute orders, but cannot modify original doctor instruction text.
            </span>
          </p>
        </div>
      </div>

      {/* INSTRUCTIONS LIST */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <div className="rounded-xl bg-teal-50 p-2 text-teal-600">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">DOCTOR INSTRUCTIONS</h2>
              <p className="text-xs text-slate-500">Active medical directives for {patient.name} ({patient.bed_number})</p>
            </div>
          </div>

          <span className="text-xs font-bold text-slate-700">
            Attending: <span className="text-teal-700">{patient.doctor_name}</span>
          </span>
        </div>

        <div className="divide-y divide-slate-100 p-6 space-y-6">
          {patientInstructions.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 p-5 bg-slate-50/50 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200/60 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-sm text-slate-900">{item.doctor_name}</span>
                  <span className="text-xs text-slate-400">• {item.issued_at}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      item.status === 'Acknowledged'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {item.status === 'Acknowledged' ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Acknowledged</span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-3.5 w-3.5" />
                        <span>Active / Pending Ack</span>
                      </>
                    )}
                  </span>

                  <span className="inline-flex items-center space-x-1 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5">
                    <Lock className="h-3 w-3" />
                    <span>Read-Only</span>
                  </span>
                </div>
              </div>

              {/* Instruction Text Block */}
              <div className="rounded-xl bg-white p-4 border border-slate-200 text-xs font-medium text-slate-800 leading-relaxed whitespace-pre-line font-mono">
                {item.instruction_text}
              </div>

              {/* Action */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  {item.status === 'Acknowledged'
                    ? `Acknowledged by Nurse Sarah Jenkins at ${item.acknowledged_at || '08:35 AM'}`
                    : 'Click below once directive is reviewed & acknowledged for shift execution.'}
                </span>

                <button
                  onClick={() => onAcknowledgeInstruction(item.id)}
                  disabled={item.status === 'Acknowledged'}
                  className={`inline-flex items-center space-x-1.5 rounded-xl px-5 py-2 text-xs font-bold transition-all shadow-xs ${
                    item.status === 'Acknowledged'
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                      : 'bg-teal-600 hover:bg-teal-700 text-white'
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>[ ACKNOWLEDGE ]</span>
                </button>
              </div>
            </div>
          ))}

          {patientInstructions.length === 0 && (
            <p className="text-center text-slate-400 text-xs py-6">
              No active doctor instructions posted for this patient.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
