import React, { useEffect, useRef, useState } from 'react';
import * as L from 'leaflet';
import { CAMARINES_NORTE_CENTER, DEFAULT_ZOOM, HAZARD_ZONES, RESOURCE_CATALOG } from '@/data/camarinesNorteData';
import { PrepositionedMarker, ResourceTypeId, OperationalArea, TacticalRoute } from '@/types/disaster';
import { createMarkerIcon } from '@/utils/leafletIcons';
import { Locate } from 'lucide-react';

export interface MapContainerProps {
  markers: PrepositionedMarker[];
  areas: OperationalArea[];
  routes: TacticalRoute[];
  onAddMarker: (resourceTypeId: ResourceTypeId, lat: number, lng: number) => void;
  onMarkerSelect: (marker: PrepositionedMarker) => void;
  onMarkerDragEnd: (id: string, lat: number, lng: number) => void;
  onAreaSelect?: (area: OperationalArea) => void;
  onRouteSelect?: (route: TacticalRoute) => void;
  showHazards: boolean;
  selectedMunicipalityCoord: [number, number] | null;
  baseIconSize: number;
  drawMode: 'none' | 'area' | 'route';
  draftPoints: [number, number][];
  onMapClickDuringDraw: (lat: number, lng: number) => void;
  /** Resource id currently "armed" for tap-to-place, or null. This is the
   * touch-device fallback for drag-and-drop placement, which never fires
   * on mobile/tablet browsers. */
  armedResourceId?: string | null;
  onPlaceArmedResource?: (lat: number, lng: number) => void;
  /** True while any Dialog/Sheet is open. Radix dialogs lock body scroll and
   * compensate for the scrollbar width via padding on <html>/<body>, which
   * can shift the map container's effective size without the container's
   * own box dimensions changing — something a ResizeObserver on the
   * container alone won't always catch. We use this to force a Leaflet
   * invalidateSize() pass when a modal opens or closes. */
  modalsOpen?: boolean;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  markers,
  areas,
  routes,
  onAddMarker,
  onMarkerSelect,
  onMarkerDragEnd,
  onAreaSelect,
  onRouteSelect,
  showHazards,
  selectedMunicipalityCoord,
  baseIconSize,
  drawMode,
  draftPoints,
  onMapClickDuringDraw,
  armedResourceId = null,
  onPlaceArmedResource,
  modalsOpen = false,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const leafletMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const hazardPolygonsRef = useRef<L.Polygon[]>([]);
  
  // Custom drawn elements refs
  const savedAreaPolygonsRef = useRef<Map<string, L.Polygon>>(new Map());
  const savedRoutePolylinesRef = useRef<Map<string, L.Polyline>>(new Map());
  const draftLayerRef = useRef<L.LayerGroup | null>(null);

  const [currentZoom, setCurrentZoom] = useState<number>(DEFAULT_ZOOM);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    try {
      const map = L.map(containerRef.current, {
        center: CAMARINES_NORTE_CENTER,
        zoom: DEFAULT_ZOOM,
        zoomControl: false,
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      map.on('zoomend', () => {
        setCurrentZoom(map.getZoom());
      });

      // Draft layer group for interactive drawing
      draftLayerRef.current = L.layerGroup().addTo(map);

      mapRef.current = map;

      // Handle ResizeObserver to keep leaflet container sized correctly
      const resizeObserver = new ResizeObserver(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      });
      resizeObserver.observe(containerRef.current);

      return () => {
        resizeObserver.disconnect();
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    } catch (err) {
      console.error('Error initializing Leaflet map:', err);
    }
  }, []);

