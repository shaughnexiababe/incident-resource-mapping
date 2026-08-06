import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { CAMARINES_NORTE_CENTER, DEFAULT_ZOOM, HAZARD_ZONES, RESOURCE_CATALOG } from '@/data/camarinesNorteData';
import { PrepositionedMarker, ResourceTypeId } from '@/types/disaster';
import { createMarkerIcon } from '@/utils/leafletIcons';

interface MapContainerProps {
  markers: PrepositionedMarker[];
  onAddMarker: (resourceTypeId: ResourceTypeId, lat: number, lng: number) => void;
  onMarkerSelect: (marker: PrepositionedMarker) => void;
  onMarkerDragEnd: (id: string, lat: number, lng: number) => void;
  showHazards: boolean;
  selectedMunicipalityCoord: [number, number] | null;
  baseIconSize: number;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  markers,
  onAddMarker,
  onMarkerSelect,
  onMarkerDragEnd,
  showHazards,
  selectedMunicipalityCoord,
  baseIconSize,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const leafletMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const hazardPolygonsRef = useRef<L.Polygon[]>([]);
  const [currentZoom, setCurrentZoom] = useState<number>(DEFAULT_ZOOM);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: CAMARINES_NORTE_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    // Tile Layer: OpenStreetMap Standard
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom());
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Handle selected municipality pan/flyTo
  useEffect(() => {
    if (selectedMunicipalityCoord && mapRef.current) {
      mapRef.current.flyTo(selectedMunicipalityCoord, 14, {
        duration: 1.2,
      });
    }
  }, [selectedMunicipalityCoord]);

  // Handle Hazard Layers render/clear
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing hazard polygons
    hazardPolygonsRef.current.forEach((polygon) => polygon.remove());
    hazardPolygonsRef.current = [];

    if (showHazards) {
      HAZARD_ZONES.forEach((hazard) => {
        let color = '#3b82f6';
        if (hazard.type === 'flood') color = '#0284c7';
        if (hazard.type === 'storm_surge') color = '#06b6d4';
        if (hazard.type === 'landslide') color = '#d97706';

        const polygon = L.polygon(hazard.coordinates as L.LatLngExpression[], {
          color,
          fillColor: color,
          fillOpacity: 0.35,
          weight: 2,
          dashArray: '5, 5',
        }).addTo(map);

        polygon.bindTooltip(
          `<div class="font-sans">
            <strong class="text-xs uppercase tracking-wide block font-bold text-amber-800">${hazard.name}</strong>
            <span class="text-[11px] text-slate-700">${hazard.description}</span>
          </div>`,
          { sticky: true }
        );

        hazardPolygonsRef.current.push(polygon);
      });
    }
  }, [showHazards]);

  // Dynamic zoom factor multiplier (slightly expands icons when zooming in deep)
  const zoomFactor = Math.max(0.75, Math.min(1.5, 1 + (currentZoom - DEFAULT_ZOOM) * 0.08));
  const effectiveSize = Math.round(baseIconSize * zoomFactor);

  // Update Markers on Map
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const currentMarkerIds = new Set(markers.map((m) => m.id));

    // Remove markers that no longer exist
    leafletMarkersRef.current.forEach((leafletMarker, id) => {
      if (!currentMarkerIds.has(id)) {
        leafletMarker.remove();
        leafletMarkersRef.current.delete(id);
      }
    });

    // Add or update markers
    markers.forEach((markerData) => {
      const existing = leafletMarkersRef.current.get(markerData.id);
      const icon = createMarkerIcon(
        markerData.resourceTypeId, 
        markerData.title, 
        markerData.quantity,
        effectiveSize
      );

      if (existing) {
        existing.setLatLng([markerData.lat, markerData.lng]);
        existing.setIcon(icon);
      } else {
        const leafletMarker = L.marker([markerData.lat, markerData.lng], {
          icon,
          draggable: true,
        }).addTo(map);

        // Click event to open edit modal
        leafletMarker.on('click', () => {
          onMarkerSelect(markerData);
        });

        // Drag end event to update position
        leafletMarker.on('dragend', (e) => {
          const latLng = e.target.getLatLng();
          onMarkerDragEnd(markerData.id, latLng.lat, latLng.lng);
        });

        leafletMarkersRef.current.set(markerData.id, leafletMarker);
      }
    });
  }, [markers, effectiveSize, onMarkerSelect, onMarkerDragEnd]);

  // Handle Drag Over & Drop onto map coordinates
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const map = mapRef.current;
    if (!map || !containerRef.current) return;

    const resourceTypeId = e.dataTransfer.getData('text/plain') as ResourceTypeId;
    if (!resourceTypeId) return;

    // Verify it is a valid resource
    const catalogItem = RESOURCE_CATALOG.find((r) => r.id === resourceTypeId);
    if (!catalogItem) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const latLng = map.containerPointToLatLng([x, y]);
    onAddMarker(resourceTypeId, latLng.lat, latLng.lng);
  };

  return (
    <div
      ref={containerRef}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="w-full h-full relative bg-slate-900"
    />
  );
};