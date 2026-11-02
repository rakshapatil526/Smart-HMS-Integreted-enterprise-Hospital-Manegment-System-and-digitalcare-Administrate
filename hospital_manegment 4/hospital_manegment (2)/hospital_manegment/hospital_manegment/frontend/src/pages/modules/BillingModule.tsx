import React, { useState } from 'react';
import {
  initialBillingInvoices,
  initialBillingReceipts,
  initialBillingRefunds,
  BillingInvoice,
  BillingReceipt,
  BillingRefundRecord,
  BillingLineItem
} from './billingData';
import {
  CreditCard, DollarSign, Search, Plus, CheckCircle2, AlertTriangle,
  FileText, Download, Bell, User, ArrowRight, ShieldCheck, RefreshCw,
  TrendingUp, PieChart, Printer, X, Filter, CornerUpLeft
} from 'lucide-react';
import { downloadPDFDocument } from '../../utils/pdfDownloader';
import { BillingOperatorReportView } from './BillingOperatorReportView';

interface BillingModuleProps {
  onNavigateTab?: (tab: string, extraData?: any) => void;
}

export const BillingModule: React.FC<BillingModuleProps> = ({ onNavigateTab }) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Main Data States
  const [invoices, setInvoices] = useState<BillingInvoice[]>(initialBillingInvoices);
  const [receipts, setReceipts] = useState<BillingReceipt[]>(initialBillingReceipts);
  const [refunds, setRefunds] = useState<BillingRefundRecord[]>(initialBillingRefunds);

  // Selected Invoice Modal / Drawer State
  const [selectedInvoice, setSelectedInvoice] = useState<BillingInvoice | null>(null);

  // Payment Recording State (Modal / Form)
  const [payInvoiceId, setPayInvoiceId] = useState<string>('');
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<'Cash' | 'Card' | 'UPI' | 'Online Payment'>('UPI');
  const [payRef, setPayRef] = useState<string>('UPI/20268891900');

  // Refund Form State (Modal)
  const [showRefundModal, setShowRefundModal] = useState<boolean>(false);
  const [refundInvoiceNo, setRefundInvoiceNo] = useState<string>('INV-2026-00125');
  const [refundAmount, setRefundAmount] = useState<number>(500);
  const [refundReason, setRefundReason] = useState<string>('Service charge adjustment / duplicate test refund');

  // New Invoice Form State (Modal)
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState<boolean>(false);
  const [newPatientName, setNewPatientName] = useState<string>('Aarav Sharma');
  const [newPatientId, setNewPatientId] = useState<string>('SC-P001');
  const [newVisitType, setNewVisitType] = useState<'OPD' | 'IPD' | 'Emergency' | 'Pharmacy'>('OPD');
  const [newDoctor, setNewDoctor] = useState<string>('Dr. Arjun Mehta');
  const [newLineItems, setNewLineItems] = useState<BillingLineItem[]>([
    { id: '1', service_name: 'OPD Specialist Consultation', source_module: 'OPD', quantity: 1, unit_price: 500, amount: 500 },
    { id: '2', service_name: 'Complete Blood Count (CBC)', source_module: 'Laboratory', quantity: 1, unit_price: 300, amount: 300 },
  ]);
  const [newDiscount, setNewDiscount] = useState<number>(0);
  const [newTax, setNewTax] = useState<number>(0);

  // Derived Metrics
  const todaysRevenueTotal = invoices.filter(i => i.status === 'Paid').reduce((acc, i) => acc + i.amount_paid, 0) + 85500; // ₹85,500 baseline
  const pendingPaymentsTotal = invoices.reduce((acc, i) => acc + i.balance_due, 0);
  const paidInvoicesCount = invoices.filter(i => i.status === 'Paid').length + 42;
  const refundsCount = refunds.length + 1;

  // Filtered Invoices List
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inv.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inv.patient_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inv.bill_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle Record Payment & Receipt Generation (Section 7 & 8)
  const handleRecordPayment = (inv: BillingInvoice) => {
    const amtToPay = payAmount > 0 ? payAmount : inv.balance_due;
    if (amtToPay <= 0) {
      alert('Payment amount must be greater than 0.');
      return;
    }

    const newAmountPaid = inv.amount_paid + amtToPay;
    const newBalance = Math.max(0, inv.total_amount - newAmountPaid);
    const newStatus: BillingInvoice['status'] = newBalance === 0 ? 'Paid' : 'Partially Paid';

    // Update invoice state
    setInvoices(prev => prev.map(i => i.id === inv.id ? {
      ...i,
      amount_paid: newAmountPaid,
      balance_due: newBalance,
      status: newStatus,
      payment_method: payMethod
    } : i));

    // Generate receipt
    const newRcpt: BillingReceipt = {
      id: `rcpt-${Date.now()}`,
      receipt_number: `RCPT-2026-${Math.floor(Math.random() * 800) + 100}`,
      invoice_number: inv.invoice_number,
      patient_name: inv.patient_name,
      patient_id: inv.patient_id,
      amount_paid: amtToPay,
      payment_method: payMethod,
      transaction_ref: payRef || `${payMethod.toUpperCase()}/202699881122`,
      date: `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      status: newBalance === 0 ? 'PAID ✓' : 'PARTIAL ✓',
      cashier_name: 'Accounts Manager Sarah Connor',
    };
    setReceipts(prev => [newRcpt, ...prev]);

    if (selectedInvoice?.id === inv.id) {
      setSelectedInvoice({
        ...inv,
        amount_paid: newAmountPaid,
        balance_due: newBalance,
        status: newStatus,
        payment_method: payMethod
      });
    }

    alert(`Payment of ₹${amtToPay.toLocaleString()} recorded for Invoice ${inv.invoice_number}!\n- Status updated to: ${newStatus}\n- Official Payment Receipt ${newRcpt.receipt_number} generated.`);
  };

  // Handle Invoice Cancellation (Section 19: Reason recorded, not deleted)
  const handleCancelInvoice = (invId: string) => {
    const reason = prompt('Please enter cancellation reason for audit log:');
    if (!reason) return;

    setInvoices(prev => prev.map(i => i.id === invId ? {
      ...i,
      status: 'Cancelled',
      cancellation_reason: reason
    } : i));

    alert(`Invoice marked as CANCELLED.\nReason logged: "${reason}"`);
  };

  // Handle Process Refund (Section 18)
  const handleProcessRefund = (e: React.FormEvent) => {
    e.preventDefault();
    const inv = invoices.find(i => i.invoice_number === refundInvoiceNo);
    if (!inv) {
      alert('Selected invoice not found.');
      return;
    }

    const newRefund: BillingRefundRecord = {
      id: `ref-${Date.now()}`,
      refund_id: `RFND-2026-${Math.floor(Math.random() * 800) + 100}`,
      invoice_number: refundInvoiceNo,
      patient_name: inv.patient_name,
      amount_refunded: refundAmount,
      reason: refundReason,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      authorized_by: 'Finance Director James Vance',
    };

    setRefunds(prev => [newRefund, ...prev]);
    setInvoices(prev => prev.map(i => i.invoice_number === refundInvoiceNo ? { ...i, status: 'Refunded', refund_amount: refundAmount, refund_reason: refundReason } : i));
    setShowRefundModal(false);

    alert(`Refund of ₹${refundAmount.toLocaleString()} processed for ${inv.patient_name} (${refundInvoiceNo}).\nRefund Receipt ${newRefund.refund_id} logged to audit trial.`);
  };

  // Handle Download Invoice PDF (Colorful PDF Document)
  const handleDownloadInvoicePDF = async (inv: BillingInvoice) => {
    await downloadPDFDocument(
      'invoice',
      {
        invoice_number: inv.invoice_number,
        patient_name: inv.patient_name,
        patient_id: inv.patient_id,
        phone: inv.phone,
        visit_type: inv.visit_type,
        attending_doctor: inv.attending_doctor,
        date: inv.date,
        due_date: inv.due_date,
        line_items: inv.line_items.map(l => ({ description: `${l.service_name} (${l.source_module})`, amount: l.amount })),
        subtotal: inv.subtotal,
        discount: inv.discount,
        tax: inv.tax,
        total_amount: inv.total_amount,
        amount_paid: inv.amount_paid,
        balance_due: inv.balance_due,
        status: inv.status,
        payment_method: inv.payment_method || 'Digital Payment',
      },
      `Invoice_${inv.invoice_number}.pdf`
    );
  };

  // Handle Download Receipt PDF
  const handleDownloadReceiptPDF = async (rcpt: BillingReceipt) => {
    await downloadPDFDocument(
      'invoice',
      {
        invoice_number: rcpt.receipt_number,
        patient_name: rcpt.patient_name,
        patient_id: rcpt.patient_id,
        source_module: 'Payment Receipt',
        status: rcpt.status,
        payment_method: rcpt.payment_method,
        line_items: [{ description: `Payment Receipt for Invoice ${rcpt.invoice_number} (Ref: ${rcpt.transaction_ref})`, amount: rcpt.amount_paid }],
        subtotal: rcpt.amount_paid,
        discount: 0,
        total_amount: rcpt.amount_paid,
      },
      `Receipt_${rcpt.receipt_number}.pdf`
    );
  };

  return (
    <div className="space-y-6 font-['Inter',sans-serif]">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-amber-400 shadow-md">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">💳 BILLING &amp; INVOICE MANAGEMENT MODULE</h1>
              <p className="text-xs text-slate-500">
                Central Financial Hub: Collect Charges ➔ Generate Invoices ➔ Record Payments ➔ Receipts ➔ Audit Logs
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold">
          <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 font-bold">
            All Service Charges Synced
          </span>
          <span className="rounded-full bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 font-bold">
            Audited Ledger Active
          </span>
        </div>
      </div>

      {/* Navigation Toolbar (Section 24 Requirement) */}
      <div className="flex items-center space-x-1 border-b border-slate-200 overflow-x-auto pb-2 custom-scrollbar text-xs font-semibold text-slate-600">
        {[
          { id: 'dashboard', label: '🏠 Dashboard' },
          { id: 'patient-billing', label: '👤 Patient Billing' },
          { id: 'charges', label: '💰 Charges' },
          { id: 'invoices', label: '🧾 Invoices' },
          { id: 'payments', label: '💵 Payments' },
          { id: 'receipts', label: '🧾 Receipts' },
          { id: 'refunds', label: '↩️ Refunds' },
          { id: 'history', label: '📋 Billing History' },
          { id: 'reports', label: '📊 Billing Reports' },
          { id: 'notifications', label: '🔔 Notifications' },
          { id: 'profile', label: '👤 My Profile' },
        ].map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-amber-400 shadow-sm font-bold'
                  : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Metrics Bar (Section 1 Requirement) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 block font-bold uppercase text-[10px]">Today's Revenue</span>
          <strong className="text-2xl text-emerald-600 font-extrabold">₹{todaysRevenueTotal.toLocaleString()}</strong>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 block font-bold uppercase text-[10px]">Pending Payments</span>
          <strong className="text-2xl text-amber-600 font-extrabold">₹{pendingPaymentsTotal.toLocaleString()}</strong>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 block font-bold uppercase text-[10px]">Paid Invoices</span>
          <strong className="text-2xl text-blue-600 font-extrabold">{paidInvoicesCount}</strong>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 block font-bold uppercase text-[10px]">Refunds Processed</span>
          <strong className="text-2xl text-purple-600 font-extrabold">{refundsCount}</strong>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 1. BILLING DASHBOARD VIEW (Section 1 Requirement) */}
      {/* ============================================================ */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Search & Status Filter */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search Patient / Invoice No / Bill Number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:border-slate-900 focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-2 text-xs w-full sm:w-auto justify-end">
              <span className="text-slate-500 font-medium">Status Filter:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="Paid">🟢 Paid</option>
                <option value="Partially Paid">🟠 Partially Paid</option>
                <option value="Issued">🔵 Issued</option>
                <option value="Draft">🟡 Draft</option>
                <option value="Cancelled">🔴 Cancelled</option>
                <option value="Refunded">🟣 Refunded</option>
              </select>
            </div>
          </div>

          {/* Recent Invoices Table (Section 1 Requirement) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <FileText className="h-4 w-4 text-amber-600" />
                <span>CENTRAL FINANCIAL INVOICES &amp; PATIENT BILLING</span>
              </h3>

              <button
                onClick={() => setShowNewInvoiceModal(true)}
                className="flex items-center space-x-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 text-xs font-bold transition-all"
              >
                <Plus className="h-4 w-4 text-amber-400" />
                <span>+ Create Invoice</span>
              </button>
            </div>

            <div className="overflow-x-auto custom-scrollbar border border-slate-100 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] border-b">
                    <th className="p-3">Invoice No</th>
                    <th className="p-3">Patient Name</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Subtotal</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Amount Paid</th>
                    <th className="p-3">Balance</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-6 text-center text-slate-400 italic">
                        No billing invoices match the search filter.
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono font-bold text-amber-700">{inv.invoice_number}</td>
                        <td className="p-3 font-bold text-slate-900">{inv.patient_name} ({inv.patient_id})</td>
                        <td className="p-3 text-slate-700">{inv.visit_type}</td>
                        <td className="p-3 text-slate-600">₹{inv.subtotal.toLocaleString()}</td>
                        <td className="p-3 font-bold text-slate-900">₹{inv.total_amount.toLocaleString()}</td>
                        <td className="p-3 text-emerald-600 font-bold">₹{inv.amount_paid.toLocaleString()}</td>
                        <td className="p-3 text-red-600 font-bold">₹{inv.balance_due.toLocaleString()}</td>
                        <td className="p-3">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                              inv.status === 'Paid'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : inv.status === 'Partially Paid'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : inv.status === 'Cancelled'
                                ? 'bg-red-50 text-red-800 border-red-200'
                                : 'bg-blue-50 text-blue-800 border-blue-200'
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 text-xs font-bold transition-all shadow-xs"
                          >
                            [ OPEN BILLING ]
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. PATIENT BILLING PROFILE (Section 3 & 4 Requirement) */}
      {/* ============================================================ */}
      {activeTab === 'patient-billing' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="border-b pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">👤 PATIENT BILLING DOSSIER</h2>
                <p className="text-xs text-slate-500">Collects charges from OPD, IPD, Lab, Radiology, and Pharmacy</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {invoices.map(inv => (
                <div key={inv.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-mono font-bold text-amber-700 text-sm">{inv.invoice_number}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                      inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {inv.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-slate-700 font-medium">
                    <div><strong>Patient:</strong> {inv.patient_name} ({inv.patient_id})</div>
                    <div><strong>Current Visit:</strong> {inv.visit_type} — {inv.attending_doctor}</div>
                    <div><strong>Outstanding Balance:</strong> <span className="font-bold text-red-600">₹{inv.balance_due.toLocaleString()}</span></div>
                  </div>

                  <div className="border-t pt-2 space-y-1">
                    <span className="font-bold text-[11px] text-slate-800 block">Itemized Service Charges:</span>
                    {inv.line_items.map((item, idx) => (
                      <div key={idx} className="flex justify-between bg-white px-3 py-1 rounded-lg border text-[11px]">
                        <span>{item.service_name} ({item.source_module})</span>
                        <span className="font-bold text-slate-900">₹{item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-between items-center">
                    <button
                      onClick={() => handleDownloadInvoicePDF(inv)}
                      className="rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 font-bold flex items-center space-x-1 border"
                    >
                      <Download className="h-3.5 w-3.5 text-amber-600" />
                      <span>PDF Invoice</span>
                    </button>

                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="rounded-xl bg-slate-900 text-white px-4 py-1.5 font-bold hover:bg-slate-800"
                    >
                      [ RECORD PAYMENT ]
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. INVOICE CREATION & CHARGES (Section 4 & 5 Requirement) */}
      {/* ============================================================ */}
      {activeTab === 'invoices' || activeTab === 'charges' ? (
        <div className="max-w-3xl mx-auto rounded-3xl border border-slate-200 bg-white p-8 shadow-md space-y-6">
          <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <FileText className="h-6 w-6 text-amber-600" />
                <span>CREATE OFFICIAL HOSPITAL INVOICE</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Aggregates service charges across OPD, IPD, LIS, RIS, &amp; Pharmacy
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Patient Name &amp; ID</label>
                <input
                  type="text"
                  value={`${newPatientName} (${newPatientId})`}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  className="w-full rounded-xl border p-2 font-bold text-slate-900 bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Attending Doctor / Department</label>
                <input
                  type="text"
                  value={newDoctor}
                  onChange={(e) => setNewDoctor(e.target.value)}
                  className="w-full rounded-xl border p-2 text-slate-900 bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-800 text-xs block">Service Line Items Breakdown:</span>
              {newLineItems.map((li, i) => (
                <div key={i} className="flex items-center justify-between bg-white p-3 rounded-xl border">
                  <div>
                    <span className="font-bold text-slate-900 block">{li.service_name}</span>
                    <span className="text-[10px] text-slate-400">Source: {li.source_module}</span>
                  </div>
                  <span className="font-bold text-slate-900">₹{li.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border space-y-2 text-right font-bold text-xs">
              <div>Subtotal: ₹{newLineItems.reduce((a, b) => a + b.amount, 0).toLocaleString()}</div>
              <div>Discount: -₹{newDiscount}</div>
              <div className="text-sm text-amber-800 font-extrabold border-t pt-2">
                TOTAL PAYABLE AMOUNT: ₹{(newLineItems.reduce((a, b) => a + b.amount, 0) - newDiscount).toLocaleString()}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  alert('Invoice INV-2026-00129 generated successfully!\nRecorded in Central Financial Audit Ledger.');
                  setActiveTab('dashboard');
                }}
                className="rounded-2xl bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 font-extrabold text-xs uppercase tracking-wider shadow-md"
              >
                [ GENERATE INVOICE ]
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* ============================================================ */}
      {/* 4. PAYMENTS & PARTIAL PAYMENT (Section 7 & 8 Requirement) */}
      {/* ============================================================ */}
      {activeTab === 'payments' && (
        <div className="max-w-3xl mx-auto rounded-3xl border border-slate-200 bg-white p-8 shadow-md space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <DollarSign className="h-6 w-6 text-emerald-600" />
              <span>RECORD PATIENT PAYMENT &amp; PARTIAL SETTLEMENT</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Cash, Card, UPI, or Online Payment receipt processing
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {invoices.filter(i => i.balance_due > 0).map(inv => (
              <div key={inv.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-mono font-bold text-amber-700 text-sm">{inv.invoice_number}</span>
                  <span className="font-bold text-slate-900">{inv.patient_name} ({inv.patient_id})</span>
                </div>

                <div className="flex justify-between items-center text-slate-800 font-medium">
                  <span>Total Bill: <strong>₹{inv.total_amount.toLocaleString()}</strong></span>
                  <span>Paid: <strong className="text-emerald-600">₹{inv.amount_paid.toLocaleString()}</strong></span>
                  <span>Balance Due: <strong className="text-red-600">₹{inv.balance_due.toLocaleString()}</strong></span>
                </div>

                <div className="pt-2 border-t flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-700">Method:</span>
                    <select
                      value={payMethod}
                      onChange={(e) => setPayMethod(e.target.value as any)}
                      className="rounded-xl border p-1.5 font-bold text-slate-900 bg-white focus:outline-none"
                    >
                      <option value="UPI">UPI Payment</option>
                      <option value="Card">Credit / Debit Card</option>
                      <option value="Cash">Cash Counter</option>
                      <option value="Online Payment">Online NetBanking</option>
                    </select>
                  </div>

                  <button
                    onClick={() => handleRecordPayment(inv)}
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 font-extrabold uppercase shadow-sm"
                  >
                    [ RECORD PAYMENT ₹{inv.balance_due.toLocaleString()} ]
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. RECEIPTS VIEW (Section 9 Requirement) */}
      {/* ============================================================ */}
      {activeTab === 'receipts' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="border-b pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">🧾 OFFICIAL PAYMENT RECEIPTS</h2>
              <p className="text-xs text-slate-500">Audited receipt logs for patients &amp; insurance claims</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {receipts.map(rcpt => (
              <div key={rcpt.id} className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-bold text-sm text-emerald-950">
                    Receipt #: <span className="font-mono">{rcpt.receipt_number}</span> — {rcpt.patient_name} ({rcpt.patient_id})
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Invoice: {rcpt.invoice_number} • Payment Method: <strong>{rcpt.payment_method}</strong> ({rcpt.transaction_ref})
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <span className="block font-bold text-base text-emerald-700">₹{rcpt.amount_paid.toLocaleString()}</span>
                  <button
                    onClick={() => handleDownloadReceiptPDF(rcpt)}
                    className="rounded-xl bg-emerald-700 text-white px-3 py-1 font-bold flex items-center space-x-1 shadow-xs"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download Receipt PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 6. REFUNDS VIEW (Section 18 Requirement) */}
      {/* ============================================================ */}
      {activeTab === 'refunds' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 max-w-4xl mx-auto">
          <div className="border-b pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <CornerUpLeft className="h-5 w-5 text-purple-600" />
                <span>↩️ AUTHORIZED FINANCIAL REFUNDS</span>
              </h2>
              <p className="text-xs text-slate-500">Audited refund log entries with manager authorization</p>
            </div>

            <button
              onClick={() => setShowRefundModal(true)}
              className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-xs font-bold shadow-sm"
            >
              + Process Refund
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {refunds.map(ref => (
              <div key={ref.id} className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
                <div className="flex items-center justify-between font-bold text-purple-950">
                  <span>Refund ID: {ref.refund_id} — {ref.patient_name}</span>
                  <span className="text-red-700 font-extrabold text-sm">-₹{ref.amount_refunded.toLocaleString()}</span>
                </div>
                <div className="text-[11px] text-purple-800 font-medium">
                  <div><strong>Invoice No:</strong> {ref.invoice_number}</div>
                  <div><strong>Reason:</strong> {ref.reason}</div>
                  <div><strong>Authorized By:</strong> {ref.authorized_by} on {ref.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 7. BILLING REPORTS & REVENUE BREAKDOWN (Section 21) */}
      {/* ============================================================ */}
      {(activeTab === 'reports' || activeTab === 'history') && (
        <BillingOperatorReportView />
      )}

      {/* ============================================================ */}
      {/* 8. NOTIFICATIONS VIEW */}
      {/* ============================================================ */}
      {activeTab === 'notifications' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 max-w-3xl mx-auto text-xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Bell className="h-5 w-5 text-amber-500" />
            <span>BILLING ALERTS &amp; NOTIFICATIONS</span>
          </h2>
          <div className="space-y-2">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 font-bold text-emerald-900">
              💵 Payment of ₹1,850 received for Invoice INV-2026-00125 via UPI.
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 font-bold text-amber-900">
              🟠 Partial payment of ₹10,000 recorded for Anika Patel (IPD). ₹18,000 balance pending.
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 9. MY PROFILE VIEW */}
      {/* ============================================================ */}
      {activeTab === 'profile' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm max-w-xl mx-auto space-y-4 text-xs">
          <div className="flex items-center space-x-3 border-b pb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-amber-400 font-bold text-lg">
              SC
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Accounts Manager Sarah Connor</h3>
              <span className="text-slate-500">Chief Accounts &amp; Billing Officer</span>
            </div>
          </div>

          <div className="space-y-2 text-slate-700 font-medium">
            <div><strong>Staff License No:</strong> FIN-ACC-2026-7701</div>
            <div><strong>Department:</strong> Central Finance &amp; Patient Revenue Management</div>
            <div><strong>Authorized Scope:</strong> Invoice Generation, Payment Settlement, Receipts, &amp; Refund Approval</div>
          </div>
        </div>
      )}

      {/* Selected Invoice Details & Payment Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl relative space-y-4 border border-slate-100 text-xs">
            <button onClick={() => setSelectedInvoice(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1">
              <X className="h-6 w-6" />
            </button>

            <div className="border-b pb-3 font-bold text-base text-slate-900 flex items-center justify-between">
              <span>Invoice: <span className="font-mono text-amber-700">{selectedInvoice.invoice_number}</span></span>
              <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full font-bold">{selectedInvoice.status}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border text-slate-800 font-medium">
              <div><strong>Patient:</strong> {selectedInvoice.patient_name} ({selectedInvoice.patient_id})</div>
              <div><strong>Attending Doctor:</strong> {selectedInvoice.attending_doctor}</div>
              <div><strong>Date:</strong> {selectedInvoice.date}</div>
              <div><strong>Visit Type:</strong> {selectedInvoice.visit_type}</div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-800 block text-xs">Itemized Service Charges Breakdown:</span>
              {selectedInvoice.line_items.map((m, i) => (
                <div key={i} className="flex items-center justify-between bg-white p-2.5 rounded-xl border text-xs font-semibold">
                  <span>{m.service_name} ({m.source_module})</span>
                  <span className="font-bold text-slate-900">₹{m.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border flex justify-between font-bold text-xs">
              <span>Total: ₹{selectedInvoice.total_amount.toLocaleString()}</span>
              <span className="text-emerald-700">Paid: ₹{selectedInvoice.amount_paid.toLocaleString()}</span>
              <span className="text-red-600">Balance: ₹{selectedInvoice.balance_due.toLocaleString()}</span>
            </div>

            <div className="pt-3 border-t flex justify-between items-center">
              <div className="flex space-x-2">
                <button onClick={() => handleDownloadInvoicePDF(selectedInvoice)} className="rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 font-bold flex items-center space-x-1 border">
                  <Download className="h-4 w-4 text-amber-600" />
                  <span>Download PDF Invoice</span>
                </button>
                <button onClick={() => handleCancelInvoice(selectedInvoice.id)} className="rounded-xl bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 font-bold border border-red-200">
                  Cancel Invoice
                </button>
              </div>

              {selectedInvoice.balance_due > 0 && (
                <button onClick={() => handleRecordPayment(selectedInvoice)} className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 font-extrabold uppercase shadow-md">
                  [ RECORD PAYMENT ]
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Process Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl relative space-y-4 border border-slate-100 text-xs">
            <button onClick={() => setShowRefundModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1">
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-bold text-base text-slate-900 border-b pb-3 flex items-center space-x-2">
              <CornerUpLeft className="h-5 w-5 text-purple-600" />
              <span>PROCESS AUTHORIZED REFUND</span>
            </h3>

            <form onSubmit={handleProcessRefund} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Invoice Number</label>
                <input type="text" required value={refundInvoiceNo} onChange={(e) => setRefundInvoiceNo(e.target.value)} className="w-full rounded-xl border p-2 font-mono font-bold text-slate-900 focus:outline-none" />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Refund Amount (₹)</label>
                <input type="number" required value={refundAmount} onChange={(e) => setRefundAmount(Number(e.target.value))} className="w-full rounded-xl border p-2 font-bold text-slate-900 focus:outline-none" />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Refund</label>
                <textarea rows={3} required value={refundReason} onChange={(e) => setRefundReason(e.target.value)} className="w-full rounded-xl border p-2 text-slate-900 focus:outline-none" />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setShowRefundModal(false)} className="rounded-xl bg-slate-100 px-4 py-2 font-bold text-slate-600">Cancel</button>
                <button type="submit" className="rounded-xl bg-purple-600 text-white px-5 py-2 font-bold shadow-md">Confirm Refund</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingModule;