  // Handle map clicks/taps: drawing mode takes priority, then tap-to-place
  // placement mode (the mobile fallback for drag-and-drop, which never
  // fires on touch devices).
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (!e.latlng) return;
      if (drawMode !== 'none') {
        onMapClickDuringDraw(e.latlng.lat, e.latlng.lng);
      } else if (armedResourceId && onPlaceArmedResource) {
        onPlaceArmedResource(e.latlng.lat, e.latlng.lng);
      }
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [drawMode, onMapClickDuringDraw, armedResourceId, onPlaceArmedResource]);

  // Render Draft Drawing Layer
  useEffect(() => {
    const draftGroup = draftLayerRef.current;
    if (!draftGroup) return;

    draftGroup.clearLayers();

    if (drawMode !== 'none' && draftPoints.length > 0) {
      try {
        // Draw point markers
        draftPoints.forEach((pt, index) => {
          if (!pt || pt.length !== 2 || isNaN(pt[0]) || isNaN(pt[1])) return;
          const circle = L.circleMarker(pt, {
            radius: 5,
            color: '#ffffff',
            fillColor: drawMode === 'area' ? '#3b82f6' : '#10b981',
            fillOpacity: 1,
            weight: 2,
          });
          circle.bindTooltip(`Pt ${index + 1}`, { 
            permanent: true, 
            direction: 'top', 
            className: 'text-[9px] bg-slate-900 text-white font-mono px-1 py-0 border-0 shadow' 
          });
          draftGroup.addLayer(circle);
        });

        if (drawMode === 'route' && draftPoints.length >= 2) {
          const polyline = L.polyline(draftPoints, {
            color: '#10b981',
            weight: 4,
            dashArray: '6, 6',
          });
          draftGroup.addLayer(polyline);
        } else if (drawMode === 'area') {
          if (draftPoints.length === 2) {
            const polyline = L.polyline(draftPoints, {
              color: '#3b82f6',
              weight: 3,
              dashArray: '4, 4',
            });
            draftGroup.addLayer(polyline);
          } else if (draftPoints.length >= 3) {
            const polygon = L.polygon(draftPoints, {
              color: '#3b82f6',
              fillColor: '#3b82f6',
              fillOpacity: 0.25,
              weight: 2,
              dashArray: '4, 4',
            });
            draftGroup.addLayer(polygon);
          }
        }
      } catch (err) {
        console.error('Error drawing draft shape:', err);
      }
    }
  }, [drawMode, draftPoints]);

  // Render Operational Area Divisions
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const currentAreaIds = new Set(areas.map((a) => a.id));

    // Remove deleted area polygons
    savedAreaPolygonsRef.current.forEach((polygon, id) => {
      if (!currentAreaIds.has(id)) {
        polygon.remove();
        savedAreaPolygonsRef.current.delete(id);
      }
    });

    // Add or update areas
    areas.forEach((areaData) => {
      if (!areaData.points || areaData.points.length < 3) return;
      const validPoints = areaData.points.filter(
        (p) => Array.isArray(p) && p.length === 2 && !isNaN(p[0]) && !isNaN(p[1])
      );
      if (validPoints.length < 3) return;

      const existing = savedAreaPolygonsRef.current.get(areaData.id);

      try {
        if (existing) {
          existing.setLatLngs(validPoints as L.LatLngExpression[]);
          existing.setStyle({
            color: areaData.color || '#3b82f6',
            fillColor: areaData.color || '#3b82f6',
            fillOpacity: areaData.opacity ?? 0.3,
          });
          // Re-bind click event cleanly
          existing.off('click');
          existing.on('click', (e: L.LeafletMouseEvent) => {
            if (e.originalEvent) {
              L.DomEvent.stopPropagation(e.originalEvent);
            }
            if (onAreaSelect) onAreaSelect(areaData);
          });
        } else {
          const polygon = L.polygon(validPoints as L.LatLngExpression[], {
            color: areaData.color || '#3b82f6',
            fillColor: areaData.color || '#3b82f6',
            fillOpacity: areaData.opacity ?? 0.3,
            weight: 2.5,
          }).addTo(map);

          polygon.bindTooltip(
            `<div class="font-sans text-xs">
              <strong class="font-bold text-white block uppercase">${areaData.name}</strong>
              ${areaData.notes ? `<span class="text-[10px] text-slate-300 block">${areaData.notes}</span>` : ''}
            </div>`,
            { sticky: true, className: 'bg-slate-900 text-white border-slate-700 p-2 rounded shadow-lg' }
          );

          polygon.on('click', (e: L.LeafletMouseEvent) => {
            if (e.originalEvent) {
              L.DomEvent.stopPropagation(e.originalEvent);
            }
            if (onAreaSelect) onAreaSelect(areaData);
          });

          savedAreaPolygonsRef.current.set(areaData.id, polygon);
        }
      } catch (err) {
        console.error('Error adding area polygon:', err);
      }
    });
  }, [areas, onAreaSelect]);

  // Render Tactical Routes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const currentRouteIds = new Set(routes.map((r) => r.id));

    // Remove deleted routes
    savedRoutePolylinesRef.current.forEach((polyline, id) => {
      if (!currentRouteIds.has(id)) {
        polyline.remove();
        savedRoutePolylinesRef.current.delete(id);
      }
    });

    // Add or update routes
    routes.forEach((routeData) => {
      if (!routeData.points || routeData.points.length < 2) return;
      const validPoints = routeData.points.filter(
        (p) => Array.isArray(p) && p.length === 2 && !isNaN(p[0]) && !isNaN(p[1])
      );
      if (validPoints.length < 2) return;

      const existing = savedRoutePolylinesRef.current.get(routeData.id);

      try {
        if (existing) {
          existing.setLatLngs(validPoints as L.LatLngExpression[]);
          existing.setStyle({
            color: routeData.color || '#10b981',
            dashArray: routeData.isDashed ? '8, 8' : undefined,
          });
          // Re-bind click cleanly
          existing.off('click');
          existing.on('click', (e: L.LeafletMouseEvent) => {
            if (e.originalEvent) {
              L.DomEvent.stopPropagation(e.originalEvent);
            }
            if (onRouteSelect) onRouteSelect(routeData);
          });
        } else {
          const polyline = L.polyline(validPoints as L.LatLngExpression[], {
            color: routeData.color || '#10b981',
            weight: 4,
            dashArray: routeData.isDashed ? '8, 8' : undefined,
          }).addTo(map);

          polyline.bindTooltip(
            `<div class="font-sans text-xs">
              <strong class="font-bold text-white block">${routeData.name}</strong>
              <span class="text-[10px] text-slate-300 block capitalize">${routeData.type} Corridor</span>
            </div>`,
            { sticky: true, className: 'bg-slate-900 text-white border-slate-700 p-1.5 rounded shadow-lg' }
          );

          polyline.on('click', (e: L.LeafletMouseEvent) => {
            if (e.originalEvent) {
              L.DomEvent.stopPropagation(e.originalEvent);
            }
            if (onRouteSelect) onRouteSelect(routeData);
          });

          savedRoutePolylinesRef.current.set(routeData.id, polyline);
        }
      } catch (err) {
        console.error('Error adding route polyline:', err);
      }
    });
  }, [routes, onRouteSelect]);

  // Force Leaflet to re-measure its container whenever a modal opens or
  // closes. Dialogs/Sheets lock body scroll and add scrollbar-compensation
  // padding, which can silently shift layout without the map container's
  // own box dimensions changing (so our ResizeObserver won't fire). Left
  // unhandled, this is a common cause of the map looking "broken"/blank
  // after closing an Area or Route edit modal.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const raf = requestAnimationFrame(() => {
      map.invalidateSize();
    });
    return () => cancelAnimationFrame(raf);
  }, [modalsOpen]);

  // Handle selected municipality pan/flyTo
  useEffect(() => {
    if (selectedMunicipalityCoord && mapRef.current) {
      mapRef.current.flyTo(selectedMunicipalityCoord, 14, {
        duration: 1.2,
      });
    }
  }, [selectedMunicipalityCoord]);

  // Handle Hazard Layers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    hazardPolygonsRef.current.forEach((polygon) => polygon.remove());
    hazardPolygonsRef.current = [];

    if (showHazards) {
      HAZARD_ZONES.forEach((hazard) => {
        let color = '#3b82f6';
        if (hazard.type === 'flood') color = '#0284c7';
        if (hazard.type === 'storm_surge') color = '#06b6d4';
        if (hazard.type === 'landslide') color = '#d97706';

        try {
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
        } catch (e) {
          console.error('Error rendering hazard overlay:', e);
        }
      });
    }
  }, [showHazards]);

  // Dynamic zoom factor multiplier
  const zoomFactor = Math.max(0.75, Math.min(1.5, 1 + (currentZoom - DEFAULT_ZOOM) * 0.08));
  const effectiveSize = Math.round(baseIconSize * zoomFactor);

  // Update Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const currentMarkerIds = new Set(markers.map((m) => m.id));

    leafletMarkersRef.current.forEach((leafletMarker, id) => {
      if (!currentMarkerIds.has(id)) {
        leafletMarker.remove();
        leafletMarkersRef.current.delete(id);
      }
    });

    markers.forEach((markerData) => {
      // Guard against malformed coordinates (e.g. from an old/corrupted
      // saved plan) before handing them to Leaflet.
      if (
        typeof markerData.lat !== 'number' ||
        typeof markerData.lng !== 'number' ||
        isNaN(markerData.lat) ||
        isNaN(markerData.lng)
      ) {
        console.error('Skipping marker with invalid coordinates:', markerData);
        return;
      }

      try {
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

          leafletMarker.on('click', () => {
            onMarkerSelect(markerData);
          });

          leafletMarker.on('dragend', (e) => {
            const latLng = e.target.getLatLng();
            onMarkerDragEnd(markerData.id, latLng.lat, latLng.lng);
          });

          leafletMarkersRef.current.set(markerData.id, leafletMarker);
        }
      } catch (err) {
        // A single bad marker (e.g. an unrecognized resourceTypeId from an
        // older saved plan) must never take down the whole map render.
        console.error('Error rendering marker:', markerData.id, err);
      }
    });
  }, [markers, effectiveSize, onMarkerSelect, onMarkerDragEnd]);

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

    const catalogItem = RESOURCE_CATALOG.find((r) => r.id === resourceTypeId);
    if (!catalogItem) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const latLng = map.containerPointToLatLng([x, y]);
    onAddMarker(resourceTypeId, latLng.lat, latLng.lng);
  };

  const handleRecenter = () => {
    if (mapRef.current) {
      mapRef.current.flyTo(CAMARINES_NORTE_CENTER, DEFAULT_ZOOM, { duration: 1 });
      mapRef.current.invalidateSize();
    }
  };

  return (
    <div className="w-full h-full relative bg-slate-900">
      <div
        ref={containerRef}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`w-full h-full relative bg-slate-900 ${
          drawMode !== 'none' || armedResourceId ? 'cursor-crosshair' : ''
        }`}
      />

      {/* Quick Recenter Button */}
      <button
        onClick={handleRecenter}
        className="absolute bottom-6 right-4 z-[400] bg-slate-900/90 hover:bg-slate-800 text-white p-2.5 rounded-lg border border-slate-700 shadow-xl flex items-center gap-1.5 text-xs font-semibold backdrop-blur-sm transition-all"
        title="Recenter map to Camarines Norte"
      >
        <Locate className="w-4 h-4 text-emerald-400" />
        <span className="hidden sm:inline">Recenter Map</span>
      </button>
    </div>
  );
};