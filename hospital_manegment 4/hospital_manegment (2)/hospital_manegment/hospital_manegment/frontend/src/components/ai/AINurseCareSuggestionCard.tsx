import React, { useState } from 'react';
import { Sparkles, AlertTriangle, CheckCircle2, RefreshCw, HeartPulse, HelpCircle, FileText, ChevronRight, Printer, Activity, User, Bed, ShieldAlert } from 'lucide-react';
import {
  initialNursePatients,
  initialNurseVitals,
  initialMedicationAdmin,
  initialCarePlans,
  initialDoctorInstructions
} from '../../pages/nurse/nurseData';

interface AINurseCareSuggestionCardProps {
  patientName?: string;
  bedNumber?: string;
  vitalsSummary?: string;
  medicationsSummary?: string;
}

export const AINurseCareSuggestionCard: React.FC<AINurseCareSuggestionCardProps> = ({
  patientName = 'Patient A (Aarav Sharma)',
  bedNumber = 'B102',
  vitalsSummary = 'BP: 125/82 mmHg, Temp: 99.1°F, Pulse: 85 bpm, SpO2: 97%',
  medicationsSummary = 'Paracetamol 500mg (Given), Amlodipine 10mg (Pending)',
}) => {
  const [loading, setLoading] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

  const [aiResult, setAiResult] = useState<any | null>({
    disclaimer: '⚠ AI Nursing Decision Support. Nurse review required before intervention.',
    question_context: 'Shift Clinical Assessment & Care Overview',
    summary: `Assigned roster evaluation: Patient ${patientName} (${bedNumber}). Hemodynamics stable with mild low-grade temperature elevation (99.1°F).`,
    critical_alerts: [
      'Patient B (Ananya Verma - ICU Bed B105): Critical Status - SpO2 93% on O2 support',
      'Patient C (Rohan Mehta - Bed B110): Critical Status - Elevated BP 155/95 mmHg'
    ],
    nursing_interventions: [
      'Re-check blood pressure & temperature prior to administering afternoon medications',
      'Encourage oral hydration (250ml water) & maintain head of bed elevated 30°',
      'Verify STAT IV saline order for Bed B102 per Dr. Narayan Swamy instruction'
    ]
  });

  const questionCategories = [
    {
      title: "🏥 Ward Patients & Immediate Attention",
      questions: [
        "Show me all patients assigned to me today.",
        "Which patients need immediate attention?",
        "Show me today's admissions, transfers, and discharges.",
        "Show me available and occupied beds in my ward."
      ]
    },
    {
      title: "🩺 Vitals & Critical Telemetry",
      questions: [
        "Show me the latest vital signs of my patients.",
        "Which patients have abnormal recorded vitals?"
      ]
    },
    {
      title: "📋 Medications, Tasks & Doctor Orders",
      questions: [
        "Show me today's medication and nursing tasks.",
        "Which medications or nursing tasks are pending?",
        "Show me new instructions or orders from doctors.",
        "Generate today's nursing/ward activity report PDF."
      ]
    }
  ];

  const handleSelectQuestion = (q: string) => {
    setActiveQuestion(q);
    setLoading(true);

    setTimeout(() => {
      let res: any = {
        disclaimer: '⚠ AI Nursing Decision Support. Nurse review required.',
        question_context: q,
        summary: '',
        critical_alerts: [],
        nursing_interventions: [],
        showPdfAction: false
      };

      switch (q) {
        case "Show me all patients assigned to me today.":
          res.summary = `You have ${initialNursePatients.length} patients assigned to your ward shift today.`;
          res.nursing_interventions = initialNursePatients.map(p => 
            `• ${p.name} — Bed ${p.bed_number} (${p.ward_name}, Room ${p.room_number}) | Doctor: ${p.doctor_name} [Status: ${p.status}]`
          );
          res.critical_alerts = [
            `Total Assigned: ${initialNursePatients.length} Patients`,
            `Critical Patients: ${initialNursePatients.filter(p => p.status === 'Critical').length} Patients needing close monitoring`
          ];
          break;

        case "Which patients need immediate attention?":
          const criticals = initialNursePatients.filter(p => p.status === 'Critical');
          res.summary = `ALERT: ${criticals.length} patients currently require IMMEDIATE NURSING ATTENTION.`;
          res.critical_alerts = criticals.map(p => 
            `🚨 STAT ATTENTION: ${p.name} (Bed ${p.bed_number}) — Status: CRITICAL (Doctor: ${p.doctor_name})`
          );
          res.nursing_interventions = [
            'Perform immediate Q1H vitals check on ICU Bed B105 (Ananya Verma)',
            'Check IV infusion drip rate & SpO2 monitor on Bed B110 (Rohan Mehta)',
            'Notify attending doctor immediately if systolic BP > 160 or SpO2 < 94%'
          ];
          break;

        case "Show me the latest vital signs of my patients.":
          res.summary = `Latest Recorded Vitals Breakdown across active ward beds:`;
          res.nursing_interventions = initialNurseVitals.map(v => 
            `• ${v.patient_name} (Bed ${v.bed_number || 'N/A'}) @ ${v.timestamp}: BP ${v.bp_systolic}/${v.bp_diastolic} mmHg, Pulse ${v.pulse} bpm, Temp ${v.temperature}°F, SpO2 ${v.spo2}%`
          );
          res.critical_alerts = [
            `Total Vitals Logged Today: ${initialNurseVitals.length} records`,
            `Abnormal Flagged Entries: ${initialNurseVitals.filter(v => parseFloat(v.temperature) > 99.5 || v.spo2 < 95 || v.bp_systolic > 140 || v.attention_required).length} entries`
          ];
          break;

        case "Which patients have abnormal recorded vitals?":
          const abnormalVitals = initialNurseVitals.filter(v => parseFloat(v.temperature) > 99.5 || v.spo2 < 95 || v.bp_systolic > 140 || v.pulse > 100 || v.attention_required);
          res.summary = `ABNORMAL VITALS DETECTED: ${abnormalVitals.length} patient vital records flagged out of target thresholds.`;
          res.critical_alerts = abnormalVitals.map(v => 
            `⚠️ HIGH RISK VITAL: ${v.patient_name} — BP: ${v.bp_systolic}/${v.bp_diastolic} mmHg, Pulse: ${v.pulse} bpm, Temp: ${v.temperature}°F, SpO2: ${v.spo2}%`
          );
          res.nursing_interventions = [
            'Re-take BP and SpO2 in 15 minutes to confirm reading',
            'Administer prescribed antipyretic if temperature > 100.4°F per MAR protocol',
            'Log escalation note in EHR and inform Resident Medical Officer (RMO)'
          ];
          break;

        case "Show me today's medication and nursing tasks.":
          res.summary = `Medication Administration Records (MAR) & Care Plan Tasks Roster:`;
          res.nursing_interventions = [
            ...initialMedicationAdmin.map(m => `💊 Med: ${m.patient_name} (Bed ${m.bed_number}) — ${m.medicine_name} ${m.dosage} (${m.scheduled_time}) [Status: ${m.status}]`),
            ...initialCarePlans.map(c => `📋 Task: ${c.patient_name} — ${c.task_name} [Status: ${c.status}]`)
          ];
          res.critical_alerts = [
            `Total Scheduled Medications: ${initialMedicationAdmin.length}`,
            `Total Nursing Tasks: ${initialCarePlans.length}`
          ];
          break;

        case "Which medications or nursing tasks are pending?":
          const pendingMeds = initialMedicationAdmin.filter(m => m.status === 'Pending');
          const pendingTasks = initialCarePlans.filter(c => c.status === 'Pending' || c.status === 'In-Progress');
          res.summary = `PENDING QUEUE: ${pendingMeds.length} medications and ${pendingTasks.length} nursing tasks pending fulfillment.`;
          res.critical_alerts = [
            `Pending Medications: ${pendingMeds.length} doses due`,
            `Pending Care Tasks: ${pendingTasks.length} tasks scheduled`
          ];
          res.nursing_interventions = [
            ...pendingMeds.map(m => `⏳ DUE MED: ${m.patient_name} (${m.bed_number}) — ${m.medicine_name} ${m.dosage} @ ${m.scheduled_time}`),
            ...pendingTasks.map(t => `⏳ DUE TASK: ${t.patient_name} — ${t.task_name}`)
          ];
          break;

        case "Show me today's admissions, transfers, and discharges.":
          res.summary = `Ward Census Movement Summary (Admissions, Transfers & Discharges):`;
          res.critical_alerts = [
            `• New Admissions Today: 2 Patients (Aarav Sharma - Bed B102, Ananya Verma - Bed B105)`,
            `• Intra-Ward Transfers: 1 Patient (Rohan Mehta transferred from ER to Bed B110)`,
            `• Planned Discharges: 1 Patient (Vikram Singh - Bed B115 scheduled for 04:00 PM discharge)`
          ];
          res.nursing_interventions = [
            'Complete admission checklist and orientation for Bed B102',
            'Verify discharge summary, take-home prescriptions, and billing clearance for Bed B115'
          ];
          break;

        case "Show me available and occupied beds in my ward.":
          res.summary = `Ward Bed Capacity & Occupancy Telemetry:`;
          res.critical_alerts = [
            `• Total Ward Capacity: 12 Beds`,
            `• Occupied Beds: 8 Beds (B102, B105, B110, B112, B115, B118, B120, B122)`,
            `• Available Beds: 4 Beds (B101, B103, B104, B106 - Cleaned & Sterilized)`
          ];
          res.nursing_interventions = [
            'Occupancy rate: 66.7%. 4 sanitized beds ready for immediate ER/OPD admission.'
          ];
          break;

        case "Show me new instructions or orders from doctors.":
          res.summary = `Active Doctor Orders & Verbal Instructions Log:`;
          res.nursing_interventions = initialDoctorInstructions.map(i => 
            `🩺 Order from ${i.doctor_name} for ${i.patient_name} (Bed ${i.bed_number}): "${i.instruction_text}" [Status: ${i.status}]`
          );
          res.critical_alerts = [
            `Total Doctor Instructions: ${initialDoctorInstructions.length}`,
            `Active Doctor Orders: ${initialDoctorInstructions.filter(i => i.status === 'Active').length}`
          ];
          break;

        case "Generate today's nursing/ward activity report PDF.":
          res.summary = `NURSING & WARD ACTIVITY SHIFT REPORT GENERATED`;
          res.critical_alerts = [
            `Report Date: ${new Date().toLocaleDateString()} | Shift: Day Shift`,
            `Total Patients: 8 | Critical: 2 | Medications Dispensed: 6 | Active Doctor Orders: ${initialDoctorInstructions.length}`
          ];
          res.nursing_interventions = [
            'Official Nursing Shift Handover & Ward Activity Report is compiled and ready for export.'
          ];
          res.showPdfAction = true;
          break;

        default:
          res.summary = `Query completed for: ${q}`;
          break;
      }

      setAiResult(res);
      setLoading(false);
    }, 400);
  };

  const handlePrintPdfReport = () => {
    const reportContent = `
      ========================================================
      🏥 SMARTCARE HOSPITAL — NURSING & WARD SHIFT ACTIVITY REPORT
      Generated Date: ${new Date().toLocaleString()}
      Shift: Morning/Day Shift
      Nurse In-Charge: Nurse Sarah Jenkins, RN
      ========================================================

      1. WARD CENSUS & PATIENTS ASSIGNED (Total: ${initialNursePatients.length})
      ${initialNursePatients.map(p => `   • Bed ${p.bed_number}: ${p.name} | Age: ${p.age} | Dr: ${p.doctor_name} | Status: ${p.status}`).join('\n')}

      2. CRITICAL PATIENTS & HIGH-PRIORITY WATCHLIST
      ${initialNursePatients.filter(p => p.status === 'Critical').map(p => `   🚨 Bed ${p.bed_number}: ${p.name} — CRITICAL MONITORING`).join('\n')}

      3. LATEST VITALS RECORDED
      ${initialNurseVitals.map(v => `   • ${v.patient_name} (${v.timestamp}): BP ${v.bp_systolic}/${v.bp_diastolic}, Pulse ${v.pulse}, Temp ${v.temperature}°F, SpO2 ${v.spo2}%`).join('\n')}

      4. DOCTOR INSTRUCTIONS & ORDERS
      ${initialDoctorInstructions.map(i => `   🩺 ${i.doctor_name} -> ${i.patient_name}: ${i.instruction_text} [${i.status}]`).join('\n')}

      5. PENDING MEDICATIONS & NURSING TASKS
      ${initialMedicationAdmin.filter(m => m.status === 'Pending').map(m => `   💊 Med: ${m.patient_name} - ${m.medicine_name} (${m.scheduled_time})`).join('\n')}

      ========================================================
      Verified by Head Nurse Signature: ______________________
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`<pre style="font-family: monospace; font-size: 13px; padding: 20px; line-height: 1.5;">${reportContent}</pre>`);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  return (
    <div className="space-y-5">
      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-teal-600 via-teal-700 to-teal-800 text-white p-5 rounded-3xl shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
            <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight flex items-center space-x-2">
              <span>👩‍⚕️ NURSE MODULE AI CLINIC — WARD ANALYZER</span>
            </h1>
            <p className="text-xs text-teal-100 mt-0.5">
              Live ward vitals analyzer, nursing tasks roster, doctor instruction sync & automated shift report generator
            </p>
          </div>
        </div>

        <button
          onClick={handlePrintPdfReport}
          className="flex items-center justify-center space-x-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 rounded-2xl text-xs transition-all shadow-md cursor-pointer shrink-0"
        >
          <Printer className="h-4 w-4" />
          <span>Export Nursing PDF Report</span>
        </button>
      </div>

      {/* PRESET 10 NURSE AI QUESTIONS PANEL */}
      <div className="rounded-3xl border border-teal-200 bg-teal-50/40 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-teal-200/80 pb-3">
          <h2 className="text-sm font-bold text-teal-950 flex items-center space-x-2">
            <HelpCircle className="h-4 w-4 text-teal-600" />
            <span>⚡ NURSE AI CLINIC ASSISTANT — 10 CLINICAL PRESET QUERIES</span>
          </h2>
          <span className="text-[10px] bg-teal-200 text-teal-900 font-extrabold px-2.5 py-0.5 rounded-full">
            REAL-TIME TELEMETRY
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {questionCategories.map((cat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 border border-teal-100 shadow-xs space-y-2">
              <h3 className="text-xs font-bold text-teal-950 border-b border-slate-100 pb-1.5">
                {cat.title}
              </h3>
              <div className="flex flex-col gap-1.5">
                {cat.questions.map((q, qIdx) => (
                  <button
                    key={qIdx}
                    onClick={() => handleSelectQuestion(q)}
                    className={`text-left text-[11px] font-semibold px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                      activeQuestion === q
                        ? 'bg-teal-700 text-white shadow-md scale-[1.02]'
                        : 'bg-teal-50/80 hover:bg-amber-100/70 text-teal-950 border border-teal-100 hover:border-amber-300'
                    }`}
                  >
                    <span className="line-clamp-2">{q}</span>
                    <ChevronRight className={`h-3 w-3 shrink-0 ml-1 ${activeQuestion === q ? 'text-amber-300' : 'text-teal-400'}`} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI OUTPUT RESPONSE CARD */}
      <div className="rounded-3xl border border-teal-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-teal-600" />
            <span>AI NURSING CARE TELEMETRY RESPONSE</span>
          </h3>
          <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded-full border border-amber-200">
            {aiResult?.question_context || 'LIVE SHIFT ANALYSIS'}
          </span>
        </div>

        {loading ? (
          <div className="py-10 flex flex-col items-center justify-center space-y-2">
            <RefreshCw className="h-7 w-7 text-teal-600 animate-spin" />
            <p className="text-xs font-bold text-slate-600">Analyzing Ward Vitals, MAR & EHR Telemetry...</p>
          </div>
        ) : aiResult ? (
          <div className="space-y-4 text-xs">
            {/* Disclaimer */}
            <div className="rounded-2xl bg-amber-50 p-3 border border-amber-200 flex items-center space-x-2 text-amber-900 font-bold">
              <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0" />
              <span>{aiResult.disclaimer}</span>
            </div>

            {/* Summary */}
            {aiResult.summary && (
              <div>
                <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">Ward Status Summary:</span>
                <p className="text-slate-900 font-semibold mt-1 leading-relaxed bg-teal-50/50 p-3.5 rounded-xl border border-teal-100">
                  {aiResult.summary}
                </p>
              </div>
            )}

            {/* Critical Alerts */}
            {aiResult.critical_alerts?.length > 0 && (
              <div>
                <span className="font-bold text-red-900 uppercase text-[10px] tracking-wider">High-Priority Ward Flags & Counts:</span>
                <ul className="space-y-1.5 mt-1">
                  {aiResult.critical_alerts.map((alert: string, idx: number) => (
                    <li key={idx} className="bg-red-50 p-2.5 rounded-xl border border-red-200 text-red-950 font-bold flex items-start space-x-2">
                      <ShieldAlert className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                      <span>{alert}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Nursing Interventions / List Items */}
            {aiResult.nursing_interventions?.length > 0 && (
              <div>
                <span className="font-bold text-teal-900 uppercase text-[10px] tracking-wider">Nursing Interventions & Task Roster:</span>
                <ul className="space-y-1.5 mt-1">
                  {aiResult.nursing_interventions.map((item: string, idx: number) => (
                    <li key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-900 font-medium flex items-start space-x-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action for PDF Generation */}
            {aiResult.showPdfAction && (
              <div className="pt-2">
                <button
                  onClick={handlePrintPdfReport}
                  className="w-full flex items-center justify-center space-x-2 bg-teal-700 hover:bg-teal-800 text-white font-extrabold py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer"
                >
                  <Printer className="h-4 w-4" />
                  <span>PRINT / DOWNLOAD TODAY'S NURSING SHIFT REPORT PDF</span>
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
