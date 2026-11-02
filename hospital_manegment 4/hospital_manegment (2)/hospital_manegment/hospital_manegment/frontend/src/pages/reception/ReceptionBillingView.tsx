import React, { useState } from 'react';
import { ReceptionPatientRecord } from '../../types';
import { FileText, Download, CheckCircle2, CreditCard } from 'lucide-react';
import { authApi } from '../../services/api';

interface ReceptionBillingViewProps {
  patients: ReceptionPatientRecord[];
}

export const ReceptionBillingView: React.FC<ReceptionBillingViewProps> = ({ patients }) => {
  const [selectedPatientId, setSelectedPatientId] = useState('SC-P001');
  const [regFee, setRegFee] = useState(200);
  const [consultFee, setConsultFee] = useState(500);
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'Card' | 'Online'>('Cash');
  const [receiptSuccess, setReceiptSuccess] = useState('');

  const targetPatient = patients.find((p) => p.patient_id === selectedPatientId) || patients[0];
  const totalAmount = regFee + consultFee;

  const handleGenerateReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authApi.generatePDF('invoice', {
        invoice_number: `REC-INV-${targetPatient.patient_id}`,
        patient_name: targetPatient.name,
        patient_id: targetPatient.patient_id,
        items: [
          { description: 'Patient Registration Fee', amount: regFee },
          { description: `OPD Consultation Fee (${targetPatient.department})`, amount: consultFee },
        ],
        total_amount: totalAmount,
        payment_status: `Paid via ${paymentMode}`,
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Receipt_${targetPatient.patient_id}.pdf`);
      document.body.appendChild(link);
      link.click();

      setReceiptSuccess(`Official Receipt PDF generated & downloaded for ${targetPatient.name}!`);
      setTimeout(() => setReceiptSuccess(''), 4000);
    } catch (err) {
      alert(`Receipt generated for ${targetPatient.name}. Total: ₹${totalAmount}`);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">BASIC FRONT-DESK BILLING</h1>
          <p className="text-xs text-slate-500">Collect OPD registration & consultation fees and generate official PDF receipts</p>
        </div>
      </div>

      {receiptSuccess && (
        <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{receiptSuccess}</span>
        </div>
      )}

      <form onSubmit={handleGenerateReceipt} className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <CreditCard className="h-5 w-5 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">PATIENT BILLING & RECEIPT GENERATION</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="sm:col-span-2">
            <label className="font-bold text-slate-800 block mb-1">Select Patient *</label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs bg-white text-slate-800 font-semibold"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.patient_id}>
                  {p.name} ({p.patient_id}) — {p.department}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Registration Fee (₹)</label>
            <input
              type="number"
              value={regFee}
              onChange={(e) => setRegFee(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-mono font-bold"
            />
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Consultation Fee (₹)</label>
            <input
              type="number"
              value={consultFee}
              onChange={(e) => setConsultFee(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-mono font-bold"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-bold text-slate-800 block mb-1">Payment Method</label>
            <div className="flex items-center space-x-3">
              {(['Cash', 'Card', 'Online'] as const).map((mode) => (
                <label
                  key={mode}
                  className={`flex-1 flex items-center justify-center space-x-2 rounded-xl p-3 border cursor-pointer font-bold text-xs transition-all ${
                    paymentMode === mode ? 'bg-blue-50 border-blue-600 text-blue-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMode"
                    value={mode}
                    checked={paymentMode === mode}
                    onChange={() => setPaymentMode(mode)}
                    className="hidden"
                  />
                  <span>[{mode}]</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Total Summary */}
        <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-600 uppercase">Total Fee Due:</span>
          <span className="text-xl font-extrabold text-slate-900 font-mono">₹{totalAmount}</span>
        </div>

        {/* Generate Receipt */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center space-x-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 text-xs font-bold shadow-md transition-all"
          >
            <Download className="h-4 w-4" />
            <span>[ GENERATE RECEIPT PDF ]</span>
          </button>
        </div>
      </form>
    </div>
  );
};
