import React, { useState } from 'react';
import {
  Sparkles,
  UserPlus,
  Search,
  Calendar,
  Clock,
  UserCheck,
  Building2,
  Bed,
  Printer,
  FileText,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Phone,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { demoDoctors, demoPatients20, initialReceptionAppointments } from '../../pages/reception/receptionData';
import { downloadPDFDocument } from '../../utils/pdfDownloader';

interface AIReceptionSuggestionCardProps {
  patientId?: string;
  patientName?: string;
  onNavigateTab?: (tab: string) => void;
}

export const AIReceptionSuggestionCard: React.FC<AIReceptionSuggestionCardProps> = ({
  patientId = 'PAT-1001',
  patientName = 'Aarav Sharma',
  onNavigateTab,
}) => {
  const [loading, setLoading] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

  const [aiResult, setAiResult] = useState<any | null>({
    disclaimer: '⚠ AI Reception & OPD Assist. Verify patient identity before processing bookings.',
    question_context: 'Hospital Reception & OPD Telemetry Overview',
    summary: `Active Reception Desk: Today's Total OPD Appointments: ${initialReceptionAppointments.length} | Waiting Lobby: 3 Patients | Available Bed Count: 14 Beds across Wards.`,
    critical_alerts: [
      'High Priority: 3 Patients currently waiting in OPD Reception Lobby > 20 mins.',
      'ICU Ward Bed Alert: 2 beds available (80% occupied).',
      'Doctor Roster: Dr. Arjun Mehta (Cardiology) is currently Available in OPD Room 102.'
    ],
    recommendations: [
      'Initiate fast-track registration for walk-in elderly patients.',
      'Verify patient mobile number & national health ID during check-in.',
      'Print appointment token slip upon successful registration.'
    ]
  });

  const questionCategories = [
    {
      title: "👤 Patient Registration & Lookup",
      questions: [
        "Register a new patient.",
        "Find this patient's existing hospital record.",
        "Show me today's waiting patients."
      ]
    },
    {
      title: "📅 Appointments & Scheduling",
      questions: [
        "Show me today's appointments.",
        "Book an appointment for this patient.",
        "Show me available doctors and appointment slots.",
        "Reschedule or cancel this patient's appointment."
      ]
    },
    {
      title: "🏥 Departments, Beds & PDF Slip",
      questions: [
        "Show me available hospital departments and services.",
        "Show me available beds and current admissions.",
        "Generate the patient's registration/appointment PDF."
      ]
    }
  ];

  const handleSelectQuestion = (q: string) => {
    setActiveQuestion(q);
    setLoading(true);

    setTimeout(() => {
      let res: any = {
        disclaimer: '⚠ AI Reception & OPD Assist. Verify patient identity before processing bookings.',
        question_context: q,
        summary: '',
        critical_alerts: [],
        recommendations: [],
        showPdfAction: false
      };

      switch (q) {
        case "Register a new patient.":
          res.summary = `NEW PATIENT REGISTRATION WORKFLOW & PROTOCOL:`;
          res.critical_alerts = [
            `1. Assign Auto-Generated ID: PAT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            `2. Mandatory Fields: Full Name, DOB, Gender, Mobile Number, Emergency Contact & Preferred Department.`,
            `3. ID Proof Verification: National Health ID / Aadhaar / Driving License check.`
          ];
          res.recommendations = [
            `• Auto-create central EHR timeline upon saving record.`,
            `• Generate initial OPD registration card & hospital UHID barcode.`,
            `• Prompt user to assign attending doctor or OPD queue.`
          ];
          break;

        case "Find this patient's existing hospital record.":
          const found = demoPatients20.find(p => p.patient_id === patientId || p.name.toLowerCase().includes(patientName.toLowerCase())) || demoPatients20[0];
          res.summary = `MASTER PATIENT INDEX RECORD SEARCH — ${found.name} (${found.patient_id}):`;
          res.critical_alerts = [
            `• Patient Name: ${found.name} | Gender/Age: ${found.gender}, ${found.age} yrs`,
            `• Mobile Phone: ${found.phone} | Emergency Contact: ${(found as any).emergency_contact || (found as any).emergency_phone || '+91 98765 00000'}`,
            `• Address: ${found.address || '742 Evergreen Terrace, Sector 4, Metro City'}`,
            `• Blood Group: ${found.blood_group || 'O+'} | Primary Doctor: ${found.assigned_doctor}`
          ];
          res.recommendations = [
            `• Visit History: 3 past OPD consultations logged in Central EHR.`,
            `• Outstanding Billing Balance: ₹0.00 (All past invoices cleared).`
          ];
          break;

        case "Show me today's appointments.":
          res.summary = `TODAY'S OPD & SPECIALIST APPOINTMENT QUEUE (${initialReceptionAppointments.length} Total):`;
          res.recommendations = initialReceptionAppointments.map(a => 
            `📅 Token #${a.id}: ${a.patient_name} (${a.patient_id}) — Doctor: ${a.doctor_name} [${a.department}] at ${a.time_slot} | Status: ${a.status}`
          );
          res.critical_alerts = [
            `Confirmed / Scheduled: ${initialReceptionAppointments.filter(a => a.status === 'Confirmed' || (a.status as string) === 'Scheduled').length}`,
            `Checked-in / Waiting: ${initialReceptionAppointments.filter(a => a.status === 'Checked-in' || a.status === 'Waiting').length}`,
            `Completed: ${initialReceptionAppointments.filter(a => a.status === 'Completed').length}`
          ];
          break;

        case "Book an appointment for this patient.":
          res.summary = `APPOINTMENT BOOKING TELEMETRY & SLOT ALLOCATION — ${patientName}:`;
          res.critical_alerts = [
            `✓ Recommended Slot: Today at 11:30 AM with Dr. Arjun Mehta (Cardiology)`,
            `✓ Department: Cardiology (OPD Room 102 - 1st Floor Main Block)`,
            `✓ Consultation Fee: ₹500.00 (Standard OPD Rate)`
          ];
          res.recommendations = [
            `Confirm slot reservation with patient.`,
            `Send SMS confirmation & token reminder to ${patientName}'s registered phone number.`
          ];
          break;

        case "Show me available doctors and appointment slots.":
          const availDocs = demoDoctors.filter(d => d.status === 'Available');
          res.summary = `LIVE DOCTOR DUTY ROSTER & SLOT MATRIX (${availDocs.length} Doctors Available Now):`;
          res.critical_alerts = availDocs.map(d => 
            `👨‍⚕️ ${d.name} (${d.department}) — Status: AVAILABLE | Hours: ${d.consultation_hours} | Today's Appts: ${d.today_appointments_count}`
          );
          res.recommendations = [
            `• Dr. Arjun Mehta (Cardiology): Next free slot at 11:30 AM`,
            `• Dr. Rahul Verma (Neurology): Next free slot at 12:00 PM`,
            `• Dr. Sneha Rao (Neurology): Afternoon slot starting 02:00 PM`
          ];
          break;

        case "Reschedule or cancel this patient's appointment.":
          res.summary = `APPOINTMENT MODIFICATION & RESCHEDULE ENGINE:`;
          res.critical_alerts = [
            `• Active Booking: APT-2026-001 (${patientName} with Dr. Arjun Mehta at 10:30 AM)`,
            `• Reschedule Options: Move to Today 03:00 PM OR Tomorrow 10:00 AM.`,
            `• Cancellation Policy: Free cancellation up to 1 hour before scheduled slot.`
          ];
          res.recommendations = [
            `Select new time slot or specify cancellation reason (e.g., Patient Request / Doctor Emergency).`,
            `System will automatically release the slot for waitlisted queue.`
          ];
          break;

        case "Show me today's waiting patients.":
          const waiting = initialReceptionAppointments.filter(a => a.status === 'Checked-in' || a.status === 'Waiting' || (a.status as string) === 'Scheduled');
          res.summary = `RECEPTION LOBBY WAITING QUEUE TELEMETRY (${waiting.length} Patients Waiting):`;
          res.critical_alerts = waiting.map(w => 
            `⏳ ${w.patient_name} (${w.patient_id}) — Doctor: ${w.doctor_name} (${w.department}) | Slot: ${w.time_slot} [Status: ${w.status}]`
          );
          res.recommendations = [
            `Average OPD wait time: 14 minutes.`,
            `Notify OPD Nursing station when patient check-in count reaches 5.`
          ];
          break;

        case "Show me available hospital departments and services.":
          res.summary = `SMARTCARE HOSPITAL DEPARTMENTAL DIRECTORY & SERVICE CATALOG:`;
          res.critical_alerts = [
            `1. Cardiology (Ext 101, Floor 1) — ECG, Echocardiography, Angiography`,
            `2. Neurology (Ext 102, Floor 2) — EEG, Stroke Unit, Neuro Consult`,
            `3. Orthopedics (Ext 103, Floor 1) — Fracture Care, Joint Replacement, X-Ray`,
            `4. Pediatrics (Ext 104, Floor 3) — Vaccination, Child Health, NICU`,
            `5. LIS Laboratory & LIS (Ext 201, Ground Floor) — Blood Tests, Pathology`,
            `6. RIS Radiology (Ext 202, Ground Floor) — CT Scan, MRI, Ultrasound`,
            `7. Emergency & SOS (Ext 999, Emergency Block) — 24/7 Trauma & Ambulance Fleet`
          ];
          res.recommendations = [
            `All departments actively accepting OPD & Emergency registrations.`
          ];
          break;

        case "Show me available beds and current admissions.":
          res.summary = `IPD WARD BEDS & ADMISSIONS LIVE TELEMETRY:`;
          res.critical_alerts = [
            `• ICU Ward: 2 Available / 10 Total (80% Occupied)`,
            `• General Male Ward: 8 Available / 30 Total (73% Occupied)`,
            `• General Female Ward: 6 Available / 25 Total (76% Occupied)`,
            `• Deluxe Private Suites: 4 Available / 12 Total (66% Occupied)`
          ];
          res.recommendations = [
            `Total Current Inpatient Admissions: 69 Patients`,
            `Emergency bed reserve: 2 ICU beds held for incoming trauma ambulance arrivals.`
          ];
          break;

        case "Generate the patient's registration/appointment PDF.":
          res.summary = `OFFICIAL PATIENT REGISTRATION & APPOINTMENT SLIP GENERATED`;
          res.critical_alerts = [
            `Patient: ${patientName} (${patientId}) | Appt Ref: APT-2026-001`,
            `Doctor: Dr. Arjun Mehta (Cardiology) | Slot: Today 11:30 AM | Room 102`
          ];
          res.recommendations = [
            `Official Registration & OPD Token Slip is generated and ready for print/download.`
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

  const handlePrintAppointmentSlipPdf = async () => {
    await downloadPDFDocument(
      'appointment',
      {
        appointment_id: 'APT-2026-001',
        patient_name: patientName,
        patient_id: patientId,
        doctor_name: 'Dr. Arjun Mehta',
        department: 'Cardiology',
        date: new Date().toISOString().split('T')[0],
        time_slot: '11:30 AM',
        token_no: 'TK-104',
        reason: 'OPD General Consultation & Registration Slip'
      },
      `Appointment_Slip_${patientId}_${patientName.replace(/\s+/g, '_')}.pdf`
    );
  };

  return (
    <div className="rounded-3xl border border-teal-200 bg-gradient-to-br from-white via-teal-50/20 to-cyan-50/30 p-6 shadow-md space-y-6 font-['Inter',sans-serif]">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-teal-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-600 text-white shadow-md shadow-teal-500/20">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">🤖 RECEPTIONIST AI ASSISTANT & OPD CLINIC SUPPORT</h2>
              <span className="rounded-full bg-teal-100 text-teal-800 border border-teal-200 px-2.5 py-0.5 text-[10px] font-extrabold uppercase">
                Live HMIS Telemetry
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Instant Patient Lookup ➔ OPD Booking ➔ Doctor Availability ➔ Bed Status ➔ Token PDF Generation
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleSelectQuestion("Show me today's appointments.")}
            className="flex items-center space-x-1.5 rounded-xl bg-teal-600 text-white px-3 py-2 text-xs font-bold shadow-sm hover:bg-teal-700 transition-all"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Queue</span>
          </button>
        </div>
      </div>

      {/* 10 Interactive Reception AI Questions Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
          <HelpCircle className="h-4 w-4 text-teal-600" />
          <span>SELECT RECEPTIONIST AI CLINIC SUPPORT QUESTION (10 PRESET QUERIES)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {questionCategories.map((cat, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2">
              <h4 className="text-xs font-bold text-teal-800 border-b border-slate-100 pb-2 flex items-center space-x-1.5">
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
                          ? 'bg-teal-700 text-white shadow-sm font-bold'
                          : 'bg-slate-50 text-slate-700 hover:bg-teal-50 hover:text-teal-900 border border-slate-100'
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
        <div className="rounded-2xl border border-teal-200 bg-white p-8 text-center space-y-3 shadow-sm">
          <RefreshCw className="h-8 w-8 text-teal-600 animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-700">Analyzing Receptionist & OPD Telemetry Data...</p>
        </div>
      ) : (
        aiResult && (
          <div className="rounded-2xl border border-teal-200 bg-white p-5 shadow-sm space-y-4">
            {/* Context Badge */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-teal-800 flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-teal-600" />
                <span>AI ANALYSIS FOR: "{aiResult.question_context}"</span>
              </span>
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                {aiResult.disclaimer}
              </span>
            </div>

            {/* Summary Banner */}
            <div className="p-3.5 bg-teal-50/70 border border-teal-200 rounded-xl text-xs font-bold text-teal-950">
              {aiResult.summary}
            </div>

            {/* Critical Alerts / Findings */}
            {aiResult.critical_alerts && aiResult.critical_alerts.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                  <span>Key Reception Data & Alerts</span>
                </h4>
                <div className="space-y-1.5">
                  {aiResult.critical_alerts.map((item: string, i: number) => (
                    <div key={i} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
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
                  <span>Recommended Reception Action Items</span>
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
                Connected to SmartCare Reception & Master Patient Index
              </div>

              <div className="flex items-center space-x-2">
                {aiResult.showPdfAction && (
                  <button
                    onClick={handlePrintAppointmentSlipPdf}
                    className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 text-xs font-bold shadow-md hover:from-emerald-700 hover:to-teal-700 transition-all"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Download Registration / Appointment PDF</span>
                  </button>
                )}
                {onNavigateTab && (
                  <button
                    onClick={() => onNavigateTab('appointments')}
                    className="flex items-center space-x-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-2 text-xs font-bold transition-all border border-slate-200"
                  >
                    <span>Go to OPD Queue</span>
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
