import React, { useState } from 'react';
import { NursePatient, CarePlanTask } from '../../types';
import { ClipboardList, CheckCircle2, Clock, ShieldAlert, PlayCircle } from 'lucide-react';

interface NurseCarePlanViewProps {
  patient: NursePatient;
  carePlanTasks: CarePlanTask[];
  onUpdateTaskStatus: (
    taskId: string,
    status: 'Completed' | 'Pending' | 'In-Progress'
  ) => void;
}

export const NurseCarePlanView: React.FC<NurseCarePlanViewProps> = ({
  patient,
  carePlanTasks,
  onUpdateTaskStatus,
}) => {
  const [activeTaskModal, setActiveTaskModal] = useState<CarePlanTask | null>(null);

  const patientTasks = carePlanTasks.filter((t) => t.patient_id === patient.id);
  const completedCount = patientTasks.filter((t) => t.status === 'Completed').length;
  const progressPercent =
    patientTasks.length > 0 ? Math.round((completedCount / patientTasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Scope Disclaimer */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-xs text-blue-950 flex items-start space-x-3">
        <ShieldAlert className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm text-blue-900">Nursing Care Execution Checklist</h4>
          <p className="mt-0.5 text-blue-800">
            Nurse updates execution status of active care routines.
            <span className="font-semibold text-teal-800 ml-1">
              Physician's medical treatment regimen remains unchanged.
            </span>
          </p>
        </div>
      </div>

      {/* Progress Bar Header */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Today's Nursing Care Plan</h3>
            <p className="text-xs text-slate-500">
              Patient: <strong className="text-slate-800">{patient.name}</strong> • Bed:{' '}
              <strong className="text-teal-700">{patient.bed_number}</strong>
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold text-teal-600">{progressPercent}%</span>
            <span className="text-xs text-slate-400 block font-medium">Completed ({completedCount}/{patientTasks.length})</span>
          </div>
        </div>

        {/* Bar */}
        <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-teal-600 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* CARE PLAN TASKS TABLE */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <ClipboardList className="h-5 w-5 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900">CARE PLAN TASKS</h3>
          </div>
          <span className="text-xs text-slate-500">Execution Status Tracker</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Task Description</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Scheduled</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patientTasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-4 font-bold text-slate-900">
                    <div className="flex items-center space-x-2">
                      <span className="h-2 w-2 rounded-full bg-teal-500" />
                      <span>{task.task_name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600 font-medium">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                      {task.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-500">{task.assigned_time}</td>
                  <td className="px-5 py-4">
                    {task.status === 'Completed' ? (
                      <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 border border-emerald-200">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>✓ Completed</span>
                      </span>
                    ) : task.status === 'In-Progress' ? (
                      <span className="inline-flex items-center space-x-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-0.5 border border-blue-200">
                        <PlayCircle className="h-3.5 w-3.5 text-blue-600" />
                        <span>In-Progress</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 border border-amber-200">
                        <Clock className="h-3.5 w-3.5 text-amber-600" />
                        <span>Pending</span>
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setActiveTaskModal(task)}
                      className="inline-flex items-center space-x-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 px-3.5 py-1.5 text-xs font-bold text-white transition-all shadow-2xs"
                    >
                      <span>[ UPDATE TASK ]</span>
                    </button>
                  </td>
                </tr>
              ))}

              {patientTasks.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-6 text-center text-slate-400 text-xs">
                    No active care plan tasks configured for this patient.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Update Modal */}
      {activeTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Update Nursing Task Status</h3>
            <p className="text-xs text-slate-500">
              Task: <strong className="text-slate-900">{activeTaskModal.task_name}</strong>
            </p>

            <div className="space-y-2 pt-2">
              {[
                { status: 'Completed', label: 'Mark as Completed ✓', color: 'border-emerald-500 bg-emerald-50 text-emerald-900' },
                { status: 'In-Progress', label: 'Mark as In-Progress 🔄', color: 'border-blue-500 bg-blue-50 text-blue-900' },
                { status: 'Pending', label: 'Keep as Pending ⏳', color: 'border-amber-500 bg-amber-50 text-amber-900' },
              ].map((opt) => (
                <button
                  key={opt.status}
                  onClick={() => {
                    onUpdateTaskStatus(activeTaskModal.id, opt.status as any);
                    setActiveTaskModal(null);
                  }}
                  className={`w-full text-left rounded-xl p-3 text-xs font-bold border transition-all ${opt.color}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveTaskModal(null)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
