import React, { useState } from 'react';
import { Image as ImageIcon, Send, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import { MobileNotificationPayload } from '../../components/common/MobileNotificationToast';
import { useAuth } from '../../context/AuthContext';
import { sharedStore } from '../../services/sharedStore';

interface RadiologyRequestDoctorViewProps {
  onNavigate: (tab: string, extraData?: any) => void;
  onTriggerNotification: (payload: MobileNotificationPayload) => void;
  initialPatientName?: string;
}

export const RadiologyRequestDoctorView: React.FC<RadiologyRequestDoctorViewProps> = ({
  onNavigate,
  onTriggerNotification,
  initialPatientName,
}) => {
  const { user } = useAuth();
  const [patientName, setPatientName] = useState(initialPatientName || 'Patient A (Aarav Sharma)');
  const [patientPhone] = useState('+1 555-0192');
  const [patientEmail] = useState('aarav.sharma@gmail.com');

  const [scanType, setScanType] = useState('X-Ray');
  const [bodyPart, setBodyPart] = useState('Chest PA View');
  const [priority, setPriority] = useState('Normal');
  const [clinicalReason, setClinicalReason] = useState('Rule out pulmonary congestion or cardiomegaly.');

  const finalizedReports = [
    {
      id: 'RAD-501',
      patient: 'Patient A (Aarav Sharma)',
      modality: 'Cardiac MRI',
      bodyPart: 'Heart / Myocardium',
      radiologist: 'Dr. Robert Vance (Radiologist)',
      findings: 'Left ventricular ejection fraction 62%. Normal wall thickness. No focal ischemic scar or perfusion deficit.',
      impression: 'Unremarkable Cardiac MRI. No structural myocardial infarction.',
      date: '2026-08-12',
    },
    {
      id: 'RAD-502',
      patient: 'Patient B (Priya Patel)',
      modality: 'Ultrasound',
      bodyPart: 'Abdomen Complete',
      radiologist: 'Dr. Robert Vance (Radiologist)',
      findings: 'Grade 1 Fatty Liver. Normal gallbladder and kidneys.',
      impression: 'Mild hepatic steatosis.',
      date: '2026-08-14',
    },
  ];

  const handleSendRequest = () => {
    if (!bodyPart) {
      alert('Please specify the target body part for the scan.');
      return;
    }

    const doctorName = sharedStore.getDoctorNameForUser(user);
    sharedStore.addRadiologyRequest({
      doctor_name: doctorName,
      patient_name: patientName,
      modality: scanType as any,
      body_part: bodyPart
    });

    onTriggerNotification({
      id: 'rad_' + Date.now(),
      patientName: patientName,
      mobileNumber: patientPhone,
      emailAddress: patientEmail,
      actionTitle: 'Radiology Imaging Request Submitted',
      messageBody: `Smart Care HMS: ${doctorName} requested ${scanType} (${bodyPart}) with ${priority} priority. Transmitted to Radiology RIS.`,
      timestamp: new Date().toLocaleTimeString(),
    });

    alert(`Radiology Request (${scanType} - ${bodyPart}) for ${patientName} submitted successfully!\n- Sent to Radiology Department (RIS)\n- Transmitted to Radiologist & Patient EHR`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <ImageIcon className="h-5 w-5 text-rose-600" />
            <span>RADIOLOGY REQUEST — DOCTOR SIDE</span>
          </h1>
          <p className="text-xs text-slate-500">
            Request imaging scans (X-Ray, CT, MRI, Ultrasound) & inspect finalized Radiologist reports
          </p>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-[11px] font-semibold text-rose-900 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
          <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0" />
          <span>Note: Doctor orders scan & views reports. Radiologist creates & finalizes scan report.</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RADIOLOGY REQUEST FORM */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <h2 className="text-sm font-bold text-slate-800 border-b pb-3 flex items-center space-x-2">
            <Send className="h-4 w-4 text-rose-600" />
            <span>RADIOLOGY REQUEST</span>
          </h2>

          <div className="bg-slate-50 p-4 rounded-2xl border text-xs">
            <label className="block font-bold text-slate-500 uppercase text-[10px]">PATIENT NAME</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="font-bold text-sm text-slate-900 bg-transparent focus:outline-none border-b border-rose-500 w-full mt-1"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Scan Type</label>
              <select
                value={scanType}
                onChange={(e) => setScanType(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 font-bold text-rose-900 focus:border-rose-500 focus:outline-none"
              >
                <option value="X-Ray">X-Ray</option>
                <option value="CT Scan">CT Scan</option>
                <option value="MRI">MRI</option>
                <option value="Ultrasound">Ultrasound</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Body Part</label>
              <input
                type="text"
                placeholder="[ Body Part e.g. Chest PA ]"
                value={bodyPart}
                onChange={(e) => setBodyPart(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 font-bold text-rose-900 focus:border-rose-500 focus:outline-none text-xs"
            >
              <option value="Normal">Normal</option>
              <option value="Urgent">Urgent</option>
              <option value="STAT">STAT (Emergency)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Reason</label>
            <textarea
              rows={3}
              value={clinicalReason}
              onChange={(e) => setClinicalReason(e.target.value)}
              placeholder="[________________________]"
              className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-rose-500 focus:outline-none"
            />
          </div>

          <button
            onClick={handleSendRequest}
            className="w-full flex items-center justify-center space-x-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white py-3 text-xs font-extrabold shadow-md shadow-rose-500/20 transition-all"
          >
            <Send className="h-4 w-4" />
            <span>[ SEND REQUEST ]</span>
          </button>
        </div>

        {/* FINALIZED RADIOLOGY REPORTS VIEW */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-800 border-b pb-3 flex items-center space-x-2">
            <FileText className="h-4 w-4 text-rose-600" />
            <span>VIEW FINALIZED RADIOLOGY REPORTS</span>
          </h2>

          <div className="space-y-4 text-xs">
            {finalizedReports.map((rep) => (
              <div key={rep.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{rep.patient}</span>
                  <span className="rounded-full bg-cyan-100 text-cyan-800 px-2.5 py-0.5 font-extrabold text-[10px]">
                    {rep.modality} ({rep.bodyPart})
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold">FINDINGS:</span>
                  <p className="text-slate-700 font-medium">{rep.findings}</p>
                </div>
                <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                  <span className="text-[10px] text-rose-800 font-bold">IMPRESSION:</span>
                  <p className="text-rose-900 font-bold">{rep.impression}</p>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                  <span>Reported by: <strong>{rep.radiologist}</strong></span>
                  <span className="text-emerald-600 font-semibold flex items-center">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Finalized Scan
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
