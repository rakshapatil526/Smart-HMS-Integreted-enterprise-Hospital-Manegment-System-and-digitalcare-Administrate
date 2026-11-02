import React, { useState } from 'react';
import { HeartPulse, Stethoscope, FlaskConical, Image as ImageIcon, Pill, Bed, Search, Calendar, FileText, CheckCircle2 } from 'lucide-react';

interface EHRClinicalTimelineViewProps {
  onNavigate: (tab: string, extraData?: any) => void;
  initialPatientId?: string;
}

export const EHRClinicalTimelineView: React.FC<EHRClinicalTimelineViewProps> = ({ initialPatientId }) => {
  const [patientSearch, setPatientSearch] = useState(initialPatientId || 'P001');

  const timelineEvents = [
    {
      date: '2026-08-15',
      type: 'Follow-up Consultation',
      icon: <Stethoscope className="h-4 w-4 text-teal-600" />,
      title: 'Follow-up OPD Consultation',
      summary: 'Patient reports improved chest symptoms on prescribed Beta-blockers. BP 120/80.',
      doctor: 'Dr. Sarah Jenkins',
      badgeClass: 'bg-teal-100 text-teal-800',
    },
    {
      date: '2026-08-12',
      type: 'MRI Report',
      icon: <ImageIcon className="h-4 w-4 text-rose-600" />,
      title: 'Cardiac MRI Scan Finalized',
      summary: 'Normal left ventricular ejection fraction (EF ~ 62%). No myocardial scarring.',
      doctor: 'Dr. Robert Vance (Radiologist)',
      badgeClass: 'bg-rose-100 text-rose-800',
    },
    {
      date: '2026-08-11',
      type: 'CBC Report',
      icon: <FlaskConical className="h-4 w-4 text-purple-600" />,
      title: 'Complete Blood Count (CBC) Verified',
      summary: 'Hemoglobin: 14.2 g/dL, WBC: 7,200 /uL, Platelets: 250,000 /uL. All values within normal limits.',
      doctor: 'Dr. Alan Turing (Lab Director)',
      badgeClass: 'bg-purple-100 text-purple-800',
    },
    {
      date: '2026-08-10',
      type: 'OPD Consultation',
      icon: <Stethoscope className="h-4 w-4 text-teal-600" />,
      title: 'Initial OPD Consultation & Diagnosis',
      summary: 'Diagnosis: Stable Angina / Exertional Ischemia. Prescribed Paracetamol 500mg, Metoprolol 25mg.',
      doctor: 'Dr. Sarah Jenkins',
      badgeClass: 'bg-teal-100 text-teal-800',
    },
    {
      date: '2026-08-01',
      type: 'Admission & Nursing Notes',
      icon: <Bed className="h-4 w-4 text-cyan-600" />,
      title: 'IPD Ward Admission & Nursing Vitals Log',
      summary: 'Admitted to Ward A - Bed 102 for observation. Vitals recorded q4h: BP stable at 122/82.',
      doctor: 'Nurse Emma Watson / Dr. Sarah Jenkins',
      badgeClass: 'bg-cyan-100 text-cyan-800',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <HeartPulse className="h-5 w-5 text-teal-600" />
            <span>PATIENT EHR — CLINICAL TIMELINE</span>
          </h1>
          <p className="text-xs text-slate-500">
            Comprehensive longitudinal medical history without opening multiple screens
          </p>
        </div>
      </div>

      {/* Patient Search & Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Patient ID (e.g. P001)..."
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                className="rounded-xl border border-slate-200 pl-9 pr-4 py-2 text-xs font-mono font-bold text-slate-800 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="text-xs font-semibold text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border">
            Active Dossier: <strong className="text-slate-900">Patient A (Aarav Sharma)</strong> | ID: <span className="font-mono text-teal-700 font-bold">P001</span>
          </div>
        </div>
      </div>

      {/* TIMELINE FEED */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <h2 className="text-sm font-bold text-slate-800 border-b pb-3 flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-teal-600" />
          <span>Chronological Health History</span>
        </h2>

        <div className="relative border-l-2 border-slate-200 ml-4 space-y-6 pl-6">
          {timelineEvents.map((ev, index) => (
            <div key={index} className="relative group">
              {/* Timeline Marker Dot */}
              <div className="absolute -left-[31px] top-1.5 h-6 w-6 rounded-full bg-white border-2 border-teal-500 flex items-center justify-center shadow-sm">
                {ev.icon}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 hover:bg-white hover:shadow-md hover:border-teal-200 transition-all space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${ev.badgeClass}`}>
                      {ev.type}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{ev.title}</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-500">{ev.date}</span>
                </div>

                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  {ev.summary}
                </p>

                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-200/60">
                  <span>Recorded by: <strong>{ev.doctor}</strong></span>
                  <span className="text-teal-600 font-semibold flex items-center">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Authorized Record
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
