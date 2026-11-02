import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Hospital } from '../../types';

export interface HospitalMarker {
  id?: string;
  name: string;
  lat: number;
  lng: number;
  latitude?: number;
  longitude?: number;
  type?: string;
  facility_type?: string;
  phone?: string;
  address?: string;
  distance_km?: number;
}

interface KarnatakaLiveMapProps {
  ambulanceLat?: number;
  ambulanceLng?: number;
  ambulanceName?: string;
  pickupLat?: number;
  pickupLng?: number;
  pickupAddress?: string;
  destinationLat?: number;
  destinationLng?: number;
  destinationName?: string;
  hospitals?: Hospital[] | HospitalMarker[];
  selectedHospital?: Hospital | HospitalMarker | null;
  routeGeometry?: [number, number][];
  onSelectHospital?: (hospital: any) => void;
  onSelectLocation?: (lat: number, lng: number, address: string) => void;
  showNearHospitals?: boolean;
  availableAmbulances?: any[];
}

export const KARNATAKA_HOSPITALS: HospitalMarker[] = [
  // 1. Bidadi Region
  { name: 'Subhash Hospital', lat: 12.7995, lng: 77.3840, type: 'General & Emergency Hospital', phone: '+91-80-2728-1122', address: 'Mysore Main Road, Bidadi Town, Ramanagara Dist' },
  { name: 'Kempegowda Govt Hospital', lat: 12.8020, lng: 77.3880, type: 'Government Community Hospital', phone: '+91-80-2728-3344', address: 'Govt Hospital Road, Bidadi, Ramanagara Dist' },
  { name: 'Bharat Super Specialty Hospital', lat: 12.8110, lng: 77.3960, type: 'Super Specialty Trauma Center', phone: '+91-80-2728-5566', address: 'Industrial Area Main Road, Bidadi, Mysore Road' },

  // 2. Kengeri & Kumbalgodu Region
  { name: 'BGS GIMS Super Specialty Hospital', lat: 12.9015, lng: 77.4950, type: 'Super Specialty & Trauma Hospital', phone: '+91-80-2860-9999', address: 'BGS Health & Education City, Kengeri, Bengaluru' },
  { name: 'Rajarajeswari Medical College & Hospital (RRMCH)', lat: 12.8750, lng: 77.4600, type: 'Medical College & ER Hospital', phone: '+91-80-2843-7444', address: 'Kambipura, Mysore Road, Kengeri, Bengaluru' },
  { name: 'Subhash Emergency Center (Kengeri)', lat: 12.9080, lng: 77.4800, type: '24/7 Emergency Care', phone: '+91-80-2848-2233', address: 'Mysore Road Bypass, Kengeri Satellite Town, Bengaluru' },
  { name: 'Kempegowda Govt Hospital (Kumbalgodu)', lat: 12.8620, lng: 77.4520, type: 'Government Health Center', phone: '+91-80-2843-1100', address: 'Kumbalgodu Main Market, Mysore Road, Bengaluru' },

  // 3. Rajarajeshwari Nagar (RR Nagar) & Mysore Road
  { name: 'SS Sparsh Hospital (RR Nagar)', lat: 12.9250, lng: 77.5120, type: 'Super Specialty & Joint ER', phone: '+91-80-3327-1100', address: 'Ideal Homes Township, RR Nagar, Bengaluru' },
  { name: 'Manipal Hospital (Mysore Road)', lat: 12.9550, lng: 77.5350, type: 'Multi-Specialty ER', phone: '+91-80-2674-8888', address: 'Mysore Road Junction, Nayandahalli, Bengaluru' },
  { name: 'Fortis Hospital (Nagarbhavi)', lat: 12.9620, lng: 77.5180, type: 'Emergency & Surgical Center', phone: '+91-80-6621-1000', address: 'Outer Ring Road, Nagarbhavi, Bengaluru' },

  // 4. Central & East Bengaluru Region
  { name: 'Smart Care Super Specialty Hospital', lat: 12.9784, lng: 77.6408, type: 'Super Specialty ER', phone: '+91-80-2500-1008', address: '100ft Indiranagar Double Road, Bengaluru' },
  { name: 'City General & Trauma Center', lat: 12.9650, lng: 77.6000, type: 'General Level-1 ER', phone: '+91-80-2222-3344', address: '45 MG Road, Richmond Town, Bengaluru' },
  { name: 'Victoria Emergency Medical Center', lat: 12.9634, lng: 77.5750, type: 'Govt Level-1 Trauma', phone: '+91-80-2670-1111', address: 'Fort Road, KR Market, Bengaluru' },
  { name: 'Apollo Emergency Care & Heart Institute', lat: 12.9100, lng: 77.5980, type: 'Cardiac & Neuro ER', phone: '+91-80-2630-4050', address: 'Bannerghatta Main Road, Jayanagar, Bengaluru' },
  { name: 'NIMHANS Neuro Emergency', lat: 12.9388, lng: 77.5959, type: 'Neurological ER', phone: '+91-80-2699-5000', address: 'Hosur Road, Lakkasandra, Bengaluru' },
  { name: 'Jayadeva Cardiac Emergency', lat: 12.9237, lng: 77.5997, type: 'Cardiology ER', phone: '+91-80-2297-7200', address: 'Bannerghatta Rd, Jayanagar 9th Block, Bengaluru' },
  { name: 'Manipal Emergency Center (HAL)', lat: 12.9582, lng: 77.6483, type: 'Multi-Specialty ER', phone: '+91-80-2502-4444', address: '98 HAL Old Airport Rd, Kodihalli, Bengaluru' },
  { name: 'Columbia Asia Emergency Ward (Hebbal)', lat: 13.0350, lng: 77.5890, type: 'Emergency Ward', phone: '+91-80-4138-0000', address: 'Kirloskar Business Park, Hebbal, Bengaluru' },
  { name: 'KR Hospital Emergency (Mysuru)', lat: 12.3140, lng: 76.6496, type: 'Mysuru District ER', phone: '+91-821-242-2000', address: 'Irwin Road, Mysuru, Karnataka' },
];

