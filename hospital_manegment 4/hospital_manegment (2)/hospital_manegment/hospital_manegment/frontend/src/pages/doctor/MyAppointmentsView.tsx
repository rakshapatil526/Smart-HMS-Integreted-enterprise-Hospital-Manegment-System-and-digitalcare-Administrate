import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Stethoscope, Search, User, Filter, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sharedStore } from '../../services/sharedStore';
import { ReceptionAppointmentRecord } from '../../types';

interface MyAppointmentsViewProps {
  onNavigate: (tab: string, extraData?: any) => void;
}

export const MyAppointmentsView: React.FC<MyAppointmentsViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const activeDoctor = sharedStore.getDoctorNameForUser(user);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchFilter, setSearchFilter] = useState('');
  const [appointmentsList, setAppointmentsList] = useState<ReceptionAppointmentRecord[]>([]);

  const refreshAppointments = () => {
    const list = sharedStore.getAppointmentsForDoctor(activeDoctor);
    setAppointmentsList(list);
  };

  useEffect(() => {
    sharedStore.setSelectedDoctor(activeDoctor);
    refreshAppointments();

    const handleAptAdded = () => refreshAppointments();

    window.addEventListener('smartcare_appointment_added', handleAptAdded);
    return () => {
      window.removeEventListener('smartcare_appointment_added', handleAptAdded);
    };
  }, [activeDoctor]);

  const filteredAppointments = appointmentsList.filter(
    apt => apt.patient_name.toLowerCase().includes(searchFilter.toLowerCase()) || apt.patient_id.toLowerCase().includes(searchFilter.toLowerCase()) || apt.appointment_number.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-teal-600" />
            <span>MY APPOINTMENTS ({activeDoctor})</span>
          </h1>
          <p className="text-xs text-slate-500">
            View & manage assigned patient consultation schedule for {activeDoctor}.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Clinician Badge */}
          <div className="flex items-center space-x-1.5 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-xl text-xs font-bold text-teal-800">
            <User className="h-4 w-4 text-teal-600" />
            <span>{activeDoctor}</span>
          </div>

          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm text-xs">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span className="font-semibold text-slate-700">Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient by name or ID (e.g. Rakshitha or SC-P021)..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2 text-xs focus:border-teal-500 focus:outline-none"
          />
        </div>
        <div className="text-xs font-semibold text-slate-500 flex items-center space-x-1.5">
          <Filter className="h-4 w-4 text-slate-400" />
          <span>Total: {filteredAppointments.length} Appointments for {activeDoctor}</span>
        </div>
      </div>

      {/* MY APPOINTMENTS TABLE */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] border-b">
                <th className="p-3">Time Slot</th>
                <th className="p-3">Apt No</th>
                <th className="p-3">Patient ID</th>
                <th className="p-3">Patient Name</th>
                <th className="p-3">Department</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-xs text-slate-400">
                    No appointments booked for {activeDoctor} on this date.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-bold font-mono text-teal-700">{apt.time_slot}</td>
                    <td className="p-3 font-mono text-slate-500">{apt.appointment_number}</td>
                    <td className="p-3 font-mono font-bold text-slate-700">{apt.patient_id}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{apt.patient_name}</div>
                    </td>
                    <td className="p-3">
                      <span className="rounded-md bg-slate-100 text-slate-700 px-2 py-0.5 font-semibold text-[10px]">
                        {apt.department}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          apt.status === 'Waiting'
                            ? 'bg-amber-100 text-amber-800'
                            : apt.status === 'Confirmed'
                            ? 'bg-teal-100 text-teal-800'
                            : apt.status === 'Checked-in'
                            ? 'bg-cyan-100 text-cyan-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      {apt.status === 'Completed' ? (
                        <button
                          onClick={() => onNavigate('ehr', { patientId: apt.patient_id })}
                          className="rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 text-xs font-bold transition-all"
                        >
                          [View EHR]
                        </button>
                      ) : (
                        <button
                          onClick={() => onNavigate('opd', { patientName: apt.patient_name, patientId: apt.patient_id })}
                          className="rounded-lg bg-teal-600 text-white hover:bg-teal-700 px-3 py-1 text-xs font-bold shadow-sm transition-all"
                        >
                          [Open Consultation]
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

