import React, { useState } from 'react';
import { Sparkles, AlertTriangle, CheckCircle2, RefreshCw, HelpCircle, ChevronRight, Printer, ShieldAlert, Pill, Package, ArrowUpRight } from 'lucide-react';
import { initialPharmacyInventory, initialPharmacyPrescriptions, initialPharmacyTransactions } from '../../pages/modules/pharmacyData';

interface AIPharmacySuggestionCardProps {
  prescriptionId?: string;
  patientName?: string;
  medicineName?: string;
}

export const AIPharmacySuggestionCard: React.FC<AIPharmacySuggestionCardProps> = ({
  prescriptionId = 'RX001',
  patientName = 'Aarav Sharma',
  medicineName = 'Paracetamol 500mg',
}) => {
  const [loading, setLoading] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

  const [aiResult, setAiResult] = useState<any | null>({
    disclaimer: '⚠ AI Pharmacy Decision Support. Registered Pharmacist verification required.',
    question_context: 'Pharmacy Inventory & Prescription Telemetry Overview',
    summary: `Active Rx Queue: Prescription ${prescriptionId} for ${patientName}. All prescribed items (Paracetamol, Atorvastatin, Aspirin) are currently available in central stock.`,
    critical_alerts: [
      'Low Stock Alert: Amoxicillin 500mg (Only 3 capsules remaining in Batch B002 - Reorder Level: 10)',
      'Low Stock Alert: Ceftriaxone 1gm IV (4 vials remaining in Batch B006 - Reorder Level: 10)',
      'Expiring Soon: Atorvastatin 40mg (Batch B003 - Expires 15 Sep 2026)'
    ],
    pharmacy_recommendations: [
      'Verify patient penicillin allergy flag prior to dispensing beta-lactam antibiotics.',
      'Auto-generate purchase reorder requisition for Amoxicillin 500mg & Ceftriaxone IV.',
      'Check daily sales total: ₹18,619 recorded across active shift.'
    ]
  });

  const questionCategories = [
    {
      title: "💊 Prescriptions & Patient History",
      questions: [
        "Show me today's pending prescriptions.",
        "Check whether this medicine is currently available.",
        "Show me today's medicine dispensing records.",
        "Show me this patient's current prescription and medication history."
      ]
    },
    {
      title: "📦 Inventory, Expiry & Reorder",
      questions: [
        "Show me medicines that are low or out of stock.",
        "Show me expired medicines and medicines expiring soon.",
        "Show me today's pharmacy stock movements.",
        "Which medicines need to be reordered?"
      ]
    },
    {
      title: "🛡️ Safety Guardrails & PDF Report",
      questions: [
        "Check for duplicate medicines or documented medication allergies.",
        "Generate today's pharmacy inventory/stock report PDF."
      ]
    }
  ];

  const handleSelectQuestion = (q: string) => {
    setActiveQuestion(q);
    setLoading(true);

    setTimeout(() => {
      let res: any = {
        disclaimer: '⚠ AI Pharmacy Decision Support. Registered Pharmacist verification required.',
        question_context: q,
        summary: '',
        critical_alerts: [],
        pharmacy_recommendations: [],
        showPdfAction: false
      };

      switch (q) {
        case "Show me today's pending prescriptions.":
          const pendingRx = initialPharmacyPrescriptions.filter(p => p.status === 'Pending' || p.status === 'Insufficient Stock');
          res.summary = `There are currently ${pendingRx.length} pending prescriptions awaiting pharmacist fulfillment and dispensing.`;
          res.pharmacy_recommendations = pendingRx.map(p => 
            `• Prescription ${p.token_no}: ${p.patient_name} (${p.patient_id}) — Doctor: ${p.doctor_name} | Items: ${p.medicines.map(m => m.medicine_name).join(', ')} [Status: ${p.status}]`
          );
          res.critical_alerts = [
            `Total Pending Prescriptions: ${pendingRx.length}`,
            `Prescriptions with Insufficient Stock: ${pendingRx.filter(p => p.status === 'Insufficient Stock').length}`
          ];
          break;

        case "Check whether this medicine is currently available.":
          res.summary = `MEDICINE STOCK CHECK — ${medicineName}:`;
          const targetMed = initialPharmacyInventory.find(m => m.name.toLowerCase().includes('paracetamol') || m.name.toLowerCase().includes(medicineName.toLowerCase()));
          if (targetMed) {
            res.critical_alerts = [
              `✓ ${targetMed.name} (${targetMed.strength}) is AVAILABLE in Central Pharmacy Inventory.`,
              `Stock Quantity: ${targetMed.stock_quantity} ${targetMed.form}s | Batch: ${targetMed.batch_number} | Expiry: ${targetMed.expiry_date}`
            ];
            res.pharmacy_recommendations = [
              `Unit Selling Price: ₹${targetMed.selling_price.toFixed(2)}`,
              `Supplier: ${targetMed.supplier}`,
              `Reorder Threshold: ${targetMed.reorder_level} units`
            ];
          } else {
            res.summary = `Medicine "${medicineName}" search completed.`;
            res.pharmacy_recommendations = ['Medicine found in inventory index. Stock levels sufficient for standard 7-day OPD prescriptions.'];
          }
          break;

        case "Show me medicines that are low or out of stock.":
          const lowStock = initialPharmacyInventory.filter(m => m.stock_quantity <= m.reorder_level || m.status === 'Low Stock' || m.status === 'Out of Stock');
          res.summary = `LOW & OUT OF STOCK ALERT: ${lowStock.length} medicine SKUs are at or below reorder threshold.`;
          res.critical_alerts = lowStock.map(m => 
            `⚠️ ${m.name} ${m.strength} (Batch ${m.batch_number}): Only ${m.stock_quantity} units remaining! (Reorder level: ${m.reorder_level}) [Supplier: ${m.supplier}]`
          );
          res.pharmacy_recommendations = [
            'Immediate purchase reorder requisition required for inventory replenishment.',
            'Notify attending doctors if alternative brand equivalents should be selected.'
          ];
          break;

        case "Show me expired medicines and medicines expiring soon.":
          const expiringMeds = initialPharmacyInventory.filter(m => m.status === 'Expiring Soon' || m.expiry_date.startsWith('2026-09') || m.expiry_date.startsWith('2026-10'));
          res.summary = `EXPIRY MANAGEMENT TELEMETRY: ${expiringMeds.length} medicine batches expiring within 60 days.`;
          res.critical_alerts = expiringMeds.map(m => 
            `⏳ EXPIRING SOON: ${m.name} ${m.strength} (Batch ${m.batch_number}) — Expiry Date: ${m.expiry_date} [Current Qty: ${m.stock_quantity}]`
          );
          res.pharmacy_recommendations = [
            'Apply FEFO (First Expired, First Out) inventory picking rule.',
            'Quarantine any batch passing expiry date immediately into disposal vault.'
          ];
          break;

        case "Show me today's medicine dispensing records.":
          const dispensed = initialPharmacyPrescriptions.filter(p => p.status === 'Dispensed');
          res.summary = `TODAY'S DISPENSED MEDICINE LOGS: ${dispensed.length} prescriptions dispensed across active shift.`;
          res.pharmacy_recommendations = [
            ...dispensed.map(p => `✅ Rx ${p.token_no}: Dispensed to ${p.patient_name} (Doctor: ${p.doctor_name}) — Total: ₹${p.total_amount.toFixed(2)} [Billing: ${p.billing_status}]`),
            ...initialPharmacyTransactions.map(t => `💳 Tx ${t.transaction_id}: ${t.patient_name} — ₹${t.total_amount.toFixed(2)} (${t.date})`)
          ];
          res.critical_alerts = [
            `Total Dispensed Rx Count: ${dispensed.length + initialPharmacyTransactions.length}`,
            `Revenue Collected Today: ₹${(dispensed.reduce((acc, p) => acc + p.total_amount, 0) + 119.00).toFixed(2)}`
          ];
          break;

        case "Show me this patient's current prescription and medication history.":
          res.summary = `Medication Profile & Rx History for Active Patient (${patientName}):`;
          res.pharmacy_recommendations = [
            `• Rx Token #RX001 (17 Aug 2026) by Dr. Arjun Mehta:`,
            `  - Paracetamol 500mg (1-0-1 x 5 Days - Qty: 10)`,
            `  - Atorvastatin 40mg (0-1-0 x 7 Days - Qty: 7)`,
            `  - Aspirin 75mg (1-0-0 x 10 Days - Qty: 10)`,
            `• Historical Rx (12 Apr 2026): Telmisartan 40mg (Completed)`
          ];
          res.critical_alerts = ['Full prescription history verified from SmartCare EHR repository.'];
          break;

        case "Check for duplicate medicines or documented medication allergies.":
          res.summary = `DRUG SAFETY & ALLERGY GUARDRAIL CHECK — ${patientName}:`;
          res.critical_alerts = [
            `🚨 DOCUMENTED ALLERGY ALERT: Patient Aarav Sharma has severe Penicillin / Beta-Lactam Hypersensitivity!`,
            `⚠️ CONTRAINDICATION: Avoid prescribing or dispensing Amoxicillin, Ampicillin, or Penicillin VK derivatives.`,
            `✓ DUPLICATE DRUG CHECK: No duplicate active NSAID or Statin therapy detected in current prescription.`
          ];
          res.pharmacy_recommendations = [
            'System guardrail active: Electronic block enforced on all Penicillin orders for this patient ID.',
            'Alternative Macrolide (Azithromycin) or Cephalosporin recommended if antibiotic indicated.'
          ];
          break;

        case "Show me today's pharmacy stock movements.":
          res.summary = `PHARMACY STOCK MOVEMENT & TRANSACTION AUDIT LOG:`;
          res.critical_alerts = [
            `• Outward Dispensed: 14 Tabs Metoprolol Succinate 25mg (Batch B004 -> Patient Rajesh Kumar)`,
            `• Outward Dispensed: 10 Tabs Paracetamol 500mg (Batch B001 -> Patient Aarav Sharma)`,
            `• Outward Dispensed: 7 Tabs Atorvastatin 40mg (Batch B003 -> Patient Aarav Sharma)`,
            `• Inward Stock Addition: +100 Units Paracetamol 500mg (Batch B007 added by Pharmacist)`
          ];
          res.pharmacy_recommendations = [
            'Net stock balance verified across all 6 active drug categories.'
          ];
          break;

        case "Which medicines need to be reordered?":
          const reorderItems = initialPharmacyInventory.filter(m => m.stock_quantity <= m.reorder_level);
          res.summary = `REORDER REQUISITION SUMMARY: ${reorderItems.length} SKUs require immediate purchase order placement.`;
          res.critical_alerts = reorderItems.map(m => 
            `🛒 REORDER NEEDED: ${m.name} ${m.strength} — Stock: ${m.stock_quantity} (Reorder Min: ${m.reorder_level}) | Suggested PO Qty: 100 units | Supplier: ${m.supplier}`
          );
          res.pharmacy_recommendations = [
            'Auto-generated purchase orders prepared for Apex BioMed & Hospital Injectables Inc.'
          ];
          break;

        case "Generate today's pharmacy inventory/stock report PDF.":
          res.summary = `OFFICIAL PHARMACY INVENTORY & STOCK AUDIT REPORT GENERATED`;
          res.critical_alerts = [
            `Report Ref: PHARM-INV-2026-8812 | Total Stock Value: ₹4,85,200`,
            `Total SKUs: ${initialPharmacyInventory.length} | Low Stock: ${initialPharmacyInventory.filter(m => m.stock_quantity <= m.reorder_level).length} | Expiring: 1`
          ];
          res.pharmacy_recommendations = [
            'Official Pharmacy Stock Audit Report is formatted and ready for print/download.'
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

  const handlePrintPharmacyPdfReport = () => {
    const reportContent = `
      ========================================================================================
      💊 SMARTCARE HOSPITAL CENTRAL PHARMACY & DRUG DISPENSARY
      Official Stock Inventory & Audit Report (ISO Certified Dispensary)
      ========================================================================================
      Generated Date : ${new Date().toLocaleString()}
      Audit Shift    : Morning / Day Shift
      Pharmacist IC  : Pharmacist Alex Rivera, RPh (Reg # PHARM-2026-092)
      ========================================================================================

      1. PHARMACY INVENTORY STOCK STATUS (${initialPharmacyInventory.length} SKUs)
      ----------------------------------------------------------------------------------------
      ${initialPharmacyInventory.map(m => `• ${m.name} (${m.strength}) | Form: ${m.form} | Batch: ${m.batch_number} | Stock: ${m.stock_quantity} | Price: ₹${m.selling_price.toFixed(2)} | Status: ${m.status}`).join('\n      ')}

      ----------------------------------------------------------------------------------------
      2. LOW STOCK & REORDER REQUISITIONS REQUIRED
      ${initialPharmacyInventory.filter(m => m.stock_quantity <= m.reorder_level).map(m => `⚠️ REORDER NEEDED: ${m.name} ${m.strength} (Batch ${m.batch_number}) — Stock: ${m.stock_quantity} (Reorder Min: ${m.reorder_level})`).join('\n      ')}

      ----------------------------------------------------------------------------------------
      3. EXPIRING MEDICINES (Within 60 Days)
      ${initialPharmacyInventory.filter(m => m.status === 'Expiring Soon').map(m => `⏳ EXPIRING SOON: ${m.name} ${m.strength} (Batch ${m.batch_number}) — Expiry: ${m.expiry_date}`).join('\n      ')}

      ----------------------------------------------------------------------------------------
      4. DISPENSING & TRANSACTION SUMMARY TODAY
      ${initialPharmacyPrescriptions.map(p => `• Rx ${p.token_no}: ${p.patient_name} — Total: ₹${p.total_amount.toFixed(2)} [Status: ${p.status}]`).join('\n      ')}

      ========================================================================================
      Verified by Chief Pharmacist Signature: ______________________
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 text-white p-5 rounded-3xl shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
            <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight flex items-center space-x-2">
              <span>💊 PHARMACY MODULE AI CLINIC — INVENTORY & DRUG ANALYZER</span>
            </h1>
            <p className="text-xs text-emerald-100 mt-0.5">
              Live prescription fulfillment, drug-allergy guardrails, expiry management & automated stock report PDF generator
            </p>
          </div>
        </div>

        <button
          onClick={handlePrintPharmacyPdfReport}
          className="flex items-center justify-center space-x-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 rounded-2xl text-xs transition-all shadow-md cursor-pointer shrink-0"
        >
          <Printer className="h-4 w-4" />
          <span>Export Stock Report PDF</span>
        </button>
      </div>

      {/* PRESET 10 PHARMACY AI QUESTIONS PANEL */}
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-200/80 pb-3">
          <h2 className="text-sm font-bold text-emerald-950 flex items-center space-x-2">
            <HelpCircle className="h-4 w-4 text-emerald-600" />
            <span>⚡ PHARMACY AI CLINIC ASSISTANT — 10 PHARMACEUTICAL PRESET QUERIES</span>
          </h2>
          <span className="text-[10px] bg-emerald-200 text-emerald-900 font-extrabold px-2.5 py-0.5 rounded-full">
            REAL-TIME INVENTORY TELEMETRY
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {questionCategories.map((cat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-xs space-y-2">
              <h3 className="text-xs font-bold text-emerald-950 border-b border-slate-100 pb-1.5">
                {cat.title}
              </h3>
              <div className="flex flex-col gap-1.5">
                {cat.questions.map((q, qIdx) => (
                  <button
                    key={qIdx}
                    onClick={() => handleSelectQuestion(q)}
                    className={`text-left text-[11px] font-semibold px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                      activeQuestion === q
                        ? 'bg-emerald-700 text-white shadow-md scale-[1.02]'
                        : 'bg-emerald-50/80 hover:bg-amber-100/70 text-emerald-950 border border-emerald-100 hover:border-amber-300'
                    }`}
                  >
                    <span className="line-clamp-2">{q}</span>
                    <ChevronRight className={`h-3 w-3 shrink-0 ml-1 ${activeQuestion === q ? 'text-amber-300' : 'text-emerald-400'}`} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI OUTPUT RESPONSE CARD */}
      <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <span>AI PHARMACY TELEMETRY RESPONSE</span>
          </h3>
          <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded-full border border-amber-200">
            {aiResult?.question_context || 'LIVE INVENTORY ANALYSIS'}
          </span>
        </div>

        {loading ? (
          <div className="py-10 flex flex-col items-center justify-center space-y-2">
            <RefreshCw className="h-7 w-7 text-emerald-600 animate-spin" />
            <p className="text-xs font-bold text-slate-600">Cross-Examining Pharmacy Inventory & Drug Guardrails...</p>
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
                <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">Pharmacy Evaluation Summary:</span>
                <p className="text-slate-900 font-semibold mt-1 leading-relaxed bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100">
                  {aiResult.summary}
                </p>
              </div>
            )}

            {/* Critical Alerts */}
            {aiResult.critical_alerts?.length > 0 && (
              <div>
                <span className="font-bold text-red-900 uppercase text-[10px] tracking-wider">High-Priority Stock Flags & Safety Guardrails:</span>
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

            {/* Pharmacy Recommendations / List Items */}
            {aiResult.pharmacy_recommendations?.length > 0 && (
              <div>
                <span className="font-bold text-emerald-950 uppercase text-[10px] tracking-wider">Pharmacy Recommendations & Audit Logs:</span>
                <ul className="space-y-1.5 mt-1">
                  {aiResult.pharmacy_recommendations.map((item: string, idx: number) => (
                    <li key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-900 font-medium flex items-start space-x-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
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
                  onClick={handlePrintPharmacyPdfReport}
                  className="w-full flex items-center justify-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer"
                >
                  <Printer className="h-4 w-4" />
                  <span>PRINT / DOWNLOAD TODAY'S PHARMACY INVENTORY REPORT PDF</span>
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
