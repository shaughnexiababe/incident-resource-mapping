import React from 'react';
import * as L from 'leaflet';
import { CAMARINES_NORTE_CENTER, DEFAULT_ZOOM, HAZARD_ZONES, RESOURCE_CATALOG } from '@/data/camarinesNorteData';
import { PrepositionedMarker, ResourceTypeId, OperationalArea, TacticalRoute } from '@/types/disaster';
import { createMarkerIcon } from '@/utils/leafletIcons';
import { Locate } from 'lucide-react';
import 'leaflet-control-geocoder';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';

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
  const mapRef = React.useRef<L.Map | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const leafletMarkersRef = React.useRef<Map<string, L.Marker>>(new Map());
  const hazardPolygonsRef = React.useRef<L.Polygon[]>([]);
  
  // Custom drawn elements refs
  const savedAreaPolygonsRef = React.useRef<Map<string, L.Polygon>>(new Map());
  const savedRoutePolylinesRef = React.useRef<Map<string, L.Polyline>>(new Map());
  const draftLayerRef = React.useRef<L.LayerGroup | null>(null);

  const [currentZoom, setCurrentZoom] = React.useState<number>(DEFAULT_ZOOM);
  const tileLayerRef = React.useRef<L.TileLayer | null>(null);

  const invalidateMapSize = React.useCallback(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    // Perform multiple invalidations to handle complex layout shifts
    requestAnimationFrame(() => {
      if (mapRef.current) {
        map.invalidateSize();
      }
    });
    const timer = setTimeout(() => {
      if (mapRef.current) {
        map.invalidateSize();
      }
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  const sanitizePoints = React.useCallback((points: [number, number][]) => {
    return points.filter(
      (point): point is [number, number] =>
        Array.isArray(point) &&
        point.length === 2 &&
        Number.isFinite(point[0]) &&
        Number.isFinite(point[1])
    );
  }, []);

  const dedupePoints = React.useCallback((points: [number, number][]) => {
    const sanitized = sanitizePoints(points);
    return sanitized.filter((point, index) => {
      if (index === 0) return true;
      const prev = sanitized[index - 1];
      // Check for identical or near-identical consecutive points (approx 10cm distance)
      return Math.hypot(prev[0] - point[0], prev[1] - point[1]) > 1e-6;
    });
  }, [sanitizePoints]);

  // Initialize Leaflet Map - EXTREMELY STABLE INITIALIZATION
  React.useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    try {
      const map = L.map(containerRef.current, {
        center: CAMARINES_NORTE_CENTER,
        zoom: DEFAULT_ZOOM,
        zoomControl: false,
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      const geocoder = (L.Control as any).geocoder({
        defaultMarkGeocode: false,
        placeholder: "Search location...",
        collapsed: true,
        position: 'topright'
      })
      .on('markgeocode', (e: any) => {
        const bbox = e.geocode.bbox;
        const poly = L.polygon([
          bbox.getSouthEast(),
          bbox.getNorthEast(),
          bbox.getNorthWest(),
          bbox.getSouthWest()
        ]);
        map.fitBounds(poly.getBounds());
      })
      .addTo(map);

      const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      tileLayerRef.current = L.tileLayer(osmUrl, {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      map.on('zoomend', () => {
        setCurrentZoom(map.getZoom());
      });

      draftLayerRef.current = L.layerGroup().addTo(map);

      mapRef.current = map;

      const resizeObserver = new ResizeObserver(() => {
        invalidateMapSize();
      });
      resizeObserver.observe(containerRef.current);

      invalidateMapSize();

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
  }, [invalidateMapSize]);

  // Handle map clicks/taps
  React.useEffect(() => {
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
  React.useEffect(() => {
    const draftGroup = draftLayerRef.current;
    if (!draftGroup) return;

    draftGroup.clearLayers();

    if (drawMode !== 'none' && draftPoints.length > 0) {
      const validPoints = dedupePoints(draftPoints);

      try {
        validPoints.forEach((pt, index) => {
          const circle = L.circleMarker(pt, {
            radius: 5,
            color: '#ffffff',
            fillColor: drawMode === 'area' ? '#3b82f6' : '#10b981',
            fillOpacity: 1,
            weight: 2,
          });
          circle.bindTooltip("Pt " + (index + 1), {
            permanent: true,
            direction: 'top',
            className: 'text-[9px] bg-slate-900 text-white font-mono px-1 py-0 border-0 shadow'
          });
          draftGroup.addLayer(circle);
        });

        if (drawMode === 'route' && validPoints.length >= 2) {
          const polyline = L.polyline(validPoints, {
            color: '#10b981',
            weight: 4,
            dashArray: '6, 6',
          });
          draftGroup.addLayer(polyline);
        } else if (drawMode === 'area') {
          if (validPoints.length === 2) {
            const polyline = L.polyline(validPoints, {
              color: '#3b82f6',
              weight: 3,
              dashArray: '4, 4',
            });
            draftGroup.addLayer(polyline);
          } else if (validPoints.length >= 3) {
            const polygon = L.polygon(validPoints, {
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
  }, [drawMode, draftPoints, dedupePoints]);

  // Render Operational Area Divisions
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const currentAreaIds = new Set(areas.map((a) => a.id));

    savedAreaPolygonsRef.current.forEach((polygon, id) => {
      if (!currentAreaIds.has(id)) {
        polygon.remove();
        savedAreaPolygonsRef.current.delete(id);
      }
    });

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

          const tooltipHtml = '<div class="font-sans text-xs">' +
            '<strong class="font-bold text-white block uppercase">' + areaData.name + '</strong>' +
            (areaData.notes ? '<span class="text-[10px] text-slate-300 block">' + areaData.notes + '</span>' : '') +
            '</div>';

          polygon.bindTooltip(tooltipHtml, { sticky: true, className: 'bg-slate-900 text-white border-slate-700 p-2 rounded shadow-lg' });

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
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const currentRouteIds = new Set(routes.map((r) => r.id));

    savedRoutePolylinesRef.current.forEach((polyline, id) => {
      if (!currentRouteIds.has(id)) {
        polyline.remove();
        savedRoutePolylinesRef.current.delete(id);
      }
    });

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

          const tooltipHtml = '<div class="font-sans text-xs">' +
            '<strong class="font-bold text-white block">' + routeData.name + '</strong>' +
            '<span class="text-[10px] text-slate-300 block capitalize">' + routeData.type + ' Corridor</span>' +
            '</div>';

          polyline.bindTooltip(tooltipHtml, { sticky: true, className: 'bg-slate-900 text-white border-slate-700 p-1.5 rounded shadow-lg' });

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

  React.useEffect(() => {
    if (mapRef.current) {
      requestAnimationFrame(() => {
        if (mapRef.current) mapRef.current.invalidateSize();
      });
      const timer = setTimeout(() => {
        if (mapRef.current) mapRef.current.invalidateSize();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [modalsOpen, armedResourceId, showHazards, selectedMunicipalityCoord]);

  React.useEffect(() => {
    if (selectedMunicipalityCoord && mapRef.current) {
      mapRef.current.flyTo(selectedMunicipalityCoord, 14, {
        duration: 1.2,
      });
    }
  }, [selectedMunicipalityCoord]);

  React.useEffect(() => {
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

          const tooltipHtml = '<div class="font-sans">' +
            '<strong class="text-xs uppercase tracking-wide block font-bold text-amber-800">' + hazard.name + '</strong>' +
            '<span class="text-[11px] text-slate-700">' + hazard.description + '</span>' +
            '</div>';

          polygon.bindTooltip(tooltipHtml, { sticky: true });

          hazardPolygonsRef.current.push(polygon);
        } catch (e) {
          console.error('Error rendering hazard overlay:', e);
        }
      });
    }
  }, [showHazards]);

  const zoomFactor = Math.max(0.75, Math.min(1.5, 1 + (currentZoom - DEFAULT_ZOOM) * 0.08));
  const effectiveSize = Math.round(baseIconSize * zoomFactor);

  React.useEffect(() => {
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
      if (
        typeof markerData.lat !== 'number' ||
        typeof markerData.lng !== 'number' ||
        !Number.isFinite(markerData.lat) ||
        !Number.isFinite(markerData.lng)
      ) {
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

          leafletMarker.on('click', (e) => {
            if (e.originalEvent) {
              e.originalEvent.stopPropagation();
            }
            onMarkerSelect(markerData);
          });

          leafletMarker.on('dragend', (e) => {
            const latLng = e.target.getLatLng();
            onMarkerDragEnd(markerData.id, latLng.lat, latLng.lng);
          });

          leafletMarkersRef.current.set(markerData.id, leafletMarker);
        }
      } catch (err) {
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
    <div className="w-full h-full min-h-0 relative flex-1 bg-slate-950 overflow-hidden">
      <div
        ref={containerRef}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="absolute inset-0 w-full h-full"
        style={{
          cursor: drawMode !== 'none' || armedResourceId ? 'crosshair' : 'grab',
          zIndex: 0
        }}
      />

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