export const KarnatakaLiveMap: React.FC<KarnatakaLiveMapProps> = ({
  ambulanceLat,
  ambulanceLng,
  ambulanceName = 'Ambulance A-01',
  pickupLat = 12.9716,
  pickupLng = 77.5946,
  pickupAddress = 'Main Road, Bengaluru',
  destinationLat,
  destinationLng,
  destinationName,
  hospitals,
  selectedHospital,
  routeGeometry = [],
  onSelectHospital,
  onSelectLocation,
  showNearHospitals = true,
  availableAmbulances = []
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up existing map instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize Leaflet Map centered on Pickup Location
    const map = L.map(mapContainerRef.current, {
      center: [pickupLat || 12.9716, pickupLng || 77.5946],
      zoom: 13,
      zoomControl: true,
    });

    // Add OpenStreetMap Open-source Map Tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors | SmartCare Emergency GIS',
    }).addTo(map);

    mapInstanceRef.current = map;

    // Custom Icon Creator
    const createCustomIcon = (emoji: string, bgClass: string, label: string, isSelected: boolean = false) => {
      const ringClass = isSelected ? 'ring-4 ring-yellow-400 scale-125 z-50' : '';
      return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="${bgClass} ${ringClass} w-9 h-9 rounded-full border-2 border-white shadow-2xl flex items-center justify-center text-base transform hover:scale-110 transition-transform">
              ${emoji}
            </div>
            <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md border border-slate-700">
              ${label}
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });
    };

    const displayHospitals = hospitals && hospitals.length > 0 ? hospitals : KARNATAKA_HOSPITALS;
    const boundsPoints: [number, number][] = [];

    if (pickupLat && pickupLng) {
      boundsPoints.push([pickupLat, pickupLng]);
    }

    // Determine selected hospital coordinates & ID/name
    const selAny = selectedHospital as any;
    let selId = selectedHospital?.id;
    let selName = selectedHospital?.name || destinationName;
    let selLat = selAny?.latitude ?? selAny?.lat ?? destinationLat;
    let selLng = selAny?.longitude ?? selAny?.lng ?? destinationLng;

    // 1. Render Hospital Markers
    if (showNearHospitals && displayHospitals) {
      displayHospitals.forEach((hospItem) => {
        const hosp = hospItem as any;
        const hLat = hosp.latitude ?? hosp.lat;
        const hLng = hosp.longitude ?? hosp.lng;
        if (!hLat || !hLng) return;

        const isSelected = Boolean((selId && hosp.id === selId) || (selName && hosp.name === selName));
        const hospShortName = hosp.name ? String(hosp.name).split(' ')[0] : 'Hospital';
        
        const emoji = isSelected ? '🏁' : '🏥';
        const bgClass = isSelected
          ? 'bg-amber-500 text-slate-950 font-black shadow-rose-500/50'
          : 'bg-emerald-600 text-white';

        const label = isSelected ? `DESTINATION: ${hospShortName}` : hospShortName;
        const icon = createCustomIcon(emoji, bgClass, label, isSelected);

        const marker = L.marker([hLat, hLng], { icon }).addTo(map);

        const distText = hosp.distance_km !== undefined ? `<span class="text-rose-600 font-bold block mt-1">📍 ${hosp.distance_km} km from pickup</span>` : '';
        const phoneText = hosp.phone ? `<span class="text-teal-700 font-mono block mt-0.5">📞 ${hosp.phone}</span>` : '';
        const addrText = hosp.address ? `<p class="text-slate-600 text-[11px] mt-1">${hosp.address}</p>` : '';
        const fType = hosp.facility_type || hosp.type;
        const typeText = fType ? `<span class="text-slate-500 font-semibold block text-[11px] mt-0.5">${fType}</span>` : '';

        marker.bindPopup(`
          <div class="p-1 font-sans text-xs">
            <strong class="text-slate-900 text-sm block font-extrabold">${hosp.name}</strong>
            ${typeText}
            ${addrText}
            ${phoneText}
            ${distText}
            ${isSelected ? '<span class="inline-block mt-2 px-2.5 py-1 bg-amber-100 text-amber-900 font-extrabold rounded-md text-[11px]">✓ SELECTED DESTINATION</span>' : ''}
          </div>
        `);

        if (isSelected) {
          marker.openPopup();
          selLat = hLat;
          selLng = hLng;
        }

        if (onSelectHospital) {
          marker.on('click', () => {
            onSelectHospital(hosp);
          });
        }

        boundsPoints.push([hLat, hLng]);
      });
    }

    // 2. Add Pickup Location Marker
    if (pickupLat && pickupLng) {
      const pickupIcon = createCustomIcon('📍', 'bg-rose-600 text-white animate-bounce', 'PICKUP LOCATION');
      L.marker([pickupLat, pickupLng], { icon: pickupIcon })
        .addTo(map)
        .bindPopup(`
          <div class="p-1 font-sans text-xs">
            <strong class="text-rose-700 block font-extrabold text-sm">📍 Pickup Location</strong>
            <p class="text-slate-700 mt-1 font-medium">${pickupAddress}</p>
            <span class="text-slate-500 font-mono block text-[10px] mt-1">Coords: ${pickupLat.toFixed(4)}, ${pickupLng.toFixed(4)}</span>
          </div>
        `);
    }

    // 3. Add Live Ambulance Marker (if available)
    if (ambulanceLat && ambulanceLng) {
      const ambIcon = createCustomIcon('🚑', 'bg-amber-500 text-white shadow-xl ring-4 ring-amber-300/60', ambulanceName);
      L.marker([ambulanceLat, ambulanceLng], { icon: ambIcon })
        .addTo(map)
        .bindPopup(`
          <div class="p-1 font-sans text-xs">
            <strong class="text-amber-900 text-sm block font-extrabold">🚑 ${ambulanceName}</strong>
            <span class="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">GPS Telemetry Active</span>
          </div>
        `);
      boundsPoints.push([ambulanceLat, ambulanceLng]);
    }

    // 4. Draw Route Line (Pickup → Destination Hospital)
    if (routeGeometry && routeGeometry.length > 0) {
      L.polyline(routeGeometry, {
        color: '#2563eb',
        weight: 5,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);
      routeGeometry.forEach(p => boundsPoints.push(p));
    } else if (pickupLat && pickupLng && selLat && selLng) {
      // Fallback straight line if route geometry not provided yet
      L.polyline([[pickupLat, pickupLng], [selLat, selLng]], {
        color: '#ef4444',
        weight: 4,
        dashArray: '8, 8',
        opacity: 0.8,
      }).addTo(map);
    }

    // 5. Add Available Ambulances Markers (Fleet view)
    if (availableAmbulances && availableAmbulances.length > 0) {
      availableAmbulances.forEach((amb) => {
        const ambLat = amb.current_latitude || 12.9716;
        const ambLng = amb.current_longitude || 77.5946;
        const vehicleCode = amb.vehicle_number ? String(amb.vehicle_number).split(' ')[0] : 'A-01';
        const icon = createCustomIcon('🚑', 'bg-amber-500 text-white font-bold', vehicleCode);
        L.marker([ambLat, ambLng], { icon })
          .addTo(map)
          .bindPopup(`
            <div class="p-1 font-sans text-xs">
              <strong class="text-amber-800 text-sm block font-bold">🚑 ${amb.vehicle_number}</strong>
              <span class="text-slate-600 block">${amb.ambulance_type || 'Advanced ALS'}</span>
              <span class="text-slate-500 block">Driver: <strong>${amb.driver_name || 'Raj Kumar'}</strong></span>
              <span class="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">Status: ${amb.status}</span>
            </div>
          `);
      });
    }

    // Handle Map Clicks to set pickup location dynamically
    if (onSelectLocation) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        onSelectLocation(lat, lng, `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
      });
    }

    // Adjust map view bounds to include points
    if (boundsPoints.length > 1) {
      try {
        const bounds = L.latLngBounds(boundsPoints);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
      } catch (err) {
        console.warn("fitBounds warning:", err);
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [ambulanceLat, ambulanceLng, pickupLat, pickupLng, selectedHospital, hospitals, routeGeometry]);

  return (
    <div className="relative w-full h-full min-h-[380px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
      <div ref={mapContainerRef} className="w-full h-full min-h-[380px] z-0" />
      {onSelectLocation && (
        <div className="absolute top-3 left-3 z-10 bg-slate-900/90 text-white text-[11px] font-semibold px-3 py-1.5 rounded-xl border border-slate-700 shadow-md backdrop-blur-md">
          📍 Click anywhere on map to pin custom pickup address
        </div>
      )}
    </div>
  );
};

