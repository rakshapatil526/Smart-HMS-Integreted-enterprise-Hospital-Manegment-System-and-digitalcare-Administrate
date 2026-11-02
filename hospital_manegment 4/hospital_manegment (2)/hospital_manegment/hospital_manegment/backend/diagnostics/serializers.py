from rest_framework import serializers
from diagnostics.models import LabRequest, LabResult, RadiologyRequest, RadiologyReport
from clinical.serializers import PatientSerializer, DoctorSerializer

class LabResultSerializer(serializers.ModelSerializer):
    verified_by_name = serializers.CharField(source='verified_by.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = LabResult
        fields = '__all__'

class LabRequestSerializer(serializers.ModelSerializer):
    patient_details = PatientSerializer(source='patient', read_only=True)
    doctor_name = serializers.CharField(source='doctor.user.get_full_name', read_only=True)
    result = LabResultSerializer(read_only=True)

    class Meta:
        model = LabRequest
        fields = '__all__'

class RadiologyReportSerializer(serializers.ModelSerializer):
    radiologist_name = serializers.CharField(source='radiologist.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = RadiologyReport
        fields = '__all__'

class RadiologyRequestSerializer(serializers.ModelSerializer):
    patient_details = PatientSerializer(source='patient', read_only=True)
    doctor_name = serializers.CharField(source='doctor.user.get_full_name', read_only=True)
    report = RadiologyReportSerializer(read_only=True)

    class Meta:
        model = RadiologyRequest
        fields = '__all__'
