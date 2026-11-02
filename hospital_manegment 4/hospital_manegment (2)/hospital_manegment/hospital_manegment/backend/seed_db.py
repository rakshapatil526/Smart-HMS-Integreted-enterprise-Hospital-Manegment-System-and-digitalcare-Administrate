import os
import sys
import django
import random
from datetime import datetime, date, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smartcare.settings')
django.setup()

from core.models import User, Department, RoleChoices, AuditLog
from clinical.models import Patient, Doctor, Appointment, OPDConsultation, Bed, Admission, NursingRecord, OTSchedule, EHRTimeline
from diagnostics.models import LabRequest, LabResult, RadiologyRequest, RadiologyReport
from operations.models import Medicine, Prescription, PharmacyDispensing, InventoryItem, StockTransaction, Invoice, Payment, InsuranceProvider, PatientInsurance, InsuranceClaim, BloodUnit, BloodRequest
from emergency_hr.models import Hospital, Ambulance, EmergencyRequest, HREmployee, Payroll, TelemedicineAppointment

def run_seed():
    print("Starting Smart Care Database Seeding Process...")

    # Clear existing non-admin data
    User.objects.filter(is_superuser=False).delete()
    Department.objects.all().delete()
    Hospital.objects.all().delete()
    Ambulance.objects.all().delete()
    EmergencyRequest.objects.all().delete()
    BloodUnit.objects.all().delete()
    Medicine.objects.all().delete()
    Bed.objects.all().delete()
    Appointment.objects.all().delete()

    # 1. Create Departments (10 exact departments)
    departments_data = [
        ("Cardiology", "CARD", "Heart & Vascular Care"),
        ("Neurology", "NEUR", "Brain, Spine & Nervous System"),
        ("Orthopedics", "ORTH", "Bone, Joint & Musculoskeletal Care"),
        ("Pediatrics", "PEDI", "Childhood & Adolescent Medicine"),
        ("General Medicine", "GENM", "Internal Medicine & General Health"),
        ("General Surgery", "GSUR", "Advanced Minimal Access & Laparoscopic Surgery"),
        ("Gynecology & Obstetrics", "GYNE", "Women's Health & Maternity Care"),
        ("Dermatology", "DERM", "Skin, Hair & Nail Care"),
        ("ENT", "ENT", "Ear, Nose, Throat & Head Care"),
        ("Ophthalmology", "OPHT", "Eye Care & Vision Surgery"),
    ]

    dept_objs = {}
    for name, code, desc in departments_data:
        d = Department.objects.create(name=name, code=code, description=desc)
        dept_objs[name] = d
    print(f"Created {len(dept_objs)} Departments.")

    # Password for all demo accounts
    DEFAULT_PASS = "Password@123"

    # 2. Create Demo Accounts for all 16 Roles
    demo_roles = [
        ("patient@smartcare.com", RoleChoices.PATIENT, "Patient", "Demo"),
        ("reception@smartcare.com", RoleChoices.RECEPTION, "Reception", "Staff"),
        ("doctor@smartcare.com", RoleChoices.DOCTOR, "Sarah", "Jenkins"),
        ("nurse@smartcare.com", RoleChoices.NURSE, "Senior", "Nurse"),
        ("labtech@smartcare.com", RoleChoices.LAB_TECH, "Lab", "Technician"),
        ("radiologist@smartcare.com", RoleChoices.RADIOLOGIST, "Chief", "Radiologist"),
        ("pharmacist@smartcare.com", RoleChoices.PHARMACIST, "Head", "Pharmacist"),
        ("otstaff@smartcare.com", RoleChoices.OT_STAFF, "OT", "Coordinator"),
        ("billing@smartcare.com", RoleChoices.BILLING_STAFF, "Billing", "Officer"),
        ("insurance@smartcare.com", RoleChoices.INSURANCE_STAFF, "TPA Insurance", "Agent"),
        ("inventory@smartcare.com", RoleChoices.INVENTORY_MANAGER, "Inventory", "Manager"),
        ("bloodbank@smartcare.com", RoleChoices.BLOOD_BANK_STAFF, "Blood Bank", "Officer"),
        ("ambulanceop@smartcare.com", RoleChoices.AMBULANCE_OPERATOR, "Dispatch", "Operator"),
        ("ambulancedriver@smartcare.com", RoleChoices.AMBULANCE_DRIVER, "Emergency", "Driver"),
        ("hrstaff@smartcare.com", RoleChoices.HR_STAFF, "HR", "Manager"),
        ("admin@smartcare.com", RoleChoices.ADMIN, "System", "Admin"),
    ]

    demo_users = {}
    for email, role, fname, lname in demo_roles:
        u = User.objects.create_user(
            username=email,
            email=email,
            password=DEFAULT_PASS,
            first_name=fname,
            last_name=lname,
            role=role,
            department=dept_objs["Cardiology"] if role == RoleChoices.DOCTOR else None
        )
        demo_users[role] = u
    print("Created 16 Demo Role Login Accounts.")

    # 3. Create 20 Exact Synthetic Patient Records (SC-P001 to SC-P020)
    synthetic_patients_data = [
        ("SC-P001", "Aarav", "Sharma", 32, "Male", "Cardiology", "Dr. Arjun Mehta", "A+", "Penicillin", "+91 9876500001", "104 Sunrise Vista, Tech Corridor", "Pooja Sharma", "+91 9876599901"),
        ("SC-P002", "Anika", "Rao", 27, "Female", "Dermatology", "Dr. Nisha Patel", "B+", "Dust Mites", "+91 9876500002", "42 Jasmine Gardens, Sector 4", "Suresh Rao", "+91 9876599902"),
        ("SC-P003", "Rohan", "Verma", 45, "Male", "General Medicine", "Dr. Vikram Rao", "O+", "Peanuts", "+91 9876500003", "88 Green Park, Block B", "Suman Verma", "+91 9876599903"),
        ("SC-P004", "Meera", "Nair", 38, "Female", "Gynecology & Obstetrics", "Dr. Meera Sharma", "AB+", "None", "+91 9876500004", "15 Lotus Avenue, West End", "Rajesh Nair", "+91 9876599904"),
        ("SC-P005", "Kabir", "Singh", 21, "Male", "Orthopedics", "Dr. Karan Shah", "A-", "Aspirin", "+91 9876500005", "77 Student Housing, Campus Road", "Harpreet Singh", "+91 9876599905"),
        ("SC-P006", "Diya", "Patel", 19, "Female", "ENT", "Dr. Amit Kulkarni", "O-", "Latex", "+91 9876500006", "12 Orchid Street, North Suburb", "Vikram Patel", "+91 9876599906"),
        ("SC-P007", "Arjun", "Kumar", 56, "Male", "Cardiology", "Dr. Priya Nair", "B-", "Sulfa Drugs", "+91 9876500007", "302 Silver Heights, Main Boulevard", "Sunita Kumar", "+91 9876599907"),
        ("SC-P008", "Sneha", "Iyer", 31, "Female", "Neurology", "Dr. Rahul Verma", "AB-", "None", "+91 9876500008", "54 Palms Enclave, South Extension", "Ramesh Iyer", "+91 9876599908"),
        ("SC-P009", "Vihaan", "Das", 8, "Male", "Pediatrics", "Dr. Neha Kapoor", "A+", "Dairy", "+91 9876500009", "90 Rosewood Residency, Central District", "Rohan Das", "+91 9876599909"),
        ("SC-P010", "Ishita", "Roy", 12, "Female", "Pediatrics", "Dr. Rohan Das", "B+", "Nuts", "+91 9876500010", "18 Cedar Towers, East Colony", "Manish Roy", "+91 9876599910"),
        ("SC-P011", "Aditya", "Shah", 41, "Male", "Ophthalmology", "Dr. Aditya Rao", "O+", "None", "+91 9876500011", "201 Heritage Square, Old Town", "Kinjal Shah", "+91 9876599911"),
        ("SC-P012", "Kavya", "Menon", 29, "Female", "General Surgery", "Dr. Sameer Joshi", "A+", "Iodine", "+91 9876500012", "33 Maple Court, Greenfield", "Vijay Menon", "+91 9876599912"),
        ("SC-P013", "Rahul", "Joshi", 63, "Male", "Neurology", "Dr. Sneha Rao", "B+", "None", "+91 9876500013", "61 Valley View, Hill Station Road", "Seema Joshi", "+91 9876599913"),
        ("SC-P014", "Nisha", "Kapoor", 35, "Female", "Dermatology", "Dr. Riya Malhotra", "O-", "Sulfa", "+91 9876500014", "88 Cyber City, Phase 2", "Amit Kapoor", "+91 9876599914"),
        ("SC-P015", "Karan", "Desai", 48, "Male", "ENT", "Dr. Pooja Desai", "AB+", "None", "+91 9876500015", "14 Ocean Drive, Waterfront", "Pooja Desai", "+91 9876599915"),
        ("SC-P016", "Pooja", "Sharma", 52, "Female", "General Medicine", "Dr. Aditi Menon", "A+", "NSAIDs", "+91 9876500016", "99 Royal Enclave, Ring Road", "Aarav Sharma", "+91 9876599916"),
        ("SC-P017", "Aman", "Gupta", 25, "Male", "Orthopedics", "Dr. Ananya Iyer", "B-", "None", "+91 9876500017", "11 College Lane, University District", "Sanjay Gupta", "+91 9876599917"),
        ("SC-P018", "Riya", "Malhotra", 44, "Female", "Ophthalmology", "Dr. Tanya Kapoor", "O+", "Pollen", "+91 9876500018", "404 Metro Towers, Station Road", "Karan Malhotra", "+91 9876599918"),
        ("SC-P019", "Neel", "Mehta", 67, "Male", "General Surgery", "Dr. Kavya Singh", "A-", "Contrast Dye", "+91 9876500019", "77 Senior Living Society, Lake Road", "Arjun Mehta", "+91 9876599919"),
        ("SC-P020", "Tanya", "Rao", 30, "Female", "Gynecology & Obstetrics", "Dr. Ishita Roy", "AB-", "None", "+91 9876500020", "23 Pine Wood, West Suburb", "Aditya Rao", "+91 9876599920"),
    ]

    patient_objs = []
    current_year = date.today().year
    for pid, fn, ln, age, gen, dept_name, doc_name, bg, allergies, phone, address, emer_name, emer_phone in synthetic_patients_data:
        p_email = f"{fn.lower()}.{ln.lower()}@example.com"
        u = User.objects.filter(email=p_email).first()
        if not u:
            u = User.objects.create_user(
                username=p_email,
                email=p_email,
                password=DEFAULT_PASS,
                first_name=fn,
                last_name=ln,
                role=RoleChoices.PATIENT,
                phone=phone,
                address=address
            )
        
        dob_val = date(current_year - age, 5, 15)
        p = Patient.objects.create(
            patient_id=pid,
            user=u,
            dob=dob_val,
            gender=gen,
            blood_group=bg,
            emergency_contact_name=emer_name,
            emergency_contact_phone=emer_phone,
            allergies=allergies,
            chronic_conditions="None"
        )
        patient_objs.append(p)
    print(f"Created {len(patient_objs)} Synthetic Patient Records (SC-P001 to SC-P020).")

    # 4. Create Doctors
    doctors_spec = [
        # Cardiology
        ("Dr. Narayan Swamy", "Swamy", "Cardiology", "Senior Consultant Cardiologist", "Interventional Cardiology & Cardiac Care", 16, 900.00, "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&q=80"),
        ("Dr. Sarah Jenkins", "Jenkins", "Cardiology", "Senior Consultant Cardiologist", "Interventional Cardiology & Clinical Operations", 14, 850.00, "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&q=80"),
        ("Dr. Arjun Mehta", "Mehta", "Cardiology", "Senior Consultant Cardiologist", "Interventional Cardiology", 12, 800.00, "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&q=80"),
        ("Dr. Priya Nair", "Nair", "Cardiology", "Junior Consultant Cardiologist", "Clinical Cardiology", 5, 500.00, "https://images.unsplash.com/photo-1594824813566-88855ce7890b?w=300&q=80"),
        # Neurology
        ("Dr. Rahul Verma", "Verma", "Neurology", "Senior Neurologist", "Neuro-vascular & Stroke Care", 15, 900.00, "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&q=80"),
        ("Dr. Sneha Rao", "Rao", "Neurology", "Consultant Neurologist", "Epilepsy & Movement Disorders", 6, 600.00, "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&q=80"),
        # Orthopedics
        ("Dr. Karan Shah", "Shah", "Orthopedics", "Senior Orthopedic Surgeon", "Joint Replacement & Trauma", 14, 850.00, "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&q=80"),
        ("Dr. Ananya Iyer", "Iyer", "Orthopedics", "Junior Orthopedic Consultant", "Sports Medicine & Arthroscopy", 4, 550.00, "https://images.unsplash.com/photo-1594824813566-88855ce7890b?w=300&q=80"),
        # Pediatrics
        ("Dr. Neha Kapoor", "Kapoor", "Pediatrics", "Senior Pediatrician", "Pediatric Care & Immunization", 11, 700.00, "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&q=80"),
        ("Dr. Rohan Das", "Das", "Pediatrics", "Consultant Pediatrician", "Neonatology & Child Nutrition", 5, 500.00, "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&q=80"),
        # General Medicine
        ("Dr. Michael Chen", "Chen", "General Medicine", "Senior Consultant Physician", "Internal Medicine & General Health", 12, 750.00, "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&q=80"),
        ("Dr. Vikram Rao", "Rao", "General Medicine", "Senior Physician", "Internal Medicine & Diabetology", 16, 750.00, "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&q=80"),
        ("Dr. Aditi Menon", "Menon", "General Medicine", "Junior Physician", "General Clinical Diagnosis", 3, 450.00, "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80"),
        # General Surgery
        ("Dr. Sameer Joshi", "Joshi", "General Surgery", "Senior General Surgeon", "Laparoscopic & GI Surgery", 18, 1000.00, "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&q=80"),
        ("Dr. Kavya Singh", "Singh", "General Surgery", "Consultant General Surgeon", "Minimal Access Surgery", 7, 650.00, "https://images.unsplash.com/photo-1594824813566-88855ce7890b?w=300&q=80"),
        # Gynecology & Obstetrics
        ("Dr. Meera Sharma", "Sharma", "Gynecology & Obstetrics", "Senior Gynecologist", "High-Risk Pregnancy & Fetal Medicine", 13, 800.00, "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&q=80"),
        ("Dr. Ishita Roy", "Roy", "Gynecology & Obstetrics", "Junior Gynecologist", "Reproductive Health", 4, 500.00, "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80"),
        # Dermatology
        ("Dr. Nisha Patel", "Patel", "Dermatology", "Senior Dermatologist", "Clinical Dermatology & Cosmetology", 10, 750.00, "https://images.unsplash.com/photo-1594824813566-88855ce7890b?w=300&q=80"),
        ("Dr. Riya Malhotra", "Malhotra", "Dermatology", "Consultant Dermatologist", "Pediatric & Aesthetic Dermatology", 5, 500.00, "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&q=80"),
        # ENT
        ("Dr. Amit Kulkarni", "Kulkarni", "ENT", "Senior ENT Specialist", "Otolaryngology & Skull Base Surgery", 15, 800.00, "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&q=80"),
        ("Dr. Pooja Desai", "Desai", "ENT", "Junior ENT Specialist", "Sinus Surgery & Voice Disorders", 4, 500.00, "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80"),
        # Ophthalmology
        ("Dr. Aditya Rao", "Rao", "Ophthalmology", "Senior Ophthalmologist", "Cataract & Refractive Surgery", 13, 850.00, "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&q=80"),
        ("Dr. Tanya Kapoor", "Kapoor", "Ophthalmology", "Consultant Ophthalmologist", "Retina & Glaucoma Care", 6, 550.00, "https://images.unsplash.com/photo-1594824813566-88855ce7890b?w=300&q=80"),
    ]

    doctor_objs = []
    for doc_idx, (full_title, last_n, dept_n, desig, spec, exp, fee, photo) in enumerate(doctors_spec, start=1):
        dept_obj = dept_objs[dept_n]
        d_email = f"doc_{dept_obj.code.lower()}_{doc_idx}@smartcare.com" if doc_idx > 1 else "doctor@smartcare.com"
        
        u = User.objects.filter(email=d_email).first()
        if not u:
            u = User.objects.create_user(
                username=d_email,
                email=d_email,
                password=DEFAULT_PASS,
                first_name=full_title.split()[0] + " " + full_title.split()[1],
                last_name=last_n,
                role=RoleChoices.DOCTOR,
                department=dept_obj,
                phone=f"+91 94440{doc_idx:05d}"
            )

        doc = Doctor.objects.create(
            doctor_id=f"DOC-{dept_obj.code}-{doc_idx:02d}",
            user=u,
            department=dept_obj,
            specialization=spec,
            qualification=desig,
            experience_years=exp,
            consultation_fee=fee,
            schedule={"Mon-Sat": ["09:00-13:00", "15:00-18:00"]},
            photo_url=photo
        )
        doctor_objs.append(doc)
    print(f"Created {len(doctor_objs)} Demo Doctors (2 per department across 10 departments).")

    # 5. Create Medicines & Pharmacy Inventory
    medicines = [
        ("Paracetamol 500mg", "Acetaminophen", "Tablet", 50, 45.00),
        ("Amoxicillin 500mg", "Amoxicillin", "Capsule", 40, 120.00),
        ("Azithromycin 250mg", "Azithromycin", "Tablet", 30, 180.00),
        ("Metformin 500mg", "Metformin", "Tablet", 100, 65.00),
        ("Amlodipine 5mg", "Amlodipine", "Tablet", 80, 55.00),
        ("Pantoprazole 40mg", "Pantoprazole", "Tablet", 90, 85.00),
        ("Cough Syrup 100ml", "Dextromethorphan", "Syrup", 25, 95.00),
        ("Ibuprofen 400mg", "Ibuprofen", "Tablet", 60, 40.00),
    ]
    for name, gen, cat, qty, price in medicines:
        Medicine.objects.create(
            name=name,
            generic_name=gen,
            category=cat,
            batch_number=f"BATCH-{random.randint(1000, 9999)}",
            expiry_date=date.today() + timedelta(days=365),
            stock_quantity=qty,
            unit_price=price
        )
    print("Created Pharmacy catalog items.")

    # 6. Create Beds & Wards
    wards = ["General Male Ward", "General Female Ward", "ICU", "Private Suite", "Emergency Care"]
    for w in wards:
        for b_num in range(1, 6):
            Bed.objects.create(
                ward_name=w,
                bed_number=f"{w[:3].upper()}-{b_num:02d}",
                bed_type="ICU" if "ICU" in w else "General",
                daily_charge=3500.00 if "ICU" in w else 1200.00,
                is_occupied=False
            )
    print("Created Beds & Wards.")

    # 6b. Create Hospitals for Emergency & Mapping Telemetry
    hospitals_data = [
        ("Smart Care Super Specialty Hospital", "100 Indiranagar Double Road, Bengaluru", 12.9784, 77.6408, "+91-80-2500-1008", True, "Super Specialty ER"),
        ("City General & Trauma Center", "45 MG Road, Richmond Town, Bengaluru", 12.9650, 77.6000, "+91-80-2222-3344", True, "General Level-1 ER"),
        ("Victoria Emergency Medical Center", "Fort Road, KR Market, Bengaluru", 12.9634, 77.5750, "+91-80-2670-1111", True, "Govt Level-1 Trauma"),
        ("Apollo Emergency Care & Heart Institute", "Bannerghatta Main Road, Jayanagar, Bengaluru", 12.9100, 77.5980, "+91-80-2630-4050", True, "Cardiac & Neuro ER"),
        ("NIMHANS Neuro Emergency Center", "Hosur Road, Lakkasandra, Bengaluru", 12.9388, 77.5959, "+91-80-2699-5000", True, "Neurological ER"),
        ("Jayadeva Institute of Cardiac Sciences", "Bannerghatta Rd, Jayanagar 9th Block, Bengaluru", 12.9237, 77.5997, "+91-80-2297-7200", True, "Cardiology ER"),
        ("Manipal Super Specialty Hospital", "98 HAL Old Airport Rd, Kodihalli, Bengaluru", 12.9582, 77.6483, "+91-80-2502-4444", True, "Multi-Specialty ER"),
        ("Fortis Emergency & Trauma Center", "154/9 Bannerghatta Rd & ITPL Main Rd, Whitefield, Bengaluru", 12.9710, 77.7500, "+91-80-6621-4444", True, "Trauma & Burn Center"),
        ("Columbia Asia Emergency Ward", "Kirloskar Business Park, Hebbal, Bengaluru", 13.0350, 77.5890, "+91-80-4138-0000", True, "Emergency Ward"),
        ("Aster CMI Hospital Emergency", "No. 43/2 NH 44, Sahakar Nagar, Hebbal, Bengaluru", 13.0480, 77.5920, "+91-80-4342-0100", True, "Pediatric & General ER"),
        ("KR Hospital Emergency (Mysuru)", "Irwin Road, Mysuru, Karnataka", 12.3140, 76.6496, "+91-821-242-2000", True, "Mysuru District ER"),
        ("KIMS Trauma Care Center (Hubballi)", "Vidyanagar, Hubballi, Karnataka", 15.3587, 75.1432, "+91-836-237-2144", True, "Hubballi Regional ER"),
    ]

    for h_name, h_addr, h_lat, h_lng, h_phone, h_avail, h_type in hospitals_data:
        Hospital.objects.create(
            name=h_name,
            address=h_addr,
            latitude=h_lat,
            longitude=h_lng,
            phone=h_phone,
            emergency_available=h_avail,
            facility_type=h_type
        )
    print(f"Created {len(hospitals_data)} Hospitals for GIS Telemetry.")

    # 7. Create Ambulances & Emergency Requests (Karnataka Coordinates & Details)
    karnataka_ambulances = [
        ("A-102", "KA-01-EA-1102", "Advanced Ambulance", "Raj Kumar", "+91 9845012340", "Force Traveler ICU Unit", "ALS (Advanced Life Support)", 12.9784, 77.6408, "MG Road, Bengaluru", "Available", "2026-08-10", "2026-09-10"),
        ("A-01", "KA-01-EA-1008", "Basic Ambulance", "Ravi Kumar", "+91 9845012341", "Force Traveler ICU", "ALS (Advanced Life Support)", 12.9784, 77.6408, "Indiranagar, Bengaluru", "Available", "2026-08-10", "2026-09-10"),
        ("A-02", "KA-05-EA-2045", "Advanced ALS", "Kumar Swamy", "+91 9845012342", "Tata Winger ALS Unit", "Ventilator + ALS", 12.9352, 77.6245, "Koramangala, Bengaluru", "En Route", "2026-08-01", "2026-09-01"),
        ("A-03", "KA-03-EA-3099", "Basic Ambulance", "Arun Gowda", "+91 9845012343", "Force Traveler Cardiac", "Basic Life Support", 12.9634, 77.5750, "KR Market, Bengaluru", "Available", "2026-07-20", "2026-08-20"),
        ("A-04", "KA-02-EA-4120", "Advanced ALS", "Manoj Patil", "+91 9845012344", "Mercedes Sprinter ICU", "Advanced Trauma Suite", 12.9237, 77.5997, "Jayanagar, Bengaluru", "Available", "2026-08-05", "2026-09-05"),
        ("A-05", "KA-09-EA-5500", "Basic Ambulance", "Suresh Mysuru", "+91 9845012345", "Force Traveler BLS", "Basic Life Support", 12.3140, 76.6496, "Main Rd, Mysuru", "Available", "2026-08-12", "2026-09-12"),
        ("A-06", "KA-25-EA-6011", "Advanced ALS", "Prakash Hubballi", "+91 9845012346", "Tata Winger ICU", "Ventilator + Defibrillator", 15.3587, 75.1432, "Vidyanagar, Hubballi", "Available", "2026-08-08", "2026-09-08"),
        ("A-07", "KA-19-EA-7012", "Advanced Ambulance", "Ganesh Mangaluru", "+91 9845012347", "Force Traveler Cardiac ICU", "ALS (Advanced Life Support)", 12.9141, 74.8560, "Hampankatta, Mangaluru", "Available", "2026-08-02", "2026-09-02"),
        ("A-08", "KA-22-EA-8015", "Basic Ambulance", "Mahesh Belagavi", "+91 9845012348", "Tata Winger BLS", "Basic Life Support", 15.8497, 74.4977, "Tilakwadi, Belagavi", "Available", "2026-08-04", "2026-09-04"),
        ("A-09", "KA-17-EA-9020", "Advanced ALS", "Shivu Davanagere", "+91 9845012349", "Force Traveler ICU", "ALS + Ventilator", 14.4644, 75.9218, "PJ Extension, Davanagere", "Available", "2026-08-06", "2026-09-06"),
        ("A-10", "KA-14-EA-1033", "Patient Transport", "Anand Shivamogga", "+91 9845012350", "Mahindra Supro Ambulance", "Patient Transport", 13.9299, 75.5681, "BH Road, Shivamogga", "Available", "2026-08-07", "2026-09-07"),
        ("A-11", "KA-06-EA-1144", "Basic Ambulance", "Venkatesh Tumakuru", "+91 9845012351", "Force Traveler BLS", "Basic Life Support", 13.3392, 77.1006, "BHM Road, Tumakuru", "Available", "2026-08-09", "2026-09-09"),
        ("A-12", "KA-04-EA-1255", "Advanced ALS", "Ramesh Whitefield", "+91 9845012352", "Tata Winger Cardiac Suite", "ALS (Advanced Life Support)", 12.9698, 77.7499, "Whitefield, Bengaluru", "Available", "2026-08-11", "2026-09-11"),
        ("A-13", "KA-51-EA-1366", "Basic Ambulance", "Somesh HSR", "+91 9845012353", "Force Traveler ICU", "Basic Life Support", 12.9121, 77.6446, "HSR Layout, Bengaluru", "Available", "2026-08-13", "2026-09-13"),
        ("A-14", "KA-53-EA-1477", "Advanced Ambulance", "Sunil Electronic City", "+91 9845012354", "Mercedes Sprinter ALS", "ALS (Advanced Life Support)", 12.8452, 77.6602, "Electronic City, Bengaluru", "Available", "2026-08-14", "2026-09-14"),
        ("A-15", "KA-01-EA-1588", "Patient Transport", "Vijay Hebbal", "+91 9845012355", "Mahindra Bolero Ambulance", "Patient Transport", 13.0358, 77.5970, "Hebbal, Bengaluru", "Available", "2026-08-15", "2026-09-15"),
        ("A-16", "KA-02-EA-1699", "Advanced ALS", "Kiran Malleshwaram", "+91 9845012356", "Force Traveler ICU", "ALS + Ventilator", 13.0031, 77.5643, "Malleshwaram, Bengaluru", "Available", "2026-08-16", "2026-09-16"),
        ("A-17", "KA-03-EA-1700", "Basic Ambulance", "Karthik Rajajinagar", "+91 9845012357", "Tata Winger BLS", "Basic Life Support", 12.9982, 77.5530, "Rajajinagar, Bengaluru", "Available", "2026-08-17", "2026-09-17"),
        ("A-18", "KA-05-EA-1811", "Advanced Ambulance", "Sandeep BTM", "+91 9845012358", "Force Traveler Cardiac", "ALS (Advanced Life Support)", 12.9166, 77.6101, "BTM Layout, Bengaluru", "Available", "2026-08-18", "2026-09-18"),
        ("A-19", "KA-41-EA-1922", "Basic Ambulance", "Chethan Kengeri", "+91 9845012359", "Tata Winger ICU", "Basic Life Support", 12.8996, 77.4827, "Kengeri, Bengaluru", "Available", "2026-08-19", "2026-09-19"),
        ("A-20", "KA-50-EA-2033", "Advanced ALS", "Prashanth Yelahanka", "+91 9845012360", "Force Traveler ICU", "ALS + Ventilator", 13.1007, 77.5963, "Yelahanka, Bengaluru", "Available", "2026-08-20", "2026-09-20"),
        ("A-21", "KA-12-EA-2144", "Basic Ambulance", "Naveen Madikeri", "+91 9845012361", "Force Traveler BLS", "Basic Life Support", 12.4244, 75.7382, "Fort Rd, Madikeri", "Available", "2026-08-21", "2026-09-21"),
    ]

    amb_objs = {}
    for code, vnum, atype, dname, dphone, model, eq, lat, lng, loc, status, lserv, nserv in karnataka_ambulances:
        driver_user = demo_users[RoleChoices.AMBULANCE_DRIVER] if code == "A-01" else None
        amb = Ambulance.objects.create(
            vehicle_number=f"{code} ({vnum})",
            ambulance_type=atype,
            driver=driver_user,
            driver_name=dname,
            driver_phone=dphone,
            vehicle_model=model,
            equipment_level=eq,
            current_latitude=lat,
            current_longitude=lng,
            current_location_name=loc,
            status=status,
            equipment_oxygen=True,
            equipment_first_aid=True,
            equipment_stretcher=True,
            equipment_defibrillator=True if "ALS" in atype else False,
            equipment_ventilator=True if "Ventilator" in eq else False,
            last_service_date=lserv,
            next_service_date=nserv
        )
        amb_objs[code] = amb
    print(f"Created {len(amb_objs)} Emergency Ambulances in Karnataka.")

    # 7b. Create Synthetic Emergency Requests
    emergency_seeds = [
        ("E001", patient_objs[0], "Aarav Sharma", "+91 9876500001", "Cardiac Emergency", "Severe retrosternal chest pain, sweating", 1, "Critical", "Main Road, Indiranagar, Bengaluru", 12.9784, 77.6408, amb_objs["A-01"], "En Route", 8, True, False),
        ("E002", patient_objs[1], "Anika Rao", "+91 9876500002", "Accident", "Two-wheeler collision, head injury", 1, "Critical", "City Road, Koramangala, Bengaluru", 12.9352, 77.6245, amb_objs["A-02"], "Patient Onboard", 4, True, True),
        ("E003", patient_objs[2], "Rahul Verma", "+91 9876500003", "Breathing Difficulty", "Acute asthma flare, SpO2 88%", 1, "Moderate", "Airport Road, Bengaluru", 12.9582, 77.6483, amb_objs["A-03"], "Completed", 0, True, True),
        ("E004", patient_objs[3], "Meera Nair", "+91 9876500004", "Neurological Emergency", "Sudden right-sided weakness, slurred speech", 1, "Critical", "Jayanagar 4th Block, Bengaluru", 12.9237, 77.5997, None, "Requested", 12, False, False),
    ]

    for req_no, pat, pname, pphone, etype, desc, num_p, sev, address, lat, lng, amb, st, eta, alert_sent, alert_ack in emergency_seeds:
        EmergencyRequest.objects.create(
            request_number=req_no,
            patient=pat,
            patient_name=pname,
            patient_phone=pphone,
            temp_patient_id=f"TEMP-{req_no}",
            emergency_type=etype,
            short_description=desc,
            number_of_patients=num_p,
            severity=sev,
            pickup_address=address,
            latitude=lat,
            longitude=lng,
            destination_hospital="Smart Care Super Specialty Hospital, Bengaluru",
            assigned_ambulance=amb,
            driver_name=amb.driver_name if amb else None,
            driver_phone=amb.driver_phone if amb else None,
            status=st,
            eta_minutes=eta,
            hospital_alert_sent=alert_sent,
            hospital_alert_acknowledged=alert_ack,
            billing_amount=2500.00 if "ALS" in (amb.ambulance_type if amb else "") else 1500.00
        )
    print("Created synthetic emergency requests.")

    # 8. Create Blood Bank Inventory
    bg_list = ["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"]
    for bg in bg_list:
        for b_idx in range(1, 4):
            BloodUnit.objects.create(
                unit_number=f"BLD-{bg.replace('+','P').replace('-','N')}-{b_idx:03d}",
                blood_group=bg,
                collection_date=date.today() - timedelta(days=10),
                expiry_date=date.today() + timedelta(days=32),
                status="Available",
                donor_name=f"Volunteer Donor {bg}"
            )
    # 9. Seed Patient Profile for patient@smartcare.com and appointments
    p_demo_user = demo_users[RoleChoices.PATIENT]
    p_demo, _ = Patient.objects.get_or_create(
        user=p_demo_user,
        defaults={
            "patient_id": "PAT-2026-8942",
            "dob": date(1994, 8, 20),
            "gender": "Male",
            "blood_group": "O+",
            "emergency_contact_name": "Pooja Sharma",
            "emergency_contact_phone": "+91 9876599901",
            "allergies": "Penicillin",
            "chronic_conditions": "Mild Hypertension"
        }
    )

    doc_sarah = Doctor.objects.filter(user__first_name__icontains="Sarah").first() or doctor_objs[0]
    doc_michael = Doctor.objects.filter(user__first_name__icontains="Michael").first() or doctor_objs[1]

    # Seed Patient Demo Appointments
    Appointment.objects.create(
        appointment_number="APT-101",
        patient=p_demo,
        doctor=doc_sarah,
        department=doc_sarah.department,
        appointment_date=date(2026, 8, 20),
        time_slot="10:30 AM",
        type="OPD",
        status="Confirmed",
        token_number=1,
        notes="Regular Heart Checkup"
    )

    Appointment.objects.create(
        appointment_number="APT-100",
        patient=p_demo,
        doctor=doc_michael,
        department=doc_michael.department,
        appointment_date=date(2026, 8, 12),
        time_slot="02:00 PM",
        type="OPD",
        status="Completed",
        token_number=5,
        notes="Fever & General Consultation"
    )

    # Seed Patient Demo Prescription
    Prescription.objects.create(
        prescription_number="RX-2026-889",
        patient=p_demo,
        doctor=doc_sarah,
        medicines=[
            {"medicine_name": "Amoxicillin", "dosage": "500mg", "frequency": "1-0-1", "duration": "5 days"},
            {"medicine_name": "Paracetamol", "dosage": "650mg", "frequency": "1-1-1", "duration": "3 days"}
        ],
        instructions="Take prescribed medicines after meals. Drink plenty of fluids.",
        is_dispensed=False
    )

    # Seed Patient Demo Lab Report
    lr_demo = LabRequest.objects.create(
        request_number="REF-2026-901",
        patient=p_demo,
        doctor=doc_sarah,
        test_name="CBC Blood Count",
        category="Hematology",
        status="Completed"
    )
    LabResult.objects.create(
        lab_request=lr_demo,
        result_data={"Hemoglobin": "14.2 g/dL", "WBC": "6,500 /uL", "Platelets": "250,000 /uL"},
        remarks="All pathology parameters within normal reference limits."
    )

    # Seed Patient Demo Radiology Report
    rr_demo = RadiologyRequest.objects.create(
        request_number="RAD-2026-101",
        patient=p_demo,
        doctor=doc_sarah,
        modality="X-Ray",
        body_part="Chest PA View",
        status="Reported"
    )
    RadiologyReport.objects.create(
        radiology_request=rr_demo,
        findings="Clear lung fields, normal cardiac size and mediastinal contours.",
        impression="No acute cardiopulmonary disease."
    )

    # Seed Patient Demo Invoice
    Invoice.objects.create(
        invoice_number="INV-2026-001",
        patient=p_demo,
        source_module="OPD",
        line_items=[{"description": "Cardiology OPD Consultation", "amount": 1600.00}],
        subtotal=1600.00,
        discount=0.00,
        total_amount=600.00,
        status="Pending"
    )

    # Additional sample appointments for synthetic patients
    for sample_i in range(1, 10):
        pat = patient_objs[sample_i]
        doc = doctor_objs[(sample_i * 2) % len(doctor_objs)]
        
        apt = Appointment.objects.create(
            appointment_number=f"APT-2026-{sample_i:04d}",
            patient=pat,
            doctor=doc,
            department=doc.department,
            appointment_date=date.today(),
            time_slot="10:00 - 10:30 AM",
            type="OPD",
            status="Completed",
            token_number=sample_i
        )

        OPDConsultation.objects.create(
            appointment=apt,
            patient=pat,
            doctor=doc,
            symptoms="Mild chest pain, shortness of breath on exertion",
            clinical_notes="Patient presented with exertional angina. Normal S1/S2.",
            diagnosis="Stable Angina Pectoris",
            vitals={"bp": "130/85", "hr": "78", "temp": "98.4F", "spo2": "98%"},
            follow_up_date=date.today() + timedelta(days=7)
        )

        EHRTimeline.objects.create(
            patient=pat,
            event_type="OPD Consultation",
            summary=f"Consultation with {doc.user.get_full_name()} ({doc.specialization})",
            details={"diagnosis": "Stable Angina Pectoris", "vitals": "130/85 BP"},
            recorded_by=doc.user
        )

    print("Populated initial Appointments, Consultations, and EHR Timelines.")
    print("SUCCESS: Smart Care Database Seeded Completed!")

if __name__ == '__main__':
    run_seed()
