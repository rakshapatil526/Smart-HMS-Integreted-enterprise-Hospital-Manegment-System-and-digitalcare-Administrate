import React, { useState } from 'react';
import { Pill, Plus, Trash2, Save, Download, Search, CheckCircle2, ShieldAlert } from 'lucide-react';
import { downloadPDFDocument } from '../../utils/pdfDownloader';
import { MobileNotificationPayload } from '../../components/common/MobileNotificationToast';
import { useAuth } from '../../context/AuthContext';
import { sharedStore } from '../../services/sharedStore';

interface PrescriptionDoctorViewProps {
  onNavigate: (tab: string, extraData?: any) => void;
  onTriggerNotification: (payload: MobileNotificationPayload) => void;
  initialPatientName?: string;
}

export const PrescriptionDoctorView: React.FC<PrescriptionDoctorViewProps> = ({
  onNavigate,
  onTriggerNotification,
  initialPatientName,
}) => {
  const { user } = useAuth();
  const currentDoctorName = sharedStore.getDoctorNameForUser(user);
  const [patientName, setPatientName] = useState(initialPatientName || 'Patient A (Aarav Sharma)');
  const [patientPhone] = useState('+1 555-0192');
  const [patientEmail] = useState('aarav.sharma@gmail.com');

  // Medicine Builder Form State
  const [medicineQuery, setMedicineQuery] = useState('Paracetamol 500mg');
  const [dosage, setDosage] = useState('500mg');
  const [frequency, setFrequency] = useState('1-0-1');
  const [duration, setDuration] = useState('7 Days');
  const [instructions, setInstructions] = useState('Take after food with warm water');

  const [medicinesList, setMedicinesList] = useState<Array<{ id: string; name: string; dosage: string; frequency: string; duration: string; instructions: string }>>([
    { id: '1', name: 'Paracetamol 500mg', dosage: '500mg', frequency: '1-0-1', duration: '7 Days', instructions: 'Take after meals' },
    { id: '2', name: 'Amoxicillin 500mg', dosage: '500mg', frequency: '1-0-1', duration: '5 Days', instructions: 'Complete full course' },
  ]);

  const handleAddMedicine = () => {
    if (!medicineQuery) return;
    setMedicinesList((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: medicineQuery,
        dosage: dosage || '1 tablet',
        frequency: frequency || '1-0-1',
        duration: duration || '7 Days',
        instructions: instructions || 'As advised',
      },
    ]);
    setMedicineQuery('');
    setInstructions('');
  };

  const handleRemoveMedicine = (id: string) => {
    setMedicinesList((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSavePrescription = () => {
    if (medicinesList.length === 0) {
      alert('Please add at least one medicine to the prescription.');
      return;
    }

    // Trigger Mobile SMS & Email update notification dispatch
    onTriggerNotification({
      id: 'rx_' + Date.now(),
      patientName: patientName,
      mobileNumber: patientPhone,
      emailAddress: patientEmail,
      actionTitle: 'New Prescription Finalized & Transmitted',
      messageBody: `Smart Care HMS: ${currentDoctorName} issued Prescription with ${medicinesList.length} items. Sent to Pharmacy & Patient Portal.`,
      timestamp: new Date().toLocaleTimeString(),
    });

    alert(`Prescription saved successfully!\n- Transmitted to Central EHR & Pharmacy Dispensing Queue\n- SMS sent to mobile ${patientPhone} & Email sent to ${patientEmail}`);
  };

  const handleGeneratePDF = async () => {
    await downloadPDFDocument(
      'prescription',
      {
        prescription_number: 'RX-2026-889',
        patient_name: patientName,
        patient_id: 'P001',
        doctor_name: currentDoctorName,
        department: 'Cardiology & Clinical Operations',
        diagnosis: 'Stable Angina / Exertional Ischemia',
        instructions: instructions || 'Take after meals. Maintain adequate oral hydration. In case of emergency, contact Smart Care Triage.',
        medicines: medicinesList.map((m) => ({
          medicine_name: m.name,
          dosage: m.dosage,
          frequency: m.frequency,
          duration: m.duration,
        })),
      },
      `Prescription_${patientName.replace(/\s+/g, '_')}.pdf`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Pill className="h-5 w-5 text-rose-600" />
            <span>CREATE PRESCRIPTION</span>
          </h1>
          <p className="text-xs text-slate-500">
            Digitally prescribe medications with dosage schedules and pharmacy auto-routing
          </p>
        </div>

        {/* Doctor Scope Notice */}
        <div className="hidden sm:flex items-center space-x-2 text-[11px] font-semibold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
          <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
          <span>Note: Doctor prescribes. Pharmacy staff dispenses & manages inventory stock.</span>
        </div>
      </div>

      {/* CREATE PRESCRIPTION FORM */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        {/* Patient Selection Header */}
        <div className="bg-slate-50 p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-500 uppercase text-[10px]">PATIENT</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="font-bold text-sm text-slate-900 bg-transparent focus:outline-none border-b border-teal-500"
            />
          </div>

          <div className="text-right text-slate-500 font-mono">
            <span>Prescription No: <strong className="text-slate-900">RX-2026-889</strong></span>
          </div>
        </div>

        {/* Medicine Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="lg:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Medicine Name</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="[ Search Medicine ]"
                value={medicineQuery}
                onChange={(e) => setMedicineQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 focus:border-teal-500 focus:outline-none font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Dosage</label>
            <input
              type="text"
              placeholder="[ 500mg / 1 tab ]"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2 focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2 focus:border-teal-500 focus:outline-none font-bold text-teal-800"
            >
              <option value="1-0-1">1-0-1 (Morning & Night)</option>
              <option value="1-1-1">1-1-1 (Thrice daily)</option>
              <option value="1-0-0">1-0-0 (Morning only)</option>
              <option value="0-0-1">0-0-1 (Night only)</option>
              <option value="1-1-0">1-1-0 (Morning & Noon)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Duration</label>
            <input
              type="text"
              placeholder="[ 7 Days ]"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2 focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Instructions & Add Button */}
        <div className="flex flex-col sm:flex-row items-end gap-3 text-xs">
          <div className="flex-1">
            <label className="block font-bold text-slate-700 mb-1">Instructions</label>
            <input
              type="text"
              placeholder="[ Special instructions e.g. after food ]"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2 focus:border-teal-500 focus:outline-none"
            />
          </div>

          <button
            onClick={handleAddMedicine}
            className="flex items-center space-x-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 font-bold transition-all shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>[ + Add Medicine ]</span>
          </button>
        </div>

        {/* PRESCRIBED MEDICINES LIST TABLE */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-600 font-semibold uppercase text-[10px] border-b">
                <th className="p-3">Medicine Name</th>
                <th className="p-3">Dosage</th>
                <th className="p-3">Frequency</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Instructions</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {medicinesList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-slate-400 italic">
                    No medicines added to prescription yet.
                  </td>
                </tr>
              ) : (
                medicinesList.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{m.name}</td>
                    <td className="p-3 text-slate-700">{m.dosage}</td>
                    <td className="p-3 font-bold text-teal-700 font-mono">{m.frequency}</td>
                    <td className="p-3 text-slate-700">{m.duration}</td>
                    <td className="p-3 text-slate-500 italic">{m.instructions}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleRemoveMedicine(m.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Save & Generate PDF Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
          <div className="text-[11px] text-slate-500 flex items-center space-x-1">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Prescription routes automatically to Central EHR Timeline & Pharmacy Module</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleGeneratePDF}
              className="flex items-center space-x-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 px-5 py-2.5 text-xs font-bold transition-all border border-slate-300"
            >
              <Download className="h-4 w-4 text-slate-600" />
              <span>[ GENERATE PDF ]</span>
            </button>

            <button
              onClick={handleSavePrescription}
              className="flex items-center space-x-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 text-xs font-extrabold shadow-md shadow-teal-500/20 transition-all"
            >
              <Save className="h-4 w-4" />
              <span>[ SAVE PRESCRIPTION ]</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
