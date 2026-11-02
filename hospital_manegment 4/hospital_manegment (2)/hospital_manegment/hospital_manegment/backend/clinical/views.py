from rest_framework import viewsets, permissions
from clinical.models import (
    Patient, Doctor, Appointment, OPDConsultation,
    Bed, Admission, NursingRecord, OTSchedule, EHRTimeline
)
from clinical.serializers import (
    PatientSerializer, DoctorSerializer, AppointmentSerializer, OPDConsultationSerializer,
    BedSerializer, AdmissionSerializer, NursingRecordSerializer, OTScheduleSerializer, EHRTimelineSerializer
)

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all().order_by('-created_at')
    serializer_class = PatientSerializer
    permission_classes = [permissions.AllowAny]

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all().order_by('department__name')
    serializer_class = DoctorSerializer
    permission_classes = [permissions.AllowAny]

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all().order_by('-appointment_date', '-token_number')
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.AllowAny]

class OPDConsultationViewSet(viewsets.ModelViewSet):
    queryset = OPDConsultation.objects.all().order_by('-created_at')
    serializer_class = OPDConsultationSerializer
    permission_classes = [permissions.AllowAny]

class BedViewSet(viewsets.ModelViewSet):
    queryset = Bed.objects.all().order_by('ward_name', 'bed_number')
    serializer_class = BedSerializer
    permission_classes = [permissions.AllowAny]

class AdmissionViewSet(viewsets.ModelViewSet):
    queryset = Admission.objects.all().order_by('-admission_date')
    serializer_class = AdmissionSerializer
    permission_classes = [permissions.AllowAny]

class NursingRecordViewSet(viewsets.ModelViewSet):
    queryset = NursingRecord.objects.all().order_by('-recorded_at')
    serializer_class = NursingRecordSerializer
    permission_classes = [permissions.AllowAny]

class OTScheduleViewSet(viewsets.ModelViewSet):
    queryset = OTSchedule.objects.all().order_by('-scheduled_datetime')
    serializer_class = OTScheduleSerializer
    permission_classes = [permissions.AllowAny]

class EHRTimelineViewSet(viewsets.ModelViewSet):
    queryset = EHRTimeline.objects.all().order_by('-timestamp')
    serializer_class = EHRTimelineSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        patient_id = self.request.query_params.get('patient')
        if patient_id:
            queryset = queryset.filter(patient_id=patient_id)
        return queryset
