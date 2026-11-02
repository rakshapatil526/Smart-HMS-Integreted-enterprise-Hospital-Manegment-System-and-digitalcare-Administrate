import React, { useState } from 'react';
import { Sparkles, AlertTriangle, CheckCircle2, RefreshCw, HelpCircle, ChevronRight, Printer, ShieldAlert, Film, Scan, FileText } from 'lucide-react';
import { initialRISRequests, initialRISReports, initialRISStudies } from '../../pages/modules/risData';

interface AIRadiologySuggestionCardProps {
  requestId?: string;
  patientName?: string;
  investigation?: string;
}

export const AIRadiologySuggestionCard: React.FC<AIRadiologySuggestionCardProps> = ({
  requestId = 'RAD-2026-001',
  patientName = 'Aarav Sharma',
  investigation = 'MRI (Brain & Cardiac Protocol)',
}) => {
  const [loading, setLoading] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

  const [aiResult, setAiResult] = useState<any | null>({
    disclaimer: '⚠ AI Radiology Decision Support. Senior Radiologist verification required.',
    question_context: 'RIS / PACS Imaging & Diagnostic Workload Overview',
    summary: `Radiology workload evaluation for ${patientName} (${requestId}): Modality ${investigation}. PACS images acquired. Impression draft ready for sign-off.`,
    critical_alerts: [
      'STAT Emergency Scan: HRCT Chest for Rahul Verma (RAD-2026-003) - Scan completed, urgent review required',
      'Urgent Order: MRI Brain for Aarav Sharma (RAD-2026-001) - Patient arrived at MRI Suite'
    ],
    radiology_recommendations: [
      'Verify 3T MRI cine & late gadolinium enhancement sequences for structural scar evaluation',
      'Compare current cardiac LVEF (62%) with baseline ultrasound findings',
      'Auto-publish DICOM series to PACS upon final radiologist electronic signature'
    ]
  });

  const questionCategories = [
    {
      title: "🩻 Imaging Requests & Workload",
      questions: [
        "Show me today's radiology requests.",
        "Show me all pending imaging procedures.",
        "Which radiology cases are marked urgent?",
        "Show me today's radiology workload."
      ]
    },
    {
      title: "🔬 Scans, PACS & Verifications",
      questions: [
        "Show me today's completed scans.",
        "Which radiology reports are waiting for verification?",
        "Show me the referring doctor's request for this patient."
      ]
    },
    {
      title: "📋 Comparative Reports & PDF Export",
      questions: [
        "Show me this patient's previous imaging and reports.",
        "Compare the patient's previous and current radiology reports.",
        "Generate the radiology report PDF."
      ]
    }
  ];

  const handleSelectQuestion = (q: string) => {
    setActiveQuestion(q);
    setLoading(true);

    setTimeout(() => {
      let res: any = {
        disclaimer: '⚠ AI Radiology Decision Support. Senior Radiologist verification required.',
        question_context: q,
        summary: '',
        critical_alerts: [],
        radiology_recommendations: [],
        showPdfAction: false
      };

      switch (q) {
        case "Show me today's radiology requests.":
          res.summary = `There are ${initialRISRequests.length} radiology imaging requests logged today across hospital departments.`;
          res.radiology_recommendations = initialRISRequests.map(r => 
            `• Order #${r.request_id}: ${r.investigation} (${r.body_part}) for ${r.patient_name} | Doctor: ${r.doctor_name} [Priority: ${r.priority} | Status: ${r.status}]`
          );
          res.critical_alerts = [
            `Total Radiology Orders: ${initialRISRequests.length}`,
            `Urgent / STAT Scans: ${initialRISRequests.filter(r => r.priority === 'Urgent' || r.priority === 'STAT Emergency').length}`
          ];
          break;

        case "Show me all pending imaging procedures.":
          const pendingScans = initialRISRequests.filter(r => r.status === 'Pending' || r.status === 'Accepted' || r.status === 'Scheduled');
          res.summary = `PENDING RADIOLOGY QUEUE: ${pendingScans.length} imaging scans awaiting machine slot execution.`;
          res.critical_alerts = pendingScans.map(r => 
            `⏳ PENDING SCAN #${r.request_id}: ${r.investigation} (${r.body_part}) for ${r.patient_name} — Priority: ${r.priority}`
          );
          res.radiology_recommendations = [
            'Verify patient NPO fasting status prior to contrast CT/MRI scans',
            'Ensure IV line 18G/20G is patently placed for contrast administration'
          ];
          break;

        case "Which radiology cases are marked urgent?":
          const urgentRad = initialRISRequests.filter(r => r.priority === 'Urgent' || r.priority === 'STAT Emergency');
          res.summary = `URGENT / STAT RADIOLOGY CASES: ${urgentRad.length} high-priority imaging cases flagged for immediate scan slot.`;
          res.critical_alerts = urgentRad.map(r => 
            `🚨 URGENT CASE #${r.request_id}: ${r.patient_name} — ${r.investigation} (${r.body_part}). Reason: "${r.clinical_reason}"`
          );
          res.radiology_recommendations = [
            'Prioritize patient transfer from ward to Radiology MRI/CT suite',
            'Ensure emergency resuscitation kit is present during STAT transport'
          ];
          break;

        case "Show me today's completed scans.":
          const completedScans = initialRISRequests.filter(r => r.status === 'Scan Completed' || r.status === 'Report Drafted' || r.status === 'Finalized');
          res.summary = `COMPLETED SCANS TODAY: ${completedScans.length} diagnostic imaging studies completed on PACS server.`;
          res.radiology_recommendations = completedScans.map(r => 
            `✅ SCAN COMPLETED #${r.request_id}: ${r.investigation} (${r.body_part}) for ${r.patient_name} [PACS Status: ${r.status}]`
          );
          res.critical_alerts = [
            `Total Completed Scans: ${completedScans.length}`,
            `PACS Image Series Acquired: 100% Verified`
          ];
          break;

        case "Which radiology reports are waiting for verification?":
          const reportsWaiting = initialRISReports.filter(rep => rep.status === 'Draft' || rep.status === 'Reviewed');
          res.summary = `REPORTS AWAITING RADIOLOGIST SIGN-OFF: ${reportsWaiting.length} draft reports pending final radiologist verification.`;
          res.critical_alerts = reportsWaiting.map(rep => 
            `📋 DRAFT REPORT #${rep.report_id}: ${rep.investigation} for ${rep.patient_name} (Radiologist: ${rep.radiologist_name}) — Impression: "${rep.impression.slice(0, 60)}..."`
          );
          res.radiology_recommendations = [
            'Attending physician notified once digital sign-off is complete'
          ];
          break;

        case "Show me this patient's previous imaging and reports.":
          res.summary = `Historical Radiology & PACS Timeline for Active Patient (${patientName}):`;
          res.radiology_recommendations = [
            `• 17 Aug 2026: MRI Brain & Cardiac Protocol (Order #RAD-2026-001) — Status: Pending / Scheduled`,
            `• 15 May 2026: Chest X-Ray PA View — Impression: Normal pulmonary vasculature, no infiltrates`,
            `• 12 Nov 2025: Ultrasound Abdomen & Pelvis — Impression: Unremarkable gallbladder & liver echotexture`,
            `• 04 Aug 2024: CT Lumbar Spine — Impression: Mild L4-L5 disc bulge without nerve root compression`
          ];
          res.critical_alerts = ['Full PACS DICOM archive history verified for patient.'];
          break;

        case "Compare the patient's previous and current radiology reports.":
          res.summary = `RADIOLOGY DELTA & COMPARATIVE ANALYSIS — ${patientName}:`;
          res.critical_alerts = [
            `📊 Previous Chest Imaging (15 May 2026): Clear lung fields, normal cardiothoracic ratio (CTR < 0.50).`,
            `📊 Current Cardiac MRI (17 Aug 2026): LVEF 62%, normal LV end-diastolic volume. No ischemic myocardial scar.`,
            `🔍 Comparative Finding: Stable cardiac & thoracic status. No acute progressive pulmonary or structural cardiac pathology.`
          ];
          res.radiology_recommendations = [
            'Maintain baseline monitoring; results indicate stable cardiovascular status.'
          ];
          break;

        case "Show me the referring doctor's request for this patient.":
          const currentReq = initialRISRequests[0];
          res.summary = `REFERRING DOCTOR REQUISITION FORM — ${currentReq.patient_name}:`;
          res.critical_alerts = [
            `Ordering Physician: ${currentReq.doctor_name} (${currentReq.department})`,
            `Requested Modality: ${currentReq.investigation} (${currentReq.body_part})`,
            `Clinical Reason: "${currentReq.clinical_reason}"`,
            `Order Priority: ${currentReq.priority}`
          ];
          res.radiology_recommendations = [
            'Requisition form verified and attached to patient EHR file.'
          ];
          break;

        case "Show me today's radiology workload.":
          res.summary = `RADIOLOGY DEPARTMENT DAILY WORKLOAD METRICS:`;
          res.critical_alerts = [
            `• Total Imaging Requests: ${initialRISRequests.length} Cases`,
            `• MRI Suite Workload: 2 Cases (3T High-Field Magnet)`,
            `• CT Scan Suite Workload: 1 Case (64-Slice HRCT)`,
            `• X-Ray & Ultrasound Workload: 2 Cases`
          ];
          res.radiology_recommendations = [
            'Workload distribution: 40% MRI, 20% CT, 40% General Radiography.',
            'Average Scan Duration: 25 minutes per procedure.'
          ];
          break;

        case "Generate the radiology report PDF.":
          res.summary = `OFFICIAL RADIOLOGY & PACS DIAGNOSTIC REPORT GENERATED`;
          res.critical_alerts = [
            `Report Ref: RAD-REP-2026-9012 | Patient: ${patientName}`,
            `Modality: MRI Brain & Cardiac Protocol | Radiologist: Dr. Robert Vance, MD`
          ];
          res.radiology_recommendations = [
            'Official Radiology Imaging Report with PACS DICOM findings is ready for download/print.'
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

  const handlePrintRadiologyPdfReport = () => {
    const reportContent = `
      ========================================================================================
      🩻 SMARTCARE HOSPITAL RADIOLOGY & IMAGING SERVICES
      Department of Diagnostic Radiology & PACS Imaging (ISO Certified)
      ========================================================================================
      Patient Name : ${patientName}           Age / Gender : 38 Y / Male
      Patient ID   : SC-P001                             Order Ref    : ${requestId}
      Referring Dr : Dr. Arjun Mehta (Neurology)         Scan Date    : 17 Aug 2026 11:15 AM
      Modality     : ${investigation}                     PACS Acc No  : PACS-2026-9812
      ========================================================================================

      CLINICAL INDICATION & REQUISITION:
      Evaluation of persistent headaches, focal neurological signs, and exertional chest discomfort.

      RADIOLOGICAL FINDINGS & OBSERVATIONS:
      1. Brain MRI: Multi-planar T1, T2, and FLAIR sequences demonstrate normal cerebral parenchyma.
         No intracranial hemorrhage, acute ischemic infarction, or mass effect. Ventricles & sulci normal.
      2. Cardiac MRI Protocol: Left ventricular ejection fraction (LVEF) is 62%. Normal LV end-diastolic volume.
         Late Gadolinium Enhancement (LGE) reveals no subendocardial or transmural myocardial infarction scar.

      IMPRESSION & CLINICAL CORRELATION:
      1. Unremarkable Cardiac MRI examination with preserved LV systolic function.
      2. No structural myocardial scar or ischemic perfusion defect identified.
      3. Intracranial brain imaging is within normal limits.

      ========================================================================================
      Reporting Radiologist: Dr. Robert Vance, MD (Senior Radiologist)
      Digitally Signed & Published to PACS / EHR Roster
      ========================================================================================
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-rose-700 via-rose-800 to-slate-900 text-white p-5 rounded-3xl shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
            <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight flex items-center space-x-2">
              <span>🩻 RADIOLOGY MODULE AI CLINIC — IMAGING ANALYZER</span>
            </h1>
            <p className="text-xs text-rose-100 mt-0.5">
              Live RIS imaging telemetry, PACS study analyzer, comparative delta check & automated radiology report PDF generator
            </p>
          </div>
        </div>

        <button
          onClick={handlePrintRadiologyPdfReport}
          className="flex items-center justify-center space-x-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 rounded-2xl text-xs transition-all shadow-md cursor-pointer shrink-0"
        >
          <Printer className="h-4 w-4" />
          <span>Export Radiology Report PDF</span>
        </button>
      </div>

      {/* PRESET 10 RADIOLOGY AI QUESTIONS PANEL */}
      <div className="rounded-3xl border border-rose-200 bg-rose-50/40 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-rose-200/80 pb-3">
          <h2 className="text-sm font-bold text-rose-950 flex items-center space-x-2">
            <HelpCircle className="h-4 w-4 text-rose-600" />
            <span>⚡ RADIOLOGY AI CLINIC ASSISTANT — 10 DIAGNOSTIC PRESET QUERIES</span>
          </h2>
          <span className="text-[10px] bg-rose-200 text-rose-900 font-extrabold px-2.5 py-0.5 rounded-full">
            REAL-TIME RIS / PACS TELEMETRY
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {questionCategories.map((cat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 border border-rose-100 shadow-xs space-y-2">
              <h3 className="text-xs font-bold text-rose-950 border-b border-slate-100 pb-1.5">
                {cat.title}
              </h3>
              <div className="flex flex-col gap-1.5">
                {cat.questions.map((q, qIdx) => (
                  <button
                    key={qIdx}
                    onClick={() => handleSelectQuestion(q)}
                    className={`text-left text-[11px] font-semibold px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                      activeQuestion === q
                        ? 'bg-rose-700 text-white shadow-md scale-[1.02]'
                        : 'bg-rose-50/80 hover:bg-amber-100/70 text-rose-950 border border-rose-100 hover:border-amber-300'
                    }`}
                  >
                    <span className="line-clamp-2">{q}</span>
                    <ChevronRight className={`h-3 w-3 shrink-0 ml-1 ${activeQuestion === q ? 'text-amber-300' : 'text-rose-400'}`} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI OUTPUT RESPONSE CARD */}
      <div className="rounded-3xl border border-rose-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-rose-600" />
            <span>AI RADIOLOGY TELEMETRY & PACS RESPONSE</span>
          </h3>
          <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded-full border border-amber-200">
            {aiResult?.question_context || 'LIVE RIS ANALYSIS'}
          </span>
        </div>

        {loading ? (
          <div className="py-10 flex flex-col items-center justify-center space-y-2">
            <RefreshCw className="h-7 w-7 text-rose-600 animate-spin" />
            <p className="text-xs font-bold text-slate-600">Querying RIS Telemetry & PACS DICOM Archive...</p>
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
                <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">Evaluation Summary:</span>
                <p className="text-slate-900 font-semibold mt-1 leading-relaxed bg-rose-50/50 p-3.5 rounded-xl border border-rose-100">
                  {aiResult.summary}
                </p>
              </div>
            )}

            {/* Critical Alerts */}
            {aiResult.critical_alerts?.length > 0 && (
              <div>
                <span className="font-bold text-red-900 uppercase text-[10px] tracking-wider">High-Priority Radiology & PACS Flags:</span>
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

            {/* Radiology Recommendations / Details */}
            {aiResult.radiology_recommendations?.length > 0 && (
              <div>
                <span className="font-bold text-rose-950 uppercase text-[10px] tracking-wider">Radiology Recommendations & Details:</span>
                <ul className="space-y-1.5 mt-1">
                  {aiResult.radiology_recommendations.map((item: string, idx: number) => (
                    <li key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-900 font-medium flex items-start space-x-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-rose-600 mt-0.5 shrink-0" />
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
                  onClick={handlePrintRadiologyPdfReport}
                  className="w-full flex items-center justify-center space-x-2 bg-rose-700 hover:bg-rose-800 text-white font-extrabold py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer"
                >
                  <Printer className="h-4 w-4" />
                  <span>PRINT / DOWNLOAD TODAY'S RADIOLOGY DIAGNOSTIC REPORT PDF</span>
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
