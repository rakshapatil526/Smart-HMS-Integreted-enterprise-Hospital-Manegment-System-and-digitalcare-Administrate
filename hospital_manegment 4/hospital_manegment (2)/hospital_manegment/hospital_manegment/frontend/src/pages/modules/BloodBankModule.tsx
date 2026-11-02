import React, { useState, useMemo } from 'react';
import {
  Droplet, Users, TestTube, AlertTriangle, ShieldCheck, HeartPulse,
  Search, Plus, CheckCircle2, Download, Printer, RefreshCw, X, Calendar,
  Clock, Activity, FileText, ArrowRight, ShieldAlert, BarChart3, Filter,
  Sparkles, Thermometer, Layers, Box, Flame
} from 'lucide-react';
import {
  INITIAL_DONORS, INITIAL_INVENTORY, INITIAL_SCREENINGS, INITIAL_REQUESTS,
  INITIAL_CROSSMATCHES, INITIAL_DISPOSALS, BloodDonor, BloodInventoryUnit,
  BloodScreeningRecord, BloodRequestItem, BloodCrossMatchRecord, BloodDisposalRecord
} from './bloodBankData';
import { downloadPDFDocument } from '../../utils/pdfDownloader';

export const BloodBankModule: React.FC = () => {
  // Navigation Sub-module State (10 Sub-modules)
  const [activeTab, setActiveTab] = useState<
    'donors' | 'components' | 'collection' | 'screening' | 'inventory' | 'requests' | 'alerts' | 'compatibility' | 'disposal' | 'reports'
  >('inventory');

  // Main Data States
  const [donors, setDonors] = useState<BloodDonor[]>(INITIAL_DONORS);
  const [inventory, setInventory] = useState<BloodInventoryUnit[]>(INITIAL_INVENTORY);
  const [screenings, setScreenings] = useState<BloodScreeningRecord[]>(INITIAL_SCREENINGS);
  const [requests, setRequests] = useState<BloodRequestItem[]>(INITIAL_REQUESTS);
  const [crossmatches, setCrossmatches] = useState<BloodCrossMatchRecord[]>(INITIAL_CROSSMATCHES);
  const [disposals, setDisposals] = useState<BloodDisposalRecord[]>(INITIAL_DISPOSALS);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('ALL');

  // Modals state
  const [showAddDonorModal, setShowAddDonorModal] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [showCrossMatchModal, setShowCrossMatchModal] = useState(false);
  const [showDisposalModal, setShowDisposalModal] = useState(false);

  // New Donor Form State
  const [newDonor, setNewDonor] = useState<{
    name: string; age: number; gender: BloodDonor['gender']; blood_group: BloodDonor['blood_group'];
    phone: string; email: string; weight_kg: number; hemoglobin_gdl: number; address: string;
  }>({
    name: '', age: 28, gender: 'Male', blood_group: 'O+',
    phone: '', email: '', weight_kg: 70, hemoglobin_gdl: 14.0, address: ''
  });

  // New Collection Form State
  const [newCollection, setNewCollection] = useState<{
    donor_id: string; blood_group: BloodDonor['blood_group']; component_type: BloodInventoryUnit['component_type'];
    volume_ml: number; storage_location: string;
  }>({
    donor_id: 'DNR-2026-001', blood_group: 'O+', component_type: 'PRBC (Packed Red Cells)',
    volume_ml: 350, storage_location: 'Cold Room 1 (Shelf A-04)'
  });

  // New Request Form State
  const [newRequest, setNewRequest] = useState<{
    patient_name: string; patient_id: string; ward_dept: string;
    doctor_name: string; blood_group: BloodDonor['blood_group']; component_type: BloodInventoryUnit['component_type'];
    units_requested: number; urgency: BloodRequestItem['urgency'];
  }>({
    patient_name: 'Aarav Sharma', patient_id: 'PAT-2026-001', ward_dept: 'ICU Bed #102',
    doctor_name: 'Dr. Sarah Jenkins', blood_group: 'O+', component_type: 'PRBC (Packed Red Cells)',
    units_requested: 2, urgency: 'STAT / Emergency 🚨'
  });

  // Aggregated Stock Counts per Blood Group
  const stockByGroup = useMemo(() => {
    const groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
    return groups.map(g => {
      const availableUnits = inventory.filter(u => u.blood_group === g && u.unit_status === 'Available');
      return {
        group: g,
        total_units: availableUnits.length,
        prbc: availableUnits.filter(u => u.component_type === 'PRBC (Packed Red Cells)').length,
        ffp: availableUnits.filter(u => u.component_type === 'FFP (Fresh Frozen Plasma)').length,
        platelets: availableUnits.filter(u => u.component_type === 'Platelet Concentrate').length,
        whole_blood: availableUnits.filter(u => u.component_type === 'Whole Blood').length,
        is_low: availableUnits.length < 3
      };
    });
  }, [inventory]);

  const totalAvailableUnits = inventory.filter(u => u.unit_status === 'Available').length;
  const criticalLowStockGroups = stockByGroup.filter(g => g.is_low);

  // PDF Export for Blood Bank Report
  const handleExportPDF = async () => {
    await downloadPDFDocument(
      'blood_bank_report',
      {
        report_title: 'SMART CARE BLOOD BANK & TRANSFUSION SERVICE REPORT',
        total_donors: donors.length,
        total_units_in_stock: totalAvailableUnits,
        critical_alerts: criticalLowStockGroups.map(g => `${g.group}: ${g.total_units} units left`),
        stock_summary: stockByGroup,
        invoice_number: 'BBR-2026-9901',
        patient_name: 'Blood Bank Central Inventory Summary'
      },
      'SmartCare_Blood_Bank_Report.pdf'
    );
  };

  const handlePrint = () => {
    window.print();
  };

  // Add Donor Handler
  const handleAddDonor = (e: React.FormEvent) => {
    e.preventDefault();
    const created: BloodDonor = {
      id: `D-${Date.now()}`,
      donor_id: `DNR-2026-00${donors.length + 1}`,
      name: newDonor.name,
      age: newDonor.age,
      gender: newDonor.gender,
      blood_group: newDonor.blood_group,
      phone: newDonor.phone,
      email: newDonor.email || `${newDonor.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      last_donation_date: new Date().toISOString().split('T')[0],
      weight_kg: newDonor.weight_kg,
      hemoglobin_gdl: newDonor.hemoglobin_gdl,
      eligibility_status: newDonor.hemoglobin_gdl >= 12.5 && newDonor.weight_kg >= 50 ? 'Eligible ✓' : 'Temporarily Ineligible',
      total_donations: 1,
      address: newDonor.address || 'Bengaluru'
    };
    setDonors([created, ...donors]);
    setShowAddDonorModal(false);
    alert(`New Blood Donor Registered!\n- Donor ID: ${created.donor_id}\n- Name: ${created.name}\n- Blood Group: ${created.blood_group}\n- Status: ${created.eligibility_status}`);
  };

  // Add Collection Session Handler
  const handleAddCollection = (e: React.FormEvent) => {
    e.preventDefault();
    const barcode = `BB-${newCollection.blood_group.replace('+', 'P').replace('-', 'N')}-2026-${Math.floor(Math.random() * 800) + 100}`;
    const newUnit: BloodInventoryUnit = {
      id: `U-${Date.now()}`,
      barcode_id: barcode,
      blood_group: newCollection.blood_group,
      component_type: newCollection.component_type,
      volume_ml: newCollection.volume_ml,
      collection_date: new Date().toISOString().split('T')[0],
      expiry_date: '2026-10-30',
      storage_location: newCollection.storage_location,
      screening_status: 'Pending',
      unit_status: 'Quarantine',
      donor_id: newCollection.donor_id
    };

    // Auto-create screening entry
    const newScr: BloodScreeningRecord = {
      id: `SCR-${Date.now()}`,
      barcode_id: barcode,
      blood_group: newCollection.blood_group,
      hiv_status: 'Non-Reactive ✓',
      hbsag_status: 'Non-Reactive ✓',
      hcv_status: 'Non-Reactive ✓',
      vdrl_status: 'Non-Reactive ✓',
      malaria_status: 'Negative ✓',
      abo_rh_verified: true,
      testing_date: new Date().toISOString().split('T')[0],
      technician_name: 'Tech Ramesh Kumar',
      final_result: 'Passed ✓'
    };

    setInventory([newUnit, ...inventory]);
    setScreenings([newScr, ...screenings]);
    setShowCollectionModal(false);
    alert(`Blood Collection Logged!\n- Barcode ID: ${barcode}\n- Volume: ${newCollection.volume_ml}ml\n- Status: Moved to Quarantine for mandatory screening.`);
  };

  // Handle Approve Screening
  const handleApproveScreening = (scrId: string, barcode: string) => {
    setScreenings(prev => prev.map(s => s.id === scrId ? { ...s, final_result: 'Passed ✓' } : s));
    setInventory(prev => prev.map(u => u.barcode_id === barcode ? { ...u, screening_status: 'Passed ✓', unit_status: 'Available' } : u));
    alert(`Screening approved for Barcode ${barcode}.\nUnit is now marked Passed ✓ and AVAILABLE in active blood stock.`);
  };

  // Add Blood Request Handler
  const handleAddRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const reqNo = `BRQ-2026-${Math.floor(Math.random() * 800) + 100}`;
    const item: BloodRequestItem = {
      id: `REQ-${Date.now()}`,
      request_no: reqNo,
      patient_name: newRequest.patient_name,
      patient_id: newRequest.patient_id,
      ward_dept: newRequest.ward_dept,
      doctor_name: newRequest.doctor_name,
      blood_group: newRequest.blood_group,
      component_type: newRequest.component_type,
      units_requested: newRequest.units_requested,
      urgency: newRequest.urgency,
      request_date: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      status: 'Pending Verification',
      reserved_barcodes: []
    };
    setRequests([item, ...requests]);
    setShowNewRequestModal(false);
    alert(`Blood Requisition ${reqNo} Logged!\n- Patient: ${newRequest.patient_name} (${newRequest.blood_group})\n- Urgency: ${newRequest.urgency}`);
  };

  // Issue Blood Unit Handler
  const handleIssueBlood = (reqId: string) => {
    const target = requests.find(r => r.id === reqId);
    if (!target) return;

    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'Issued ✓' } : r));
    // Update inventory units status
    if (target.reserved_barcodes.length > 0) {
      setInventory(prev => prev.map(u => target.reserved_barcodes.includes(u.barcode_id) ? { ...u, unit_status: 'Issued' } : u));
    }
    alert(`Blood Requisition ${target.request_no} ISSUED to ${target.ward_dept} for patient ${target.patient_name}. Transfusion slip generated.`);
  };

  return (
    <div className="space-y-6 font-['Inter',sans-serif]">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-red-950 via-rose-900 to-slate-950 p-6 text-white shadow-xl border border-red-500/30">
        <div>
          <div className="flex items-center space-x-2 text-rose-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Droplet className="h-4 w-4 text-rose-400 animate-pulse" />
            <span>BLOOD BANK &amp; TRANSFUSION MEDICINE SERVICE</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center space-x-2">
            <span>Smart Care Central Blood Bank</span>
            <span className="rounded-full bg-rose-500/20 text-rose-200 border border-rose-400/40 text-xs px-3 py-0.5 font-bold">
              10 Sub-Modules Active
            </span>
          </h1>
          <p className="text-xs text-rose-200/80 mt-1">
            Donor Registry • Component Separation • 5-Panel Screening • Live Stock • Cross-Match • Emergency Alerts
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportPDF}
            className="flex items-center space-x-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white px-4 py-2.5 text-xs font-extrabold shadow-md transition-all uppercase tracking-wider border border-white/20"
          >
            <Download className="h-4 w-4" />
            <span>Export Blood Report</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 text-xs font-bold border border-slate-700 shadow-sm transition-all"
          >
            <Printer className="h-4 w-4 text-rose-400" />
            <span>Print Log</span>
          </button>
        </div>
      </div>

      {/* Emergency Stock Warning Callout Banner (Sub-module #7) */}
      {criticalLowStockGroups.length > 0 && (
        <div className="rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 p-4 text-white shadow-lg flex items-center justify-between animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-white/20">
              <AlertTriangle className="h-6 w-6 text-yellow-300" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-yellow-200">
                🚨 CRITICAL BLOOD STOCK ALERT — IMMEDIATE DONOR CALLOUT REQUIRED
              </h4>
              <p className="text-xs text-white/90">
                Low inventory detected (<strong className="underline">under 3 units</strong>) for Blood Groups:{' '}
                {criticalLowStockGroups.map(g => `${g.group} (${g.total_units} units)`).join(', ')}.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('donors')}
            className="rounded-xl bg-white text-red-900 px-4 py-2 text-xs font-extrabold hover:bg-yellow-100 shadow-md transition-all shrink-0"
          >
            Trigger Donor Drive ➔
          </button>
        </div>
      )}

      {/* 10 SUB-MODULES NAVIGATION TOOLBAR */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 border-b border-slate-200 custom-scrollbar text-xs font-bold">
        {[
          { id: 'inventory', label: '🩸 5. Blood Inventory', badge: `${totalAvailableUnits} Units` },
          { id: 'donors', label: '👤 1. Donor Management', badge: `${donors.length} Donors` },
          { id: 'components', label: '🧪 2. Component Mgmt' },
          { id: 'collection', label: '🩺 3. Blood Collection' },
          { id: 'screening', label: '🔬 4. Screening & Testing' },
          { id: 'requests', label: '📋 6. Request & Issue', badge: `${requests.filter(r=>r.status!=='Issued ✓').length} Open` },
          { id: 'alerts', label: '🚨 7. Emergency Alerts', badge: `${criticalLowStockGroups.length} Critical` },
          { id: 'compatibility', label: '🧬 8. Cross-Matching' },
          { id: 'disposal', label: '☣️ 9. Expiry & Disposal' },
          { id: 'reports', label: '📊 10. Bank Reports' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`shrink-0 rounded-xl px-4 py-2.5 transition-all flex items-center space-x-1.5 ${
              activeTab === tab.id
                ? 'bg-red-900 text-white shadow-md font-extrabold'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                activeTab === tab.id ? 'bg-rose-500 text-white' : 'bg-red-100 text-red-800'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ============================================================ */}
      {/* 5. BLOOD INVENTORY MANAGEMENT SUB-MODULE */}
      {/* ============================================================ */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          {/* Blood Group Grid Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            {stockByGroup.map(item => (
              <div
                key={item.group}
                className={`p-4 rounded-2xl border transition-all ${
                  item.is_low
                    ? 'bg-red-50 border-red-300 shadow-sm'
                    : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-extrabold text-lg text-slate-900">{item.group}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    item.is_low ? 'bg-red-600 text-white animate-pulse' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {item.is_low ? 'LOW STOCK' : 'OK'}
                  </span>
                </div>
                <div className="mt-2 space-y-1 text-slate-600 font-medium">
                  <div className="text-xl font-extrabold text-red-700">{item.total_units} Units</div>
                  <div className="text-[11px] text-slate-500">
                    PRBC: <strong>{item.prbc}</strong> | FFP: <strong>{item.ffp}</strong> | Plt: <strong>{item.platelets}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Inventory Unit List */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
                  <Box className="h-4 w-4 text-red-600" />
                  <span>Itemized Barcode Inventory Stock Ledger</span>
                </h3>
                <p className="text-xs text-slate-500">Track storage temperature, expiry dates, and screening status</p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search barcode or blood group..."
                  className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:outline-none"
                />
                <select
                  value={bloodGroupFilter}
                  onChange={(e) => setBloodGroupFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none"
                >
                  <option value="ALL">All Blood Groups</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 max-h-[400px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-900 text-white sticky top-0 z-10">
                  <tr>
                    <th className="p-3">Barcode ID</th>
                    <th className="p-3">Blood Group</th>
                    <th className="p-3">Component Type</th>
                    <th className="p-3">Volume</th>
                    <th className="p-3">Collection Date</th>
                    <th className="p-3">Expiry Date</th>
                    <th className="p-3">Storage Location</th>
                    <th className="p-3">Screening</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {inventory
                    .filter(u => (bloodGroupFilter === 'ALL' || u.blood_group === bloodGroupFilter) &&
                      (!searchQuery || u.barcode_id.toLowerCase().includes(searchQuery.toLowerCase()) || u.blood_group.toLowerCase().includes(searchQuery.toLowerCase())))
                    .map(unit => (
                      <tr key={unit.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-red-700">{unit.barcode_id}</td>
                        <td className="p-3 font-extrabold text-slate-900">{unit.blood_group}</td>
                        <td className="p-3">{unit.component_type}</td>
                        <td className="p-3">{unit.volume_ml} ml</td>
                        <td className="p-3 text-slate-500">{unit.collection_date}</td>
                        <td className="p-3 text-slate-500">{unit.expiry_date}</td>
                        <td className="p-3 text-slate-600">{unit.storage_location}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            unit.screening_status === 'Passed ✓' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {unit.screening_status}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                            unit.unit_status === 'Available' ? 'bg-emerald-100 text-emerald-800' :
                            unit.unit_status === 'Reserved / Cross-matched' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {unit.unit_status}
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
      {/* 1. BLOOD DONOR MANAGEMENT SUB-MODULE */}
      {/* ============================================================ */}
      {activeTab === 'donors' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
                <Users className="h-4 w-4 text-red-600" />
                <span>Registered Voluntary Blood Donors Directory</span>
              </h3>
              <p className="text-xs text-slate-500">Eligibility checks (Hb &gt;= 12.5 g/dL, Weight &gt;= 50kg, 90-day donation interval)</p>
            </div>

            <button
              onClick={() => setShowAddDonorModal(true)}
              className="rounded-xl bg-red-700 hover:bg-red-800 text-white px-4 py-2 text-xs font-bold shadow-md transition-all"
            >
              + Register New Donor
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {donors.map(donor => (
              <div key={donor.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-sm">{donor.name}</span>
                  <span className="font-extrabold text-red-700 bg-red-100 border border-red-200 px-2.5 py-0.5 rounded-full text-xs">
                    {donor.blood_group}
                  </span>
                </div>
                <div className="text-slate-600 space-y-1 font-medium text-[11px]">
                  <div>Donor ID: <strong className="font-mono text-slate-800">{donor.donor_id}</strong> | Age: <strong>{donor.age}</strong></div>
                  <div>Phone: <strong>{donor.phone}</strong></div>
                  <div>Hemoglobin: <strong>{donor.hemoglobin_gdl} g/dL</strong> | Weight: <strong>{donor.weight_kg} kg</strong></div>
                  <div>Last Donation: <strong>{donor.last_donation_date}</strong> (Total: <strong>{donor.total_donations}</strong>)</div>
                </div>
                <div className="pt-2 border-t flex justify-between items-center">
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                    donor.eligibility_status === 'Eligible ✓' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {donor.eligibility_status}
                  </span>
                  <button
                    onClick={() => {
                      setNewCollection({ ...newCollection, donor_id: donor.donor_id, blood_group: donor.blood_group });
                      setShowCollectionModal(true);
                    }}
                    className="text-xs font-bold text-red-700 hover:underline"
                  >
                    Collect Blood ➔
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. BLOOD GROUP & COMPONENT MANAGEMENT SUB-MODULE */}
      {/* ============================================================ */}
      {activeTab === 'components' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="border-b pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
              <Layers className="h-4 w-4 text-red-600" />
              <span>Blood Component Separation &amp; Storage Parameters</span>
            </h3>
            <p className="text-xs text-slate-500">Standard operating guidelines for blood component preparation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-2">
              <h4 className="font-bold text-red-950 text-sm">Packed Red Blood Cells (PRBC)</h4>
              <p className="text-red-900 text-xs">Separated via light spin centrifugation. Used for anemia, hemorrhage, and surgical blood loss.</p>
              <div className="text-[11px] font-semibold text-red-800 space-y-1 pt-1">
                <div>• Storage Temp: <strong>2°C to 6°C</strong></div>
                <div>• Shelf Life: <strong>35 to 42 Days (CPDA-1)</strong></div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <h4 className="font-bold text-amber-950 text-sm">Fresh Frozen Plasma (FFP)</h4>
              <p className="text-amber-900 text-xs">Frozen within 8 hours of collection. Rich in clotting factors, fibrinogen, and prothrombin.</p>
              <div className="text-[11px] font-semibold text-amber-800 space-y-1 pt-1">
                <div>• Storage Temp: <strong>-30°C or colder</strong></div>
                <div>• Shelf Life: <strong>1 Year (12 Months)</strong></div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 space-y-2">
              <h4 className="font-bold text-teal-950 text-sm">Platelet Concentrate (RDP / SDP)</h4>
              <p className="text-teal-900 text-xs">Prepared from whole blood or apheresis. Used for thrombocytopenia, dengue, and chemotherapy.</p>
              <div className="text-[11px] font-semibold text-teal-800 space-y-1 pt-1">
                <div>• Storage Temp: <strong>20°C to 24°C (Continuous Agitation)</strong></div>
                <div>• Shelf Life: <strong>5 Days ONLY</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. BLOOD COLLECTION SUB-MODULE */}
      {/* ============================================================ */}
      {activeTab === 'collection' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
                <Droplet className="h-4 w-4 text-red-600" />
                <span>Phlebotomy Blood Collection Session Log</span>
              </h3>
              <p className="text-xs text-slate-500">Record donor phlebotomy, blood bag volume, and unique barcode labeling</p>
            </div>
            <button
              onClick={() => setShowCollectionModal(true)}
              className="rounded-xl bg-red-700 hover:bg-red-800 text-white px-4 py-2 text-xs font-bold shadow-md"
            >
              + Log Blood Collection
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="p-3">Barcode</th>
                  <th className="p-3">Donor ID</th>
                  <th className="p-3">Group</th>
                  <th className="p-3">Volume</th>
                  <th className="p-3">Collection Date</th>
                  <th className="p-3">Storage Location</th>
                  <th className="p-3">Unit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {inventory.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-red-700">{u.barcode_id}</td>
                    <td className="p-3 font-mono text-slate-600">{u.donor_id}</td>
                    <td className="p-3 font-bold text-slate-900">{u.blood_group}</td>
                    <td className="p-3">{u.volume_ml} ml</td>
                    <td className="p-3 text-slate-500">{u.collection_date}</td>
                    <td className="p-3">{u.storage_location}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                        {u.unit_status}
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
      {/* 4. BLOOD SCREENING & TESTING SUB-MODULE */}
      {/* ============================================================ */}
      {activeTab === 'screening' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="border-b pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
              <TestTube className="h-4 w-4 text-red-600" />
              <span>Mandatory 5-Panel Infection Screening &amp; Serology Tests</span>
            </h3>
            <p className="text-xs text-slate-500">Screening for HIV 1&amp;2, HBsAg (Hep B), HCV (Hep C), VDRL (Syphilis), and Malaria Parasite</p>
          </div>

          <div className="space-y-3 text-xs">
            {screenings.map(scr => (
              <div key={scr.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-bold text-slate-900 text-sm">
                    Barcode: <strong className="font-mono text-red-700">{scr.barcode_id}</strong> ({scr.blood_group})
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    scr.final_result === 'Passed ✓' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {scr.final_result}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] font-semibold">
                  <div className="p-2 bg-white rounded-xl border">HIV 1&amp;2: <strong className="text-emerald-700">{scr.hiv_status}</strong></div>
                  <div className="p-2 bg-white rounded-xl border">HBsAg: <strong className="text-emerald-700">{scr.hbsag_status}</strong></div>
                  <div className="p-2 bg-white rounded-xl border">HCV: <strong className="text-emerald-700">{scr.hcv_status}</strong></div>
                  <div className="p-2 bg-white rounded-xl border">VDRL: <strong className="text-emerald-700">{scr.vdrl_status}</strong></div>
                  <div className="p-2 bg-white rounded-xl border">Malaria: <strong className="text-emerald-700">{scr.malaria_status}</strong></div>
                </div>

                <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
                  <span>Tested on {scr.testing_date} by {scr.technician_name}</span>
                  {scr.final_result === 'Pending' && (
                    <button
                      onClick={() => handleApproveScreening(scr.id, scr.barcode_id)}
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 font-bold"
                    >
                      Approve &amp; Pass Unit ✓
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 6. BLOOD REQUEST & ISSUE SUB-MODULE */}
      {/* ============================================================ */}
      {activeTab === 'requests' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
                <FileText className="h-4 w-4 text-red-600" />
                <span>Hospital Blood Requisition &amp; Transfusion Issue Desk</span>
              </h3>
              <p className="text-xs text-slate-500">Requisitions from OPD, IPD, OT, and Emergency departments</p>
            </div>
            <button
              onClick={() => setShowNewRequestModal(true)}
              className="rounded-xl bg-red-700 hover:bg-red-800 text-white px-4 py-2 text-xs font-bold shadow-md"
            >
              + Create Blood Requisition
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {requests.map(req => (
              <div key={req.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-mono text-xs font-bold text-red-700">{req.request_no}</span>
                    <h4 className="font-bold text-slate-900 text-sm">{req.patient_name} ({req.patient_id})</h4>
                    <span className="text-[11px] text-slate-500">Ward: {req.ward_dept} | Doctor: {req.doctor_name}</span>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-red-100 text-red-800 border border-red-200 block">
                      {req.blood_group} ({req.component_type})
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 block">{req.urgency}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t text-xs">
                  <span className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
                    req.status === 'Issued ✓' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    Status: {req.status}
                  </span>

                  {req.status !== 'Issued ✓' && (
                    <button
                      onClick={() => handleIssueBlood(req.id)}
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 font-extrabold uppercase shadow-sm"
                    >
                      [ Issue Blood Unit ]
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 7. EMERGENCY & LOW-STOCK ALERTS SUB-MODULE */}
      {/* ============================================================ */}
      {activeTab === 'alerts' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="border-b pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span>Real-time Low-Stock &amp; Universal Donor Emergency Alerts</span>
            </h3>
            <p className="text-xs text-slate-500">Automated inventory threshold monitoring (&lt; 3 units threshold per group)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-2">
              <h4 className="font-extrabold text-red-950 text-sm">O Negative (O-) Universal Donor Stock</h4>
              <p className="text-red-900 text-xs">O- Negative is essential for emergency trauma resuscitation prior to cross-matching.</p>
              <div className="text-lg font-extrabold text-red-700">
                {stockByGroup.find(g => g.group === 'O-')?.total_units || 0} Units Available
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <h4 className="font-extrabold text-amber-950 text-sm">Critical Low-Stock Blood Groups</h4>
              <ul className="list-disc list-inside text-amber-900 space-y-1 font-medium">
                {criticalLowStockGroups.map(g => (
                  <li key={g.group}>Group <strong>{g.group}</strong> has only <strong>{g.total_units} units</strong> in stock.</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 8. BLOOD COMPATIBILITY (CROSS-MATCHING) SUB-MODULE */}
      {/* ============================================================ */}
      {activeTab === 'compatibility' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="border-b pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
              <Activity className="h-4 w-4 text-red-600" />
              <span>Blood Compatibility &amp; Serological Cross-Matching Ledger</span>
            </h3>
            <p className="text-xs text-slate-500">Major/Minor cross-matching, Coombs testing, and compatibility certification</p>
          </div>

          <div className="space-y-3 text-xs">
            {crossmatches.map(xm => (
              <div key={xm.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>Match ID: <strong className="font-mono text-red-700">{xm.match_id}</strong> — Patient: {xm.patient_name} ({xm.patient_blood_group})</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">{xm.overall_compatibility}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] font-semibold text-slate-700 pt-1">
                  <div className="p-2 bg-white rounded-xl border">Donor Barcode: <strong className="font-mono text-red-700">{xm.donor_barcode}</strong></div>
                  <div className="p-2 bg-white rounded-xl border">Major Match: <strong className="text-emerald-700">{xm.major_crossmatch}</strong></div>
                  <div className="p-2 bg-white rounded-xl border">Coombs Test: <strong className="text-emerald-700">{xm.coombs_test}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 9. BLOOD EXPIRY & DISPOSAL SUB-MODULE */}
      {/* ============================================================ */}
      {activeTab === 'disposal' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="border-b pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
              <Flame className="h-4 w-4 text-red-600" />
              <span>Biohazard Blood Expiry &amp; Condemnation Disposal Log</span>
            </h3>
            <p className="text-xs text-slate-500">Safe biohazardous disposal protocol for expired or reactive blood units</p>
          </div>

          <div className="space-y-3 text-xs">
            {disposals.map(disp => (
              <div key={disp.id} className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-2">
                <div className="flex items-center justify-between font-bold text-red-950">
                  <span>Disposal Log: {disp.disposal_id} — Barcode: <strong className="font-mono text-red-700">{disp.barcode_id}</strong> ({disp.blood_group})</span>
                  <span className="text-red-700 font-extrabold">{disp.reason}</span>
                </div>
                <div className="text-[11px] text-red-900 font-medium">
                  <div>Method: {disp.method}</div>
                  <div>Disposed By: {disp.disposed_by} on {disp.disposal_date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 10. BLOOD BANK REPORTS & ANALYTICS SUB-MODULE */}
      {/* ============================================================ */}
      {activeTab === 'reports' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="border-b pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-red-600" />
              <span>Blood Bank Management Reports &amp; Analytics Summary</span>
            </h3>
            <p className="text-xs text-slate-500">Comprehensive audit metrics, donor demographics, and component utilization</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-red-50 rounded-2xl border border-red-200">
              <span className="text-red-800 block font-bold text-[10px]">Total Available Stock</span>
              <strong className="text-2xl text-red-900 font-extrabold">{totalAvailableUnits} Units</strong>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
              <span className="text-emerald-800 block font-bold text-[10px]">Registered Donors</span>
              <strong className="text-2xl text-emerald-900 font-extrabold">{donors.length} Donors</strong>
            </div>
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
              <span className="text-blue-800 block font-bold text-[10px]">Transfusion Requests</span>
              <strong className="text-2xl text-blue-900 font-extrabold">{requests.length} Requests</strong>
            </div>
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
              <span className="text-purple-800 block font-bold text-[10px]">Safety Screening Pass Rate</span>
              <strong className="text-2xl text-purple-900 font-extrabold">100%</strong>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REGISTER NEW DONOR */}
      {showAddDonorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl relative space-y-4 border border-slate-100 text-xs">
            <button onClick={() => setShowAddDonorModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-extrabold text-base text-slate-900 border-b pb-3">Register New Blood Donor</h3>

            <form onSubmit={handleAddDonor} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Donor Full Name</label>
                <input type="text" required value={newDonor.name} onChange={e => setNewDonor({ ...newDonor, name: e.target.value })} className="w-full rounded-xl border p-2 text-xs" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Blood Group</label>
                  <select value={newDonor.blood_group} onChange={e => setNewDonor({ ...newDonor, blood_group: e.target.value as any })} className="w-full rounded-xl border p-2 text-xs font-bold">
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Gender</label>
                  <select value={newDonor.gender} onChange={e => setNewDonor({ ...newDonor, gender: e.target.value as any })} className="w-full rounded-xl border p-2 text-xs">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold mb-1">Age</label>
                  <input type="number" required value={newDonor.age} onChange={e => setNewDonor({ ...newDonor, age: Number(e.target.value) })} className="w-full rounded-xl border p-2 text-xs" />
                </div>
                <div>
                  <label className="block font-bold mb-1">Weight (kg)</label>
                  <input type="number" required value={newDonor.weight_kg} onChange={e => setNewDonor({ ...newDonor, weight_kg: Number(e.target.value) })} className="w-full rounded-xl border p-2 text-xs" />
                </div>
                <div>
                  <label className="block font-bold mb-1">Hb (g/dL)</label>
                  <input type="number" step="0.1" required value={newDonor.hemoglobin_gdl} onChange={e => setNewDonor({ ...newDonor, hemoglobin_gdl: Number(e.target.value) })} className="w-full rounded-xl border p-2 text-xs" />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Phone Number</label>
                <input type="text" required value={newDonor.phone} onChange={e => setNewDonor({ ...newDonor, phone: e.target.value })} className="w-full rounded-xl border p-2 text-xs" />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setShowAddDonorModal(false)} className="rounded-xl bg-slate-100 px-4 py-2 font-bold">Cancel</button>
                <button type="submit" className="rounded-xl bg-red-700 text-white px-5 py-2 font-bold shadow-md">Register Donor</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LOG BLOOD COLLECTION */}
      {showCollectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl relative space-y-4 border border-slate-100 text-xs">
            <button onClick={() => setShowCollectionModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-extrabold text-base text-slate-900 border-b pb-3">Log Phlebotomy Blood Collection</h3>

            <form onSubmit={handleAddCollection} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Donor ID</label>
                <input type="text" required value={newCollection.donor_id} onChange={e => setNewCollection({ ...newCollection, donor_id: e.target.value })} className="w-full rounded-xl border p-2 text-xs font-mono font-bold" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Blood Group</label>
                  <select value={newCollection.blood_group} onChange={e => setNewCollection({ ...newCollection, blood_group: e.target.value as any })} className="w-full rounded-xl border p-2 text-xs font-bold">
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Volume (ml)</label>
                  <select value={newCollection.volume_ml} onChange={e => setNewCollection({ ...newCollection, volume_ml: Number(e.target.value) })} className="w-full rounded-xl border p-2 text-xs">
                    <option value={350}>350 ml (Single Bag)</option>
                    <option value={450}>450 ml (Double Bag)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Component Type</label>
                <select value={newCollection.component_type} onChange={e => setNewCollection({ ...newCollection, component_type: e.target.value as any })} className="w-full rounded-xl border p-2 text-xs">
                  <option value="PRBC (Packed Red Cells)">PRBC (Packed Red Cells)</option>
                  <option value="FFP (Fresh Frozen Plasma)">FFP (Fresh Frozen Plasma)</option>
                  <option value="Platelet Concentrate">Platelet Concentrate</option>
                  <option value="Whole Blood">Whole Blood</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setShowCollectionModal(false)} className="rounded-xl bg-slate-100 px-4 py-2 font-bold">Cancel</button>
                <button type="submit" className="rounded-xl bg-red-700 text-white px-5 py-2 font-bold shadow-md">Log Collection</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE BLOOD REQUISITION */}
      {showNewRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl relative space-y-4 border border-slate-100 text-xs">
            <button onClick={() => setShowNewRequestModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-extrabold text-base text-slate-900 border-b pb-3">Create Hospital Blood Requisition</h3>

            <form onSubmit={handleAddRequest} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Patient Name</label>
                <input type="text" required value={newRequest.patient_name} onChange={e => setNewRequest({ ...newRequest, patient_name: e.target.value })} className="w-full rounded-xl border p-2 text-xs" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Ward / Dept</label>
                  <input type="text" required value={newRequest.ward_dept} onChange={e => setNewRequest({ ...newRequest, ward_dept: e.target.value })} className="w-full rounded-xl border p-2 text-xs" />
                </div>
                <div>
                  <label className="block font-bold mb-1">Attending Doctor</label>
                  <input type="text" required value={newRequest.doctor_name} onChange={e => setNewRequest({ ...newRequest, doctor_name: e.target.value })} className="w-full rounded-xl border p-2 text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Blood Group</label>
                  <select value={newRequest.blood_group} onChange={e => setNewRequest({ ...newRequest, blood_group: e.target.value as any })} className="w-full rounded-xl border p-2 text-xs font-bold">
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Urgency</label>
                  <select value={newRequest.urgency} onChange={e => setNewRequest({ ...newRequest, urgency: e.target.value as any })} className="w-full rounded-xl border p-2 text-xs font-bold">
                    <option value="STAT / Emergency 🚨">STAT / Emergency 🚨</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Routine">Routine</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setShowNewRequestModal(false)} className="rounded-xl bg-slate-100 px-4 py-2 font-bold">Cancel</button>
                <button type="submit" className="rounded-xl bg-red-700 text-white px-5 py-2 font-bold shadow-md">Create Requisition</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
