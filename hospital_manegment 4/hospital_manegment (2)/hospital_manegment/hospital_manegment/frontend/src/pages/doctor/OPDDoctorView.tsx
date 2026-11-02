import React, { useState } from 'react';
import { Stethoscope, User, Clock, FileText, FlaskConical, Image as ImageIcon, Pill, Calendar, Save, CheckCircle2 } from 'lucide-react';
import { MobileNotificationPayload } from '../../components/common/MobileNotificationToast';

interface OPDDoctorViewProps {
  onNavigate: (tab: string, extraData?: any) => void;
  onTriggerNotification: (payload: MobileNotificationPayload) => void;
  initialPatientName?: string;
}

export const OPDDoctorView: React.FC<OPDDoctorViewProps> = ({
  onNavigate,
  onTriggerNotification,
  initialPatientName,
}) => {
  const [inConsultation, setInConsultation] = useState(!!initialPatientName);
  const [activePatient, setActivePatient] = useState({
    name: initialPatientName || 'Patient A (Aarav Sharma)',
    age: 35,
    patientId: 'P001',
    allergies: 'Penicillin, NSAIDs',
    phone: '+1 555-0192',
    email: 'aarav.sharma@gmail.com',
  });

  // Form State
  const [chiefComplaint, setChiefComplaint] = useState('Recurrent retrosternal discomfort during mild exercise for 3 days.');
  const [symptoms, setSymptoms] = useState('Chest tightness, shortness of breath, mild diaphoresis.');
  const [medicalHistory, setMedicalHistory] = useState('Essential Hypertension diagnosed in 2024. Non-smoker.');
  const [examination, setExamination] = useState('BP 130/85 mmHg, HR 78 bpm, SpO2 98% on room air. S1 S2 normal.');
  const [diagnosis, setDiagnosis] = useState('Stable Angina / Suspected Ischemic Heart Disease');
  const [clinicalNotes, setClinicalNotes] = useState('Advised ECG, TMT test, lipid profile, and cardiology follow-up in 1 week.');
  const [followUpDate, setFollowUpDate] = useState('2026-08-24');

  const opdQueue = [
    { token: '001', patient: 'Patient A (Aarav Sharma)', time: '09:00', status: 'Waiting', patientId: 'P001', age: 35, phone: '+1 555-0192', email: 'aarav.sharma@gmail.com', allergies: 'Penicillin' },
    { token: '002', patient: 'Patient B (Priya Patel)', time: '09:30', status: 'Waiting', patientId: 'P002', age: 40, phone: '+1 555-0194', email: 'priya.patel@gmail.com', allergies: 'Sulfa Drugs' },
    { token: '003', patient: 'Patient C (Vikram Singh)', time: '10:00', status: 'Confirmed', patientId: 'P003', age: 52, phone: '+1 555-0196', email: 'vikram.singh@gmail.com', allergies: 'None' },
  ];

  const handleStartConsultation = (p: any) => {
    setActivePatient(p);
    setInConsultation(true);
  };

  const handleSaveConsultation = () => {
    // Save to EHR and dispatch simulated SMS & Email notification to patient's registered mobile number & email address
    onTriggerNotification({
      id: 'sms_' + Date.now(),
      patientName: activePatient.name,
      mobileNumber: activePatient.phone,
      emailAddress: activePatient.email,
      actionTitle: 'OPD Consultation Summary Saved',
      messageBody: `Smart Care HMS: OPD Consultation complete for ${activePatient.name}. Diagnosis: ${diagnosis}. Follow-up set for ${followUpDate}.`,
      timestamp: new Date().toLocaleTimeString(),
    });

    alert(`OPD Consultation for ${activePatient.name} saved successfully!\n- Clinical record pushed to EHR Timeline\n- Updates notification sent to mobile ${activePatient.phone} & ${activePatient.email}`);
    setInConsultation(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Stethoscope className="h-5 w-5 text-teal-600" />
            <span>OPD CONSULTATION — DOCTOR SIDE</span>
          </h1>
          <p className="text-xs text-slate-500">
            Outpatient Queue & Detailed Clinical Examination Desk
          </p>
        </div>
      </div>

      {!inConsultation ? (
        /* OPD QUEUE SCREEN */
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-800 border-b pb-3 flex items-center space-x-2">
            <Clock className="h-4 w-4 text-amber-500" />
            <span>OPD QUEUE</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] border-b">
                  <th className="p-3">Token</th>
                  <th className="p-3">Patient Name</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {opdQueue.map((item) => (
                  <tr key={item.token} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <span className="rounded-full bg-cyan-100 text-cyan-800 px-3 py-1 font-bold font-mono">
                        {item.token}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-900">{item.patient}</td>
                    <td className="p-3 font-mono text-slate-600">{item.time}</td>
                    <td className="p-3">
                      <span className="rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 text-[10px] font-bold">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleStartConsultation(item)}
                        className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white px-4 py-1.5 text-xs font-bold shadow-sm transition-all"
                      >
                        [START CONSULTATION]
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CONSULTATION SCREEN */
        <div className="rounded-3xl border border-slate-200 bg-white shadow-lg overflow-hidden space-y-6 p-6">
          {/* Header Banner */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">OPD CONSULTATION SCREEN</div>
              <div className="text-lg font-bold">Patient: {activePatient.name}</div>
            </div>
            <div className="flex items-center space-x-4 text-xs font-semibold text-slate-300">
              <span>Age: <strong className="text-white">{activePatient.age}</strong></span>
              <span>Patient ID: <strong className="text-teal-300">{activePatient.patientId}</strong></span>
              <span className="bg-red-900/60 text-red-300 px-2.5 py-1 rounded-lg border border-red-500/40">
                Allergies: {activePatient.allergies}
              </span>
            </div>
          </div>

          {/* Clinical Inputs Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Chief Complaint</label>
              <textarea
                rows={3}
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                placeholder="[____________________________________________]"
                className="w-full rounded-xl border border-slate-200 p-3 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Symptoms</label>
              <textarea
                rows={3}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="[____________________________________________]"
                className="w-full rounded-xl border border-slate-200 p-3 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Medical History</label>
              <textarea
                rows={3}
                value={medicalHistory}
                onChange={(e) => setMedicalHistory(e.target.value)}
                placeholder="[____________________________________________]"
                className="w-full rounded-xl border border-slate-200 p-3 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Examination</label>
              <textarea
                rows={3}
                value={examination}
                onChange={(e) => setExamination(e.target.value)}
                placeholder="[____________________________________________]"
                className="w-full rounded-xl border border-slate-200 p-3 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Diagnosis</label>
              <textarea
                rows={3}
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="[____________________________________________]"
                className="w-full rounded-xl border border-slate-200 p-3 focus:border-teal-500 focus:outline-none font-semibold text-teal-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Clinical Notes</label>
              <textarea
                rows={3}
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                placeholder="[____________________________________________]"
                className="w-full rounded-xl border border-slate-200 p-3 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Direct Module Requests & Follow-up Row */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onNavigate('lab-requests', { patientName: activePatient.name })}
                className="flex items-center space-x-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white px-3.5 py-2 text-xs font-bold shadow-sm transition-all"
              >
                <FlaskConical className="h-4 w-4" />
                <span>[Request Lab]</span>
              </button>

              <button
                onClick={() => onNavigate('radiology', { patientName: activePatient.name })}
                className="flex items-center space-x-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 text-xs font-bold shadow-sm transition-all"
              >
                <ImageIcon className="h-4 w-4" />
                <span>[Request Radiology]</span>
              </button>

              <button
                onClick={() => onNavigate('prescriptions', { patientName: activePatient.name })}
                className="flex items-center space-x-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white px-3.5 py-2 text-xs font-bold shadow-sm transition-all"
              >
                <Pill className="h-4 w-4" />
                <span>[Prescription]</span>
              </button>
            </div>

            <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
              <Calendar className="h-4 w-4 text-slate-500" />
              <span>Follow-up Date:</span>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="rounded-lg border border-slate-300 p-1.5 font-semibold text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex justify-between items-center pt-2 border-t">
            <button
              onClick={() => setInConsultation(false)}
              className="text-xs font-bold text-slate-500 hover:text-slate-700"
            >
              ← Back to OPD Queue
            </button>

            <button
              onClick={handleSaveConsultation}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-6 py-3 text-xs font-extrabold shadow-lg shadow-teal-500/20 transition-all"
            >
              <Save className="h-4 w-4" />
              <span>[ SAVE CONSULTATION ]</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
