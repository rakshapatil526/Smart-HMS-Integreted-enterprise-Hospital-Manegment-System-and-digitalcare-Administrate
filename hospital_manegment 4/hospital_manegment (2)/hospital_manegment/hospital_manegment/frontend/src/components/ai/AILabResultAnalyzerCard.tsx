import React, { useState } from 'react';
import { Sparkles, AlertTriangle, CheckCircle2, RefreshCw, BarChart2, HelpCircle, FileText, ChevronRight, Printer, ShieldAlert, FlaskConical, TestTube, ArrowUpRight } from 'lucide-react';
import { initialLabRequests } from '../../pages/lab/labData';

interface AILabResultAnalyzerCardProps {
  requestId?: string;
  patientName?: string;
  testName?: string;
  sampleType?: string;
  parametersSummary?: string;
}

export const AILabResultAnalyzerCard: React.FC<AILabResultAnalyzerCardProps> = ({
  requestId = 'LAB005',
  patientName = 'Patient E (Vikram Singh)',
  testName = 'Lipid Profile',
  sampleType = 'Blood (Serum)',
  parametersSummary = 'Total Cholesterol: 235 mg/dL (High), Triglycerides: 180 mg/dL (High), LDL: 157 mg/dL (High)',
}) => {
  const [loading, setLoading] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

  const [aiResult, setAiResult] = useState<any | null>({
    disclaimer: '⚠ AI Diagnostic Decision Support. Pathologist verification required.',
    question_context: 'Diagnostic Delta & Quality Control Overview',
    summary: `Observed lipid panel for ${patientName} (${requestId}) demonstrates hypercholesterolemia with elevated LDL (157 mg/dL) and triglycerides (180 mg/dL). No immediate panic/critical crisis values.`,
    critical_alerts: [
      'Elevated Total Cholesterol: 235 mg/dL (Reference < 200 mg/dL)',
      'Elevated LDL Cholesterol: 157 mg/dL (Reference < 100 mg/dL)'
    ],
    pathology_recommendations: [
      'Suggest clinical correlation with lipid-lowering statin therapy and cardiovascular risk evaluation.',
      'Delta Check: Total Cholesterol increased by +18 mg/dL compared to previous 6-month baseline.',
      'Autoanalyzer QC status: Calibration normal. No sample hemolysis detected.'
    ]
  });

  const questionCategories = [
    {
      title: "🧪 Pending Tests, Samples & Rejections",
      questions: [
        "Show me today's pending laboratory tests.",
        "Show me samples that are waiting for processing.",
        "Which samples have been rejected and why?",
        "Show me today's urgent laboratory requests."
      ]
    },
    {
      title: "🔬 Verifications, Critical & Delta Analysis",
      questions: [
        "Which test reports are waiting for verification?",
        "Show me abnormal or critical laboratory results requiring review.",
        "Show me this patient's previous laboratory reports.",
        "Compare this patient's previous and current laboratory results."
      ]
    },
    {
      title: "📋 Completed Tests & Report PDF",
      questions: [
        "Show me today's completed laboratory tests.",
        "Generate the laboratory report PDF."
      ]
    }
  ];

  const handleSelectQuestion = (q: string) => {
    setActiveQuestion(q);
    setLoading(true);

    setTimeout(() => {
      let res: any = {
        disclaimer: '⚠ AI Diagnostic Decision Support. Pathologist verification required.',
        question_context: q,
        summary: '',
        critical_alerts: [],
        pathology_recommendations: [],
        showPdfAction: false
      };

      switch (q) {
        case "Show me today's pending laboratory tests.":
          const pendingTests = initialLabRequests.filter(r => r.status === 'Pending' || r.status === 'Requested');
          res.summary = `There are currently ${pendingTests.length} pending laboratory test orders requiring sample collection or lab acceptance.`;
          res.pathology_recommendations = pendingTests.map(r => 
            `• Order #${r.request_id}: ${r.test_name} for ${r.patient_name} (Category: ${r.category}, Priority: ${r.priority}) — Doctor: ${r.doctor_name}`
          );
          res.critical_alerts = [
            `Total Pending Test Orders: ${pendingTests.length} orders`,
            `Urgent Pending Orders: ${pendingTests.filter(r => r.priority === 'Urgent').length} STAT orders`
          ];
          break;

        case "Show me samples that are waiting for processing.":
          const waitingSamples = initialLabRequests.filter(r => r.status === 'Sample Collected' || r.status === 'Processing');
          res.summary = `SAMPLES IN LAB QUEUE: ${waitingSamples.length} specimen tubes collected and currently waiting or undergoing autoanalyzer processing.`;
          res.critical_alerts = waitingSamples.map(r => 
            `🔬 Specimen ${r.sample_details?.sample_id || 'LAB-S'} (${r.sample_details?.sample_type || 'Blood'}): ${r.test_name} for ${r.patient_name} [Status: ${r.status}]`
          );
          res.pathology_recommendations = [
            'Ensure centrifugation speed 3500 RPM for 10 minutes for Serum biochemistry tubes',
            'Verify barcode scan before loading onto Beckman Coulter Autoanalyzer'
          ];
          break;

        case "Which samples have been rejected and why?":
          const rejectedSamples = initialLabRequests.filter(r => r.status === 'Sample Issue');
          res.summary = `REJECTED / INSUFFICIENT SAMPLES: ${rejectedSamples.length} specimen rejected during quality pre-analytical check.`;
          res.critical_alerts = rejectedSamples.map(r => 
            `🚨 REJECTED SAMPLE #${r.sample_details?.sample_id || 'LAB-S-007'}: ${r.patient_name} (${r.test_name}) — Reason: "${r.sample_details?.issue_reason || 'Insufficient volume'}" (${r.sample_details?.issue_remarks || 'Under 5ml'})`
          );
          res.pathology_recommendations = [
            'Re-collection order automatically transmitted to attending ward nurse and ordering physician.',
            'Maintain strict specimen rejection criteria per ISO 15189 pre-analytical quality protocol.'
          ];
          break;

        case "Show me today's urgent laboratory requests.":
          const urgentReqs = initialLabRequests.filter(r => r.priority === 'Urgent');
          res.summary = `STAT / URGENT LABORATORY ORDERS: ${urgentReqs.length} urgent diagnostic requests flagged for fast-track processing.`;
          res.critical_alerts = urgentReqs.map(r => 
            `🚨 URGENT ORDER #${r.request_id}: ${r.test_name} for ${r.patient_name} — Reason: "${r.clinical_reason}" [Status: ${r.status}]`
          );
          res.pathology_recommendations = [
            'Fast-track turnaround time target: < 45 minutes for STAT orders.',
            'Direct phone escalation to attending doctor required if panic value is confirmed.'
          ];
          break;

        case "Which test reports are waiting for verification?":
          const waitingVerif = initialLabRequests.filter(r => r.status === 'Result Entered');
          res.summary = `REPORTS AWAITING PATHOLOGIST VERIFICATION: ${waitingVerif.length} completed lab test panels ready for senior pathologist sign-off.`;
          res.critical_alerts = waitingVerif.map(r => 
            `📋 Waiting Sign-Off: ${r.request_id} - ${r.test_name} for ${r.patient_name} (Entered by ${r.result?.entered_by || 'Lab Tech'})`
          );
          res.pathology_recommendations = [
            'Review parameter findings, reference ranges, and historical delta checks prior to digital signature.',
            'Once verified, report is automatically published to EHR and Doctor portal.'
          ];
          break;

        case "Show me abnormal or critical laboratory results requiring review.":
          const abnormalReqs = initialLabRequests.filter(r => r.result?.parameters.some(p => p.status === 'High' || p.status === 'Low' || p.status === 'Abnormal'));
          res.summary = `CRITICAL & ABNORMAL RESULTS: ${abnormalReqs.length} test panels contain parameters outside established ISO reference intervals.`;
          res.critical_alerts = abnormalReqs.map(r => {
            const highLow = r.result?.parameters.filter(p => p.status !== 'Normal').map(p => `${p.parameter_name}: ${p.value} ${p.unit} (${p.status})`).join(', ');
            return `⚠️ ABNORMAL RESULT (${r.request_id} - ${r.patient_name}): ${r.test_name} -> ${highLow}`;
          });
          res.pathology_recommendations = [
            'Verify repeat test run if delta shift exceeds 25%.',
            'Log critical panic value communication in LIS audit registry.'
          ];
          break;

        case "Show me this patient's previous laboratory reports.":
          res.summary = `Historical Laboratory Diagnostic Timeline for Active Patient (${patientName}):`;
          res.pathology_recommendations = [
            `• 16 Aug 2026: Blood Gas (ABG) — Order #LAB006 — Status: Verified (pH 7.38, pCO2 41 mmHg - Normal)`,
            `• 10 Jun 2026: Lipid Profile — Total Cholesterol 217 mg/dL, LDL 139 mg/dL`,
            `• 15 Jan 2026: Complete Blood Count (CBC) — Hb 14.2 g/dL, WBC 6,800 /µL (Normal)`,
            `• 02 Nov 2025: Fasting Blood Glucose — FBS 98 mg/dL (Normal)`
          ];
          res.critical_alerts = ['Full historical EHR lab timeline verified across 4 diagnostic encounters.'];
          break;

        case "Compare this patient's previous and current laboratory results.":
          res.summary = `DELTA CHECK & TREND COMPARISON — ${patientName}:`;
          res.critical_alerts = [
            `📈 Total Cholesterol: Previous (10 Jun) = 217 mg/dL -> Current (17 Aug) = 235 mg/dL (+18 mg/dL ↑ Elevated)`,
            `📈 LDL Cholesterol: Previous (10 Jun) = 139 mg/dL -> Current (17 Aug) = 157 mg/dL (+18 mg/dL ↑ Elevated)`,
            `↔️ HDL Cholesterol: Previous (10 Jun) = 41 mg/dL -> Current (17 Aug) = 42 mg/dL (Stable)`,
            `📈 Triglycerides: Previous (10 Jun) = 165 mg/dL -> Current (17 Aug) = 180 mg/dL (+15 mg/dL ↑ Elevated)`
          ];
          res.pathology_recommendations = [
            'Delta Check Interpretation: Upward progression in LDL and Total Cholesterol over 2-month interval.',
            'Recommendation: Evaluate initiation/dose escalation of Statin therapy with attending Cardiologist.'
          ];
          break;

        case "Show me today's completed laboratory tests.":
          const completedReqs = initialLabRequests.filter(r => r.status === 'Verified' || r.status === 'Completed' || r.status === 'Result Entered');
          res.summary = `COMPLETED LABORATORY TESTS TODAY: ${completedReqs.length} test panels successfully analyzed, verified, and published.`;
          res.pathology_recommendations = completedReqs.map(r => 
            `✅ ${r.request_id}: ${r.test_name} for ${r.patient_name} — Doctor: ${r.doctor_name} [Verified by Senior Pathologist]`
          );
          res.critical_alerts = [
            `Total Completed Diagnostic Tests: ${completedReqs.length} reports`,
            `Turnaround Time (TAT) Average: 34 minutes (Target < 60 mins)`
          ];
          break;

        case "Generate the laboratory report PDF.":
          res.summary = `OFFICIAL ISO 15189 LABORATORY DIAGNOSTIC REPORT GENERATED`;
          res.critical_alerts = [
            `Report Reference: LAB-REPORT-2026-8901 | Patient: ${patientName}`,
            `Test Panel: Lipid Profile & Fasting Blood Biochemistry | Pathologist Verification: Verified`
          ];
          res.pathology_recommendations = [
            'Official Laboratory Test Report is compiled and formatted for print/download.'
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

  const handlePrintLabPdfReport = () => {
    const reportContent = `
      ========================================================================================
      🧪 SMARTCARE HOSPITAL CENTRAL PATHOLOGY & LABORATORY SERVICES
      Accredited ISO 15189 Medical Diagnostic Laboratory
      ========================================================================================
      Patient Name : ${patientName}           Age / Gender : 61 Y / Male
      Patient ID   : P005                               Order Ref    : ${requestId}
      Referred By  : Dr. Rajesh Sharma (Cardiology)      Sample Date  : 17 Aug 2026 07:45 AM
      Specimen Type: Blood Serum                         Report Date  : ${new Date().toLocaleString()}
      ========================================================================================

      TEST PARAMETER                  OBSERVED VALUE    UNIT        REFERENCE INTERVAL    STATUS
      ----------------------------------------------------------------------------------------
      Total Cholesterol               235               mg/dL       < 200 mg/dL           HIGH [↑]
      Triglycerides                   180               mg/dL       < 150 mg/dL           HIGH [↑]
      HDL Cholesterol                 42                mg/dL       > 40 mg/dL            NORMAL
      LDL Cholesterol                 157               mg/dL       < 100 mg/dL           HIGH [↑]
      CHOL / HDL Ratio                5.6               Ratio       < 4.5                 HIGH [↑]

      ----------------------------------------------------------------------------------------
      DELTA CHECK COMPARISON (Previous vs Current):
      • Total Cholesterol: 217 mg/dL (10 Jun 2026) -> 235 mg/dL (17 Aug 2026) [+18 mg/dL ↑]
      • LDL Cholesterol  : 139 mg/dL (10 Jun 2026) -> 157 mg/dL (17 Aug 2026) [+18 mg/dL ↑]

      PATHOLOGY INTERPRETATION & CLINICAL REMARKS:
      Observed lipid profile demonstrates moderate hyperlipidemia with elevated LDL and serum triglycerides.
      Suggest clinical correlation with lipid-lowering therapy and cardiovascular risk factors.

      ========================================================================================
      Entered By: Alex Mercer, MLS (Lab Tech)      Verified By: Dr. Neha Shah (Senior Pathologist)
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-purple-700 via-indigo-800 to-purple-900 text-white p-5 rounded-3xl shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
            <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight flex items-center space-x-2">
              <span>🔬 LABORATORY MODULE AI CLINIC — DIAGNOSTIC ANALYZER</span>
            </h1>
            <p className="text-xs text-purple-100 mt-0.5">
              Live sample tracking, delta check comparison, panic alert engine & ISO 15189 lab report PDF generator
            </p>
          </div>
        </div>

        <button
          onClick={handlePrintLabPdfReport}
          className="flex items-center justify-center space-x-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 rounded-2xl text-xs transition-all shadow-md cursor-pointer shrink-0"
        >
          <Printer className="h-4 w-4" />
          <span>Export Laboratory Report PDF</span>
        </button>
      </div>

      {/* PRESET 10 LAB AI QUESTIONS PANEL */}
      <div className="rounded-3xl border border-purple-200 bg-purple-50/40 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-purple-200/80 pb-3">
          <h2 className="text-sm font-bold text-purple-950 flex items-center space-x-2">
            <HelpCircle className="h-4 w-4 text-purple-600" />
            <span>⚡ LABORATORY AI CLINIC ASSISTANT — 10 DIAGNOSTIC PRESET QUERIES</span>
          </h2>
          <span className="text-[10px] bg-purple-200 text-purple-900 font-extrabold px-2.5 py-0.5 rounded-full">
            REAL-TIME LIS TELEMETRY
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {questionCategories.map((cat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 border border-purple-100 shadow-xs space-y-2">
              <h3 className="text-xs font-bold text-purple-950 border-b border-slate-100 pb-1.5">
                {cat.title}
              </h3>
              <div className="flex flex-col gap-1.5">
                {cat.questions.map((q, qIdx) => (
                  <button
                    key={qIdx}
                    onClick={() => handleSelectQuestion(q)}
                    className={`text-left text-[11px] font-semibold px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                      activeQuestion === q
                        ? 'bg-purple-700 text-white shadow-md scale-[1.02]'
                        : 'bg-purple-50/80 hover:bg-amber-100/70 text-purple-950 border border-purple-100 hover:border-amber-300'
                    }`}
                  >
                    <span className="line-clamp-2">{q}</span>
                    <ChevronRight className={`h-3 w-3 shrink-0 ml-1 ${activeQuestion === q ? 'text-amber-300' : 'text-purple-400'}`} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI OUTPUT RESPONSE CARD */}
      <div className="rounded-3xl border border-purple-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span>AI DIAGNOSTIC TELEMETRY & DELTA ANALYSIS RESPONSE</span>
          </h3>
          <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded-full border border-amber-200">
            {aiResult?.question_context || 'LIVE LIS ANALYSIS'}
          </span>
        </div>

        {loading ? (
          <div className="py-10 flex flex-col items-center justify-center space-y-2">
            <RefreshCw className="h-7 w-7 text-purple-600 animate-spin" />
            <p className="text-xs font-bold text-slate-600">Cross-Examining ISO Reference Intervals & Delta Limits...</p>
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
                <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">Diagnostic Evaluation Summary:</span>
                <p className="text-slate-900 font-semibold mt-1 leading-relaxed bg-purple-50/50 p-3.5 rounded-xl border border-purple-100">
                  {aiResult.summary}
                </p>
              </div>
            )}

            {/* Critical Alerts */}
            {aiResult.critical_alerts?.length > 0 && (
              <div>
                <span className="font-bold text-red-900 uppercase text-[10px] tracking-wider">High-Priority Diagnostic Flags & Delta Checks:</span>
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

            {/* Pathology Recommendations / List Items */}
            {aiResult.pathology_recommendations?.length > 0 && (
              <div>
                <span className="font-bold text-purple-900 uppercase text-[10px] tracking-wider">Pathology Recommendations & Laboratory Details:</span>
                <ul className="space-y-1.5 mt-1">
                  {aiResult.pathology_recommendations.map((item: string, idx: number) => (
                    <li key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-900 font-medium flex items-start space-x-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-purple-600 mt-0.5 shrink-0" />
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
                  onClick={handlePrintLabPdfReport}
                  className="w-full flex items-center justify-center space-x-2 bg-purple-700 hover:bg-purple-800 text-white font-extrabold py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer"
                >
                  <Printer className="h-4 w-4" />
                  <span>PRINT / DOWNLOAD TODAY'S LABORATORY DIAGNOSTIC REPORT PDF</span>
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
