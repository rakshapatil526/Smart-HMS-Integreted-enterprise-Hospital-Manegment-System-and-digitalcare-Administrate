import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Hospital, Ambulance, EmergencyRequest } from '../../types';
import { MapPin, Navigation, Truck, Building2, AlertTriangle, ShieldCheck } from 'lucide-react';

// Custom Marker Icon Creators
const createHospitalIcon = (isEmergencyAvailable: boolean) => L.divIcon({
  html: `<div style="
    background: ${isEmergencyAvailable ? '#059669' : '#dc2626'};
    color: white;
    width: 38px;
    height: 38px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    border: 2px solid white;
    font-size: 18px;
  ">🏥</div>`,
  className: '',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -36]
});

const createAmbulanceIcon = (status: string) => {
  let bgColor = '#10b981'; // Available (Green)
  if (['Assigned', 'En Route', 'At Pickup', 'Patient Onboard', 'En Route to Hospital', 'Hospital Arrived'].includes(status)) {
    bgColor = '#ef4444'; // Busy / On Trip (Red)
  } else if (['Maintenance', 'Out of Service', 'Offline'].includes(status)) {
    bgColor = '#6b7280'; // Gray
  }

  return L.divIcon({
    html: `<div style="
      background: ${bgColor};
      color: white;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(0,0,0,0.35);
      border: 2.5px solid white;
      font-size: 16px;
    ">🚑</div>`,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

const createPickupIcon = (priority: string = 'HIGH') => {
  const isCritical = priority === 'CRITICAL' || priority === 'Critical';
  return L.divIcon({
    html: `<div style="position: relative;">
      <span style="
        position: absolute;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: ${isCritical ? 'rgba(220, 38, 38, 0.4)' : 'rgba(234, 88, 12, 0.4)'};
        top: -6px;
        left: -6px;
        animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></span>
      <div style="
        background: ${isCritical ? '#dc2626' : '#ea580c'};
        color: white;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        border: 2px solid white;
        font-size: 16px;
        position: relative;
        z-index: 10;
      ">🚨</div>
    </div>`,
    className: '',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17]
  });
};

const createDestinationIcon = () => L.divIcon({
  html: `<div style="
    background: #2563eb;
    color: white;
    width: 36px;
    height: 36px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.35);
    border: 2px solid white;
    font-size: 18px;
  ">🏁</div>`,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -34]
});

interface LayerFilters {
  hospitals: boolean;
  availableAmbulances: boolean;
  busyAmbulances: boolean;
  outOfService: boolean;
  emergencyRequests: boolean;
}

interface OperatorDispatchMapProps {
  hospitals: Hospital[];
  ambulances: Ambulance[];
  emergencyRequests: EmergencyRequest[];
  selectedRequest: EmergencyRequest | null;
  selectedHospital: Hospital | null;
  mapCenter: [number, number];
  filters: LayerFilters;
  onSelectRequest: (req: EmergencyRequest) => void;
  onSelectHospital: (hosp: Hospital) => void;
  onSelectAmbulance: (amb: Ambulance) => void;
  onAssignClick: (req: EmergencyRequest) => void;
}

export const OperatorDispatchMap: React.FC<OperatorDispatchMapProps> = ({
  hospitals,
  ambulances,
  emergencyRequests,
  selectedRequest,
  selectedHospital,
  mapCenter,
  filters,
  onSelectRequest,
  onSelectHospital,
  onSelectAmbulance,
  onAssignClick
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);

  const [routeInfo, setRouteInfo] = useState<{ distanceKm: number; durationMin: number } | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: mapCenter,
        zoom: 12,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      markersGroupRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update Center when mapCenter changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(mapCenter, mapRef.current.getZoom(), { animate: true });
    }
  }, [mapCenter]);

  // Update Markers & Layer Filtering
  useEffect(() => {
    if (!mapRef.current || !markersGroupRef.current) return;

    const group = markersGroupRef.current;
    group.clearLayers();

    // 1. Render Hospitals
    if (filters.hospitals) {
      hospitals.forEach(h => {
        if (h.latitude && h.longitude) {
          const marker = L.marker([h.latitude, h.longitude], {
            icon: createHospitalIcon(h.emergency_available ?? true)
          });

          const isSelected = selectedHospital?.id === h.id;

          const popupContent = document.createElement('div');
          popupContent.className = 'p-1 font-sans text-xs space-y-1.5 min-w-[200px]';
          popupContent.innerHTML = `
            <div class="font-extrabold text-sm text-slate-900 flex items-center justify-between border-b pb-1">
              <span>🏥 ${h.name}</span>
            </div>
            <div class="text-slate-600 font-medium">${h.address}</div>
            <div class="flex items-center justify-between pt-1">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${h.emergency_available !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}">
                ${h.emergency_available !== false ? 'Emergency: AVAILABLE' : 'FULL'}
              </span>
              <span class="font-mono text-slate-500 text-[10px]">Beds: ${h.available_beds ?? 12} / ${h.total_beds ?? 50}</span>
            </div>
            ${h.phone ? `<div class="text-[10px] text-slate-500">📞 ${h.phone}</div>` : ''}
          `;

          const btn = document.createElement('button');
          btn.className = 'w-full mt-2 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow transition-all';
          btn.innerText = 'SELECT HOSPITAL';
          btn.onclick = () => onSelectHospital(h);
          popupContent.appendChild(btn);

          marker.bindPopup(popupContent);
          marker.addTo(group);
        }
      });
    }

    // 2. Render Ambulances
    ambulances.forEach(amb => {
      const isAvailable = amb.status === 'Available';
      const isBusy = ['Assigned', 'En Route', 'At Pickup', 'Patient Onboard', 'En Route to Hospital', 'Hospital Arrived'].includes(amb.status);
      const isOutOfService = ['Maintenance', 'Out of Service', 'Offline'].includes(amb.status);

      if (
        (isAvailable && filters.availableAmbulances) ||
        (isBusy && filters.busyAmbulances) ||
        (isOutOfService && filters.outOfService)
      ) {
        if (amb.current_latitude && amb.current_longitude) {
          const marker = L.marker([amb.current_latitude, amb.current_longitude], {
            icon: createAmbulanceIcon(amb.status)
          });

          const popupContent = document.createElement('div');
          popupContent.className = 'p-1 font-sans text-xs space-y-1.5 min-w-[210px]';
          popupContent.innerHTML = `
            <div class="font-black text-sm text-slate-900 border-b pb-1 flex items-center justify-between">
              <span>🚑 ${amb.vehicle_number}</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${isAvailable ? 'bg-emerald-100 text-emerald-800' : isBusy ? 'bg-red-100 text-red-800' : 'bg-slate-200 text-slate-700'}">
                ${amb.status}
              </span>
            </div>
            <div class="space-y-0.5 text-slate-700 font-medium">
              <div><strong>Driver:</strong> ${amb.driver_name || 'Assigned Driver'}</div>
              <div><strong>Phone:</strong> ${amb.driver_phone || '+91 9876543210'}</div>
              <div><strong>Type:</strong> ${amb.ambulance_type || 'ALS ICU Unit'}</div>
              <div><strong>Rating:</strong> ⭐ ${amb.rating || 4.8}</div>
              <div class="text-[10px] text-slate-400 font-mono">Lat: ${amb.current_latitude.toFixed(4)}, Lng: ${amb.current_longitude.toFixed(4)}</div>
            </div>
          `;

          marker.bindPopup(popupContent);
          marker.on('click', () => onSelectAmbulance(amb));
          marker.addTo(group);
        }
      }
    });

    // 3. Render Pending Emergency Requests
    if (filters.emergencyRequests) {
      emergencyRequests.forEach(req => {
        if (req.latitude && req.longitude) {
          const isPending = ['Requested', 'REQUESTED', 'SEARCHING'].includes(req.status);
          const marker = L.marker([req.latitude, req.longitude], {
            icon: createPickupIcon(req.priority || req.severity)
          });

          const popupContent = document.createElement('div');
          popupContent.className = 'p-1 font-sans text-xs space-y-2 min-w-[220px]';
          popupContent.innerHTML = `
            <div class="font-extrabold text-sm text-red-600 border-b pb-1 flex items-center justify-between">
              <span>🚨 Emergency Request</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white">
                ${req.priority || 'HIGH'}
              </span>
            </div>
            <div class="space-y-1 text-slate-800 font-medium">
              <div>👤 <strong>Patient:</strong> ${req.patient_name || 'Emergency Patient'}</div>
              <div>📍 <strong>Pickup:</strong> ${req.pickup_address}</div>
              <div>🏥 <strong>Hospital:</strong> ${req.destination_hospital || 'SmartCare Hospital'}</div>
              <div class="text-[11px] font-bold text-amber-700">Type: ${req.emergency_type || 'Accident'}</div>
            </div>
          `;

          const actionDiv = document.createElement('div');
          actionDiv.className = 'grid grid-cols-2 gap-1.5 pt-1';

          const viewBtn = document.createElement('button');
          viewBtn.className = 'py-1 rounded bg-slate-800 text-white font-bold text-[11px] hover:bg-slate-900';
          viewBtn.innerText = 'VIEW';
          viewBtn.onclick = () => onSelectRequest(req);

          const assignBtn = document.createElement('button');
          assignBtn.className = 'py-1 rounded bg-red-600 text-white font-bold text-[11px] hover:bg-red-700';
          assignBtn.innerText = 'DISPATCH';
          assignBtn.onclick = () => {
            onSelectRequest(req);
            onAssignClick(req);
          };

          actionDiv.appendChild(viewBtn);
          actionDiv.appendChild(assignBtn);
          popupContent.appendChild(actionDiv);

          marker.bindPopup(popupContent);
          marker.addTo(group);
        }
      });
    }

    // 4. Render Selected Destination Hospital Pin
    if (selectedRequest && selectedRequest.destination_latitude && selectedRequest.destination_longitude) {
      const destMarker = L.marker(
        [selectedRequest.destination_latitude, selectedRequest.destination_longitude],
        { icon: createDestinationIcon() }
      );
      destMarker.bindPopup(`<b>🏁 Destination: ${selectedRequest.destination_hospital}</b>`);
      destMarker.addTo(group);
    }
  }, [hospitals, ambulances, emergencyRequests, selectedRequest, selectedHospital, filters]);

  // Fetch & Draw Road Route using OSRM when selectedRequest is active
  useEffect(() => {
    if (!mapRef.current) return;

    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
      routePolylineRef.current = null;
    }
    setRouteInfo(null);

    if (!selectedRequest || !selectedRequest.latitude || !selectedRequest.longitude) return;

    // Determine target destination coordinates (selected request's destination or hospital)
    let destLat = selectedRequest.destination_latitude;
    let destLng = selectedRequest.destination_longitude;

    if (!destLat || !destLng) {
      const matchedHosp = hospitals.find(h => h.name.toLowerCase().includes((selectedRequest.destination_hospital || '').toLowerCase()));
      if (matchedHosp) {
        destLat = matchedHosp.latitude;
        destLng = matchedHosp.longitude;
      } else if (hospitals.length > 0) {
        destLat = hospitals[0].latitude;
        destLng = hospitals[0].longitude;
      }
    }

    if (!destLat || !destLng) return;

    // Fetch OSRM Road Route: Pickup -> Destination Hospital
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${selectedRequest.longitude},${selectedRequest.latitude};${destLng},${destLat}?overview=full&geometries=geojson`;

    fetch(osrmUrl)
      .then(res => res.json())
      .then(data => {
        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const coords = route.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);

          const polyline = L.polyline(coords, {
            color: '#dc2626',
            weight: 5,
            opacity: 0.8,
            dashArray: '10, 8'
          }).addTo(mapRef.current!);

          routePolylineRef.current = polyline;

          const distKm = round(route.distance / 1000, 1);
          const durMin = Math.round(route.duration / 60);
          setRouteInfo({ distanceKm: distKm, durationMin: durMin });

          // Fit bounds to display pickup, route, and destination
          const bounds = L.latLngBounds(coords as [number, number][]);
          mapRef.current!.fitBounds(bounds, { padding: [50, 50] });
        }
      })
      .catch(err => {
        console.warn('OSRM Route fetch error, drawing direct polyline fallback:', err);
        const polyline = L.polyline([
          [selectedRequest.latitude, selectedRequest.longitude],
          [destLat!, destLng!]
        ], {
          color: '#dc2626',
          weight: 4,
          dashArray: '6, 6'
        }).addTo(mapRef.current!);
        routePolylineRef.current = polyline;
      });
  }, [selectedRequest, hospitals]);

  const round = (val: number, decimals: number) => {
    return Math.round(val * Math.pow(10, decimals)) / Math.pow(10, decimals);
  };

  return (
    <div className="relative w-full h-[520px] rounded-3xl overflow-hidden shadow-xl border border-slate-300">
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Route Info Badge */}
      {selectedRequest && routeInfo && (
        <div className="absolute bottom-4 left-4 z-[400] bg-slate-900/90 backdrop-blur-md text-white p-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white font-bold">
            <Navigation className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Road Route Telemetry</div>
            <div className="text-sm font-black flex items-center space-x-3">
              <span>📏 {routeInfo.distanceKm} km</span>
              <span>•</span>
              <span className="text-emerald-400">⏱️ {routeInfo.durationMin} mins</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
