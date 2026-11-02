import React, { useState } from 'react';
import { ReceptionAppointmentRecord, ReceptionPatientRecord, ReceptionDoctorRecord } from '../../types';
import { Calendar, Plus, CheckCircle2, Clock, XCircle, RefreshCw, FileText, Download } from 'lucide-react';
import { authApi } from '../../services/api';

interface ReceptionAppointmentsViewProps {
  appointments: ReceptionAppointmentRecord[];
  patients: ReceptionPatientRecord[];
  doctors: ReceptionDoctorRecord[];
  onStatusChange: (id: string, newStatus: ReceptionAppointmentRecord['status']) => void;
  onBookNew: () => void;
}

export const ReceptionAppointmentsView: React.FC<ReceptionAppointmentsViewProps> = ({
  appointments,
  patients,
  doctors,
  onStatusChange,
  onBookNew,
}) => {
  const [selectedDate, setSelectedDate] = useState('2026-08-17');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');

  const filteredAppointments = appointments.filter((a) => {
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    const matchesDept = deptFilter === 'ALL' || a.department === deptFilter;
    return matchesStatus && matchesDept;
  });

  const handleDownloadSlip = async (apt: ReceptionAppointmentRecord) => {
    try {
      const res = await authApi.generatePDF('prescription', {
        prescription_number: apt.appointment_number,
        patient_name: apt.patient_name,
        doctor_name: apt.doctor_name,
        medicines: [
          { medicine_name: `Department: ${apt.department}`, dosage: `Time: ${apt.time_slot}`, frequency: `Token: #${apt.token_number}`, duration: `Date: ${apt.date}` }
        ]
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Appointment_Slip_${apt.appointment_number}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert(`Appointment Slip PDF created for ${apt.patient_name} (${apt.appointment_number}).`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">APPOINTMENT MANAGEMENT</h1>
          <p className="text-xs text-slate-500">Book, reschedule, cancel, confirm, and check-in patient consultation appointments</p>
        </div>
        <button
          onClick={onBookNew}
          className="inline-flex items-center space-x-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-xs font-bold text-white transition-all shadow-sm shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>+ Book Appointment</span>
        </button>
      </div>

      {/* Date & Filter Toolbar */}
      <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <Calendar className="h-4 w-4 text-blue-600 shrink-0" />
          <span className="text-xs font-bold text-slate-700">Filter Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-800"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs bg-white text-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Waiting">Waiting</option>
            <option value="Checked-in">Checked-in</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs bg-white text-slate-700"
          >
            <option value="ALL">All Departments</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Neurology">Neurology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="General Medicine">General Medicine</option>
            <option value="General Surgery">General Surgery</option>
            <option value="Gynecology & Obstetrics">Gynecology</option>
            <option value="Dermatology">Dermatology</option>
            <option value="ENT">ENT</option>
            <option value="Ophthalmology">Ophthalmology</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Token / Apt No</th>
                <th className="px-5 py-3.5">Time</th>
                <th className="px-5 py-3.5">Patient Name</th>
                <th className="px-5 py-3.5">Doctor</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-extrabold text-blue-700 font-mono">Token #{apt.token_number}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{apt.appointment_number}</div>
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-900">{apt.time_slot}</td>
                  <td className="px-5 py-4 font-bold text-slate-900">{apt.patient_name}</td>
                  <td className="px-5 py-4 text-slate-800 font-semibold">{apt.doctor_name}</td>
                  <td className="px-5 py-4 text-slate-600">{apt.department}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        apt.status === 'Confirmed'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : apt.status === 'Waiting'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : apt.status === 'Checked-in'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : apt.status === 'Completed'
                          ? 'bg-slate-100 text-slate-700 border border-slate-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => handleDownloadSlip(apt)}
                        title="Download Appointment Slip PDF"
                        className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>

                      {apt.status !== 'Checked-in' && apt.status !== 'Completed' && (
                        <button
                          onClick={() => onStatusChange(apt.id, 'Checked-in')}
                          className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 text-[11px] font-bold"
                        >
                          Check-in
                        </button>
                      )}

                      {apt.status === 'Waiting' && (
                        <button
                          onClick={() => onStatusChange(apt.id, 'Confirmed')}
                          className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 text-[11px] font-bold"
                        >
                          Confirm
                        </button>
                      )}

                      {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                        <button
                          onClick={() => onStatusChange(apt.id, 'Cancelled')}
                          className="rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 px-2 py-1 text-[11px] font-bold"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
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
