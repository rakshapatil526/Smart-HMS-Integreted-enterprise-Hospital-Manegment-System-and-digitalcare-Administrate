import uuid
from django.db import models
from core.models import User, Department
from clinical.models import Patient, Appointment

class Hospital(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    address = models.TextField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    phone = models.CharField(max_length=50, blank=True, null=True, default='+91-80-2500-1008')
    emergency_available = models.BooleanField(default=True)
    facility_type = models.CharField(max_length=100, default='Multi-Specialty ER')
    available_beds = models.IntegerField(default=12)
    total_beds = models.IntegerField(default=50)
    trauma_center = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.latitude}, {self.longitude})"

class Ambulance(models.Model):
    STATUS_CHOICES = [
        ('Available', 'Available'),
        ('Assigned', 'Assigned'),
        ('En Route', 'En Route'),
        ('At Pickup', 'At Pickup'),
        ('Patient Onboard', 'Patient Onboard'),
        ('En Route to Hospital', 'En Route to Hospital'),
        ('Hospital Arrived', 'Hospital Arrived'),
        ('Completed', 'Completed'),
        ('Maintenance', 'Maintenance'),
        ('Out of Service', 'Out of Service'),
    ]
    
    TYPE_CHOICES = [
        ('Basic Ambulance', 'Basic Ambulance'),
        ('Advanced ALS', 'Advanced ALS'),
        ('Patient Transport', 'Patient Transport'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vehicle_number = models.CharField(max_length=50, unique=True)
    ambulance_type = models.CharField(max_length=50, choices=TYPE_CHOICES, default='Basic Ambulance')
    driver = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_ambulance')
    driver_name = models.CharField(max_length=100, default='Ravi Kumar')
    driver_phone = models.CharField(max_length=20, default='+91 9876543210')
    vehicle_model = models.CharField(max_length=100, default='Force Traveler ICU Ambulance')
    equipment_level = models.CharField(max_length=50, default='ALS (Advanced Life Support)')
    rating = models.FloatField(default=4.8)
    
    # Karnataka default GPS (Bengaluru Center: 12.9716, 77.5946)
    current_latitude = models.FloatField(default=12.9716)
    current_longitude = models.FloatField(default=77.5946)
    current_location_name = models.CharField(max_length=255, default='Indiranagar, Bengaluru')
    
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Available')
    
    # Operational Maintenance Checklist
    equipment_oxygen = models.BooleanField(default=True)
    equipment_first_aid = models.BooleanField(default=True)
    equipment_stretcher = models.BooleanField(default=True)
    equipment_defibrillator = models.BooleanField(default=True)
    equipment_ventilator = models.BooleanField(default=False)
    
    last_service_date = models.DateField(null=True, blank=True)
    next_service_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.vehicle_number} ({self.status})"

class EmergencyRequest(models.Model):
    STATUS_CHOICES = [
        ('REQUESTED', 'REQUESTED'),
        ('SEARCHING', 'SEARCHING'),
        ('DRIVER_ASSIGNED', 'DRIVER_ASSIGNED'),
        ('DRIVER_ACCEPTED', 'DRIVER_ACCEPTED'),
        ('EN_ROUTE_TO_PICKUP', 'EN_ROUTE_TO_PICKUP'),
        ('ARRIVED_AT_PICKUP', 'ARRIVED_AT_PICKUP'),
        ('PATIENT_ONBOARD', 'PATIENT_ONBOARD'),
        ('EN_ROUTE_TO_HOSPITAL', 'EN_ROUTE_TO_HOSPITAL'),
        ('ARRIVED_AT_HOSPITAL', 'ARRIVED_AT_HOSPITAL'),
        ('PATIENT_HANDOVER', 'PATIENT_HANDOVER'),
        ('COMPLETED', 'COMPLETED'),
        ('CANCELLED', 'CANCELLED'),
        ('Requested', 'Requested'),
        ('Assigned', 'Assigned'),
        ('En Route', 'En Route'),
        ('At Pickup', 'At Pickup'),
        ('Patient Onboard', 'Patient Onboard'),
        ('En Route to Hospital', 'En Route to Hospital'),
        ('Hospital Arrived', 'Hospital Arrived'),
    ]
    
    SEVERITY_CHOICES = [
        ('Critical', 'Critical'),
        ('Moderate', 'Moderate'),
        ('Minor', 'Minor'),
    ]

    PRIORITY_CHOICES = [
        ('CRITICAL', 'Critical'),
        ('HIGH', 'High'),
        ('MODERATE', 'Moderate'),
        ('LOW', 'Low'),
    ]

    EMERGENCY_TYPES = [
        ('Accident', '🚗 Accident'),
        ('Cardiac Emergency', '❤️ Cardiac Emergency'),
        ('Neurological Emergency', '🧠 Neurological Emergency'),
        ('Breathing Difficulty', '🫁 Breathing Difficulty'),
        ('Injury', '🤕 Injury'),
        ('Burn', '🔥 Burn'),
        ('Pediatric Emergency', '👶 Pediatric Emergency'),
        ('Other', '🚨 Other'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    request_number = models.CharField(max_length=50, unique=True)
    
    # Patient linkage (optional FK for unknown patients)
    patient = models.ForeignKey(Patient, on_delete=models.SET_NULL, null=True, blank=True, related_name='emergency_trips')
    patient_name = models.CharField(max_length=100, default='Emergency Patient')
    patient_phone = models.CharField(max_length=20, default='+91 9876512345')
    temp_patient_id = models.CharField(max_length=50, blank=True, null=True)
    
    # Emergency Details
    emergency_type = models.CharField(max_length=50, choices=EMERGENCY_TYPES, default='Accident')
    short_description = models.TextField(blank=True, null=True)
    number_of_patients = models.IntegerField(default=1)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='Critical')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='HIGH')
    
    # Location Telemetry (Karnataka default)
    pickup_address = models.TextField(default='MG Road, Bengaluru')
    latitude = models.FloatField(default=12.9716)
    longitude = models.FloatField(default=77.5946)
    destination_hospital = models.CharField(max_length=255, default='Smart Care Super Specialty Hospital, Bengaluru')
    destination_latitude = models.FloatField(blank=True, null=True)
    destination_longitude = models.FloatField(blank=True, null=True)
    
    # Dispatch & Driver Assignment
    assigned_ambulance = models.ForeignKey(Ambulance, on_delete=models.SET_NULL, null=True, blank=True, related_name='emergency_requests')
    driver_name = models.CharField(max_length=100, blank=True, null=True)
    driver_phone = models.CharField(max_length=20, blank=True, null=True)
    
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Requested')
    eta_minutes = models.IntegerField(default=8)
    
    # ER Alert & Handover Preparation
    hospital_alert_sent = models.BooleanField(default=False)
    hospital_alert_acknowledged = models.BooleanField(default=False)
    doctor_assessment_notes = models.TextField(blank=True, null=True)
    assigned_doctor_name = models.CharField(max_length=100, blank=True, null=True, default='Dr. Mehta')
    assigned_nurse_name = models.CharField(max_length=100, blank=True, null=True, default='Nurse Anjali')
    assigned_er_bay = models.CharField(max_length=50, blank=True, null=True, default='E-02 (Emergency)')
    driver_rating = models.FloatField(default=4.8)
    distance_km = models.FloatField(default=2.1)
    handover_time = models.DateTimeField(blank=True, null=True)
    
    # Integration flags
    ipd_admission_required = models.BooleanField(default=False)
    ipd_bed_allocated = models.CharField(max_length=50, blank=True, null=True)
    billing_amount = models.DecimalField(max_digits=10, decimal_places=2, default=850.00)
    billing_invoice_generated = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.request_number} - {self.patient_name} ({self.status})"

class HREmployee(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='hr_profile')
    employee_id = models.CharField(max_length=50, unique=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    designation = models.CharField(max_length=100)
    date_of_joining = models.DateField()
    shift = models.CharField(max_length=50, default='General (09:00 - 17:00)')
    base_monthly_salary = models.DecimalField(max_digits=10, decimal_places=2)

class Payroll(models.Model):
    STATUS_CHOICES = [('Draft', 'Draft'), ('Processed', 'Processed'), ('Paid', 'Paid')]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(HREmployee, on_delete=models.CASCADE, related_name='payrolls')
    month = models.IntegerField()
    year = models.IntegerField()
    base_salary = models.DecimalField(max_digits=10, decimal_places=2)
    allowances = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    net_salary = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Processed')
    salary_slip_pdf_url = models.CharField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class TelemedicineAppointment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE, related_name='telemedicine_session')
    room_id = models.CharField(max_length=100, unique=True)
    meeting_url = models.CharField(max_length=500)
    consultation_notes = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, default='Scheduled')
    created_at = models.DateTimeField(auto_now_add=True)
