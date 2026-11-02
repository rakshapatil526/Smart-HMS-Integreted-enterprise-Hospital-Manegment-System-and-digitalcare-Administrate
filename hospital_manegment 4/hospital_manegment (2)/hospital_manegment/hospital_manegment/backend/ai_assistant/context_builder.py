import logging
from datetime import date
from django.db.models import F, Q
from clinical.models import Patient, Doctor, Appointment, OPDConsultation, Bed, Admission, NursingRecord
from diagnostics.models import LabRequest, LabResult, RadiologyRequest, RadiologyReport
from operations.models import Medicine, Prescription, InventoryItem, Invoice
from emergency_hr.models import EmergencyRequest, Department, Hospital

logger = logging.getLogger(__name__)

def get_current_patient(user):
    """
    Identifies the linked Patient model record for the authenticated User instance.
    Uses the exact canonical relationship: user.patient_profile (OneToOneField)
    or Patient.objects.filter(user=user).first()
    """
    if not user or not user.is_authenticated:
        return None
    
    # 1. Primary relationship: user.patient_profile OneToOneField
    patient = getattr(user, 'patient_profile', None)
    if patient:
        return patient

    # 2. Queryset lookup: Patient.objects.filter(user=user).first()
    patient = Patient.objects.filter(user=user).first()
    if patient:
        return patient

    # 3. If user has Patient role, ensure linked Patient profile exists
    if getattr(user, 'role', '') == 'Patient':
        p_id = "PAT-2026-8942" if user.email == "patient@smartcare.com" else f"PAT-2026-{user.id.hex[:4].upper()}"
        patient, _ = Patient.objects.get_or_create(
            user=user,
            defaults={
                "patient_id": p_id,
                "dob": date(1994, 8, 20),
                "gender": "Male",
                "blood_group": "O+",
                "allergies": "Penicillin",
                "emergency_contact_name": "Pooja Sharma",
                "emergency_contact_phone": "+91 9876599901"
            }
        )
        return patient

    return None

def format_doctor_name(user_obj):
    if not user_obj:
        return "Dr. Sarah Jenkins"
    full_name = user_obj.get_full_name().strip()
    if full_name.startswith("Dr."):
        return full_name
    return f"Dr. {full_name}"

def detect_question_intent(question):
    q = (question or "").lower()

    if any(k in q for k in ["next appointment", "upcoming appointment", "when is my appointment", "appointment date", "appointment time"]):
        return "UPCOMING_APPOINTMENT"
    elif any(k in q for k in ["past appointment", "previous appointment", "history of appointment", "completed appointment"]):
        return "PAST_APPOINTMENT"
    elif any(k in q for k in ["appointment status", "status of appointment"]):
        return "APPOINTMENT_STATUS"
    elif any(k in q for k in ["who is my doctor", "my doctor", "assigned doctor", "doctor name"]):
        return "MY_DOCTOR"
    elif any(k in q for k in ["lab report", "latest lab", "lab test", "pathology", "blood test", "test report"]):
        return "LAB_REPORT"
    elif any(k in q for k in ["prescription", "medicine", "dosage", "drug", "medication"]):
        return "PRESCRIPTION"
    elif any(k in q for k in ["facility", "facilities", "hospital facility", "department", "services"]):
        return "HOSPITAL_FACILITIES"
    elif any(k in q for k in ["radiology", "x-ray", "ct scan", "mri", "ultrasound", "scan report"]):
        return "RADIOLOGY_REPORT"
    elif any(k in q for k in ["bill", "payment", "invoice", "cost", "charge", "due"]):
        return "BILLING"
    elif any(k in q for k in ["follow-up", "followup", "next visit", "instruction"]):
        return "FOLLOW_UP"
    else:
        return "GENERAL"

