import React, { useState, useEffect } from 'react';
import { sharedStore } from '../../services/sharedStore';
import {
  initialPharmacyInventory,
  initialPharmacyPrescriptions,
  initialPharmacyTransactions,
  PharmacyMedicine,
  PharmacyPrescription,
  PharmacyTransaction
} from './pharmacyData';
import {
  Pill, Search, Plus, CheckCircle2, AlertTriangle, Clock,
  FileText, Download, Bell, User, ShoppingBag, CreditCard,
  X, Eye, ArrowRight, ShieldCheck, RefreshCw, Filter
} from 'lucide-react';
import { downloadPDFDocument } from '../../utils/pdfDownloader';
import { AIPharmacySuggestionCard } from '../../components/ai/AIPharmacySuggestionCard';

interface PharmacyModuleProps {
  onNavigateTab?: (tab: string, extraData?: any) => void;
  initialTab?: string;
}

export const PharmacyModule: React.FC<PharmacyModuleProps> = ({ onNavigateTab, initialTab = 'dashboard' }) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterForm, setFilterForm] = useState<string>('ALL');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Main Data States
  const [inventory, setInventory] = useState<PharmacyMedicine[]>(initialPharmacyInventory);
  const [prescriptions, setPrescriptions] = useState<PharmacyPrescription[]>(sharedStore.getPrescriptions());
  const [transactions, setTransactions] = useState<PharmacyTransaction[]>(initialPharmacyTransactions);
  const [notifications, setNotifications] = useState<any[]>(sharedStore.getPharmacyNotifications());

  useEffect(() => {
    const handlePrescriptionUpdate = () => {
      setPrescriptions(sharedStore.getPrescriptions());
      setNotifications(sharedStore.getPharmacyNotifications());
    };
    handlePrescriptionUpdate();
    window.addEventListener('smartcare_prescription_added', handlePrescriptionUpdate);
    window.addEventListener('smartcare_pharmacy_notif_added', handlePrescriptionUpdate);
    return () => {
      window.removeEventListener('smartcare_prescription_added', handlePrescriptionUpdate);
      window.removeEventListener('smartcare_pharmacy_notif_added', handlePrescriptionUpdate);
    };
  }, []);

  // Active Selected Prescription Modal / Drawer State
  const [selectedRx, setSelectedRx] = useState<PharmacyPrescription | null>(null);

  // New Medicine Inventory Form State (Modal)
  const [showAddMedModal, setShowAddMedModal] = useState<boolean>(false);
  const [newMedName, setNewMedName] = useState<string>('');
  const [newGenericName, setNewGenericName] = useState<string>('');
  const [newStrength, setNewStrength] = useState<string>('');
  const [newForm, setNewForm] = useState<'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Ointment'>('Tablet');
  const [newBatchNo, setNewBatchNo] = useState<string>('B007');
  const [newStockQty, setNewStockQty] = useState<number>(100);
  const [newExpiryDate, setNewExpiryDate] = useState<string>('2027-12-31');
  const [newSupplier, setNewSupplier] = useState<string>('PharmaCare Distributors');
  const [newPrice, setNewPrice] = useState<number>(5.00);
  const [newReorderLevel, setNewReorderLevel] = useState<number>(20);

  // Derived Metrics
  const totalPrescriptionsCount = prescriptions.length;
  const pendingRxCount = prescriptions.filter(p => p.status === 'Pending' || p.status === 'Insufficient Stock').length;
  const dispensedRxCount = prescriptions.filter(p => p.status === 'Dispensed').length;
  const lowStockCount = inventory.filter(m => m.stock_quantity <= m.reorder_level).length;
  const expiringSoonCount = inventory.filter(m => m.status === 'Expiring Soon').length;
  const todaySalesTotal = transactions.reduce((acc, t) => acc + t.total_amount, 0) + 18500; // ₹18,500 baseline

  // Filtered Prescriptions
  const filteredPrescriptions = prescriptions.filter(p => {
    const matchesSearch = p.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.token_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.patient_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.doctor_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Filtered Inventory
  const filteredInventory = inventory.filter(m => {
    const matchesQuery = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         m.generic_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         m.batch_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesForm = filterForm === 'ALL' || m.form === filterForm;
    return matchesQuery && matchesForm;
  });

  // Handle Dispensing & Automatic Stock Deduction (Section 5 & 6 Requirement)
  const handleConfirmDispensing = (rxObj: PharmacyPrescription) => {
    // Check if any medicine is insufficient
    const hasInsufficient = rxObj.medicines.some(m => m.available_qty < m.required_qty);
    if (hasInsufficient) {
      alert(`Cannot dispense Prescription ${rxObj.token_no}.\nOne or more prescribed medicines have insufficient inventory stock.\nPharmacist cannot silently substitute medicines without doctor authorization.`);
      return;
    }

    // Deduct stock automatically (Section 6: Stock = Stock - Required Qty)
    const updatedInventory = inventory.map(med => {
      const matchedPrescribed = rxObj.medicines.find(pm => pm.medicine_name.toLowerCase() === med.name.toLowerCase());
      if (matchedPrescribed) {
        const newQty = Math.max(0, med.stock_quantity - matchedPrescribed.required_qty);
        const newStatus = newQty <= med.reorder_level ? 'Low Stock' : med.status;
        return { ...med, stock_quantity: newQty, status: newStatus };
      }
      return med;
    });
    setInventory(updatedInventory);

    // Update Prescription status to Dispensed in shared store and local state
    sharedStore.dispensePrescription(rxObj.id, 'Pharmacist Alex Rivera');
    setPrescriptions(prev => prev.map(p => p.id === rxObj.id ? { ...p, status: 'Dispensed', billing_status: 'Sent to Billing' } : p));

    // Create Pharmacy Transaction & Transmit to Billing
    const newTx: PharmacyTransaction = {
      id: `tx-${Date.now()}`,
      transaction_id: `PHARM-TX-2026-${Math.floor(Math.random() * 800) + 100}`,
      token_no: rxObj.token_no,
      patient_id: rxObj.patient_id,
      patient_name: rxObj.patient_name,
      date: `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      medicines_summary: rxObj.medicines.map(m => `${m.medicine_name} (${m.required_qty} units)`).join(', '),
      total_amount: rxObj.total_amount,
      pharmacist_name: 'Pharmacist Alex Rivera',
      billing_status: 'Sent to Billing',
    };
    setTransactions(prev => [newTx, ...prev]);

    if (selectedRx?.id === rxObj.id) {
      setSelectedRx({ ...rxObj, status: 'Dispensed', billing_status: 'Sent to Billing' });
    }

    alert(`Prescription ${rxObj.token_no} for ${rxObj.patient_name} DISPENSED successfully!\n- Stock automatically updated in Inventory.\n- Notification transmitted to Doctor ${rxObj.doctor_name}.\n- Itemized charges ($${rxObj.total_amount}) transmitted to Billing Module.`);
  };

  // Handle Add New Medicine to Inventory
  const handleAddNewMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim()) return;

    const newMed: PharmacyMedicine = {
      id: `med-${Date.now()}`,
      name: newMedName,
      generic_name: newGenericName || newMedName,
      strength: newStrength || '500 mg',
      form: newForm,
      batch_number: newBatchNo,
      stock_quantity: newStockQty,
      expiry_date: newExpiryDate,
      supplier: newSupplier,
      selling_price: newPrice,
      reorder_level: newReorderLevel,
      status: newStockQty <= newReorderLevel ? 'Low Stock' : 'Available',
    };

    setInventory(prev => [newMed, ...prev]);
    setShowAddMedModal(false);
    setNewMedName('');
    setNewGenericName('');
    alert(`Medicine ${newMedName} (${newBatchNo}) added to Pharmacy Inventory.`);
  };

  // Handle Prescription PDF Download
  const handleDownloadPrescriptionPDF = async (rxObj: PharmacyPrescription) => {
    await downloadPDFDocument(
      'prescription',
      {
        prescription_number: rxObj.token_no,
        patient_name: rxObj.patient_name,
        patient_id: rxObj.patient_id,
        doctor_name: rxObj.doctor_name,
        department: rxObj.department,
        medicines: rxObj.medicines.map(m => ({
          medicine_name: m.medicine_name,
          dosage: m.strength,
          frequency: m.frequency,
          duration: m.duration,
        })),
      },
      `Prescription_${rxObj.token_no}_${rxObj.patient_name.replace(/\s+/g, '_')}.pdf`
    );
  };

  return (
    <div className="space-y-6 font-['Inter',sans-serif]">
      {/* Module Title Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md">
              <Pill className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">💊 PHARMACY MANAGEMENT MODULE</h1>
              <p className="text-xs text-slate-500">
                Prescription Verification ➔ Medicine Availability ➔ Dispensing ➔ Auto-Stock Deduction ➔ Billing Transmission
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold">
          <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 font-bold">
            Live Inventory Synced
          </span>
          <span className="rounded-full bg-teal-50 text-teal-800 border border-teal-200 px-3 py-1 font-bold">
            Billing Connected
          </span>
        </div>
      </div>

      {/* DOCTOR PRESCRIPTION NOTIFICATIONS FEED */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-amber-900 flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <Bell className="h-4 w-4 text-amber-600 animate-bounce" />
            <span>INCOMING DOCTOR PRESCRIPTIONS & NOTIFICATIONS</span>
          </span>
          <span className="rounded-full bg-amber-600 text-white text-[11px] font-bold px-2.5 py-0.5">
            {notifications.length} Alerts
          </span>
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
          {notifications.map((n) => (
            <div key={n.id} className="rounded-xl border border-amber-100 bg-white p-3 shadow-2xs flex items-start justify-between">
              <div className="flex items-start space-x-2.5">
                <Pill className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                  <p className="text-xs text-slate-600">{n.message}</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-semibold text-slate-400 shrink-0">{n.timestamp}</span>
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="text-center text-xs text-slate-400 py-3">No incoming doctor prescription notifications.</div>
          )}
        </div>
      </div>

      {/* Navigation Toolbar (Section 15 Requirement) */}
      <div className="flex items-center space-x-1 border-b border-slate-200 overflow-x-auto pb-2 custom-scrollbar text-xs font-semibold text-slate-600">
        {[
          { id: 'dashboard', label: '🏠 Dashboard' },
          { id: 'prescriptions', label: '📋 Prescriptions' },
          { id: 'dispensing', label: '💊 Dispensing' },
          { id: 'inventory', label: '📦 Medicine Inventory' },
          { id: 'low-stock', label: '⚠️ Low Stock' },
          { id: 'expiry', label: '⏳ Expiry Alerts' },
          { id: 'transactions', label: '🧾 Pharmacy Transactions' },
          { id: 'ai-assistant', label: '🤖 AI Pharmacy Assist' },
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
                  ? 'bg-teal-600 text-white shadow-sm font-bold'
                  : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Metrics Summary Bar (Section 1 Requirement) */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 block font-bold uppercase text-[10px]">Prescriptions</span>
          <strong className="text-2xl text-slate-900 font-extrabold">{totalPrescriptionsCount}</strong>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 block font-bold uppercase text-[10px]">Pending</span>
          <strong className="text-2xl text-amber-600 font-extrabold">{pendingRxCount}</strong>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 block font-bold uppercase text-[10px]">Dispensed</span>
          <strong className="text-2xl text-emerald-600 font-extrabold">{dispensedRxCount}</strong>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 block font-bold uppercase text-[10px]">Low Stock</span>
          <strong className="text-2xl text-red-600 font-extrabold">{lowStockCount}</strong>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 block font-bold uppercase text-[10px]">Expiring Soon</span>
          <strong className="text-2xl text-purple-600 font-extrabold">{expiringSoonCount}</strong>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 block font-bold uppercase text-[10px]">Today's Sales</span>
          <strong className="text-xl text-teal-700 font-extrabold">₹{todaySalesTotal.toLocaleString()}</strong>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 1. PHARMACY DASHBOARD VIEW (Section 1 Requirement) */}
      {/* ============================================================ */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search Patient Name / Prescription Token (RX001) / Doctor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Real-time synchronization with Doctor OPD/IPD prescriptions
            </div>
          </div>

          {/* Main Dashboard Prescriptions Table */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <FileText className="h-4 w-4 text-teal-600" />
                <span>INCOMING DOCTOR PRESCRIPTIONS QUEUE</span>
              </h3>
            </div>

            <div className="overflow-x-auto custom-scrollbar border border-slate-100 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] border-b border-slate-200">
                    <th className="p-3">Prescription Token</th>
                    <th className="p-3">Patient Name</th>
                    <th className="p-3">Attending Doctor</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Medicines Count</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {filteredPrescriptions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-400 italic">
                        No prescriptions match the current search query.
                      </td>
                    </tr>
                  ) : (
                    filteredPrescriptions.map((rx) => (
                      <tr key={rx.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono font-bold text-teal-700">{rx.token_no}</td>
                        <td className="p-3 font-bold text-slate-900">{rx.patient_name} ({rx.patient_id})</td>
                        <td className="p-3 text-slate-700">{rx.doctor_name}</td>
                        <td className="p-3 text-slate-600">{rx.department}</td>
                        <td className="p-3 font-bold text-slate-800">{rx.medicines.length} items</td>
                        <td className="p-3">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                              rx.status === 'Dispensed'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : rx.status === 'Insufficient Stock'
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            {rx.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setSelectedRx(rx)}
                            className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 text-xs font-bold transition-all border shadow-xs"
                          >
                            [ OPEN PRESCRIPTION ]
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
      {/* 2. PRESCRIPTIONS & AVAILABILITY VERIFICATION (Section 2, 3, 4) */}
      {/* ============================================================ */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="border-b pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">📋 DOCTOR PRESCRIPTIONS &amp; STOCK VERIFICATION</h2>
                <p className="text-xs text-slate-500">Doctor prescribes ➔ Pharmacist verifies medicine availability ➔ Dispense</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {prescriptions.map(rx => (
                <div key={rx.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-mono font-bold text-teal-700 text-sm">{rx.token_no}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                      rx.status === 'Dispensed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {rx.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-slate-700 font-medium">
                    <div><strong>Patient:</strong> {rx.patient_name} ({rx.patient_id})</div>
                    <div><strong>Doctor:</strong> {rx.doctor_name} ({rx.department})</div>
                    <div><strong>Date:</strong> {rx.date}</div>
                  </div>

                  <div className="border-t pt-2 space-y-1">
                    <span className="font-bold text-[11px] text-slate-800 block">Prescribed Medicines:</span>
                    {rx.medicines.map((m, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border text-[11px]">
                        <span>{m.medicine_name} ({m.strength}) — Req: {m.required_qty}</span>
                        <span className={m.available_qty >= m.required_qty ? 'text-emerald-600 font-bold' : 'text-red-600 font-bold'}>
                          {m.available_qty >= m.required_qty ? `🟢 Available (${m.available_qty})` : `🔴 Insufficient (${m.available_qty})`}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-between items-center">
                    <button
                      onClick={() => handleDownloadPrescriptionPDF(rx)}
                      className="rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 font-bold flex items-center space-x-1 border"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>PDF</span>
                    </button>

                    {rx.status !== 'Dispensed' ? (
                      <button
                        onClick={() => handleConfirmDispensing(rx)}
                        className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white px-4 py-1.5 font-bold shadow-xs"
                      >
                        [ DISPENSE &amp; DEDUCT STOCK ]
                      </button>
                    ) : (
                      <span className="text-emerald-600 font-bold text-xs">✓ Dispensed &amp; Billed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. DISPENSING WORKFLOW VIEW (Section 5 Requirement) */}
      {/* ============================================================ */}
      {activeTab === 'dispensing' && (
        <div className="max-w-3xl mx-auto rounded-3xl border border-slate-200 bg-white p-8 shadow-md space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <ShoppingBag className="h-6 w-6 text-teal-600" />
              <span>PHARMACY DISPENSING DESK</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select verified prescription ➔ Check stock quantity ➔ Confirm dispensing &amp; auto-deduct stock
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {prescriptions.filter(p => p.status !== 'Dispensed').map(rx => (
              <div key={rx.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="font-bold text-sm text-slate-900">
                    Token: <span className="font-mono text-teal-700">{rx.token_no}</span> — {rx.patient_name} ({rx.patient_id})
                  </div>
                  <span className="text-slate-500 font-semibold">{rx.doctor_name}</span>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-slate-800 block text-xs">Medicine Availability Checklist:</span>
                  {rx.medicines.map((m, i) => (
                    <div key={i} className="flex items-center justify-between bg-white p-2.5 rounded-xl border text-xs font-semibold">
                      <div>
                        <span className="text-slate-900 font-bold block">{m.medicine_name} {m.strength}</span>
                        <span className="text-[10px] text-slate-400">Dose: {m.frequency} ({m.duration})</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-slate-700">Req: <strong>{m.required_qty}</strong> | In Stock: <strong>{m.available_qty}</strong></span>
                        <span className={m.available_qty >= m.required_qty ? 'text-emerald-600 font-bold text-[10px]' : 'text-red-600 font-bold text-[10px]'}>
                          {m.available_qty >= m.required_qty ? '✓ Stock Sufficient' : '🔴 Insufficient Stock'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-between items-center border-t">
                  <span className="font-bold text-slate-900 text-xs">Total Bill Amount: ${rx.total_amount}</span>
                  <button
                    onClick={() => handleConfirmDispensing(rx)}
                    className="rounded-2xl bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 font-extrabold text-xs shadow-md transition-all uppercase"
                  >
                    [ CONFIRM DISPENSING ]
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. MEDICINE INVENTORY VIEW (Section 6 & 7 Requirement) */}
      {/* ============================================================ */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Pill className="h-5 w-5 text-teal-600" />
                  <span>PHARMACY MEDICINE INVENTORY CATALOG</span>
                </h2>
                <p className="text-xs text-slate-500">Live drug stock, batch numbers, expiration dates, and reorder levels</p>
              </div>

              <button
                onClick={() => setShowAddMedModal(true)}
                className="flex items-center space-x-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 text-xs font-bold transition-all shadow-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Medicine</span>
              </button>
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-3 text-xs">
              <span className="text-slate-500 font-medium">Filter Form:</span>
              {['ALL', 'Tablet', 'Capsule', 'Syrup', 'Injection'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilterForm(f)}
                  className={`px-3 py-1 rounded-xl font-bold transition-all ${
                    filterForm === f ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto custom-scrollbar border border-slate-100 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] border-b">
                    <th className="p-3">Medicine Name</th>
                    <th className="p-3">Generic Name</th>
                    <th className="p-3">Strength &amp; Form</th>
                    <th className="p-3">Batch No</th>
                    <th className="p-3">Available Stock</th>
                    <th className="p-3">Expiry Date</th>
                    <th className="p-3">Selling Price</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {filteredInventory.map(m => (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{m.name}</td>
                      <td className="p-3 text-slate-500 italic">{m.generic_name}</td>
                      <td className="p-3 text-slate-700">{m.strength} ({m.form})</td>
                      <td className="p-3 font-mono font-bold text-teal-700">{m.batch_number}</td>
                      <td className="p-3 font-bold">
                        <span className={m.stock_quantity <= m.reorder_level ? 'text-red-600' : 'text-slate-900'}>
                          {m.stock_quantity} units
                        </span>
                      </td>
                      <td className="p-3 text-slate-700">{m.expiry_date}</td>
                      <td className="p-3 font-bold text-emerald-700">${m.selling_price.toFixed(2)}</td>
                      <td className="p-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                          m.status === 'Low Stock' ? 'bg-red-50 text-red-700 border-red-200' :
                          m.status === 'Expiring Soon' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. LOW STOCK ALERTS (Section 8 Requirement) */}
      {/* ============================================================ */}
      {activeTab === 'low-stock' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 max-w-3xl mx-auto">
          <div className="border-b pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span>⚠️ LOW STOCK INVENTORY REORDER ALERTS</span>
              </h2>
              <p className="text-xs text-slate-500">Medicines below configured safety reorder thresholds</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {inventory.filter(m => m.stock_quantity <= m.reorder_level).map(m => (
              <div key={m.id} className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-between text-red-950">
                <div>
                  <h4 className="font-bold text-sm text-red-900">{m.name} ({m.strength})</h4>
                  <span className="text-[11px] text-red-700">Generic: {m.generic_name} • Batch: {m.batch_number}</span>
                </div>
                <div className="text-right">
                  <span className="block font-bold text-sm text-red-900">Current Stock: {m.stock_quantity} units</span>
                  <span className="text-[11px] font-semibold text-red-700">Reorder Threshold: {m.reorder_level} units</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 6. EXPIRY ALERTS (Section 9 Requirement) */}
      {/* ============================================================ */}
      {activeTab === 'expiry' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 max-w-3xl mx-auto">
          <div className="border-b pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <span>⏳ EXPIRING SOON MEDICINE ALERTS</span>
              </h2>
              <p className="text-xs text-slate-500">Batches approaching expiration date within 30-90 days</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {inventory.filter(m => m.status === 'Expiring Soon').map(m => (
              <div key={m.id} className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-between text-purple-950">
                <div>
                  <h4 className="font-bold text-sm text-purple-900">{m.name} ({m.strength})</h4>
                  <span className="text-[11px] text-purple-700">Batch: {m.batch_number} • Supplier: {m.supplier}</span>
                </div>
                <div className="text-right">
                  <span className="block font-bold text-sm text-purple-900">Expiry Date: {m.expiry_date}</span>
                  <span className="text-[11px] font-semibold text-purple-700">Stock Qty: {m.stock_quantity} units</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 7. PHARMACY TRANSACTIONS & BILLING (Section 10 Requirement) */}
      {/* ============================================================ */}
      {activeTab === 'transactions' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="border-b pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-teal-600" />
                <span>🧾 PHARMACY TRANSACTIONS &amp; BILLING TRANSMISSIONS</span>
              </h2>
              <p className="text-xs text-slate-500">Itemized medicine charges sent to Billing Module for final invoice generation</p>
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar border border-slate-100 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] border-b">
                  <th className="p-3">Transaction ID</th>
                  <th className="p-3">Token No</th>
                  <th className="p-3">Patient Name</th>
                  <th className="p-3">Date / Time</th>
                  <th className="p-3">Medicines Summary</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Billing Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-teal-700">{tx.transaction_id}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">{tx.token_no}</td>
                    <td className="p-3 font-bold text-slate-900">{tx.patient_name} ({tx.patient_id})</td>
                    <td className="p-3 text-slate-500">{tx.date}</td>
                    <td className="p-3 text-slate-700">{tx.medicines_summary}</td>
                    <td className="p-3 font-bold text-emerald-700">${tx.total_amount.toFixed(2)}</td>
                    <td className="p-3">
                      <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold">
                        {tx.billing_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 10. AI PHARMACY ASSISTANT VIEW */}
      {/* ============================================================ */}
      {(activeTab === 'ai-assistant' || activeTab === 'ai-cds') && (
        <AIPharmacySuggestionCard
          prescriptionId={prescriptions[0]?.token_no}
          patientName={prescriptions[0]?.patient_name}
        />
      )}

      {/* ============================================================ */}
      {/* 8. NOTIFICATIONS VIEW */}
      {/* ============================================================ */}
      {activeTab === 'notifications' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 max-w-3xl mx-auto">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Bell className="h-5 w-5 text-teal-500" />
            <span>PHARMACY ALERTS &amp; NOTIFICATIONS</span>
          </h2>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 font-bold text-amber-900">
              💊 New Prescription RX001 issued by Dr. Arjun Mehta for Aarav Sharma.
            </div>
            <div className="p-3 bg-red-50 rounded-xl border border-red-200 font-bold text-red-900">
              ⚠️ Amoxicillin 500mg stock reached low threshold (3 units remaining).
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 font-bold text-emerald-900">
              🧾 Prescription RX004 dispensed &amp; $119.00 transmitted to Billing.
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
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-white font-bold text-lg">
              AR
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Pharmacist Alex Rivera, RPh</h3>
              <span className="text-slate-500">Chief Pharmacist &amp; Dispensary Manager</span>
            </div>
          </div>

          <div className="space-y-2 text-slate-700 font-medium">
            <div><strong>Pharmacy License No:</strong> RPH-2026-9081</div>
            <div><strong>Department:</strong> Central Pharmacy &amp; Drug Dispensary</div>
            <div><strong>Authorized Scope:</strong> Prescription Verification, Stock Control, Dispensing, &amp; Billing Transmissions</div>
          </div>
        </div>
      )}

      {/* Selected Prescription Details Modal */}
      {selectedRx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl relative space-y-4 border border-slate-100 text-xs">
            <button onClick={() => setSelectedRx(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1">
              <X className="h-6 w-6" />
            </button>

            <div className="border-b pb-3 font-bold text-base text-slate-900 flex items-center justify-between">
              <span>Prescription: <span className="font-mono text-teal-700">{selectedRx.token_no}</span></span>
              <span className="text-xs bg-teal-50 text-teal-800 border border-teal-200 px-3 py-1 rounded-full font-bold">{selectedRx.status}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border text-slate-800 font-medium">
              <div><strong>Patient:</strong> {selectedRx.patient_name} ({selectedRx.patient_id})</div>
              <div><strong>Doctor:</strong> {selectedRx.doctor_name} ({selectedRx.department})</div>
              <div><strong>Date:</strong> {selectedRx.date}</div>
              <div><strong>Total Bill:</strong> ${selectedRx.total_amount}</div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-800 block text-xs">Prescribed Medicines Stock Audit:</span>
              {selectedRx.medicines.map((m, i) => (
                <div key={i} className="flex items-center justify-between bg-white p-2.5 rounded-xl border text-xs font-semibold">
                  <div>
                    <span className="text-slate-900 font-bold block">{m.medicine_name} {m.strength}</span>
                    <span className="text-[10px] text-slate-400">Schedule: {m.frequency} for {m.duration}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-slate-700">Required: <strong>{m.required_qty}</strong> | In Stock: <strong>{m.available_qty}</strong></span>
                    <span className={m.available_qty >= m.required_qty ? 'text-emerald-600 font-bold text-[10px]' : 'text-red-600 font-bold text-[10px]'}>
                      {m.available_qty >= m.required_qty ? '🟢 Available' : '🔴 Insufficient Stock'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t flex justify-between items-center">
              <button onClick={() => handleDownloadPrescriptionPDF(selectedRx)} className="rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 font-bold flex items-center space-x-1 border">
                <Download className="h-4 w-4 text-teal-600" />
                <span>Download Prescription PDF</span>
              </button>

              {selectedRx.status !== 'Dispensed' ? (
                <button onClick={() => handleConfirmDispensing(selectedRx)} className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 font-bold shadow-md uppercase">
                  [ CONFIRM DISPENSING ]
                </button>
              ) : (
                <span className="text-emerald-600 font-bold">✓ Dispensed &amp; Billed</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add New Medicine Modal */}
      {showAddMedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl relative space-y-4 border border-slate-100 text-xs">
            <button onClick={() => setShowAddMedModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1">
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-bold text-base text-slate-900 border-b pb-3 flex items-center space-x-2">
              <Pill className="h-5 w-5 text-teal-600" />
              <span>ADD NEW MEDICINE TO INVENTORY</span>
            </h3>

            <form onSubmit={handleAddNewMedicine} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Medicine Brand Name</label>
                <input type="text" required value={newMedName} onChange={(e) => setNewMedName(e.target.value)} placeholder="e.g. Paracetamol 500mg" className="w-full rounded-xl border p-2 text-slate-900 focus:outline-none" />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Generic Name</label>
                <input type="text" value={newGenericName} onChange={(e) => setNewGenericName(e.target.value)} placeholder="e.g. Acetaminophen" className="w-full rounded-xl border p-2 text-slate-900 focus:outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Strength</label>
                  <input type="text" value={newStrength} onChange={(e) => setNewStrength(e.target.value)} placeholder="500 mg" className="w-full rounded-xl border p-2 text-slate-900 focus:outline-none" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Form</label>
                  <select value={newForm} onChange={(e) => setNewForm(e.target.value as any)} className="w-full rounded-xl border p-2 text-slate-900 focus:outline-none">
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                    <option value="Ointment">Ointment</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Batch Number</label>
                  <input type="text" value={newBatchNo} onChange={(e) => setNewBatchNo(e.target.value)} className="w-full rounded-xl border p-2 text-slate-900 focus:outline-none font-mono font-bold" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Quantity</label>
                  <input type="number" value={newStockQty} onChange={(e) => setNewStockQty(Number(e.target.value))} className="w-full rounded-xl border p-2 text-slate-900 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Selling Price ($)</label>
                  <input type="number" step="0.5" value={newPrice} onChange={(e) => setNewPrice(Number(e.target.value))} className="w-full rounded-xl border p-2 text-slate-900 focus:outline-none" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Reorder Level</label>
                  <input type="number" value={newReorderLevel} onChange={(e) => setNewReorderLevel(Number(e.target.value))} className="w-full rounded-xl border p-2 text-slate-900 focus:outline-none" />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setShowAddMedModal(false)} className="rounded-xl bg-slate-100 px-4 py-2 font-bold text-slate-600">Cancel</button>
                <button type="submit" className="rounded-xl bg-teal-600 text-white px-5 py-2 font-bold shadow-md">Add Medicine</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyModule;
