import React, { useState } from 'react';
import { FlaskConical, Send, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import { MobileNotificationPayload } from '../../components/common/MobileNotificationToast';
import { useAuth } from '../../context/AuthContext';
import { sharedStore } from '../../services/sharedStore';

interface LabRequestDoctorViewProps {
  onNavigate: (tab: string, extraData?: any) => void;
  onTriggerNotification: (payload: MobileNotificationPayload) => void;
  initialPatientName?: string;
}

export const LabRequestDoctorView: React.FC<LabRequestDoctorViewProps> = ({
  onNavigate,
  onTriggerNotification,
  initialPatientName,
}) => {
  const { user } = useAuth();
  const [patientName, setPatientName] = useState(initialPatientName || 'Patient A (Aarav Sharma)');
  const [patientPhone] = useState('+1 555-0192');
  const [patientEmail] = useState('aarav.sharma@gmail.com');

  const [selectedTests, setSelectedTests] = useState<string[]>(['CBC', 'Lipid Profile']);
  const [priority, setPriority] = useState('Normal');
  const [clinicalReason, setClinicalReason] = useState('Evaluation of exertional angina and cardiovascular risk profile.');

  const availableTests = [
    'CBC',
    'Blood Sugar',
    'Lipid Profile',
    'Liver Function',
    'Kidney Function',
    'Urine Test',
    'Other',
  ];

  // Mock Lab Results Feed (Doctor can view, cannot enter processing results)
  const existingLabResults = [
    {
      id: 'LAB-901',
      patient: 'Patient A (Aarav Sharma)',
      test: 'Complete Blood Count (CBC)',
      status: 'Completed',
      date: '2026-08-11',
      values: 'Hemoglobin: 14.2 g/dL, WBC: 7.2k, Platelets: 250k',
    },
    {
      id: 'LAB-902',
      patient: 'Patient B (Priya Patel)',
      test: 'Fasting Blood Sugar (FBS)',
      status: 'Completed',
      date: '2026-08-14',
      values: 'Glucose: 110 mg/dL (Slightly elevated)',
    },
  ];

  const handleToggleTest = (test: string) => {
    setSelectedTests((prev) =>
      prev.includes(test) ? prev.filter((t) => t !== test) : [...prev, test]
    );
  };

  const handleSendToLab = () => {
    if (selectedTests.length === 0) {
      alert('Please select at least one lab test.');
      return;
    }

    const doctorName = sharedStore.getDoctorNameForUser(user);
    sharedStore.addLabRequest({
      doctor_name: doctorName,
      patient_name: patientName,
      test_name: selectedTests.join(', '),
      priority: priority as any,
      clinical_reason: clinicalReason
    });

    onTriggerNotification({
      id: 'lab_' + Date.now(),
      patientName: patientName,
      mobileNumber: patientPhone,
      emailAddress: patientEmail,
      actionTitle: 'Laboratory Investigation Request Sent',
      messageBody: `Smart Care HMS: ${doctorName} ordered Lab Tests (${selectedTests.join(', ')}) with ${priority} priority. Sent to LIS Laboratory.`,
      timestamp: new Date().toLocaleTimeString(),
    });

    alert(`Lab Request for ${patientName} submitted successfully!\n- Transmitted to Laboratory Department (LIS)\n- Notification dispatched to Laboratory Tech & Patient EHR`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <FlaskConical className="h-5 w-5 text-purple-600" />
            <span>LAB REQUEST — DOCTOR SIDE</span>
          </h1>
          <p className="text-xs text-slate-500">
            Order pathology and blood investigations; view finalized lab test reports
          </p>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-[11px] font-semibold text-purple-900 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
          <ShieldAlert className="h-4 w-4 text-purple-600 shrink-0" />
          <span>Note: Doctor orders tests & views reports. Lab Tech inputs processing values.</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LAB REQUEST FORM */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <h2 className="text-sm font-bold text-slate-800 border-b pb-3 flex items-center space-x-2">
            <Send className="h-4 w-4 text-purple-600" />
            <span>LAB REQUEST FORM</span>
          </h2>

          <div className="bg-slate-50 p-4 rounded-2xl border text-xs">
            <label className="block font-bold text-slate-500 uppercase text-[10px]">PATIENT NAME</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="font-bold text-sm text-slate-900 bg-transparent focus:outline-none border-b border-purple-500 w-full mt-1"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Select Tests:</label>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              {availableTests.map((t) => {
                const isSelected = selectedTests.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleToggleTest(t)}
                    className={`flex items-center space-x-2 p-3 rounded-xl border transition-all text-left ${
                      isSelected
                        ? 'bg-purple-50 border-purple-400 text-purple-900 font-bold shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span>{t}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 font-bold text-purple-900 focus:border-purple-500 focus:outline-none"
              >
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
                <option value="STAT">STAT (Emergency)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Reason</label>
            <textarea
              rows={3}
              value={clinicalReason}
              onChange={(e) => setClinicalReason(e.target.value)}
              placeholder="[________________________]"
              className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-purple-500 focus:outline-none"
            />
          </div>

          <button
            onClick={handleSendToLab}
            className="w-full flex items-center justify-center space-x-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white py-3 text-xs font-extrabold shadow-md shadow-purple-500/20 transition-all"
          >
            <Send className="h-4 w-4" />
            <span>[ SEND TO LAB ]</span>
          </button>
        </div>

        {/* FINALIZED LAB RESULTS VIEW */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-800 border-b pb-3 flex items-center space-x-2">
            <FileText className="h-4 w-4 text-purple-600" />
            <span>VIEW FINALIZED LAB RESULTS</span>
          </h2>

          <div className="space-y-3 text-xs">
            {existingLabResults.map((res) => (
              <div key={res.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{res.patient}</span>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 font-extrabold text-[10px]">
                    {res.status}
                  </span>
                </div>
                <div className="font-semibold text-purple-900">{res.test}</div>
                <p className="text-slate-700 font-mono bg-white p-2.5 rounded-xl border text-[11px]">
                  {res.values}
                </p>
                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                  <span>Report Date: {res.date}</span>
                  <span className="text-purple-600 font-semibold flex items-center">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Verified by Lab Tech
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
