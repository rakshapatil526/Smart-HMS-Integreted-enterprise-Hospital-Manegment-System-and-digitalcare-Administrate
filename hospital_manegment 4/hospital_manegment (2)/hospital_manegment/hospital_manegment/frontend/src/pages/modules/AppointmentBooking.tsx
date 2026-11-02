import React, { useState, useEffect } from 'react';
import { clinicalApi, authApi } from '../../services/api';
import { Appointment, Doctor, Department } from '../../types';
import { Calendar as CalendarIcon, Clock, User, Stethoscope, Plus, CheckCircle, XCircle, Download } from 'lucide-react';
import { downloadPDFDocument } from '../../utils/pdfDownloader';

export const AppointmentBooking: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [selectedDept, setSelectedDept] = useState('');
  const [selectedDoc, setSelectedDoc] = useState('');
  const [aptDate, setAptDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('10:00 - 10:30 AM');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [aptRes, docRes, deptRes] = await Promise.all([
        clinicalApi.getAppointments(),
        clinicalApi.getDoctors(),
        authApi.getDepartments()
      ]);
      setAppointments(aptRes.data);
      setDoctors(docRes.data);
      setDepartments(deptRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const filteredDoctors = selectedDept
    ? doctors.filter(d => d.department?.id === selectedDept || d.department?.name === selectedDept)
    : doctors;

  const handleBook = async () => {
    if (!selectedDoc) {
      alert("Please select a doctor");
      return;
    }
    try {
      await clinicalApi.createAppointment({
        doctor: selectedDoc,
        appointment_date: aptDate,
        time_slot: timeSlot,
        type: 'OPD',
        status: 'Booked'
      });
      alert("Appointment Booked Successfully!");
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert("Failed to book appointment.");
    }
  };

  const handleDownloadSlip = async (apt: Appointment) => {
    const pName = `${apt.patient_details?.user?.first_name || 'Patient'} ${apt.patient_details?.user?.last_name || ''}`.trim();
    const dName = `Dr. ${apt.doctor_details?.user?.first_name || ''} ${apt.doctor_details?.user?.last_name || 'Consultant'}`.trim();
    await downloadPDFDocument(
      'prescription',
      {
        prescription_number: apt.appointment_number,
        patient_name: pName,
        patient_id: apt.patient_details?.patient_id || 'PAT-2026-8942',
        doctor_name: dName,
        department: apt.department?.name || 'General OPD',
        diagnosis: `Scheduled Consultation (${apt.type || 'OPD'}) - Token #${apt.token_number}`,
        instructions: `Please report to ${apt.department?.name || 'OPD'} desk 15 minutes before time slot ${apt.time_slot}.`,
        title: `Appointment Confirmation Slip (${apt.appointment_number})`
      },
      `Appointment_Slip_${apt.appointment_number}.pdf`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Appointment Management</h1>
          <p className="text-xs text-slate-500">Book, reschedule, and track doctor consultation slots</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 shadow-sm transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-3">Today's Scheduled Appointments</h3>
        {loading ? (
          <div className="py-6 text-center text-xs text-slate-400">Loading appointments...</div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Apt No</th>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Doctor</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Date & Slot</th>
                  <th className="p-3">Token No</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {appointments.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-mono font-bold text-teal-700">{a.appointment_number}</td>
                    <td className="p-3 font-semibold text-slate-900">
                      {a.patient_details?.user?.first_name} {a.patient_details?.user?.last_name}
                    </td>
                    <td className="p-3">Dr. {a.doctor_details?.user?.last_name || 'Consultant'}</td>
                    <td className="p-3">{a.department?.name || 'General'}</td>
                    <td className="p-3">{a.appointment_date} ({a.time_slot})</td>
                    <td className="p-3 font-bold text-amber-600">#{a.token_number}</td>
                    <td className="p-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        a.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                        a.status === 'Checked-in' ? 'bg-cyan-100 text-cyan-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDownloadSlip(a)}
                        className="inline-flex items-center space-x-1 rounded-lg bg-teal-50 px-2.5 py-1 text-[11px] font-bold text-teal-700 hover:bg-teal-100 transition-all border border-teal-200"
                      >
                        <Download className="h-3 w-3 text-teal-600" />
                        <span>PDF Slip</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b pb-2">Book Doctor Consultation Slot</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select Department</label>
                <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)} className="w-full rounded-xl border p-2">
                  <option value="">All Departments (10+)</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select Doctor ({filteredDoctors.length} available)</label>
                <select value={selectedDoc} onChange={e => setSelectedDoc(e.target.value)} className="w-full rounded-xl border p-2">
                  <option value="">Choose Doctor...</option>
                  {filteredDoctors.map(d => (
                    <option key={d.id} value={d.id}>
                      Dr. {d.user?.first_name} {d.user?.last_name} ({d.specialization} - ${d.consultation_fee})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Date</label>
                  <input type="date" value={aptDate} onChange={e => setAptDate(e.target.value)} className="w-full rounded-xl border p-2" />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Time Slot</label>
                  <select value={timeSlot} onChange={e => setTimeSlot(e.target.value)} className="w-full rounded-xl border p-2">
                    <option value="09:00 - 09:30 AM">09:00 - 09:30 AM</option>
                    <option value="10:00 - 10:30 AM">10:00 - 10:30 AM</option>
                    <option value="11:30 - 12:00 PM">11:30 - 12:00 PM</option>
                    <option value="04:00 - 04:30 PM">04:00 - 04:30 PM</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-600">Cancel</button>
              <button onClick={handleBook} className="px-4 py-2 rounded-xl bg-teal-600 text-xs font-semibold text-white">Confirm Booking</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
