import React, { useState } from 'react';
import { NursePatient, NurseVitalEntry } from '../../types';
import { HeartPulse, Save, Clock, AlertTriangle, CheckCircle2, History } from 'lucide-react';
import { AINurseCareSuggestionCard } from '../../components/ai/AINurseCareSuggestionCard';

interface NurseVitalsViewProps {
  patient: NursePatient;
  vitalsHistory: NurseVitalEntry[];
  onSaveVitals: (newVital: Omit<NurseVitalEntry, 'id'>) => void;
}

export const NurseVitalsView: React.FC<NurseVitalsViewProps> = ({
  patient,
  vitalsHistory,
  onSaveVitals,
}) => {
  const [temperature, setTemperature] = useState('98.6');
  const [bpSystolic, setBpSystolic] = useState('120');
  const [bpDiastolic, setBpDiastolic] = useState('80');
  const [pulse, setPulse] = useState('78');
  const [spo2, setSpo2] = useState('98');
  const [respRate, setRespRate] = useState('18');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Filter history for current patient
  const patientVitals = vitalsHistory.filter((v) => v.patient_id === patient.id);

  // Evaluate threshold on current input
  const sysNum = parseInt(bpSystolic) || 120;
  const diaNum = parseInt(bpDiastolic) || 80;
  const pulseNum = parseInt(pulse) || 78;
  const spo2Num = parseInt(spo2) || 98;
  const tempNum = parseFloat(temperature) || 98.6;

  const isAbnormal =
    tempNum > 100.4 || spo2Num < 95 || sysNum > 140 || sysNum < 90 || pulseNum > 100;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    onSaveVitals({
      patient_id: patient.id,
      patient_name: patient.name,
      bed_number: patient.bed_number,
      temperature: `${tempNum} °F`,
      bp_systolic: sysNum,
      bp_diastolic: diaNum,
      pulse: pulseNum,
      spo2: spo2Num,
      respiratory_rate: parseInt(respRate) || 18,
      timestamp: currentTimeStr,
      recorded_by: 'Nurse Sarah Jenkins',
      attention_required: isAbnormal,
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-900 flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold">Vitals Saved to Patient Record & EHR!</span>
            <span className="text-emerald-700 ml-1">
              Updated vital observations are now accessible by attending {patient.doctor_name}.
            </span>
          </div>
        </div>
      )}

      {/* Threshold Warning Banner */}
      {isAbnormal && (
        <div className="rounded-xl bg-amber-50 border-2 border-amber-300 p-4 text-xs text-amber-950 flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm text-amber-900">⚠️ Attention Required</h4>
            <p className="mt-0.5 text-amber-800">
              Recent vital sign values exceed normal clinical threshold limits (Temp &gt; 100.4°F, SpO2 &lt; 95%, or BP &gt; 140/90).
            </p>
          </div>
        </div>
      )}

      {/* VITAL SIGNS FORM */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center space-x-2">
            <div className="rounded-xl bg-rose-50 p-2 text-rose-600">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">VITAL SIGNS ENTRY</h2>
              <p className="text-xs text-slate-500">Record current vital parameters for nursing observation log</p>
            </div>
          </div>

          <div className="text-right text-xs">
            <span className="text-slate-400">Patient:</span> <strong className="text-slate-900">{patient.name}</strong>
            <span className="ml-3 text-slate-400">Bed:</span> <strong className="text-teal-700">{patient.bed_number}</strong>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Temperature */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Temperature (°F)</span>
                <span className="text-[11px] text-slate-400 font-normal">Normal: 97.8 - 99.1 °F</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-semibold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">°F</span>
              </div>
            </div>

            {/* Blood Pressure */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Blood Pressure (mmHg)</span>
                <span className="text-[11px] text-slate-400 font-normal">Sys / Dia</span>
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Sys"
                  value={bpSystolic}
                  onChange={(e) => setBpSystolic(e.target.value)}
                  className="w-1/2 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm font-semibold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  required
                />
                <span className="text-slate-400 font-bold">/</span>
                <input
                  type="number"
                  placeholder="Dia"
                  value={bpDiastolic}
                  onChange={(e) => setBpDiastolic(e.target.value)}
                  className="w-1/2 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm font-semibold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  required
                />
              </div>
            </div>

            {/* Pulse */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Pulse Rate (bpm)</span>
                <span className="text-[11px] text-slate-400 font-normal">Normal: 60 - 100 bpm</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={pulse}
                  onChange={(e) => setPulse(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-semibold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">bpm</span>
              </div>
            </div>

            {/* SpO2 */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>SpO2 Oxygen (%)</span>
                <span className="text-[11px] text-slate-400 font-normal">Normal: 95 - 100%</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={spo2}
                  onChange={(e) => setSpo2(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-semibold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">%</span>
              </div>
            </div>

            {/* Respiratory Rate */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Respiratory Rate</span>
                <span className="text-[11px] text-slate-400 font-normal">Normal: 12 - 20 /min</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={respRate}
                  onChange={(e) => setRespRate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-semibold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">/min</span>
              </div>
            </div>

            {/* Timestamp */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Time</label>
              <div className="flex items-center space-x-2 rounded-xl border border-slate-200 bg-slate-100/60 px-4 py-2.5 text-sm font-semibold text-slate-600">
                <Clock className="h-4 w-4 text-slate-400" />
                <span>Current Time ({new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="inline-flex items-center space-x-2 rounded-xl bg-teal-600 hover:bg-teal-700 px-6 py-2.5 text-xs font-bold text-white transition-all shadow-sm"
            >
              <Save className="h-4 w-4" />
              <span>SAVE VITALS</span>
            </button>
          </div>
        </form>
      </div>

      {/* AI NURSING CARE SUGGESTIONS CARD */}
      <AINurseCareSuggestionCard
        patientName={patient.name}
        bedNumber={patient.bed_number}
        vitalsSummary={`BP: ${bpSystolic}/${bpDiastolic} mmHg, Temp: ${temperature}°F, Pulse: ${pulse} bpm, SpO2: ${spo2}%`}
      />

      {/* VITAL HISTORY */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <History className="h-4 w-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-900">VITAL HISTORY</h3>
          </div>
          <span className="text-xs text-slate-500">Trend logs monitored by Nurse & Attending Doctor</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Time</th>
                <th className="px-5 py-3">BP (mmHg)</th>
                <th className="px-5 py-3">Pulse (bpm)</th>
                <th className="px-5 py-3">Temp (°F)</th>
                <th className="px-5 py-3">SpO2 (%)</th>
                <th className="px-5 py-3">Resp Rate</th>
                <th className="px-5 py-3">Recorded By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patientVitals.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{entry.timestamp}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-800">
                    {entry.bp_systolic}/{entry.bp_diastolic}
                  </td>
                  <td className="px-5 py-3.5">{entry.pulse} bpm</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`font-semibold ${
                        parseFloat(entry.temperature) > 100 ? 'text-rose-600 font-bold' : 'text-slate-800'
                      }`}
                    >
                      {entry.temperature}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`font-semibold ${
                        entry.spo2 < 95 ? 'text-rose-600 font-bold' : 'text-slate-800'
                      }`}
                    >
                      {entry.spo2}%
                    </span>
                  </td>
                  <td className="px-5 py-3.5">{entry.respiratory_rate} /min</td>
                  <td className="px-5 py-3.5 text-slate-500">{entry.recorded_by}</td>
                </tr>
              ))}

              {patientVitals.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-6 text-center text-slate-400 text-xs">
                    No prior vital logs recorded yet for this patient.
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
