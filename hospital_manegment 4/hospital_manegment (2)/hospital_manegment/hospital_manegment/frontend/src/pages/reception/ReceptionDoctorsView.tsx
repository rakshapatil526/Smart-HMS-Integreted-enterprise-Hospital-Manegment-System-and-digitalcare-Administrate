import React, { useState } from 'react';
import { ReceptionDoctorRecord } from '../../types';
import { Search, Filter, Calendar, Clock, UserCheck, CheckCircle2, ShieldCheck, X } from 'lucide-react';

interface ReceptionDoctorsViewProps {
  doctors: ReceptionDoctorRecord[];
  onBookForDoctor: (doctor: ReceptionDoctorRecord) => void;
}

export const ReceptionDoctorsView: React.FC<ReceptionDoctorsViewProps> = ({
  doctors,
  onBookForDoctor,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedDoctorSchedule, setSelectedDoctorSchedule] = useState<ReceptionDoctorRecord | null>(null);

  const filteredDoctors = doctors.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'ALL' || d.department === departmentFilter;
    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">DOCTOR DIRECTORY & SCHEDULE AVAILABILITY</h1>
          <p className="text-xs text-slate-500">20 Consultant Doctors across 10 Speciality Departments (Front-Desk Scheduling View)</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Doctor Name, Department, or Specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white text-slate-700"
          >
            <option value="ALL">All 10 Departments</option>
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

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white text-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="Available">🟢 Available</option>
            <option value="Busy">🔴 Busy</option>
          </select>
        </div>
      </div>

      {/* Doctor Cards Grid (Section 13 Doctor Card Layout Blueprint) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* Top Doctor Photo & Bio */}
            <div className="space-y-3">
              <div className="flex items-start space-x-4">
                <img
                  src={doc.photo_url}
                  alt={doc.name}
                  className="h-16 w-16 rounded-2xl object-cover border-2 border-slate-100 shadow-xs shrink-0"
                />
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">{doc.name}</h3>
                  <div className="text-xs font-semibold text-blue-700">{doc.designation}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{doc.specialization}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 font-semibold block uppercase text-[9px]">Department</span>
                  <strong className="text-slate-800">{doc.department}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block uppercase text-[9px]">Experience</span>
                  <strong className="text-slate-800">{doc.experience_years} years</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block uppercase text-[9px]">Hours Today</span>
                  <strong className="text-slate-800">{doc.consultation_hours}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block uppercase text-[9px]">Status</span>
                  <span className={`font-extrabold ${doc.status === 'Available' ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {doc.status === 'Available' ? '🟢 AVAILABLE' : '🔴 BUSY'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedDoctorSchedule(doc)}
                className="flex-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 text-xs font-bold transition-all text-center"
              >
                [ VIEW SCHEDULE ]
              </button>
              <button
                onClick={() => onBookForDoctor(doc)}
                className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2 text-xs font-bold shadow-xs transition-all text-center"
              >
                [ BOOK APPOINTMENT ]
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DOCTOR SCHEDULE MODAL (Section 14 Doctor Availability Blueprint) */}
      {selectedDoctorSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">DOCTOR CONSULTATION SCHEDULE</h3>
              </div>
              <button
                onClick={() => setSelectedDoctorSchedule(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <img
                src={selectedDoctorSchedule.photo_url}
                alt={selectedDoctorSchedule.name}
                className="h-12 w-12 rounded-xl object-cover border border-slate-200"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900">{selectedDoctorSchedule.name}</h4>
                <div className="text-[11px] text-blue-700 font-semibold">{selectedDoctorSchedule.department}</div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h5 className="font-bold text-slate-800">Weekly OPD Timing Schedule:</h5>
              {Object.entries(selectedDoctorSchedule.schedule).map(([day, time]) => (
                <div key={day} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="font-bold text-slate-700">{day}</span>
                  <span className="font-mono text-slate-900">{time}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => {
                  onBookForDoctor(selectedDoctorSchedule);
                  setSelectedDoctorSchedule(null);
                }}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-xs font-bold shadow-sm transition-all"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
