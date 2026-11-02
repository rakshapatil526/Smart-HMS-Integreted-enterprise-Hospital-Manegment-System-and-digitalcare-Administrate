from rest_framework import serializers
from clinical.models import (
    Patient, Doctor, Appointment, OPDConsultation,
    Bed, Admission, NursingRecord, OTSchedule, EHRTimeline
)
from core.serializers import UserSerializer, DepartmentSerializer

class PatientSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.UUIDField(write_only=True, required=False)

    class Meta:
        model = Patient
        fields = '__all__'

class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    department_details = DepartmentSerializer(source='department', read_only=True)

    class Meta:
        model = Doctor
        fields = '__all__'

class AppointmentSerializer(serializers.ModelSerializer):
    patient_details = PatientSerializer(source='patient', read_only=True)
    doctor_details = DoctorSerializer(source='doctor', read_only=True)

    class Meta:
        model = Appointment
        fields = '__all__'

class OPDConsultationSerializer(serializers.ModelSerializer):
    appointment_details = AppointmentSerializer(source='appointment', read_only=True)
    patient_name = serializers.CharField(source='patient.user.get_full_name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.user.get_full_name', read_only=True)

    class Meta:
        model = OPDConsultation
        fields = '__all__'

class BedSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='current_patient.user.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = Bed
        fields = '__all__'

class AdmissionSerializer(serializers.ModelSerializer):
    patient_details = PatientSerializer(source='patient', read_only=True)
    doctor_name = serializers.CharField(source='attending_doctor.user.get_full_name', read_only=True)
    bed_details = BedSerializer(source='bed', read_only=True)

    class Meta:
        model = Admission
        fields = '__all__'

class NursingRecordSerializer(serializers.ModelSerializer):
    nurse_name = serializers.CharField(source='nurse.get_full_name', read_only=True)

    class Meta:
        model = NursingRecord
        fields = '__all__'

class OTScheduleSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.user.get_full_name', read_only=True)
    surgeon_name = serializers.CharField(source='lead_surgeon.user.get_full_name', read_only=True)

    class Meta:
        model = OTSchedule
        fields = '__all__'

class EHRTimelineSerializer(serializers.ModelSerializer):
    recorded_by_name = serializers.CharField(source='recorded_by.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = EHRTimeline
        fields = '__all__'
