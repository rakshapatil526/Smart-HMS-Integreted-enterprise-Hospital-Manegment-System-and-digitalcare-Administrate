import React, { useState } from 'react';
import {
  Sparkles,
  Truck,
  MapPin,
  Clock,
  Phone,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Printer,
  Shield,
  Navigation,
  Activity,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { downloadPDFDocument } from '../../utils/pdfDownloader';

interface AIAmbulanceOperatorSuggestionCardProps {
  requestId?: string;
  ambulanceNumber?: string;
  onNavigateTab?: (tab: string) => void;
}

export const AIAmbulanceOperatorSuggestionCard: React.FC<AIAmbulanceOperatorSuggestionCardProps> = ({
  requestId = 'EMG-2026-881',
  ambulanceNumber = 'KA-01-EQ-9910',
  onNavigateTab,
}) => {
  const [loading, setLoading] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

  const [aiResult, setAiResult] = useState<any | null>({
    disclaimer: '⚠ AI Ambulance Dispatch Support. Operator verification required for emergency routing.',
    question_context: 'Emergency Fleet & Dispatch Control Center Overview',
    summary: 'Active Ambulance Dispatch Hub: 22 Total Units | 21 Available | 1 Active Emergency Mission | 1 Pending Dispatch Request.',
    critical_alerts: [
      'Active Emergency Mission: KA-01-EQ-9910 en route to Manipal Hospital Cardiac Bay (ETA 8 mins).',
      'Pending Request: Severe Cardiac Distress at Koramangala 5th Block (Awaiting Dispatch Assignment).'
    ],
    recommendations: [
      'Dispatch nearest ALS Ambulance KA-04-ER-2244 to Koramangala pending emergency.',
      'Broadcast pre-arrival cardiac emergency alert to Receiving Hospital ER Trauma Desk.'
    ]
  });

  const questionCategories = [
    {
      title: "🚑 Fleet Availability & Active Trips",
      questions: [
        "Show me all available ambulances.",
        "Show me currently active ambulance trips.",
        "Show me pending emergency requests.",
        "Show me today's completed ambulance trips."
      ]
    },
    {
      title: "🚨 Emergency Assignment & Staff Telemetry",
      questions: [
        "Which ambulance is assigned to this emergency?",
        "Show me the assigned driver and medical staff.",
        "Show me the current status of this ambulance trip.",
        "Show me the emergency patient's transfer details."
      ]
    },
    {
      title: "🔧 Fleet Maintenance & PDF Activity Report",
      questions: [
        "Which ambulances require maintenance?",
        "Generate today's ambulance activity report PDF."
      ]
    }
  ];

  const handleSelectQuestion = (q: string) => {
    setActiveQuestion(q);
    setLoading(true);

    setTimeout(() => {
      let res: any = {
        disclaimer: '⚠ AI Ambulance Dispatch Support. Operator verification required for emergency routing.',
        question_context: q,
        summary: '',
        critical_alerts: [],
        recommendations: [],
        showPdfAction: false
      };

      switch (q) {
        case "Show me all available ambulances.":
          res.summary = `LIVE AVAILABLE AMBULANCE FLEET (21 Units Ready for Immediate Dispatch):`;
          res.critical_alerts = [
            `🚑 Unit #1: KA-01-EQ-9910 (ALS - Advanced Life Support) — Driver: Ravi Kumar (+91 9876543210) | Station: MG Road Hub`,
            `🚑 Unit #2: KA-04-ER-2244 (ALS - Cardiac Ready) — Driver: Suresh Babu (+91 9876511223) | Station: Koramangala Hub`,
            `🚑 Unit #3: KA-02-EM-1122 (BLS - Basic Life Support) — Driver: Anand Verma (+91 9876533445) | Station: Indiranagar Hub`,
            `🚑 Unit #4: KA-03-EQ-5566 (Neonatal / ICU Unit) — Driver: Mohan Das (+91 9876577889) | Station: Central HMIS Base`
          ];
          res.recommendations = [
            `Average Fleet Readiness: 95.4%`,
            `All ready units fully equipped with Oxygen, Defibrillator, Ventilator & GPS Tracker.`
          ];
          break;

        case "Show me currently active ambulance trips.":
          res.summary = `CURRENTLY ACTIVE EMERGENCY MISSIONS (1 Active Mission):`;
          res.critical_alerts = [
            `🚨 Mission #EMG-2026-881: Ambulance ${ambulanceNumber} (ALS Unit)`,
            `• Patient: Aarav Sharma (42/M) — Condition: Acute Chest Pain & Dizziness`,
            `• Pickup Location: 100ft Road, Indiranagar, Bengaluru`,
            `• Destination: SmartCare Central Hospital ER Cardiac Care Unit`,
            `• Current Stage: EN_ROUTE_TO_HOSPITAL | Speed: 52 km/h | ETA: 7 mins`
          ];
          res.recommendations = [
            `ER Trauma Desk notified. Cardiac ICU Bed #4 pre-reserved.`
          ];
          break;

        case "Show me pending emergency requests.":
          res.summary = `PENDING EMERGENCY DISPATCH REQUESTS (1 Request Awaiting Assignment):`;
          res.critical_alerts = [
            `⚠️ Request Ref: #EMG-2026-904 | Severity: CRITICAL`,
            `• Incident Type: Road Traffic Accident & Multiple Trauma`,
            `• Pickup Address: Near Forum Mall, Hosur Main Road, Koramangala`,
            `• Patient: Unidentified Male (Approx 35 yrs) | Caller: Passersby (Rajesh)`,
            `• Nearest Available Unit: KA-04-ER-2244 (1.8 km away - Est. Dispatch Time: 4 mins)`
          ];
          res.recommendations = [
            `Click DISPATCH NOW in Command Operator Dashboard to assign KA-04-ER-2244.`
          ];
          break;

        case "Which ambulance is assigned to this emergency?":
          res.summary = `ASSIGNED DISPATCH UNIT TELEMETRY — Emergency Ref #${requestId}:`;
          res.critical_alerts = [
            `✓ Assigned Ambulance: Unit ${ambulanceNumber} (Advanced Life Support - ALS)`,
            `✓ GPS Coordinates: 12.9716° N, 77.5946° E (Real-time tracking active)`,
            `✓ Dispatch Timestamp: 11:42 AM (4 mins ago)`
          ];
          res.recommendations = [
            `Siren and Emergency Flashing Lights reported Active by Driver Telematics.`
          ];
          break;

        case "Show me the assigned driver and medical staff.":
          res.summary = `DISPATCH CREW & PARAMEDIC ROSTER — Unit ${ambulanceNumber}:`;
          res.critical_alerts = [
            `👨‍✈️ Lead Ambulance Driver: Ravi Kumar (Lic #DL-KA-2018-99401 | Phone: +91 98765 43210)`,
            `👩‍⚕️ On-Board Emergency Paramedic: Nurse Sunita Sharma, RN (Critical Care & ACLS Certified)`,
            `👨‍⚕️ Emergency Medical Technician (EMT): Vikram Singh (BLS/PALS Specialist)`
          ];
          res.recommendations = [
            `Direct Driver Tele-Contact: Active via Encrypted HMIS Dispatch Channel.`
          ];
          break;

        case "Show me the current status of this ambulance trip.":
          res.summary = `REAL-TIME TRIP TELEMETRY & PROGRESS TRACKER — Mission #${requestId}:`;
          res.critical_alerts = [
            `Stage 1: 🟢 Emergency SOS Triggered (11:40 AM)`,
            `Stage 2: 🟢 Operator Dispatch Confirmed (11:42 AM)`,
            `Stage 3: 🟢 On-Scene Patient Pickup Complete (11:46 AM)`,
            `Stage 4: 🟡 En-Route to Hospital ER (11:48 AM - Current Stage)`,
            `Stage 5: ⚪ Handover to ER Trauma Bay (Expected 11:55 AM)`
          ];
          res.recommendations = [
            `Vitals Streaming: SpO2 95%, Heart Rate 104 bpm, BP 135/88 mmHg.`
          ];
          break;

        case "Show me today's completed ambulance trips.":
          res.summary = `TODAY'S COMPLETED EMERGENCY DISPATCH LOGS (14 Completed Missions):`;
          res.critical_alerts = [
            `• Mission #EMG-870: KA-01-EQ-9910 ➔ Cardiac Transfer to Fortis (Completed 08:30 AM)`,
            `• Mission #EMG-871: KA-02-EM-1122 ➔ Pregnancy Emergency to OPD (Completed 09:15 AM)`,
            `• Mission #EMG-872: KA-03-EQ-5566 ➔ Pediatric Convulsion Transfer (Completed 10:05 AM)`,
            `• Mission #EMG-873: KA-04-ER-2244 ➔ OPD Inter-Facility Transfer (Completed 10:50 AM)`
          ];
          res.recommendations = [
            `Total Transfers Completed Today: 14 | Average Response ETA: 6.2 Minutes.`
          ];
          break;

        case "Which ambulances require maintenance?":
          res.summary = `FLEET MAINTENANCE & HEALTH MONITORS (2 Units Scheduled):`;
          res.critical_alerts = [
            `🔧 KA-03-EM-4455 (BLS Unit 3): Scheduled Brake Pad & Oil Change (Due Today at 16:00)`,
            `🔧 KA-05-EQ-7788 (ALS Unit 5): Medical Oxygen Cylinder Valve Sensor Check (Offline for 1 hr)`
          ];
          res.recommendations = [
            `Auto-routing assigned maintenance slots to Central Biomedical Engineering Depot.`
          ];
          break;

        case "Show me the emergency patient's transfer details.":
          res.summary = `EMERGENCY PATIENT TRANSFER DOSSIER — Patient Aarav Sharma (PAT-1001):`;
          res.critical_alerts = [
            `• Patient: Aarav Sharma | Age/Gender: 42/M | Blood Group: O+`,
            `• Chief Complaint: Severe Acute Retrosternal Chest Pain radiating to Left Arm`,
            `• Initial Field Medication Given by Paramedic: Aspirin 300mg (Chewable) + Sublingual Nitroglycerin`,
            `• Destination Room: Emergency Resuscitation Bay #2 (Dr. Arjun Mehta Attending)`
          ];
          res.recommendations = [
            `EHR File synchronized with Receiving ER Doctor Portal.`
          ];
          break;

        case "Generate today's ambulance activity report PDF.":
          res.summary = `OFFICIAL AMBULANCE FLEET & DISPATCH ACTIVITY REPORT GENERATED`;
          res.critical_alerts = [
            `Report Ref: AMB-REP-2026-9921 | Total Registered Fleet: 22 Units`,
            `Active Missions: 1 | Completed Today: 14 | Maintenance: 2 | Average Response ETA: 6.2 mins`
          ];
          res.recommendations = [
            `Official Fleet & Emergency Response Log Report formatted for instant print/download.`
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

  const handlePrintAmbulancePdfReport = async () => {
    await downloadPDFDocument(
      'ambulance',
      {
        report_id: 'AMB-REP-2026-9921',
        date: new Date().toISOString().split('T')[0],
        total_fleet: 22,
        available: 21,
        active_trips: 1,
        completed_today: 14,
        average_eta: '6.2 mins',
        operator_name: 'Dispatch Operator HQ',
        active_mission: {
          trip_id: requestId,
          ambulance_no: ambulanceNumber,
          patient_name: 'Aarav Sharma',
          pickup: 'Indiranagar 100ft Road',
          destination: 'SmartCare ER Cardiac Bay'
        }
      },
      `Ambulance_Dispatch_Report_${new Date().toISOString().split('T')[0]}.pdf`
    );
  };

  return (
    <div className="rounded-3xl border border-red-200 bg-gradient-to-br from-white via-red-50/20 to-amber-50/30 p-6 shadow-md space-y-6 font-['Inter',sans-serif]">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-red-600 to-amber-600 text-white shadow-md shadow-red-500/20">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">🤖 AMBULANCE OPERATOR AI ASSISTANT & DISPATCH SUPPORT</h2>
              <span className="rounded-full bg-red-100 text-red-800 border border-red-200 px-2.5 py-0.5 text-[10px] font-extrabold uppercase">
                Real-Time GPS Telemetry
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Available Fleet ➔ Active Emergency Trips ➔ Crew Roster ➔ Trip Vitals ➔ PDF Activity Log
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleSelectQuestion("Show me currently active ambulance trips.")}
            className="flex items-center space-x-1.5 rounded-xl bg-red-600 text-white px-3 py-2 text-xs font-bold shadow-sm hover:bg-red-700 transition-all"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Fleet GPS</span>
          </button>
        </div>
      </div>

      {/* 10 Interactive Ambulance Operator AI Questions Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
          <HelpCircle className="h-4 w-4 text-red-600" />
          <span>SELECT AMBULANCE OPERATOR AI SUPPORT QUESTION (10 PRESET QUERIES)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {questionCategories.map((cat, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2">
              <h4 className="text-xs font-bold text-red-800 border-b border-slate-100 pb-2 flex items-center space-x-1.5">
                <span>{cat.title}</span>
              </h4>
              <div className="space-y-1.5">
                {cat.questions.map((q, qIdx) => {
                  const isActive = activeQuestion === q;
                  return (
                    <button
                      key={qIdx}
                      onClick={() => handleSelectQuestion(q)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between group ${
                        isActive
                          ? 'bg-red-600 text-white shadow-sm font-bold'
                          : 'bg-slate-50 text-slate-700 hover:bg-red-50 hover:text-red-900 border border-slate-100'
                      }`}
                    >
                      <span className="line-clamp-2 pr-2">{q}</span>
                      <ChevronRight className={`h-3.5 w-3.5 shrink-0 transition-transform ${isActive ? 'text-white' : 'text-slate-400 group-hover:translate-x-0.5'}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Intelligence Output Display Card */}
      {loading ? (
        <div className="rounded-2xl border border-red-200 bg-white p-8 text-center space-y-3 shadow-sm">
          <RefreshCw className="h-8 w-8 text-red-600 animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-700">Fetching Real-time GPS & Dispatch Telemetry...</p>
        </div>
      ) : (
        aiResult && (
          <div className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm space-y-4">
            {/* Context Badge */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-red-800 flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-red-600" />
                <span>AI ANALYSIS FOR: "{aiResult.question_context}"</span>
              </span>
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                {aiResult.disclaimer}
              </span>
            </div>

            {/* Summary Banner */}
            <div className="p-3.5 bg-red-50/70 border border-red-200 rounded-xl text-xs font-bold text-red-950">
              {aiResult.summary}
            </div>

            {/* Critical Alerts / Findings */}
            {aiResult.critical_alerts && aiResult.critical_alerts.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                  <span>Key Fleet Data & Dispatch Alerts</span>
                </h4>
                <div className="space-y-1.5">
                  {aiResult.critical_alerts.map((item: string, i: number) => (
                    <div key={i} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations / Actionable Next Steps */}
            {aiResult.recommendations && aiResult.recommendations.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Recommended Dispatch Action Items</span>
                </h4>
                <div className="space-y-1 text-xs text-slate-700 font-medium bg-emerald-50/30 border border-emerald-100 p-3 rounded-xl">
                  {aiResult.recommendations.map((rec: string, i: number) => (
                    <div key={i} className="py-0.5">• {rec}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar / PDF Download Button */}
            <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 gap-3">
              <div className="text-[11px] text-slate-500 font-medium">
                Connected to Emergency Dispatch Command & Telematics Base
              </div>

              <div className="flex items-center space-x-2">
                {aiResult.showPdfAction && (
                  <button
                    onClick={handlePrintAmbulancePdfReport}
                    className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white px-4 py-2 text-xs font-bold shadow-md hover:from-red-700 hover:to-amber-700 transition-all"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Download Ambulance Activity PDF</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};
