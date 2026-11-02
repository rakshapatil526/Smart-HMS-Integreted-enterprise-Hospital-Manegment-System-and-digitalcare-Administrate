from rest_framework import viewsets, permissions
from diagnostics.models import LabRequest, LabResult, RadiologyRequest, RadiologyReport
from diagnostics.serializers import (
    LabRequestSerializer, LabResultSerializer,
    RadiologyRequestSerializer, RadiologyReportSerializer
)

class LabRequestViewSet(viewsets.ModelViewSet):
    queryset = LabRequest.objects.all().order_by('-requested_at')
    serializer_class = LabRequestSerializer
    permission_classes = [permissions.AllowAny]

class LabResultViewSet(viewsets.ModelViewSet):
    queryset = LabResult.objects.all().order_by('-completed_at')
    serializer_class = LabResultSerializer
    permission_classes = [permissions.AllowAny]

class RadiologyRequestViewSet(viewsets.ModelViewSet):
    queryset = RadiologyRequest.objects.all().order_by('-requested_at')
    serializer_class = RadiologyRequestSerializer
    permission_classes = [permissions.AllowAny]

class RadiologyReportViewSet(viewsets.ModelViewSet):
    queryset = RadiologyReport.objects.all().order_by('-reported_at')
    serializer_class = RadiologyReportSerializer
    permission_classes = [permissions.AllowAny]
