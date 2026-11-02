import React, { useState, useEffect } from 'react';
import { ReceptionPatientRecord } from '../../types';
import { sharedStore } from '../../services/sharedStore';
import { UserPlus, Upload, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ReceptionNewPatientViewProps {
  onRegisterPatient: (newPatient: ReceptionPatientRecord) => void;
  onNavigateTab: (tab: string) => void;
}

export const ReceptionNewPatientView: React.FC<ReceptionNewPatientViewProps> = ({
  onRegisterPatient,
  onNavigateTab,
}) => {
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('1994-05-15');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [phone, setPhone] = useState('+1 (555) 019-8800');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('77 Park Avenue, West Sector, City');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [allergies, setAllergies] = useState('None');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80');
  const [department, setDepartment] = useState('Cardiology');
  const [doctorsList, setDoctorsList] = useState(sharedStore.getDoctors());
  const [assignedDoctor, setAssignedDoctor] = useState(sharedStore.getDoctors()[0]?.name || 'Dr. Narayan Swamy');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const updateDocs = () => {
      const docs = sharedStore.getDoctors();
      setDoctorsList(docs);
      if (!docs.some(d => d.name === assignedDoctor) && docs.length > 0) {
        setAssignedDoctor(docs[0].name);
      }
    };
    window.addEventListener('smartcare_doctor_added', updateDocs);
    return () => window.removeEventListener('smartcare_doctor_added', updateDocs);
  }, [assignedDoctor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) {
      alert('Full Name and Phone number are required.');
      return;
    }

    const nextIdNumber = Math.floor(Math.random() * 800) + 21;
    const generatedId = `SC-P${String(nextIdNumber).padStart(3, '0')}`;

    const newRecord: ReceptionPatientRecord = {
      id: `pat-rec-${Date.now()}`,
      patient_id: generatedId,
      name: fullName,
      age: 32,
      gender,
      phone,
      email: email || `${fullName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      address,
      emergency_contact_name: emergencyName || 'Family Member',
      emergency_contact_phone: emergencyPhone || phone,
      blood_group: bloodGroup,
      allergies,
      photo_url: photoUrl,
      registration_date: '17 Aug 2026',
      department,
      assigned_doctor: assignedDoctor,
      today_appointment: {
        doctor_name: assignedDoctor,
        time_slot: '11:30 AM',
        status: 'Confirmed',
      },
      admission_status: 'Not Admitted',
      billing_status: 'Paid (₹700)',
    };

    onRegisterPatient(newRecord);
    setSuccessMessage(`Patient successfully registered! Generated Patient ID: ${generatedId}`);
    setTimeout(() => {
      onNavigateTab('appointments');
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">REGISTER NEW PATIENT</h1>
          <p className="text-xs text-slate-500">Front desk patient onboarding & administrative record creation</p>
        </div>
      </div>

      {successMessage && (
        <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-6">
        {/* Photo Selection Avatar */}
        <div className="flex items-center space-x-6 pb-6 border-b border-slate-100">
          <img
            src={photoUrl}
            alt="Profile Avatar"
            className="h-20 w-20 rounded-full object-cover border-2 border-blue-600 shadow-sm shrink-0"
          />
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 block">Profile Photo Avatar</label>
            <p className="text-[11px] text-slate-500">Synthetic portrait avatar generated for front desk identification.</p>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setPhotoUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80')}
                className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
              >
                Avatar 1 (Female)
              </button>
              <button
                type="button"
                onClick={() => setPhotoUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80')}
                className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
              >
                Avatar 2 (Male)
              </button>
            </div>
          </div>
        </div>

        {/* Basic Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-800 block mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Vikram Sharma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Date of Birth *</label>
            <input
              type="date"
              required
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Gender *</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs bg-white text-slate-700"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Phone Number *</label>
            <input
              type="text"
              required
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-mono focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Email Address</label>
            <input
              type="email"
              placeholder="patient@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs bg-white text-slate-700"
            >
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="General Medicine">General Medicine</option>
              <option value="General Surgery">General Surgery</option>
              <option value="Gynecology & Obstetrics">Gynecology & Obstetrics</option>
              <option value="Dermatology">Dermatology</option>
              <option value="ENT">ENT</option>
              <option value="Ophthalmology">Ophthalmology</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Assigned Consulting Doctor</label>
            <select
              value={assignedDoctor}
              onChange={(e) => setAssignedDoctor(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs bg-white text-slate-700 font-semibold"
            >
              {doctorsList.map((doc) => (
                <option key={doc.id || doc.name} value={doc.name}>
                  {doc.name} ({doc.department} - {doc.specialization})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="font-bold text-slate-800 block mb-1">Residential Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Emergency Contact Name</label>
            <input
              type="text"
              placeholder="Relative / Guardian Name"
              value={emergencyName}
              onChange={(e) => setEmergencyName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Emergency Contact Phone</label>
            <input
              type="text"
              placeholder="+1 (555) 000-0000"
              value={emergencyPhone}
              onChange={(e) => setEmergencyPhone(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-mono focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Blood Group</label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs bg-white text-slate-700"
            >
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Known Allergies</label>
            <input
              type="text"
              placeholder="e.g. Penicillin, Latex, None"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="inline-flex items-center space-x-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 text-xs font-bold shadow-md transition-all"
          >
            <UserPlus className="h-4 w-4" />
            <span>[ REGISTER PATIENT ]</span>
          </button>
        </div>
      </form>
    </div>
  );
};
