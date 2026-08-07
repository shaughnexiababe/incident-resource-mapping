import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { MarkerEditModal } from '@/components/MarkerEditModal';
import { AreaEditModal } from '@/components/AreaEditModal';
import { RouteEditModal } from '@/components/RouteEditModal';
import { PlanSummaryDrawer } from '@/components/PlanSummaryDrawer';

import { MapContainerProps } from '@/components/MapContainer';
// Leaflet (~150KB) and its React wrapper logic only need to load once the
// user is actually looking at the map — lazy-loading it out of the main
// bundle is the single biggest win against the "chunk too large" build
// warning, since nothing else in the app depends on it.
const MapContainer = lazy(() =>
  import('@/components/MapContainer').then((m) => ({ default: m.MapContainer }))
) as React.ComponentType<MapContainerProps>;
import { PrepositionedMarker, ResourceTypeId, PrepositionPlan, OperationalArea, TacticalRoute } from '@/types/disaster';
import { RESOURCE_CATALOG, MUNICIPALITIES, INITIAL_MARKERS } from '@/data/camarinesNorteData';
import { showSuccess, showError } from '@/utils/toast';
import { haversineDistanceKm } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Check, X, RotateCcw } from 'lucide-react';

const STORAGE_KEY = 'incident_resource_preposition_plan_v4';

