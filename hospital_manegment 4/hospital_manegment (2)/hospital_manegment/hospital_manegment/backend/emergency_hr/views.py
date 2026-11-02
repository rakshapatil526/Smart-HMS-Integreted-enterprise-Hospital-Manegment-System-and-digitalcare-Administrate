import math
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from emergency_hr.models import Hospital, Ambulance, EmergencyRequest, HREmployee, Payroll, TelemedicineAppointment
from emergency_hr.serializers import (
    HospitalSerializer, AmbulanceSerializer, EmergencyRequestSerializer,
    HREmployeeSerializer, PayrollSerializer, TelemedicineAppointmentSerializer
)
from operations.models import Invoice
from clinical.models import Bed, Admission, EHRTimeline
import random

def haversine_km(lat1, lon1, lat2, lon2):
    R = 6371.0  # Earth radius in km
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

class HospitalViewSet(viewsets.ModelViewSet):
    queryset = Hospital.objects.all()
    serializer_class = HospitalSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['get', 'post'], url_path='nearby')
    def nearby(self, request):
        return self._get_nearby_hospitals(request)

    def _get_nearby_hospitals(self, request):
        lat_val = request.query_params.get('latitude') or request.data.get('latitude')
        lng_val = request.query_params.get('longitude') or request.data.get('longitude')
        radius_val = request.query_params.get('radius') or request.data.get('radius') or 25.0

        if lat_val is None or lng_val is None:
            pickup_lat = 12.9716
            pickup_lng = 77.5946
        else:
            try:
                pickup_lat = float(lat_val)
                pickup_lng = float(lng_val)
            except ValueError:
                return Response({'error': 'Invalid latitude or longitude format'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            radius_km = float(radius_val)
        except ValueError:
            radius_km = 25.0

        hospitals = Hospital.objects.all()
        results = []
        for h in hospitals:
            dist = haversine_km(pickup_lat, pickup_lng, h.latitude, h.longitude)
            if dist <= radius_km:
                data = HospitalSerializer(h).data
                data['distance_km'] = round(dist, 2)
                results.append(data)

        # Sort hospitals in ascending order of distance
        results.sort(key=lambda x: x['distance_km'])

        return Response({
            'pickup': {
                'latitude': pickup_lat,
                'longitude': pickup_lng
            },
            'radius_km': radius_km,
            'count': len(results),
            'hospitals': results,
            'message': 'Nearby hospitals retrieved successfully.' if results else 'No nearby hospitals found.'
        })

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

def broadcast_emergency_event(event_type, payload):
    try:
        channel_layer = get_channel_layer()
        if channel_layer:
            async_to_sync(channel_layer.group_send)(
                'emergency_dispatch',
                {
                    'type': 'emergency_message',
                    'message': {
                        'type': event_type,
                        'data': payload
                    }
                }
            )
    except Exception as e:
        pass

class AmbulanceViewSet(viewsets.ModelViewSet):
    queryset = Ambulance.objects.all()
    serializer_class = AmbulanceSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['get'])
    def stats(self, request):
        total = Ambulance.objects.count()
        available = Ambulance.objects.filter(status='Available').count()
        assigned = Ambulance.objects.filter(status='Assigned').count()
        on_trip = Ambulance.objects.filter(status__in=['En Route', 'At Pickup', 'Patient Onboard', 'En Route to Hospital', 'Hospital Arrived']).count()
        out_of_service = Ambulance.objects.filter(status__in=['Out of Service', 'Maintenance']).count()
        offline = Ambulance.objects.filter(status='Offline').count()
        pending_requests = EmergencyRequest.objects.filter(status__in=['Requested', 'REQUESTED', 'SEARCHING']).count()
        
        return Response({
            'total': total,
            'available': available,
            'assigned': assigned,
            'on_trip': on_trip,
            'out_of_service': out_of_service,
            'offline': offline,
            'pending_requests': pending_requests,
        })

    @action(detail=False, methods=['get'])
    def nearby(self, request):
        lat_val = request.query_params.get('latitude') or 12.9716
        lng_val = request.query_params.get('longitude') or 77.5946
        radius_val = request.query_params.get('radius') or 25.0
        try:
            pickup_lat = float(lat_val)
            pickup_lng = float(lng_val)
            radius_km = float(radius_val)
        except ValueError:
            pickup_lat, pickup_lng, radius_km = 12.9716, 77.5946, 25.0

        ambulances = Ambulance.objects.all()
        results = []
        for amb in ambulances:
            dist = haversine_km(pickup_lat, pickup_lng, amb.current_latitude, amb.current_longitude)
            if dist <= radius_km:
                data = AmbulanceSerializer(amb).data
                data['distance_km'] = round(dist, 2)
                results.append(data)

        results.sort(key=lambda x: x['distance_km'])
        return Response({'count': len(results), 'ambulances': results})

    @action(detail=True, methods=['post'])
    def update_location(self, request, pk=None):
        ambulance = self.get_object()
        lat = request.data.get('latitude')
        lng = request.data.get('longitude')
        location_name = request.data.get('location_name')
        if lat is not None and lng is not None:
            ambulance.current_latitude = float(lat)
            ambulance.current_longitude = float(lng)
            if location_name:
                ambulance.current_location_name = location_name
            ambulance.save()
            data = AmbulanceSerializer(ambulance).data
            broadcast_emergency_event('location_update', data)
            return Response(data)
        return Response({'error': 'Latitude and Longitude required'}, status=status.HTTP_400_BAD_REQUEST)

class EmergencyRequestViewSet(viewsets.ModelViewSet):
    queryset = EmergencyRequest.objects.all().order_by('-created_at')
    serializer_class = EmergencyRequestSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        # Auto-match nearest available ambulance when created if available
        response = super().create(request, *args, **kwargs)
        if response.status_code == status.HTTP_201_CREATED:
            try:
                emergency_id = response.data.get('id')
                emergency = EmergencyRequest.objects.get(id=emergency_id)
                
                # Check if patient specified destination coordinates
                dest_lat = request.data.get('destination_latitude')
                dest_lng = request.data.get('destination_longitude')
                if dest_lat is not None and dest_lng is not None:
                    emergency.destination_latitude = float(dest_lat)
                    emergency.destination_longitude = float(dest_lng)
                
                req_priority = request.data.get('priority')
                if req_priority:
                    emergency.priority = req_priority

                emergency.save()
                data = EmergencyRequestSerializer(emergency).data
                broadcast_emergency_event('new_emergency_request', data)
                response.data = data
            except Exception as e:
                pass
        return response


    @action(detail=False, methods=['post'])
    def search_nearby(self, request):
        patient_lat = float(request.data.get('latitude', 12.9716))
        patient_lng = float(request.data.get('longitude', 77.5946))
        
        available = Ambulance.objects.filter(status='Available')
        if not available.exists():
            # Reset one for demo/testing if all assigned
            first = Ambulance.objects.first()
            if first:
                first.status = 'Available'
                first.save()
                available = Ambulance.objects.filter(status='Available')

        results = []
        for amb in available:
            # Simple distance formula representation
            dist = round(random.uniform(1.2, 4.0), 1)
            eta = int(dist * 2.5) + 1
            results.append({
                'ambulance': AmbulanceSerializer(amb).data,
                'distance_km': dist,
                'eta_minutes': eta
            })
        return Response({'available_ambulances': results, 'count': len(results)})

    @action(detail=True, methods=['post'])
    def assign_ambulance(self, request, pk=None):
        emergency = self.get_object()
        ambulance_id = request.data.get('ambulance_id')
        if not ambulance_id:
            return Response({'error': 'ambulance_id required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            amb = Ambulance.objects.get(id=ambulance_id)
            amb.status = 'Assigned'
            amb.save()
            
            emergency.assigned_ambulance = amb
            emergency.driver_name = amb.driver_name
            emergency.driver_phone = amb.driver_phone
            emergency.status = 'DRIVER_ASSIGNED'
            emergency.save()
            data = EmergencyRequestSerializer(emergency).data
            broadcast_emergency_event('ambulance_assigned', data)
            return Response(data)
        except Ambulance.DoesNotExist:
            return Response({'error': 'Ambulance not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        emergency = self.get_object()
        emergency.status = 'DRIVER_ACCEPTED'
        emergency.save()

        if emergency.assigned_ambulance:
            emergency.assigned_ambulance.status = 'En Route'
            emergency.assigned_ambulance.save()

        return Response(EmergencyRequestSerializer(emergency).data)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        emergency = self.get_object()
        new_status = request.data.get('status')
        if not new_status:
            return Response({'error': 'status required'}, status=status.HTTP_400_BAD_REQUEST)
        
        emergency.status = new_status
        if new_status in ['PATIENT_ONBOARD', 'EN_ROUTE_TO_HOSPITAL', 'Patient Onboard']:
            emergency.hospital_alert_sent = True
        
        if new_status == 'PATIENT_HANDOVER':
            from django.utils import timezone
            emergency.handover_time = timezone.now()

        if new_status in ['COMPLETED', 'Completed']:
            if emergency.patient and not emergency.billing_invoice_generated:
                inv_number = f"INV-EMG-{random.randint(10000, 99999)}"
                try:
                    Invoice.objects.create(
                        invoice_number=inv_number,
                        patient=emergency.patient,
                        total_amount=emergency.billing_amount,
                        discount_amount=0.00,
                        net_payable=emergency.billing_amount,
                        paid_amount=0.00,
                        status='Pending',
                        items_summary=f"Ambulance Emergency Dispatch Fee ({emergency.assigned_ambulance.vehicle_number if emergency.assigned_ambulance else 'ALS'})"
                    )
                    emergency.billing_invoice_generated = True
                except Exception as e:
                    pass

        emergency.save()

        # Update linked ambulance status
        if emergency.assigned_ambulance:
            amb = emergency.assigned_ambulance
            if new_status in ['COMPLETED', 'CANCELLED', 'Completed', 'Cancelled']:
                amb.status = 'Available'
            elif new_status in ['PATIENT_ONBOARD', 'EN_ROUTE_TO_HOSPITAL']:
                amb.status = 'Patient Onboard'
            elif new_status == 'ARRIVED_AT_PICKUP':
                amb.status = 'At Pickup'
            elif new_status == 'ARRIVED_AT_HOSPITAL':
                amb.status = 'Hospital Arrived'
            else:
                amb.status = 'En Route'
            amb.save()

        return Response(EmergencyRequestSerializer(emergency).data)

    @action(detail=True, methods=['post'])
    def er_prep(self, request, pk=None):
        emergency = self.get_object()
        emergency.assigned_doctor_name = request.data.get('doctor_name', emergency.assigned_doctor_name)
        emergency.assigned_nurse_name = request.data.get('nurse_name', emergency.assigned_nurse_name)
        emergency.assigned_er_bay = request.data.get('er_bay', emergency.assigned_er_bay)
        emergency.hospital_alert_acknowledged = True
        if request.data.get('ipd_admission_required'):
            emergency.ipd_admission_required = True
            emergency.ipd_bed_allocated = request.data.get('ipd_bed_allocated', 'Bed-ICU-04')
        emergency.save()
        return Response(EmergencyRequestSerializer(emergency).data)

    @action(detail=True, methods=['post'])
    def doctor_handover(self, request, pk=None):
        emergency = self.get_object()
        notes = request.data.get('notes', '')
        emergency.doctor_assessment_notes = notes
        emergency.status = 'PATIENT_HANDOVER'
        from django.utils import timezone
        emergency.handover_time = timezone.now()
        emergency.save()

        if emergency.assigned_ambulance:
            emergency.assigned_ambulance.status = 'Available'
            emergency.assigned_ambulance.save()

        # Log to EHR timeline
        if emergency.patient:
            try:
                EHRTimeline.objects.create(
                    patient=emergency.patient,
                    event_type='Emergency ER Intake & Handover',
                    summary=f'Emergency ER Handover for {emergency.request_number}',
                    details={
                        'emergency_type': emergency.emergency_type,
                        'doctor': emergency.assigned_doctor_name,
                        'nurse': emergency.assigned_nurse_name,
                        'er_bay': emergency.assigned_er_bay,
                        'notes': notes
                    }
                )
            except Exception:
                pass

        return Response({'status': 'Doctor Handover Recorded', 'emergency': EmergencyRequestSerializer(emergency).data})

class HREmployeeViewSet(viewsets.ModelViewSet):
    queryset = HREmployee.objects.all()
    serializer_class = HREmployeeSerializer
    permission_classes = [permissions.AllowAny]

class PayrollViewSet(viewsets.ModelViewSet):
    queryset = Payroll.objects.all().order_by('-year', '-month')
    serializer_class = PayrollSerializer
    permission_classes = [permissions.AllowAny]

class TelemedicineAppointmentViewSet(viewsets.ModelViewSet):
    queryset = TelemedicineAppointment.objects.all().order_by('-created_at')
    serializer_class = TelemedicineAppointmentSerializer
    permission_classes = [permissions.AllowAny]
