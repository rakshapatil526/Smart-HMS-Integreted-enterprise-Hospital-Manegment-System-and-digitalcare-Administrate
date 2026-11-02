import React, { useState } from 'react';
import { Bed, User, HeartPulse, Activity, ClipboardList, Send, CheckCircle2, ShieldAlert, Plus, X } from 'lucide-react';
import { MobileNotificationPayload } from '../../components/common/MobileNotificationToast';
import { useAuth } from '../../context/AuthContext';
import { sharedStore } from '../../services/sharedStore';

interface IPDDoctorViewProps {
  onNavigate: (tab: string, extraData?: any) => void;
  onTriggerNotification: (payload: MobileNotificationPayload) => void;
  initialPatientName?: string;
}

export const IPDDoctorView: React.FC<IPDDoctorViewProps> = ({
  onNavigate,
  onTriggerNotification,
  initialPatientName,
}) => {
  const { user } = useAuth();
  const currentDoctorName = sharedStore.getDoctorNameForUser(user);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);

  // Form states inside open IPD patient detail
  const [newProgressNote, setNewProgressNote] = useState('');
  const [nursingInstruction, setNursingInstruction] = useState('Check BP every 4 hours.');

  interface IPDInstruction {
    id: string;
    doctor: string;
    instruction: string;
    status: string;
    givenAt: string;
    recordedVitals?: { bp?: string; hr?: string; temp?: string; spo2?: string };
    nurseNotes?: string;
    nurseName?: string;
  }

  const [nursingInstructionsList, setNursingInstructionsList] = useState<IPDInstruction[]>([
    {
      id: 'INS-1',
      doctor: 'Dr. Sarah Jenkins',
      instruction: 'Check BP every 4 hours. Notify if Systolic > 140.',
      status: 'Completed',
      givenAt: '08:00 AM',
      recordedVitals: { bp: '124/82 mmHg', hr: '74 bpm', temp: '98.4 °F', spo2: '99%' },
      nurseNotes: 'Patient resting comfortably. Vitals within target parameters.',
      nurseName: 'Nurse Emma Watson',
    },
    {
      id: 'INS-2',
      doctor: 'Dr. Sarah Jenkins',
      instruction: 'Administer IV Saline 500ml over 6 hours.',
      status: 'Completed',
      givenAt: '10:30 AM',
      recordedVitals: { bp: '122/80 mmHg', hr: '72 bpm', temp: '98.6 °F', spo2: '98%' },
      nurseNotes: 'IV started successfully in left arm.',
      nurseName: 'Nurse Emma Watson',
    },
  ]);

  const ipdPatientsList = [
    {
      id: 'IPD-201',
      patient: 'Patient A (Aarav Sharma)',
      patientId: 'P001',
      age: 25,
      ward: 'ICU',
      bed: '102',
      status: 'Stable',
      admissionDate: '2026-08-15',
      diagnosis: 'Acute Coronary Syndrome / Observation',
      phone: '+1 555-0192',
      email: 'aarav.sharma@gmail.com',
      progressNotes: [
        '2026-08-16 09:00: Patient reports no further chest pain overnight. ECG stable.',
        '2026-08-15 18:00: Admitted from Emergency. Troponin I pending.',
      ],
    },
    {
      id: 'IPD-202',
      patient: 'Patient B (Priya Patel)',
      patientId: 'P002',
      age: 40,
      ward: 'General Ward',
      bed: '204',
      status: 'Stable',
      admissionDate: '2026-08-16',
      diagnosis: 'Severe Dehydration / Gastroenteritis',
      phone: '+1 555-0194',
      email: 'priya.patel@gmail.com',
      progressNotes: ['2026-08-16 11:00: Hydration improved. Tolerance to oral fluid good.'],
    },
  ];

  const handleAddInstruction = () => {
    if (!nursingInstruction) return;
    setNursingInstructionsList((prev) => [
      {
        id: 'INS-' + Date.now(),
        doctor: 'Dr. Sarah Jenkins',
        instruction: nursingInstruction,
        status: 'Pending',
        givenAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recordedVitals: undefined,
        nurseNotes: undefined,
        nurseName: undefined,
      },
      ...prev,
    ]);

    onTriggerNotification({
      id: 'nurse_ins_' + Date.now(),
      patientName: selectedPatient?.patient || 'Patient A',
      mobileNumber: selectedPatient?.phone || '+1 555-0192',
      emailAddress: selectedPatient?.email || 'patient@gmail.com',
      actionTitle: 'Nursing Instruction Transmitted',
      messageBody: `Smart Care HMS: Doctor issued instruction for ${selectedPatient?.patient}: "${nursingInstruction}". Nurse queue updated.`,
      timestamp: new Date().toLocaleTimeString(),
    });

    setNursingInstruction('');
    alert('Instruction sent to Nurse Care Console!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Bed className="h-5 w-5 text-cyan-600" />
            <span>IPD — DOCTOR SIDE & NURSING CONNECTION</span>
          </h1>
          <p className="text-xs text-slate-500">
            Admitted patient management, daily progress notes, & nursing care instructions
          </p>
        </div>
      </div>

      {/* MY IPD PATIENTS TABLE */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 border-b pb-3 flex items-center space-x-2">
          <User className="h-4 w-4 text-cyan-600" />
          <span>MY IPD PATIENTS</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] border-b">
                <th className="p-3">Patient</th>
                <th className="p-3">Ward</th>
                <th className="p-3">Bed</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {ipdPatientsList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-bold text-slate-900">
                    {item.patient}
                    <div className="text-[10px] text-slate-400 font-normal">ID: {item.patientId}</div>
                  </td>
                  <td className="p-3 font-semibold text-slate-700">{item.ward}</td>
                  <td className="p-3 font-mono font-bold text-cyan-700">Bed #{item.bed}</td>
                  <td className="p-3">
                    <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-extrabold">
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedPatient(item)}
                      className="rounded-lg bg-teal-600 text-white hover:bg-teal-700 px-3.5 py-1 text-xs font-bold transition-all shadow-sm"
                    >
                      [Open]
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* OPEN IPD PATIENT DETAIL MODAL */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-md">
                  IPD INPATIENT DOSSIER • {selectedPatient.ward} BED #{selectedPatient.bed}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">{selectedPatient.patient}</h2>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-slate-400 hover:text-slate-700 transition-colors p-1"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Admission Info & Diagnosis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border">
              <div>
                <span className="text-[10px] text-slate-400 font-bold">ADMISSION DATE</span>
                <div className="font-bold text-slate-800">{selectedPatient.admissionDate}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold">DIAGNOSIS</span>
                <div className="font-bold text-teal-800">{selectedPatient.diagnosis}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold">ATTENDING DOCTOR</span>
                <div className="font-bold text-slate-800">{currentDoctorName}</div>
              </div>
            </div>

            {/* DOCTOR + NURSING CONNECTION */}
            <div className="rounded-2xl border border-teal-200 bg-teal-50/40 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-teal-900 flex items-center space-x-2">
                  <ClipboardList className="h-4 w-4 text-teal-600" />
                  <span>DOCTOR → NURSE INSTRUCTION & RECORDED VITALS LOG</span>
                </h3>
                <span className="text-[10px] text-teal-700 font-semibold italic">
                  (Doctor issues instructions; Nurse records vitals & notes)
                </span>
              </div>

              {/* Add New Instruction Box */}
              <div className="flex items-center space-x-2 text-xs">
                <input
                  type="text"
                  placeholder='e.g. "Check BP every 4 hours. Give Paracetamol 500mg if Temp > 100F."'
                  value={nursingInstruction}
                  onChange={(e) => setNursingInstruction(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-300 p-2.5 font-medium focus:border-teal-500 focus:outline-none"
                />
                <button
                  onClick={handleAddInstruction}
                  className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 font-bold shadow-sm transition-all shrink-0"
                >
                  Send Instruction
                </button>
              </div>

              {/* History of Nursing Instructions & Recorded Vitals */}
              <div className="space-y-3 pt-2">
                {nursingInstructionsList.map((ins) => (
                  <tr key={ins.id} className="block rounded-xl bg-white p-3.5 border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        Doctor Order: <span className="text-teal-700">"{ins.instruction}"</span>
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ins.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ins.status}
                      </span>
                    </div>

                    {ins.recordedVitals && (
                      <div className="bg-slate-50 p-2.5 rounded-lg border text-[11px] font-mono grid grid-cols-4 gap-2 text-slate-800">
                        <div>BP: <strong>{ins.recordedVitals.bp}</strong></div>
                        <div>HR: <strong>{ins.recordedVitals.hr}</strong></div>
                        <div>Temp: <strong>{ins.recordedVitals.temp}</strong></div>
                        <div>SpO2: <strong>{ins.recordedVitals.spo2}</strong></div>
                      </div>
                    )}

                    {ins.nurseNotes && (
                      <div className="text-[10px] text-slate-500 italic">
                        Nurse Note: "{ins.nurseNotes}" — <strong>{ins.nurseName}</strong>
                      </div>
                    )}
                  </tr>
                ))}
              </div>
            </div>

            {/* Quick Action Tabs */}
            <div className="flex flex-wrap gap-2 pt-2 border-t text-xs">
              <button
                onClick={() => { setSelectedPatient(null); onNavigate('prescriptions', { patientName: selectedPatient.patient }); }}
                className="rounded-xl bg-slate-900 text-white px-4 py-2 font-bold hover:bg-slate-800"
              >
                + Prescribe Medication
              </button>
              <button
                onClick={() => { setSelectedPatient(null); onNavigate('lab-requests', { patientName: selectedPatient.patient }); }}
                className="rounded-xl bg-purple-600 text-white px-4 py-2 font-bold hover:bg-purple-700"
              >
                + Request Lab
              </button>
              <button
                onClick={() => { setSelectedPatient(null); onNavigate('radiology', { patientName: selectedPatient.patient }); }}
                className="rounded-xl bg-rose-600 text-white px-4 py-2 font-bold hover:bg-rose-700"
              >
                + Request Radiology
              </button>
              <button
                onClick={() => { setSelectedPatient(null); onNavigate('ot', { patientName: selectedPatient.patient }); }}
                className="rounded-xl bg-amber-600 text-white px-4 py-2 font-bold hover:bg-amber-700"
              >
                + Request Surgery (OT)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
