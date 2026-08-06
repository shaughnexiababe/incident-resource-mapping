import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { MapContainer } from '@/components/MapContainer';
import { MarkerEditModal } from '@/components/MarkerEditModal';
import { AreaEditModal } from '@/components/AreaEditModal';
import { RouteEditModal } from '@/components/RouteEditModal';
import { PlanSummaryDrawer } from '@/components/PlanSummaryDrawer';
import { PrepositionedMarker, ResourceTypeId, PrepositionPlan, OperationalArea, TacticalRoute } from '@/types/disaster';
import { RESOURCE_CATALOG, MUNICIPALITIES } from '@/data/camarinesNorteData';
import { showSuccess, showError } from '@/utils/toast';
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
      const dist = Math.hypot(mun.lat - lat, mun.lng - lng);
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

  // Handle Map Drawing Clicks
  const handleMapClickDuringDraw = (lat: number, lng: number) => {
    setDraftPoints((prev) => [...prev, [lat, lng]]);
  };

  // Finish Area Drawing
  const handleFinishDrawArea = () => {
    if (draftPoints.length < 3) {
      showError('An area division requires at least 3 points on the map.');
      return;
    }

    const newArea: OperationalArea = {
      id: `area-${Date.now()}`,
      name: `Division ${String.fromCharCode(65 + areas.length)}`,
      color: '#3b82f6',
      opacity: 0.3,
      points: draftPoints,
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
    if (draftPoints.length < 2) {
      showError('A route requires at least 2 points on the map.');
      return;
    }

    const newRoute: TacticalRoute = {
      id: `route-${Date.now()}`,
      name: `Route ${routes.length + 1}`,
      type: 'evacuation',
      color: '#10b981',
      isDashed: false,
      points: draftPoints,
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
        showHazards={showHazards}
        setShowHazards={setShowHazards}
        onToggleSummary={() => setIsSummaryOpen(true)}
        iconSize={iconSize}
        setIconSize={setIconSize}
        drawMode={drawMode}
        onStartDrawArea={() => {
          setDrawMode((prev) => (prev === 'area' ? 'none' : 'area'));
          setDraftPoints([]);
        }}
        onStartDrawRoute={() => {
          setDrawMode((prev) => (prev === 'route' ? 'none' : 'route'));
          setDraftPoints([]);
        }}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 relative">
        <Sidebar
          onMunicipalitySelect={(lat, lng) => setSelectedMunicipalityCoord([lat, lng])}
          areas={areas}
          routes={routes}
          onSelectArea={(a) => {
            setSelectedArea(a);
            setIsAreaModalOpen(true);
          }}
          onSelectRoute={(r) => {
            setSelectedRoute(r);
            setIsRouteModalOpen(true);
          }}
          onDeleteArea={handleDeleteArea}
          onDeleteRoute={handleDeleteRoute}
        />

        <main className="flex-1 h-full relative">
          {/* Floating Drawing Control Overlay */}
          {drawMode !== 'none' && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-slate-900/95 border border-slate-700 text-white px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-md flex items-center space-x-3">
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

          <MapContainer
            markers={markers}
            areas={areas}
            routes={routes}
            onAddMarker={handleAddMarker}
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
          />
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