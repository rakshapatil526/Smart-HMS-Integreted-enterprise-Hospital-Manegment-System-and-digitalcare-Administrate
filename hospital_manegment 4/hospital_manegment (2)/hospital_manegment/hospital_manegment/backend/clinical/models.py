import uuid
from django.db import models
from core.models import User, Department

class Patient(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient_id = models.CharField(max_length=50, unique=True) # PAT-2026-XXXX
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    dob = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=20, choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')])
    blood_group = models.CharField(max_length=10)
    emergency_contact_name = models.CharField(max_length=100)
    emergency_contact_phone = models.CharField(max_length=20)
    allergies = models.TextField(blank=True, default="None")
    chronic_conditions = models.TextField(blank=True, default="None")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.patient_id} - {self.user.get_full_name()}"

class Doctor(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    doctor_id = models.CharField(max_length=50, unique=True) # DOC-XXXX
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='doctors')
    specialization = models.CharField(max_length=150)
    qualification = models.CharField(max_length=150)
    experience_years = models.IntegerField(default=5)
    bio = models.TextField(blank=True, null=True)
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=500.00)
    schedule = models.JSONField(default=dict, blank=True) # e.g. {"Mon": ["09:00-12:00", "14:00-17:00"]}
    photo_url = models.CharField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Dr. {self.user.get_full_name()} ({self.specialization})"

class Appointment(models.Model):
    STATUS_CHOICES = [
        ('Booked', 'Booked'),
        ('Checked-in', 'Checked-in'),
        ('In-Consultation', 'In-Consultation'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    ]
    TYPE_CHOICES = [
        ('OPD', 'OPD'),
        ('Telemedicine', 'Telemedicine'),
        ('Follow-up', 'Follow-up'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    appointment_number = models.CharField(max_length=50, unique=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='appointments')
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    appointment_date = models.DateField()
    time_slot = models.CharField(max_length=50)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='OPD')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Booked')
    token_number = models.IntegerField(default=1)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class OPDConsultation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE, related_name='opd_consultation')
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    symptoms = models.TextField()
    clinical_notes = models.TextField()
    diagnosis = models.TextField()
    vitals = models.JSONField(default=dict) # e.g. {"bp": "120/80", "hr": "72", "temp": "98.6F", "spo2": "99%"}
    follow_up_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Bed(models.Model):
    TYPE_CHOICES = [('ICU', 'ICU'), ('General', 'General Ward'), ('Private', 'Private Room'), ('Emergency', 'Emergency')]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ward_name = models.CharField(max_length=100)
    bed_number = models.CharField(max_length=20)
    bed_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='General')
    daily_charge = models.DecimalField(max_digits=10, decimal_places=2, default=1000.00)
    is_occupied = models.BooleanField(default=False)
    current_patient = models.ForeignKey(Patient, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_bed')

    def __str__(self):
        return f"{self.ward_name} - Bed {self.bed_number}"

class Admission(models.Model):
    STATUS_CHOICES = [('Admitted', 'Admitted'), ('Transferred', 'Transferred'), ('Discharged', 'Discharged')]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    admission_number = models.CharField(max_length=50, unique=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='admissions')
    attending_doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    bed = models.ForeignKey(Bed, on_delete=models.SET_NULL, null=True, blank=True)
    admission_date = models.DateTimeField(auto_now_add=True)
    discharge_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Admitted')
    reason_for_admission = models.TextField()
    discharge_summary = models.TextField(blank=True, null=True)

class NursingRecord(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    admission = models.ForeignKey(Admission, on_delete=models.CASCADE, related_name='nursing_records')
    nurse = models.ForeignKey(User, on_delete=models.CASCADE)
    vitals = models.JSONField(default=dict)
    administered_medicines = models.TextField(blank=True, null=True)
    nursing_notes = models.TextField()
    shift = models.CharField(max_length=20, choices=[('Morning', 'Morning'), ('Evening', 'Evening'), ('Night', 'Night')])
    recorded_at = models.DateTimeField(auto_now_add=True)

class OTSchedule(models.Model):
    STATUS_CHOICES = [('Scheduled', 'Scheduled'), ('In-Progress', 'In-Progress'), ('Completed', 'Completed'), ('Cancelled', 'Cancelled')]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ot_room = models.CharField(max_length=50)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    lead_surgeon = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='lead_surgeries')
    anesthetist = models.CharField(max_length=100)
    surgery_name = models.CharField(max_length=200)
    scheduled_datetime = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Scheduled')
    pre_op_notes = models.TextField(blank=True, null=True)
    post_op_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class EHRTimeline(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='ehr_entries')
    event_type = models.CharField(max_length=50) # 'Consultation', 'Lab Report', 'Radiology', 'Prescription', 'Admission', 'Surgery', 'Discharge'
    summary = models.CharField(max_length=255)
    details = models.JSONField(default=dict)
    recorded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