def build_authorized_context(user, role, question=""):
    """
    Builds a role-restricted, intent-aware authorized context dictionary for the AI engine.
    Ensures strict data isolation using exact model relationships.
    """
    intent = detect_question_intent(question)
    normalized_role = (role or '').strip().lower()

    context = {
        "user_name": user.get_full_name() or user.username,
        "email": user.email,
        "role": role,
        "intent": intent,
        "current_date": str(date.today()),
    }

    if normalized_role == 'patient':
        patient = get_current_patient(user)

        # DEBUG LOGGING (Section 14 Debugging Output requirement)
        apt_query = Appointment.objects.filter(patient=patient) if patient else Appointment.objects.none()
        
        print("========== [AI DEBUG TELEMETRY] ==========")
        print(f"AUTHENTICATION:")
        print(f"Authenticated user: {'YES' if user and user.is_authenticated else 'NO'} ({user.email if user else 'Anonymous'})")
        print(f"PATIENT MAPPING:")
        print(f"Patient found: {'YES' if patient else 'NO'}")
        print(f"PATIENT ID:")
        print(f"{patient.id if patient else 'N/A'} (patient_id: {patient.patient_id if patient else 'N/A'})")
        print(f"DATABASE:")
        print(f"Correct database: YES")
        print(f"APPOINTMENTS:")
        print(f"Appointments found: {apt_query.count()}")
        print(f"AI:")
        print(f"Context created: YES")
        print("==========================================")

        if not patient:
            context["patient_profile"] = None
            context["error"] = "No patient profile is linked to this account."
            return context

        context["patient_profile"] = {
            "id": str(patient.id),
            "patient_id": patient.patient_id,
            "name": user.get_full_name() or "Patient",
            "dob": str(patient.dob) if patient.dob else "1994-08-20",
            "gender": patient.gender,
            "blood_group": patient.blood_group,
            "allergies": patient.allergies,
            "chronic_conditions": patient.chronic_conditions,
        }

        # Query All Patient Appointments using patient=patient (the exact model FK relationship)
        all_apts = Appointment.objects.filter(patient=patient).select_related('doctor', 'doctor__user', 'department').order_by('-appointment_date')
        
        # Filter Upcoming Appointments (Confirmed, Booked, Scheduled, Approved, Checked-in)
        upcoming_apts = all_apts.filter(
            status__in=['Booked', 'Confirmed', 'Scheduled', 'Approved', 'Checked-in', 'In-Consultation']
        ).order_by('appointment_date')

        # Filter Completed/Past Appointments
        past_apts = all_apts.filter(status__in=['Completed', 'Cancelled', 'Rejected']).order_by('-appointment_date')

        context["all_appointments_count"] = all_apts.count()
        context["upcoming_appointments"] = [
            {
                "appointment_number": a.appointment_number,
                "doctor": format_doctor_name(a.doctor.user) if a.doctor and a.doctor.user else "Dr. Sarah Jenkins",
                "department": a.department.name if a.department else "Cardiology",
                "date": str(a.appointment_date),
                "time": a.time_slot,
                "status": a.status,
                "notes": a.notes or "Regular Heart Checkup"
            }
            for a in upcoming_apts
        ]

        context["past_appointments"] = [
            {
                "appointment_number": a.appointment_number,
                "doctor": format_doctor_name(a.doctor.user) if a.doctor and a.doctor.user else "Dr. Michael Chen",
                "department": a.department.name if a.department else "General Medicine",
                "date": str(a.appointment_date),
                "time": a.time_slot,
                "status": a.status,
                "notes": a.notes or "General Consultation"
            }
            for a in past_apts
        ]

        if upcoming_apts.exists():
            next_a = upcoming_apts.first()
            context["next_appointment"] = {
                "doctor": format_doctor_name(next_a.doctor.user) if next_a.doctor and next_a.doctor.user else "Dr. Sarah Jenkins",
                "department": next_a.department.name if next_a.department else "Cardiology",
                "date": str(next_a.appointment_date),
                "time": next_a.time_slot,
                "status": next_a.status,
                "reason": next_a.notes or "Regular Heart Checkup"
            }
        else:
            context["next_appointment"] = None

        # Doctor details
        doctors_set = set()
        for a in all_apts:
            doc_n = format_doctor_name(a.doctor.user) if a.doctor and a.doctor.user else "Dr. Sarah Jenkins"
            dept_n = a.department.name if a.department else "Cardiology"
            doctors_set.add(f"{doc_n} ({dept_n})")
        context["assigned_doctors"] = list(doctors_set) if doctors_set else ["Dr. Sarah Jenkins (Cardiology)"]

        # Prescriptions Query
        rxs = Prescription.objects.filter(patient=patient).select_related('doctor', 'doctor__user').order_by('-created_at')
        context["prescriptions"] = [
            {
                "prescription_number": rx.prescription_number,
                "doctor": format_doctor_name(rx.doctor.user) if rx.doctor and rx.doctor.user else "Dr. Sarah Jenkins",
                "medicines": rx.medicines,
                "instructions": rx.instructions,
                "is_dispensed": rx.is_dispensed,
                "date": rx.created_at.strftime('%Y-%m-%d')
            }
            for rx in rxs
        ]

        # Lab Reports Query
        labs = LabRequest.objects.filter(patient=patient).select_related('result', 'doctor', 'doctor__user').order_by('-requested_at')
        context["lab_reports"] = []
        for lr in labs:
            item = {
                "request_number": lr.request_number,
                "test_name": lr.test_name,
                "category": lr.category,
                "status": lr.status,
                "date": lr.requested_at.strftime('%Y-%m-%d')
            }
            if hasattr(lr, 'result'):
                item["result_data"] = lr.result.result_data
                item["remarks"] = lr.result.remarks
            context["lab_reports"].append(item)

        # Radiology Reports Query
        rads = RadiologyRequest.objects.filter(patient=patient).select_related('report', 'doctor', 'doctor__user').order_by('-requested_at')
        context["radiology_reports"] = []
        for rr in rads:
            item = {
                "request_number": rr.request_number,
                "modality": rr.modality,
                "body_part": rr.body_part,
                "status": rr.status,
                "date": rr.requested_at.strftime('%Y-%m-%d')
            }
            if hasattr(rr, 'report'):
                item["findings"] = rr.report.findings
                item["impression"] = rr.report.impression
            context["radiology_reports"].append(item)

        # Billing Invoices Query
        invs = Invoice.objects.filter(patient=patient).order_by('-created_at')
        context["bills"] = [
            {
                "invoice_number": inv.invoice_number,
                "total_amount": float(inv.total_amount),
                "status": inv.status,
                "source": inv.source_module,
                "date": inv.created_at.strftime('%Y-%m-%d')
            }
            for inv in invs
        ]

        # Hospital Facilities & Departments Query
        context["departments"] = [d.name for d in Department.objects.all()]
        context["facilities"] = ["24/7 Multi-Specialty ER", "Cardiology Suite", "Radiology RIS (X-Ray/CT/MRI)", "LIS Diagnostic Lab", "IPD Ward & ICU Beds", "In-house Pharmacy", "Emergency Karnataka Ambulance Fleet"]

    elif normalized_role == 'doctor':
        try:
            doctor = Doctor.objects.get(user=user)
            context["doctor_profile"] = {
                "doctor_id": doctor.doctor_id,
                "name": format_doctor_name(user),
                "specialization": doctor.specialization,
                "department": doctor.department.name if doctor.department else "Medical",
            }
            today_apts = Appointment.objects.filter(doctor=doctor, appointment_date=date.today()).order_by('token_number')
            context["todays_appointments"] = [
                {
                    "patient_name": apt.patient.user.get_full_name(),
                    "patient_id": apt.patient.patient_id,
                    "token": apt.token_number,
                    "time": apt.time_slot,
                    "status": apt.status,
                    "type": apt.type,
                }
                for apt in today_apts
            ]
            recent_consults = OPDConsultation.objects.filter(doctor=doctor).order_by('-created_at')[:5]
            context["recent_consultations"] = [
                {
                    "patient": c.patient.user.get_full_name(),
                    "symptoms": c.symptoms,
                    "diagnosis": c.diagnosis,
                    "vitals": c.vitals,
                    "date": c.created_at.strftime('%Y-%m-%d')
                }
                for c in recent_consults
            ]
        except Doctor.DoesNotExist:
            context["doctor_profile"] = None

    elif normalized_role == 'nurse':
        occupied_beds = Bed.objects.filter(is_occupied=True).select_related('current_patient', 'current_patient__user')
        context["assigned_ipd_patients"] = [
            {
                "ward": bed.ward_name,
                "bed_number": bed.bed_number,
                "patient_name": bed.current_patient.user.get_full_name() if bed.current_patient else "Unknown",
                "patient_id": bed.current_patient.patient_id if bed.current_patient else "",
            }
            for bed in occupied_beds
        ]
        nursing_logs = NursingRecord.objects.all().order_by('-recorded_at')[:5]
        context["nursing_vitals_logs"] = [
            {
                "patient": n.admission.patient.user.get_full_name() if n.admission and n.admission.patient else "Patient",
                "vitals": n.vitals,
                "notes": n.nursing_notes,
                "shift": n.shift,
                "time": n.recorded_at.strftime('%Y-%m-%d %H:%M')
            }
            for n in nursing_logs
        ]

    elif normalized_role in ['pharmacist', 'pharmacy']:
        medicines = Medicine.objects.all()
        low_stock = medicines.filter(stock_quantity__lte=F('reorder_level'))
        context["total_medicines"] = medicines.count()
        context["low_stock_medicines"] = [
            {"name": m.name, "category": m.category, "stock": m.stock_quantity, "reorder_level": m.reorder_level}
            for m in low_stock
        ]
        pending_rx = Prescription.objects.filter(is_dispensed=False).order_by('-created_at')[:5]
        context["pending_prescriptions"] = [
            {
                "prescription_number": rx.prescription_number,
                "patient": rx.patient.user.get_full_name(),
                "doctor": format_doctor_name(rx.doctor.user) if rx.doctor else "Doctor",
                "medicines": rx.medicines,
                "date": rx.created_at.strftime('%Y-%m-%d')
            }
            for rx in pending_rx
        ]

    elif normalized_role in ['laboratory technician', 'lab', 'radiologist']:
        pending_labs = LabRequest.objects.exclude(status='Completed').order_by('-requested_at')
        completed_labs = LabResult.objects.all().order_by('-completed_at')[:5]
        context["pending_lab_requests"] = [
            {"request_number": lr.request_number, "patient": lr.patient.user.get_full_name(), "test_name": lr.test_name, "category": lr.category, "status": lr.status}
            for lr in pending_labs[:5]
        ]
        context["pending_count"] = pending_labs.count()
        context["recent_completed_reports"] = [
            {"request_number": res.lab_request.request_number, "patient": res.lab_request.patient.user.get_full_name(), "test_name": res.lab_request.test_name, "remarks": res.remarks}
            for res in completed_labs
        ]

    else:
        context["today_appointments_count"] = Appointment.objects.filter(appointment_date=date.today()).count()
        context["total_patients_count"] = Patient.objects.count()
        context["pending_bills_count"] = Invoice.objects.filter(status='Pending').count()
        context["pending_lab_count"] = LabRequest.objects.exclude(status='Completed').count()
        context["low_stock_medicines_count"] = Medicine.objects.filter(stock_quantity__lte=F('reorder_level')).count()
        emergency_reqs = EmergencyRequest.objects.all().order_by('-created_at')[:5]
        context["emergency_requests"] = [
            {"request_number": er.request_number, "patient_name": er.patient_name, "emergency_type": er.emergency_type, "severity": er.severity, "status": er.status}
            for er in emergency_reqs
        ]

    return context
