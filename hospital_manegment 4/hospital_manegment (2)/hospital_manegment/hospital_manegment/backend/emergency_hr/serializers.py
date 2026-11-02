from rest_framework import serializers
from emergency_hr.models import Hospital, Ambulance, EmergencyRequest, HREmployee, Payroll, TelemedicineAppointment
from clinical.serializers import PatientSerializer, AppointmentSerializer
from core.serializers import UserSerializer, DepartmentSerializer

class HospitalSerializer(serializers.ModelSerializer):
    distance_km = serializers.FloatField(read_only=True, required=False)

    class Meta:
        model = Hospital
        fields = '__all__'

class AmbulanceSerializer(serializers.ModelSerializer):
    driver_name = serializers.CharField(source='driver.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = Ambulance
        fields = '__all__'

class EmergencyRequestSerializer(serializers.ModelSerializer):
    patient_details = PatientSerializer(source='patient', read_only=True)
    ambulance_details = AmbulanceSerializer(source='assigned_ambulance', read_only=True)

    class Meta:
        model = EmergencyRequest
        fields = '__all__'

class HREmployeeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = HREmployee
        fields = '__all__'

class PayrollSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.get_full_name', read_only=True)
    employee_id = serializers.CharField(source='employee.employee_id', read_only=True)
    department_name = serializers.CharField(source='employee.department.name', read_only=True)

    class Meta:
        model = Payroll
        fields = '__all__'

class TelemedicineAppointmentSerializer(serializers.ModelSerializer):
    appointment_details = AppointmentSerializer(source='appointment', read_only=True)

    class Meta:
        model = TelemedicineAppointment
        fields = '__all__'
