import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { MapContainer } from '@/components/MapContainer';
import { MarkerEditModal } from '@/components/MarkerEditModal';
import { PlanSummaryDrawer } from '@/components/PlanSummaryDrawer';
import { PrepositionedMarker, ResourceTypeId, PrepositionPlan } from '@/types/disaster';
import { INITIAL_MARKERS, RESOURCE_CATALOG, MUNICIPALITIES } from '@/data/camarinesNorteData';
import { showSuccess, showError } from '@/utils/toast';

const STORAGE_KEY = 'camarines_norte_preposition_plan_v1';

const Index = () => {
  const [planTitle, setPlanTitle] = useState<string>('Typhoon Preparedness Plan - Camarines Norte');
  const [markers, setMarkers] = useState<PrepositionedMarker[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<PrepositionedMarker | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState<boolean>(false);
  const [showHazards, setShowHazards] = useState<boolean>(true);
  const [selectedMunicipalityCoord, setSelectedMunicipalityCoord] = useState<[number, number] | null>(null);

  // Load initial plan from localStorage or defaults
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed: PrepositionPlan = JSON.parse(savedData);
        if (parsed.title) setPlanTitle(parsed.title);
        if (parsed.markers && parsed.markers.length > 0) {
          setMarkers(parsed.markers);
          return;
        }
      }
    } catch (e) {
      console.error('Failed to parse saved plan:', e);
    }
    // Fallback default markers
    setMarkers(INITIAL_MARKERS);
  }, []);

  // Calculate deployment stats
  const totalMarkers = markers.reduce((acc, m) => acc + (m.quantity || 1), 0);

  const totalPersonnel = markers
    .filter((m) => {
      const cat = RESOURCE_CATALOG.find((r) => r.id === m.resourceTypeId)?.category;
      return cat === 'personnel';
    })
    .reduce((acc, m) => acc + (m.quantity || 1), 0);

  const totalVehicles = markers
    .filter((m) => {
      const cat = RESOURCE_CATALOG.find((r) => r.id === m.resourceTypeId)?.category;
      return cat === 'vehicle';
    })
    .reduce((acc, m) => acc + (m.quantity || 1), 0);

  const totalFacilities = markers.filter((m) => {
    const cat = RESOURCE_CATALOG.find((r) => r.id === m.resourceTypeId)?.category;
    return cat === 'facility';
  }).length;

  // Add new marker dropped on map
  const handleAddMarker = (resourceTypeId: ResourceTypeId, lat: number, lng: number) => {
    const resourceDef = RESOURCE_CATALOG.find((r) => r.id === resourceTypeId) || RESOURCE_CATALOG[0];

    // Auto-detect closest municipality
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
    setIsModalOpen(true);
    showSuccess(`Added ${resourceDef.name} at coordinates [${lat.toFixed(3)}, ${lng.toFixed(3)}]`);
  };

  // Update position after dragging marker on map
  const handleMarkerDragEnd = useCallback((id: string, lat: number, lng: number) => {
    setMarkers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          return { ...m, lat, lng, updatedAt: new Date().toISOString() };
        }
        return m;
      })
    );
    showSuccess('Marker position updated.');
  }, []);

  // Save changes from Marker Edit Modal
  const handleSaveMarkerChanges = (updatedMarker: PrepositionedMarker) => {
    setMarkers((prev) =>
      prev.map((m) => (m.id === updatedMarker.id ? updatedMarker : m))
    );
    showSuccess(`Updated note for ${updatedMarker.title}`);
  };

  // Delete marker
  const handleDeleteMarker = (markerId: string) => {
    setMarkers((prev) => prev.filter((m) => m.id !== markerId));
    showSuccess('Marker removed from plan.');
  };

  // Save full preposition plan to localStorage + simulate backend save
  const handleSavePlan = () => {
    const plan: PrepositionPlan = {
      id: `plan-${Date.now()}`,
      title: planTitle,
      description: 'Camarines Norte Disaster Response Preposition Plan',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      markers,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
      showSuccess(`Plan "${planTitle}" saved successfully with ${markers.length} asset entries!`);
    } catch (e) {
      showError('Failed to save plan to storage.');
    }
  };

  // Reset Plan to default
  const handleResetPlan = () => {
    if (window.confirm('Reset plan markers to initial setup for Camarines Norte?')) {
      setMarkers(INITIAL_MARKERS);
      setPlanTitle('Typhoon Preparedness Plan - Camarines Norte');
      localStorage.removeItem(STORAGE_KEY);
      showSuccess('Prepositioning plan reset to defaults.');
    }
  };

  // Export Plan to JSON file
  const handleExportJSON = () => {
    const plan: PrepositionPlan = {
      id: `plan-${Date.now()}`,
      title: planTitle,
      description: 'Camarines Norte Disaster Response Preposition Plan',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      markers,
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

  const handleMunicipalitySelect = (lat: number, lng: number) => {
    setSelectedMunicipalityCoord([lat, lng]);
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
        onSavePlan={handleSavePlan}
        onResetPlan={handleResetPlan}
        onExportJSON={handleExportJSON}
        showHazards={showHazards}
        setShowHazards={setShowHazards}
        onToggleSummary={() => setIsSummaryOpen(true)}
      />

      {/* Main Workspace Layout: Sidebar + Leaflet Map */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 relative">
        <Sidebar onMunicipalitySelect={handleMunicipalitySelect} />

        <main className="flex-1 h-full relative">
          <MapContainer
            markers={markers}
            onAddMarker={handleAddMarker}
            onMarkerSelect={(m) => {
              setSelectedMarker(m);
              setIsModalOpen(true);
            }}
            onMarkerDragEnd={handleMarkerDragEnd}
            showHazards={showHazards}
            selectedMunicipalityCoord={selectedMunicipalityCoord}
          />
        </main>
      </div>

      {/* Marker Edit Modal */}
      <MarkerEditModal
        marker={selectedMarker}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMarkerChanges}
        onDelete={handleDeleteMarker}
      />

      {/* Full Inventory Breakdown Drawer */}
      <PlanSummaryDrawer
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        markers={markers}
        onSelectMarker={(m) => {
          setSelectedMarker(m);
          setIsModalOpen(true);
        }}
      />
    </div>
  );
};

export default Index;