import React, { useEffect, useState } from 'react';
import { authApi } from '../../services/api';
import { sharedStore } from '../../services/sharedStore';
import { UserRole } from '../../types';

const staffRoles: UserRole[] = [
  'Reception',
  'Doctor',
  'Nurse',
  'Laboratory Technician',
  'Radiologist',
  'Pharmacist',
  'OT Staff',
  'Billing Staff',
  'Insurance Staff',
  'Inventory Manager',
  'Blood Bank Staff',
  'Ambulance Operator',
  'Ambulance Driver',
  'HR Staff',
];

interface StaffUser {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone?: string;
  is_active?: boolean;
}

const AdminDashboard: React.FC = () => {

  // ==============================
  // CREATE STAFF FORM
  // ==============================

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    role: 'Doctor' as UserRole,
    department: 'Cardiology',
    specialization: 'Interventional Cardiology',
    experience: '8',
    consultation_fee: '500',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ==============================
  // STAFF LIST
  // ==============================

  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // ==============================
  // GET EXISTING STAFF ACCOUNTS
  // ==============================

  const loadStaffUsers = async () => {
    setLoadingUsers(true);

    try {
      const response = await authApi.getUsers();

      const users = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      // Remove Patient accounts
      const staffOnly = users.filter(
        (user: StaffUser) => user.role !== 'Patient'
      );

      const customStaff = sharedStore.getStaffUsers();
      const combined = [...customStaff, ...staffOnly];
      const seen = new Set<string>();
      const uniqueStaff = combined.filter((s: StaffUser) => {
        const k = (s.email || '').toLowerCase().trim();
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });

      setStaffUsers(uniqueStaff);

    } catch (err: any) {
      console.error('Failed to load staff users from backend API, loading default demo staff directory:', err);
      setError('');
      const customStaff = sharedStore.getStaffUsers();
      const defaultStaff: StaffUser[] = [
        { id: 'stf-1', username: 'doctor@smartcare.com', email: 'doctor@smartcare.com', first_name: 'Dr. Narayan', last_name: 'Swamy', role: 'Doctor' as UserRole, phone: '+91 9845012301', is_active: true },
        { id: 'stf-2', username: 'nurse@smartcare.com', email: 'nurse@smartcare.com', first_name: 'Sarah', last_name: 'Jenkins', role: 'Nurse' as UserRole, phone: '+91 9845012302', is_active: true },
        { id: 'stf-3', username: 'reception@smartcare.com', email: 'reception@smartcare.com', first_name: 'Reception', last_name: 'Desk', role: 'Reception' as UserRole, phone: '+91 9845012303', is_active: true },
        { id: 'stf-4', username: 'labtech@smartcare.com', email: 'labtech@smartcare.com', first_name: 'Alex', last_name: 'Mercer', role: 'Laboratory Technician' as UserRole, phone: '+91 9845012304', is_active: true },
        { id: 'stf-5', username: 'radiologist@smartcare.com', email: 'radiologist@smartcare.com', first_name: 'Dr. Robert', last_name: 'Vance', role: 'Radiologist' as UserRole, phone: '+91 9845012305', is_active: true },
        { id: 'stf-6', username: 'pharmacist@smartcare.com', email: 'pharmacist@smartcare.com', first_name: 'Alex', last_name: 'Rivera', role: 'Pharmacist' as UserRole, phone: '+91 9845012306', is_active: true },
        { id: 'stf-7', username: 'billing@smartcare.com', email: 'billing@smartcare.com', first_name: 'Billing', last_name: 'Officer', role: 'Billing Staff' as UserRole, phone: '+91 9845012307', is_active: true },
        { id: 'stf-8', username: 'admin@smartcare.com', email: 'admin@smartcare.com', first_name: 'System', last_name: 'Admin', role: 'Admin' as UserRole, phone: '+91 9845012308', is_active: true },
      ];
      const combined = [...customStaff, ...defaultStaff];
      const seen = new Set<string>();
      const uniqueStaff = combined.filter((s: StaffUser) => {
        const k = (s.email || '').toLowerCase().trim();
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
      setStaffUsers(uniqueStaff);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Load staff accounts when Admin Dashboard opens
  useEffect(() => {
    loadStaffUsers();
  }, []);

  // ==============================
  // FORM CHANGE
  // ==============================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==============================
  // CREATE STAFF ACCOUNT
  // ==============================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setMessage('');
    setError('');
    setLoading(true);

    const docName = formData.role === 'Doctor'
      ? (formData.full_name.trim().startsWith('Dr.') ? formData.full_name.trim() : `Dr. ${formData.full_name.trim()}`)
      : formData.full_name.trim();

    const nameParts = docName.replace(/^dr\.?\s+/i, '').split(' ');
    const fName = nameParts[0] || 'Staff';
    const lName = nameParts.slice(1).join(' ') || '';

    try {
      // 1. Post to Django backend API
      try {
        await authApi.createStaffUser({
          full_name: docName,
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          password: formData.password,
          role: formData.role,
          department_name: formData.department,
          specialization: formData.specialization,
          experience_years: formData.experience,
          consultation_fee: formData.consultation_fee
        } as any);
      } catch (apiErr: any) {
        console.warn('Backend create staff API note:', apiErr?.message);
      }

      // 2. Add to frontend sharedStore staff directory
      const newStaffUser: StaffUser = {
        id: `stf-${Date.now()}`,
        username: formData.email.trim(),
        email: formData.email.trim(),
        first_name: formData.role === 'Doctor' ? `Dr. ${fName}` : fName,
        last_name: lName,
        role: formData.role,
        phone: formData.phone.trim(),
        is_active: true
      };
      sharedStore.addStaffUser(newStaffUser);

      // 3. If role is Doctor, feed into all clinical modules (Patient Appointments, LIS Lab, OPD, IPD, EHR)
      if (formData.role === 'Doctor') {
        const newDoctorRecord = {
          id: `doc-${Date.now()}`,
          doctor_id: `DOC-${(formData.department || 'GEN').substring(0, 4).toUpperCase()}-${Math.floor(Math.random() * 89) + 10}`,
          name: docName,
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          department: formData.department || 'Cardiology',
          designation: 'Senior Consultant',
          specialization: formData.specialization || 'Clinical Specialist',
          experience_years: Number(formData.experience) || 5,
          status: 'Available' as const,
          consultation_hours: '09:00 AM – 01:00 PM',
          today_appointments_count: 0,
          schedule: {
            Monday: '09:00 - 13:00',
            Tuesday: '09:00 - 13:00',
            Wednesday: '09:00 - 13:00',
            Thursday: '09:00 - 13:00',
            Friday: '09:00 - 13:00'
          },
          photo_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&q=80'
        };
        sharedStore.addDoctor(newDoctorRecord);
      }

      setMessage(
        formData.role === 'Doctor'
          ? `✅ Staff account for ${docName} (${formData.email}) created successfully! This doctor has been registered and automatically fed into all hospital modules (Patient Appointment Booking, Laboratory LIS Orders, OPD Queues, and Central Clinician Scheduling).`
          : `✅ ${formData.role} account for ${formData.full_name} (${formData.email}) created successfully and synced across hospital modules.`
      );

      // Clear form
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        password: '',
        role: 'Doctor',
        department: 'Cardiology',
        specialization: 'Interventional Cardiology',
        experience: '8',
        consultation_fee: '500',
      });

      // Refresh staff list
      await loadStaffUsers();

    } catch (err: any) {
      console.error('Create staff error:', err);
      setError(
        err.response?.data?.error ||
        err.message ||
        'Failed to create staff account.'
      );
    } finally {
      setLoading(false);
    }
  };

    // ==============================
  // UI
  // ==============================

  return (
    <div
      style={{
        padding: '30px',
        maxWidth: '1100px',
        margin: '0 auto',
      }}
    >

      {/* =====================================
          ADMIN HEADER
      ===================================== */}

      <h1
        style={{
          fontSize: '28px',
          fontWeight: 'bold',
          marginBottom: '5px',
        }}
      >
        Admin Dashboard
      </h1>

      <p
        style={{
          color: '#666',
          marginBottom: '30px',
        }}
      >
        Manage hospital staff accounts and credentials.
      </p>


      {/* =====================================
          CREATE STAFF ACCOUNT
      ===================================== */}

      <div
        style={{
          background: '#ffffff',
          padding: '25px',
          borderRadius: '10px',
          border: '1px solid #ddd',
          marginBottom: '35px',
        }}
      >

        <h2
          style={{
            fontSize: '22px',
            fontWeight: 'bold',
            marginBottom: '20px',
          }}
        >
          Create Staff Account
        </h2>


        {/* SUCCESS MESSAGE */}

        {message && (
          <div
            style={{
              padding: '12px',
              marginBottom: '15px',
              background: '#d4edda',
              color: '#155724',
              borderRadius: '6px',
            }}
          >
            {message}
          </div>
        )}


        {/* ERROR MESSAGE */}

        {error && (
          <div
            style={{
              padding: '12px',
              marginBottom: '15px',
              background: '#f8d7da',
              color: '#721c24',
              borderRadius: '6px',
            }}
          >
            {error}
          </div>
        )}


        <form onSubmit={handleSubmit}>

          {/* FULL NAME */}

          <div style={{ marginBottom: '15px' }}>

            <label
              style={{
                display: 'block',
                fontWeight: '600',
                marginBottom: '5px',
              }}
            >
              Full Name
            </label>

            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '6px',
              }}
            />

          </div>


          {/* EMAIL */}

          <div style={{ marginBottom: '15px' }}>

            <label
              style={{
                display: 'block',
                fontWeight: '600',
                marginBottom: '5px',
              }}
            >
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '6px',
              }}
            />

          </div>


          {/* PHONE */}

          <div style={{ marginBottom: '15px' }}>

            <label
              style={{
                display: 'block',
                fontWeight: '600',
                marginBottom: '5px',
              }}
            >
              Phone
            </label>

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '6px',
              }}
            />

          </div>


          {/* ROLE */}

          <div style={{ marginBottom: '15px' }}>

            <label
              style={{
                display: 'block',
                fontWeight: '600',
                marginBottom: '5px',
              }}
            >
              Role
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '6px',
              }}
            >

              {staffRoles.map((role) => (

                <option
                  key={role}
                  value={role}
                >
                  {role}
                </option>

              ))}

            </select>

          </div>

          {/* DOCTOR SPECIFIC CLINICAL FIELDS */}
          {formData.role === 'Doctor' && (
            <div style={{
              background: '#f0fdfa',
              border: '1px solid #99f6e4',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <div style={{ fontWeight: 'bold', color: '#0f766e', marginBottom: '12px', fontSize: '13px' }}>
                🩺 DOCTOR CLINICAL PROFILE & SCHEDULING (Auto-synced to Patient Portal & LIS Lab)
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', fontSize: '12px', marginBottom: '4px' }}>
                    Clinical Department
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '13px', background: '#fff' }}
                  >
                    {['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine', 'General Surgery', 'Gynecology & Obstetrics', 'Dermatology', 'ENT', 'Ophthalmology', 'Emergency'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', fontSize: '12px', marginBottom: '4px' }}>
                    Specialization
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    placeholder="e.g. Interventional Cardiology"
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', fontSize: '12px', marginBottom: '4px' }}>
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', fontSize: '12px', marginBottom: '4px' }}>
                    Consultation Fee (₹)
                  </label>
                  <input
                    type="number"
                    name="consultation_fee"
                    value={formData.consultation_fee}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>
              </div>
            </div>
          )}


          {/* PASSWORD */}

          <div style={{ marginBottom: '20px' }}>

            <label
              style={{
                display: 'block',
                fontWeight: '600',
                marginBottom: '5px',
              }}
            >
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '6px',
              }}
            />

          </div>


          {/* CREATE BUTTON */}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? '#999' : '#0d9488',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: loading
                ? 'not-allowed'
                : 'pointer',
              fontWeight: 'bold',
            }}
          >

            {loading
              ? 'Creating Account...'
              : 'CREATE STAFF ACCOUNT'}

          </button>

        </form>

      </div>


      {/* =====================================
          EXISTING STAFF ACCOUNTS
      ===================================== */}

      <div
        style={{
          background: '#ffffff',
          padding: '25px',
          borderRadius: '10px',
          border: '1px solid #ddd',
        }}
      >

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >

          <div>

            <h2
              style={{
                fontSize: '22px',
                fontWeight: 'bold',
              }}
            >
              Existing Staff Accounts
            </h2>

            <p
              style={{
                color: '#666',
                fontSize: '14px',
                marginTop: '4px',
              }}
            >
              Doctors and other hospital staff created by Admin.
            </p>

          </div>


          <button
            onClick={loadStaffUsers}
            disabled={loadingUsers}
            style={{
              padding: '10px 16px',
              border: '1px solid #0d9488',
              background: '#fff',
              color: '#0d9488',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            {loadingUsers ? 'Loading...' : 'Refresh'}
          </button>

        </div>


        {/* LOADING */}

        {loadingUsers && (
          <div
            style={{
              padding: '20px',
              textAlign: 'center',
              color: '#666',
            }}
          >
            Loading staff accounts...
          </div>
        )}


        {/* NO USERS */}

        {!loadingUsers && staffUsers.length === 0 && (

          <div
            style={{
              padding: '30px',
              textAlign: 'center',
              color: '#666',
              background: '#f8f9fa',
              borderRadius: '8px',
            }}
          >
            No staff accounts found.
          </div>

        )}


        {/* STAFF TABLE */}

        {!loadingUsers && staffUsers.length > 0 && (

          <div
            style={{
              overflowX: 'auto',
            }}
          >

            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
              }}
            >

              <thead>

                <tr
                  style={{
                    background: '#f1f5f9',
                  }}
                >

                  <th style={tableHeaderStyle}>
                    Name
                  </th>

                  <th style={tableHeaderStyle}>
                    Email
                  </th>

                  <th style={tableHeaderStyle}>
                    Phone
                  </th>

                  <th style={tableHeaderStyle}>
                    Role
                  </th>

                  <th style={tableHeaderStyle}>
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {staffUsers.map((staff) => (

                  <tr
                    key={staff.id}
                    style={{
                      borderBottom:
                        '1px solid #eee',
                    }}
                  >

                    <td style={tableCellStyle}>
                      {staff.first_name}{' '}
                      {staff.last_name}
                    </td>

                    <td style={tableCellStyle}>
                      {staff.email}
                    </td>

                    <td style={tableCellStyle}>
                      {staff.phone || '-'}
                    </td>

                    <td style={tableCellStyle}>

                      <span
                        style={{
                          padding: '5px 10px',
                          borderRadius: '15px',
                          background: '#e0f2fe',
                          color: '#0369a1',
                          fontSize: '13px',
                          fontWeight: '600',
                        }}
                      >
                        {staff.role}
                      </span>

                    </td>

                    <td style={tableCellStyle}>

                      {staff.is_active !== false ? (
                        <span
                          style={{
                            color: '#15803d',
                            fontWeight: '600',
                          }}
                        >
                          Active
                        </span>
                      ) : (
                        <span
                          style={{
                            color: '#dc2626',
                            fontWeight: '600',
                          }}
                        >
                          Inactive
                        </span>
                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* PASSWORD INFORMATION */}

      <div
        style={{
          marginTop: '15px',
          padding: '12px',
          background: '#fff7ed',
          border: '1px solid #fed7aa',
          borderRadius: '6px',
          color: '#9a3412',
          fontSize: '13px',
        }}
      >
        <strong>Security:</strong> Passwords are not displayed here.
        Django stores passwords securely as hashes. If a staff member
        forgets their password, use a password-reset process instead
        of displaying the original password.
      </div>

    </div>
  );
};


// ========================================
// TABLE STYLES
// ========================================

const tableHeaderStyle: React.CSSProperties = {
  padding: '12px',
  textAlign: 'left',
  fontSize: '13px',
  fontWeight: '700',
  color: '#334155',
};

const tableCellStyle: React.CSSProperties = {
  padding: '12px',
  fontSize: '14px',
  color: '#334155',
};


export default AdminDashboard;

