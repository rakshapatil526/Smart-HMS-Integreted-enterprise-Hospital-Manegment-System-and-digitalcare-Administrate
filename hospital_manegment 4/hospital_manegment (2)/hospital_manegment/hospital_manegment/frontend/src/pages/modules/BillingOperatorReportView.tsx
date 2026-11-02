import React, { useState, useMemo } from 'react';
import {
  TrendingUp, PieChart as PieIcon, BarChart3, Download, Printer,
  Search, Filter, CheckCircle2, AlertTriangle, FileText, User, CreditCard, RefreshCw
} from 'lucide-react';
import { BILLING_40_PATIENTS_DATA, PatientBillingRecord } from './billing40PatientsData';
import { downloadPDFDocument } from '../../utils/pdfDownloader';

export const BillingOperatorReportView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Filter 40 Patient Data
  const filteredRecords = useMemo(() => {
    return BILLING_40_PATIENTS_DATA.filter((r) => {
      const matchesSearch =
        !searchQuery ||
        r.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.patient_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.bill_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.attending_doctor.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDept = deptFilter === 'ALL' || r.visit_type === deptFilter;
      const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [searchQuery, deptFilter, statusFilter]);

  // Aggregate Metrics across all 40 Patients
  const totalBilled = BILLING_40_PATIENTS_DATA.reduce((acc, r) => acc + r.total_amount, 0);
  const totalPaid = BILLING_40_PATIENTS_DATA.reduce((acc, r) => acc + r.amount_paid, 0);
  const totalBalance = BILLING_40_PATIENTS_DATA.reduce((acc, r) => acc + r.balance_due, 0);
  const collectionPercentage = ((totalPaid / totalBilled) * 100).toFixed(1);

  // Department Breakdown for Bar Chart
  const deptBreakdown = useMemo(() => {
    const depts = ['OPD', 'IPD', 'Pharmacy', 'Laboratory', 'Radiology', 'Emergency'] as const;
    return depts.map((d) => {
      const records = BILLING_40_PATIENTS_DATA.filter((r) => r.visit_type === d);
      const rev = records.reduce((acc, r) => acc + r.total_amount, 0);
      return { department: d, revenue: rev, count: records.length };
    });
  }, []);

  const maxDeptRevenue = Math.max(...deptBreakdown.map((d) => d.revenue));

  // Payment Status Distribution for Pie/Donut Chart
  const statusDistribution = useMemo(() => {
    const statuses = ['Paid', 'Partially Paid', 'Pending', 'Refunded'] as const;
    return statuses.map((st) => {
      const recs = BILLING_40_PATIENTS_DATA.filter((r) => r.status === st);
      const amt = recs.reduce((acc, r) => acc + r.total_amount, 0);
      return { status: st, count: recs.length, amount: amt };
    });
  }, []);

  // PDF Export Handler for Billing Operator Report
  const handleExportPDF = async () => {
    await downloadPDFDocument(
      'billing_operator_report',
      {
        report_title: 'BILLING OPERATOR REPORT & FINANCIAL ANALYTICS',
        operator_name: 'Accounts Manager Sarah Connor',
        total_patients: BILLING_40_PATIENTS_DATA.length,
        total_billed: totalBilled,
        total_paid: totalPaid,
        total_balance: totalBalance,
        collection_rate: `${collectionPercentage}%`,
        department_summary: deptBreakdown,
        patient_records: BILLING_40_PATIENTS_DATA.map((r) => ({
          description: `${r.bill_number} - ${r.patient_name} (${r.visit_type} - ${r.status})`,
          amount: r.total_amount
        })),
        invoice_number: 'REP-2026-40PATIENTS',
        patient_name: '40 Patients Cohort Summary'
      },
      'Billing_Operator_Report_40_Patients.pdf'
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-['Inter',sans-serif]">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 p-6 text-white shadow-xl border border-teal-500/20">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <BarChart3 className="h-4 w-4 text-amber-400" />
            <span>FINANCIAL AUDIT &amp; BILLING OFFICER REVENUE INTELLIGENCE</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Billing Officer Report &amp; Analytics
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            40 Patient Financial Cohort Audit • Department Revenue Breakdown • Visual Bar &amp; Pie Charts • PDF Export
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportPDF}
            className="flex items-center space-x-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2.5 text-xs font-extrabold shadow-md transition-all uppercase tracking-wider"
          >
            <Download className="h-4 w-4" />
            <span>Export PDF Report</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 text-xs font-bold border border-slate-700 shadow-sm transition-all"
          >
            <Printer className="h-4 w-4 text-teal-400" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Top Key Financial Indicators (4 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Total Billed (40 Patients)</span>
          <div className="text-2xl font-extrabold text-slate-900">₹{totalBilled.toLocaleString()}</div>
          <span className="text-[10px] text-teal-600 font-bold">40 Invoices Generated</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Total Revenue Collected</span>
          <div className="text-2xl font-extrabold text-emerald-600">₹{totalPaid.toLocaleString()}</div>
          <span className="text-[10px] text-emerald-600 font-bold">Collection Rate: {collectionPercentage}%</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Pending Balance Due</span>
          <div className="text-2xl font-extrabold text-amber-600">₹{totalBalance.toLocaleString()}</div>
          <span className="text-[10px] text-amber-600 font-bold">4 Partial / 3 Pending</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Average Bill Per Patient</span>
          <div className="text-2xl font-extrabold text-blue-600">₹{Math.round(totalBilled / 40).toLocaleString()}</div>
          <span className="text-[10px] text-blue-600 font-bold">Across 6 Hospital Modules</span>
        </div>
      </div>

      {/* CHARTS GRID: BAR CHART & PIE CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 1: BAR CHART (Department Revenue Breakdown) */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Department Revenue Breakdown</h3>
                <p className="text-[11px] text-slate-500">Bar Graph — 40 Patient Revenue by Hospital Module</p>
              </div>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              Bar Chart
            </span>
          </div>

          {/* SVG Bar Chart Visualization */}
          <div className="space-y-3 pt-2">
            {deptBreakdown.map((dept) => {
              const barWidthPercent = Math.max(8, Math.round((dept.revenue / maxDeptRevenue) * 100));
              return (
                <div key={dept.department} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span className="flex items-center space-x-2">
                      <span className="w-24 text-slate-700">{dept.department}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({dept.count} Patients)</span>
                    </span>
                    <span className="font-extrabold text-slate-900">₹{dept.revenue.toLocaleString()}</span>
                  </div>

                  {/* Graphic Progress Bar */}
                  <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex items-center">
                    <div
                      className={`h-full rounded-full transition-all duration-700 flex items-center justify-end pr-2 text-[9px] font-extrabold text-white ${
                        dept.department === 'IPD'
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600'
                          : dept.department === 'Emergency'
                          ? 'bg-gradient-to-r from-rose-500 to-amber-600'
                          : dept.department === 'Radiology'
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-600'
                          : dept.department === 'Pharmacy'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-600'
                          : dept.department === 'Laboratory'
                          ? 'bg-gradient-to-r from-teal-500 to-emerald-600'
                          : 'bg-gradient-to-r from-slate-600 to-slate-800'
                      }`}
                      style={{ width: `${barWidthPercent}%` }}
                    >
                      {barWidthPercent > 20 && `${barWidthPercent}%`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHART 2: PIE / DONUT CHART (Payment Status & Method Distribution) */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
                <PieIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Payment Status Distribution</h3>
                <p className="text-[11px] text-slate-500">Pie / Donut Graph — Paid, Partial, Pending &amp; Refunded</p>
              </div>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
              Pie Chart
            </span>
          </div>

          {/* Graphic Pie / Donut Chart & Legend */}
          <div className="flex flex-col sm:flex-row items-center justify-around gap-4 pt-2">
            {/* Donut SVG Graphic */}
            <div className="relative h-44 w-44 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                {/* Background Ring */}
                <path
                  className="text-slate-100"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Paid Slice (75%) */}
                <path
                  className="text-emerald-500 transition-all duration-700"
                  strokeDasharray="75, 100"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Partially Paid Slice (15%) */}
                <path
                  className="text-amber-500 transition-all duration-700"
                  strokeDasharray="15, 100"
                  strokeDashoffset="-75"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Pending Slice (7.5%) */}
                <path
                  className="text-red-500 transition-all duration-700"
                  strokeDasharray="7.5, 100"
                  strokeDashoffset="-90"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Refunded Slice (2.5%) */}
                <path
                  className="text-purple-500 transition-all duration-700"
                  strokeDasharray="2.5, 100"
                  strokeDashoffset="-97.5"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-extrabold text-slate-900">40</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Patients</span>
              </div>
            </div>

            {/* Pie Chart Legend List */}
            <div className="space-y-2.5 text-xs w-full sm:w-auto">
              <div className="flex items-center justify-between space-x-6 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold">
                <span className="flex items-center space-x-2">
                  <span className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span>Paid (32 Patients)</span>
                </span>
                <span>₹7,60,650</span>
              </div>

              <div className="flex items-center justify-between space-x-6 p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 font-bold">
                <span className="flex items-center space-x-2">
                  <span className="h-3 w-3 rounded-full bg-amber-500" />
                  <span>Partially Paid (4 Patients)</span>
                </span>
                <span>₹1,45,000</span>
              </div>

              <div className="flex items-center justify-between space-x-6 p-2 rounded-xl bg-red-50 border border-red-200 text-red-950 font-bold">
                <span className="flex items-center space-x-2">
                  <span className="h-3 w-3 rounded-full bg-red-500" />
                  <span>Pending (3 Patients)</span>
                </span>
                <span>₹4,900</span>
              </div>

              <div className="flex items-center justify-between space-x-6 p-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-950 font-bold">
                <span className="flex items-center space-x-2">
                  <span className="h-3 w-3 rounded-full bg-purple-500" />
                  <span>Refunded (1 Patient)</span>
                </span>
                <span>₹16,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 40 PATIENTS DETAILED BILLING TRANSACTIONS TABLE */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        {/* Table Filter Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b pb-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-slate-700" />
            <h3 className="font-bold text-sm text-slate-900">
              Itemized 40 Patient Financial Ledger
            </h3>
            <span className="rounded-full bg-slate-100 text-slate-700 px-2.5 py-0.5 text-xs font-bold border">
              Showing {filteredRecords.length} of 40 Records
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient, ID, doctor, bill..."
                className="rounded-xl border border-slate-200 pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500 w-48"
              />
            </div>

            {/* Department Filter */}
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Departments</option>
              <option value="OPD">OPD</option>
              <option value="IPD">IPD</option>
              <option value="Pharmacy">Pharmacy</option>
              <option value="Laboratory">Laboratory</option>
              <option value="Radiology">Radiology</option>
              <option value="Emergency">Emergency</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Payment Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Pending">Pending</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 max-h-[500px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-900 text-white sticky top-0 z-10">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Bill Number</th>
                <th className="p-3">Date</th>
                <th className="p-3">Patient Name &amp; ID</th>
                <th className="p-3">Age / Sex</th>
                <th className="p-3">Visit Type</th>
                <th className="p-3">Attending Doctor</th>
                <th className="p-3 text-right">Total Bill</th>
                <th className="p-3 text-right">Amount Paid</th>
                <th className="p-3 text-right">Balance Due</th>
                <th className="p-3">Method</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredRecords.map((r, idx) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 text-slate-400 font-bold">{idx + 1}</td>
                  <td className="p-3 font-mono font-bold text-teal-700">{r.bill_number}</td>
                  <td className="p-3 text-slate-500 whitespace-nowrap">{r.date}</td>
                  <td className="p-3">
                    <strong className="text-slate-900 block">{r.patient_name}</strong>
                    <span className="text-[10px] text-slate-400 font-mono">{r.patient_id}</span>
                  </td>
                  <td className="p-3 text-slate-600">{r.age} Y / {r.gender[0]}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                        r.visit_type === 'OPD'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : r.visit_type === 'IPD'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : r.visit_type === 'Emergency'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : r.visit_type === 'Radiology'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : r.visit_type === 'Pharmacy'
                          ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                          : 'bg-teal-50 text-teal-700 border-teal-200'
                      }`}
                    >
                      {r.visit_type}
                    </span>
                  </td>
                  <td className="p-3 text-slate-700">{r.attending_doctor}</td>
                  <td className="p-3 text-right font-bold text-slate-900">₹{r.total_amount.toLocaleString()}</td>
                  <td className="p-3 text-right font-bold text-emerald-600">₹{r.amount_paid.toLocaleString()}</td>
                  <td className="p-3 text-right font-bold text-red-600">₹{r.balance_due.toLocaleString()}</td>
                  <td className="p-3 text-slate-600 text-[11px] font-semibold">{r.payment_method}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                        r.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : r.status === 'Partially Paid'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : r.status === 'Pending'
                          ? 'bg-red-100 text-red-800 border-red-300'
                          : 'bg-purple-100 text-purple-800 border-purple-300'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