const Index = () => {
  const [planTitle, setPlanTitle] = useState<string>('Incident Operational Response Plan');
  const [markers, setMarkers] = useState<PrepositionedMarker[]>([]);
  const [areas, setAreas] = useState<OperationalArea[]>([]);
  const [routes, setRoutes] = useState<TacticalRoute[]>([]);

  // Modals
  const [selectedMarker, setSelectedMarker] = useState<PrepositionedMarker | null>(null);
  const [selectedArea, setSelectedArea] = useState<OperationalArea | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<TacticalRoute | null>(null);

  const [isMarkerModalOpen, setIsMarkerModalOpen] = useState<boolean>(false);
  const [isAreaModalOpen, setIsAreaModalOpen] = useState<boolean>(false);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState<boolean>(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState<boolean>(false);

  // Map Drawing Mode
  const [drawMode, setDrawMode] = useState<'none' | 'area' | 'route'>('none');
  const [draftPoints, setDraftPoints] = useState<[number, number][]>([]);

  // Tap-to-place mode — fallback for touch devices, where HTML5
  // drag-and-drop (used for desktop placement) does not fire at all.
  const [armedResourceId, setArmedResourceId] = useState<ResourceTypeId | null>(null);

  // Map settings
  const [showHazards, setShowHazards] = useState<boolean>(false);
  const [selectedMunicipalityCoord, setSelectedMunicipalityCoord] = useState<[number, number] | null>(null);
  const [iconSize, setIconSize] = useState<number>(40);

  // Load plan from localStorage if previously saved
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed: PrepositionPlan = JSON.parse(savedData);
        if (parsed.title) setPlanTitle(parsed.title);
        if (parsed.markers) setMarkers(parsed.markers);
        if (parsed.areas) setAreas(parsed.areas);
        if (parsed.routes) setRoutes(parsed.routes);
      }
    } catch (e) {
      console.error('Failed to parse saved plan:', e);
    }
  }, []);

  // Deployment stats
  const totalMarkers = markers.reduce((acc, m) => acc + (m.quantity || 1), 0);
  const totalPersonnel = markers
    .filter((m) => RESOURCE_CATALOG.find((r) => r.id === m.resourceTypeId)?.category === 'personnel')
    .reduce((acc, m) => acc + (m.quantity || 1), 0);
  const totalVehicles = markers
    .filter((m) => RESOURCE_CATALOG.find((r) => r.id === m.resourceTypeId)?.category === 'vehicle')
    .reduce((acc, m) => acc + (m.quantity || 1), 0);
  const totalFacilities = markers.filter((m) => RESOURCE_CATALOG.find((r) => r.id === m.resourceTypeId)?.category === 'facility').length;

  // Add new marker dropped on map
  const handleAddMarker = (resourceTypeId: ResourceTypeId, lat: number, lng: number) => {
    const resourceDef = RESOURCE_CATALOG.find((r) => r.id === resourceTypeId) || RESOURCE_CATALOG[0];

    let closestTown = 'Daet (Capital)';
    let minDistance = Number.MAX_VALUE;

    MUNICIPALITIES.forEach((mun) => {
      const dist = haversineDistanceKm(mun.lat, mun.lng, lat, lng);
      if (dist < minDistance) {
        minDistance = dist;
        closestTown = mun.name;
      }
    });

    const newMarker: PrepositionedMarker = {
      id: `marker-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      resourceTypeId,
      title: `${resourceDef.defaultCallsign}`,
      notes: `Prepositioned in ${closestTown}. Edit notes to specify details.`,
      lat,
      lng,
      status: 'ready',
      quantity: 1,
      municipality: closestTown,
      updatedAt: new Date().toISOString(),
    };

    setMarkers((prev) => [...prev, newMarker]);
    setSelectedMarker(newMarker);
    setIsMarkerModalOpen(true);
    showSuccess(`Added ${resourceDef.name} at coordinates [${lat.toFixed(3)}, ${lng.toFixed(3)}]`);
  };

  // Drag marker end
  const handleMarkerDragEnd = useCallback((id: string, lat: number, lng: number) => {
    setMarkers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, lat, lng, updatedAt: new Date().toISOString() } : m))
    );
    showSuccess('Marker position updated.');
  }, []);

  // Arm/disarm a resource for tap-to-place (mobile fallback for drag/drop)
  const handleArmResource = useCallback((resourceTypeId: ResourceTypeId) => {
    setArmedResourceId((prev) => (prev === resourceTypeId ? null : resourceTypeId));
    // Placement and area/route drawing are mutually exclusive modes.
    setDrawMode('none');
    setDraftPoints([]);
  }, []);

  // Place the armed resource at a tapped map location. Stays armed
  // afterward so multiple units of the same type can be placed quickly,
  // matching how repeated drag-and-drop placement works on desktop.
  const handlePlaceArmedResource = useCallback(
    (lat: number, lng: number) => {
      if (!armedResourceId) return;
      handleAddMarker(armedResourceId, lat, lng);
    },
    [armedResourceId]
  );

  // Handle Map Drawing Clicks
  const handleMapClickDuringDraw = useCallback((lat: number, lng: number) => {
    if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) return;

    setDraftPoints((prev) => {
      // Reject a click that lands on (effectively) the same spot as the
      // last point. Duplicate/near-duplicate consecutive points create
      // zero-length polygon/polyline segments, which is a documented
      // source of Leaflet renderer errors during subsequent pan/zoom —
      // errors that happen inside Leaflet's own event loop, outside React,
      // and can leave the map visually broken until a full page reload.
      const last = prev[prev.length - 1];
      if (last && Math.hypot(last[0] - lat, last[1] - lng) < 1e-6) {
        return prev;
      }
      return [...prev, [lat, lng]];
    });
  }, []);

  // Finish Area Drawing
  const handleFinishDrawArea = () => {
    const validPoints = draftPoints.filter(
      (p) => Array.isArray(p) && p.length === 2 && !isNaN(p[0]) && !isNaN(p[1])
    );

    if (validPoints.length < 3) {
      showError('An area division requires at least 3 valid points on the map.');
      return;
    }

    const newArea: OperationalArea = {
      id: `area-${Date.now()}`,
      name: `Division ${String.fromCharCode(65 + areas.length)}`,
      color: '#3b82f6',
      opacity: 0.3,
      points: validPoints,
      notes: 'Operational Area Division',
      updatedAt: new Date().toISOString(),
    };

    setSelectedArea(newArea);
    setIsAreaModalOpen(true);
    setDrawMode('none');
    setDraftPoints([]);
  };

  // Finish Route Drawing
  const handleFinishDrawRoute = () => {
    const validPoints = draftPoints.filter(
      (p) => Array.isArray(p) && p.length === 2 && !isNaN(p[0]) && !isNaN(p[1])
    );

    if (validPoints.length < 2) {
      showError('A route requires at least 2 valid points on the map.');
      return;
    }

    const newRoute: TacticalRoute = {
      id: `route-${Date.now()}`,
      name: `Route ${routes.length + 1}`,
      type: 'evacuation',
      color: '#10b981',
      isDashed: false,
      points: validPoints,
      notes: 'Primary Traffic Flow Corridor',
      updatedAt: new Date().toISOString(),
    };

    setSelectedRoute(newRoute);
    setIsRouteModalOpen(true);
    setDrawMode('none');
    setDraftPoints([]);
  };

  // Save Area
  const handleSaveArea = (updatedArea: OperationalArea) => {
    setAreas((prev) => {
      const exists = prev.some((a) => a.id === updatedArea.id);
      if (exists) {
        return prev.map((a) => (a.id === updatedArea.id ? updatedArea : a));
      }
      return [...prev, updatedArea];
    });
    showSuccess(`Saved area "${updatedArea.name}"`);
  };

  // Delete Area
  const handleDeleteArea = (id: string) => {
    setAreas((prev) => prev.filter((a) => a.id !== id));
    showSuccess('Area division removed.');
  };

  // Save Route
  const handleSaveRoute = (updatedRoute: TacticalRoute) => {
    setRoutes((prev) => {
      const exists = prev.some((r) => r.id === updatedRoute.id);
      if (exists) {
        return prev.map((r) => (r.id === updatedRoute.id ? updatedRoute : r));
      }
      return [...prev, updatedRoute];
    });
    showSuccess(`Saved route "${updatedRoute.name}"`);
  };

  // Delete Route
  const handleDeleteRoute = (id: string) => {
    setRoutes((prev) => prev.filter((r) => r.id !== id));
    showSuccess('Tactical route removed.');
  };

  // Save Plan
  const handleSavePlan = () => {
    const plan: PrepositionPlan = {
      id: `plan-${Date.now()}`,
      title: planTitle,
      description: 'Incident Resource & Prepositioning Operational Plan',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      markers,
      areas,
      routes,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
      showSuccess(`Plan "${planTitle}" saved with ${markers.length} markers, ${areas.length} areas, and ${routes.length} routes!`);
    } catch (e) {
      showError('Failed to save plan to storage.');
    }
  };

  // Reset Plan to BLANK
  const handleResetPlan = () => {
    if (window.confirm('Reset map? This will clear all placed markers, area divisions, and routes.')) {
      setMarkers([]);
      setAreas([]);
      setRoutes([]);
      setDraftPoints([]);
      setDrawMode('none');
      localStorage.removeItem(STORAGE_KEY);
      showSuccess('Prepositioning map cleared. Starting blank.');
    }
  };

  // Import JSON — restores a previously exported plan. Basic runtime
  // validation is applied since imported data bypasses TypeScript entirely
  // (a malformed file must never be able to crash the map render).
  const handleImportJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error('Could not read file contents.');
        const parsed = JSON.parse(text);

        if (typeof parsed !== 'object' || parsed === null) {
          throw new Error('File does not contain a valid plan object.');
        }

        const importedMarkers: PrepositionedMarker[] = Array.isArray(parsed.markers)
          ? parsed.markers.filter(
              (m: unknown): m is PrepositionedMarker =>
                !!m &&
                typeof m === 'object' &&
                typeof (m as PrepositionedMarker).lat === 'number' &&
                typeof (m as PrepositionedMarker).lng === 'number' &&
                !isNaN((m as PrepositionedMarker).lat) &&
                !isNaN((m as PrepositionedMarker).lng) &&
                typeof (m as PrepositionedMarker).resourceTypeId === 'string'
            )
          : [];

        const importedAreas: OperationalArea[] = Array.isArray(parsed.areas)
          ? parsed.areas.filter(
              (a: unknown): a is OperationalArea =>
                !!a && typeof a === 'object' && Array.isArray((a as OperationalArea).points) && (a as OperationalArea).points.length >= 3
            )
          : [];

        const importedRoutes: TacticalRoute[] = Array.isArray(parsed.routes)
          ? parsed.routes.filter(
              (r: unknown): r is TacticalRoute =>
                !!r && typeof r === 'object' && Array.isArray((r as TacticalRoute).points) && (r as TacticalRoute).points.length >= 2
            )
          : [];

        if (importedMarkers.length === 0 && importedAreas.length === 0 && importedRoutes.length === 0) {
          showError('No valid markers, areas, or routes found in that file.');
          return;
        }

        setPlanTitle(typeof parsed.title === 'string' && parsed.title.trim() ? parsed.title : 'Imported Plan');
        setMarkers(importedMarkers);
        setAreas(importedAreas);
        setRoutes(importedRoutes);

        showSuccess(
          `Imported ${importedMarkers.length} markers, ${importedAreas.length} areas, and ${importedRoutes.length} routes.`
        );
      } catch (err) {
        console.error('Failed to import plan:', err);
        showError('Could not import that file — it does not look like a valid plan export.');
      }
    };
    reader.onerror = () => showError('Failed to read the selected file.');
    reader.readAsText(file);
  };

  // Export JSON
  const handleExportJSON = () => {
    const plan: PrepositionPlan = {
      id: `plan-${Date.now()}`,
      title: planTitle,
      description: 'Incident Resource & Prepositioning Operational Plan',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      markers,
      areas,
      routes,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(plan, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${planTitle.replace(/\s+/g, '_')}_plan.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showSuccess('Preposition Plan exported to JSON.');
  };

  const handleSelectAreaFromList = (area: OperationalArea) => {
    setSelectedArea(area);
    setIsAreaModalOpen(true);
    if (area.points && area.points.length > 0) {
      const firstPt = area.points[0];
      setSelectedMunicipalityCoord([firstPt[0], firstPt[1]]);
    }
  };

  const handleSelectRouteFromList = (route: TacticalRoute) => {
    setSelectedRoute(route);
    setIsRouteModalOpen(true);
    if (route.points && route.points.length > 0) {
      const firstPt = route.points[0];
      setSelectedMunicipalityCoord([firstPt[0], firstPt[1]]);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 font-sans">
      {/* Top Navbar Header */}
      <Navbar
        planTitle={planTitle}
        setPlanTitle={setPlanTitle}
        totalMarkers={totalMarkers}
        totalPersonnel={totalPersonnel}
        totalVehicles={totalVehicles}
        totalFacilities={totalFacilities}
        totalAreas={areas.length}
        totalRoutes={routes.length}
        onSavePlan={handleSavePlan}
        onResetPlan={handleResetPlan}
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
        showHazards={showHazards}
        setShowHazards={setShowHazards}
        onToggleSummary={() => setIsSummaryOpen(true)}
        iconSize={iconSize}
        setIconSize={setIconSize}
        drawMode={drawMode}
        onStartDrawArea={() => {
          setDrawMode((prev) => (prev === 'area' ? 'none' : 'area'));
          setDraftPoints([]);
          setArmedResourceId(null);
        }}
        onStartDrawRoute={() => {
          setDrawMode((prev) => (prev === 'route' ? 'none' : 'route'));
          setDraftPoints([]);
          setArmedResourceId(null);
        }}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 relative">
        <Sidebar
          onMunicipalitySelect={(lat, lng) => setSelectedMunicipalityCoord([lat, lng])}
          areas={areas}
          routes={routes}
          onSelectArea={handleSelectAreaFromList}
          onSelectRoute={handleSelectRouteFromList}
          onDeleteArea={handleDeleteArea}
          onDeleteRoute={handleDeleteRoute}
          armedResourceId={armedResourceId}
          onArmResource={handleArmResource}
        />

        <main className="flex-1 h-full min-h-0 relative">
          {/* Floating Drawing Control Overlay */}
          {drawMode !== 'none' && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-slate-900/95 border border-slate-700 text-white px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-md flex items-center space-x-3 print:hidden">
              <div className="text-xs">
                <span className="font-bold text-amber-400 block uppercase">
                  {drawMode === 'area' ? 'Drawing Area Division' : 'Drawing Tactical Route'}
                </span>
                <span className="text-[11px] text-slate-300">
                  Click on map to place points ({draftPoints.length} points placed)
                </span>
              </div>

              <div className="flex items-center space-x-1.5 border-l border-slate-800 pl-3">
                <Button
                  size="sm"
                  onClick={drawMode === 'area' ? handleFinishDrawArea : handleFinishDrawRoute}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white h-7 text-xs font-bold gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Finish
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDraftPoints([])}
                  className="bg-slate-800 border-slate-700 text-slate-300 h-7 text-xs gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Clear Points
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setDrawMode('none');
                    setDraftPoints([]);
                  }}
                  className="text-slate-400 hover:text-white h-7 text-xs p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Floating Tap-to-Place Overlay (mobile fallback for drag & drop) */}
          {armedResourceId && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-slate-900/95 border border-slate-700 text-white px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-md flex items-center space-x-3 print:hidden">
              <div className="text-xs">
                <span className="font-bold text-emerald-400 block uppercase">
                  {RESOURCE_CATALOG.find((r) => r.id === armedResourceId)?.name || 'Resource'} Armed
                </span>
                <span className="text-[11px] text-slate-300">Tap the map to place. Tap again to place another.</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setArmedResourceId(null)}
                className="text-slate-400 hover:text-white h-7 text-xs p-1 border-l border-slate-800 pl-3"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center bg-slate-950 text-slate-400 text-sm">
                Loading map…
              </div>
            }
          >
            <MapContainer
              markers={markers}
              areas={areas}
              routes={routes}
              onAddMarker={handleAddMarker}
              armedResourceId={armedResourceId}
              onPlaceArmedResource={handlePlaceArmedResource}
              onMarkerSelect={(m) => {
                setSelectedMarker(m);
                setIsMarkerModalOpen(true);
              }}
              onMarkerDragEnd={handleMarkerDragEnd}
              onAreaSelect={(a) => {
                setSelectedArea(a);
                setIsAreaModalOpen(true);
              }}
              onRouteSelect={(r) => {
                setSelectedRoute(r);
                setIsRouteModalOpen(true);
              }}
              showHazards={showHazards}
              selectedMunicipalityCoord={selectedMunicipalityCoord}
              baseIconSize={iconSize}
              drawMode={drawMode}
              draftPoints={draftPoints}
              onMapClickDuringDraw={handleMapClickDuringDraw}
              modalsOpen={isMarkerModalOpen || isAreaModalOpen || isRouteModalOpen || isSummaryOpen}
            />
          </Suspense>
        </main>
      </div>

      {/* Marker Edit Modal */}
      <MarkerEditModal
        marker={selectedMarker}
        isOpen={isMarkerModalOpen}
        onClose={() => setIsMarkerModalOpen(false)}
        onSave={(updated) => {
          setMarkers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
          showSuccess(`Updated ${updated.title}`);
        }}
        onDelete={(id) => {
          setMarkers((prev) => prev.filter((m) => m.id !== id));
          showSuccess('Marker removed.');
        }}
      />

      {/* Operational Area Edit Modal */}
      <AreaEditModal
        area={selectedArea}
        isOpen={isAreaModalOpen}
        onClose={() => setIsAreaModalOpen(false)}
        onSave={handleSaveArea}
        onDelete={handleDeleteArea}
      />

      {/* Tactical Route Edit Modal */}
      <RouteEditModal
        route={selectedRoute}
        isOpen={isRouteModalOpen}
        onClose={() => setIsRouteModalOpen(false)}
        onSave={handleSaveRoute}
        onDelete={handleDeleteRoute}
      />

      {/* Summary Inventory Drawer */}
      <PlanSummaryDrawer
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        markers={markers}
        onSelectMarker={(m) => {
          setSelectedMarker(m);
          setIsMarkerModalOpen(true);
        }}
      />
    </div>
  );
};

export default Index;