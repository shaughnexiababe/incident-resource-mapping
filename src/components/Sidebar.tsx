import React, { useState } from 'react';
import { RESOURCE_CATALOG, MUNICIPALITIES } from '@/data/camarinesNorteData';
import { ResourceCategory, ResourceDefinition, OperationalArea, TacticalRoute } from '@/types/disaster';
import { ENHANCED_ICON_SVGS } from '@/utils/leafletIcons';
import { 
  Info,
  GripVertical,
  Navigation,
  Trash2,
  Edit2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface SidebarProps {
  onMunicipalitySelect: (lat: number, lng: number) => void;
  areas?: OperationalArea[];
  routes?: TacticalRoute[];
  onSelectArea?: (area: OperationalArea) => void;
  onSelectRoute?: (route: TacticalRoute) => void;
  onDeleteArea?: (id: string) => void;
  onDeleteRoute?: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  onMunicipalitySelect,
  areas = [],
  routes = [],
  onSelectArea,
  onSelectRoute,
  onDeleteArea,
  onDeleteRoute,
}) => {
  const [activeTab, setActiveTab] = useState<string>('vehicles');

  const getResources = (category: ResourceCategory) => {
    return RESOURCE_CATALOG.filter((r) => r.category === category);
  };

  const handleDragStart = (e: React.DragEvent, resourceId: string) => {
    e.dataTransfer.setData('text/plain', resourceId);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const renderIconBadge = (item: ResourceDefinition) => {
    if (item.id === 'icp') {
      return (
        <div className="w-9 h-9 rounded-full border-2 border-slate-900 bg-white flex flex-col items-center justify-center relative overflow-hidden shrink-0 shadow-md">
          <div className="w-full h-1/2 bg-blue-600"></div>
          <div className="w-full h-1/2 bg-white"></div>
          <span className="absolute text-[10px] font-black text-slate-950 tracking-tight">ICP</span>
        </div>
      );
    }
    if (item.id === 'staging_area') {
      return (
        <div className="w-9 h-9 rounded-full border-2 border-slate-900 bg-white text-slate-950 flex items-center justify-center font-black text-base shrink-0 shadow-md">
          S
        </div>
      );
    }
    if (item.id === 'camp') {
      return (
        <div className="w-9 h-9 rounded-full border-2 border-slate-900 bg-white text-slate-950 flex items-center justify-center font-black text-base shrink-0 shadow-md">
          C
        </div>
      );
    }
    if (item.id === 'base') {
      return (
        <div className="w-9 h-9 rounded-full border-2 border-slate-900 bg-white text-slate-950 flex items-center justify-center font-black text-base shrink-0 shadow-md">
          B
        </div>
      );
    }
    if (item.id === 'helibase') {
      return (
        <div className="w-9 h-9 rounded-full border-2 border-slate-900 bg-white text-slate-950 flex items-center justify-center font-black text-base shrink-0 shadow-md relative">
          <div className="absolute -top-1 w-0.5 h-2.5 bg-slate-900"></div>
          <div className="absolute -bottom-0.5 -left-0.5 w-2.5 h-0.5 bg-slate-900 transform -rotate-30"></div>
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-0.5 bg-slate-900 transform rotate-30"></div>
          <span>H</span>
        </div>
      );
    }
    if (item.id === 'helispot') {
      return (
        <div className="w-9 h-9 rounded-full border-2 border-slate-900 bg-white text-slate-950 flex items-center justify-center font-black text-xs shrink-0 shadow-md">
          H1
        </div>
      );
    }
    if (item.id === 'medical_post') {
      return (
        <div className="w-9 h-9 rounded-full border-2 border-slate-900 bg-white text-slate-950 flex items-center justify-center font-black text-sm shrink-0 relative shadow-md">
          <span>M</span>
          <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-red-600"></span>
        </div>
      );
    }
    if (item.id === 'eoc') {
      return (
        <div className="w-9 h-9 rounded-full border-2 border-slate-900 bg-white text-slate-950 flex items-center justify-center font-black text-[9px] shrink-0 shadow-md">
          EOC
        </div>
      );
    }

    const enhancedSvg = ENHANCED_ICON_SVGS[item.id] || '';

    return (
      <div className="w-9 h-9 flex items-center justify-center shrink-0 filter drop-shadow-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          dangerouslySetInnerHTML={{ __html: enhancedSvg }}
        />
      </div>
    );
  };

  const renderDraggableCard = (item: ResourceDefinition) => {
    return (
      <div
        key={item.id}
        draggable
        onDragStart={(e) => handleDragStart(e, item.id)}
        className="group relative flex items-center space-x-3 p-2.5 bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700/80 rounded-lg cursor-grab active:cursor-grabbing transition-all hover:shadow-md hover:border-slate-500 select-none"
      >
        <div className="text-slate-500 group-hover:text-slate-300 transition-colors">
          <GripVertical className="w-4 h-4" />
        </div>

        {renderIconBadge(item)}

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-100 truncate group-hover:text-white">
              {item.name}
            </span>
            {item.agency && (
              <Badge variant="outline" className="text-[10px] py-0 px-1 border-slate-600 text-slate-300">
                {item.agency}
              </Badge>
            )}
          </div>
          <p className="text-[11px] text-slate-400 truncate mt-0.5">
            {item.description}
          </p>
        </div>
      </div>
    );
  };

  return (
    <aside className="w-full md:w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-full z-10">
      {/* Header instruction banner */}
      <div className="p-3 bg-slate-800/50 border-b border-slate-800 text-xs text-slate-300 flex items-start space-x-2">
        <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <span>
          <strong>Drag assets</strong> onto the map, or use top controls to draw <strong>Area Divisions</strong> and <strong>Rerouting Lines</strong>.
        </span>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <div className="p-2 bg-slate-900 border-b border-slate-800">
          <TabsList className="w-full bg-slate-800/90 p-1 text-slate-400 grid grid-cols-5 h-9">
            <TabsTrigger value="vehicles" className="text-[10px] py-1 data-[state=active]:bg-red-600 data-[state=active]:text-white font-semibold">
              Vehicles
            </TabsTrigger>
            <TabsTrigger value="personnel" className="text-[10px] py-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white font-semibold">
              Personnel
            </TabsTrigger>
            <TabsTrigger value="facilities" className="text-[10px] py-1 data-[state=active]:bg-purple-600 data-[state=active]:text-white font-semibold">
              ICS
            </TabsTrigger>
            <TabsTrigger value="layers" className="text-[10px] py-1 data-[state=active]:bg-cyan-600 data-[state=active]:text-white font-semibold">
              Layers ({areas.length + routes.length})
            </TabsTrigger>
            <TabsTrigger value="locations" className="text-[10px] py-1 data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-semibold">
              Towns
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Vehicles & Craft */}
        <TabsContent value="vehicles" className="flex-1 overflow-y-auto p-3 space-y-2 mt-0">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Vehicles, Air & Water Craft
          </div>
          {getResources('vehicle').map(renderDraggableCard)}
        </TabsContent>

        {/* Tab 2: Personnel */}
        <TabsContent value="personnel" className="flex-1 overflow-y-auto p-3 space-y-2 mt-0">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Response Personnel & Teams
          </div>
          {getResources('personnel').map(renderDraggableCard)}
        </TabsContent>

        {/* Tab 3: ICS Facilities */}
        <TabsContent value="facilities" className="flex-1 overflow-y-auto p-3 space-y-2 mt-0">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Incident Command System</span>
            <span className="text-[9px] bg-blue-900/60 text-blue-300 px-1.5 py-0.5 rounded border border-blue-700">FEMA Standard</span>
          </div>
          {getResources('facility').map(renderDraggableCard)}
        </TabsContent>

        {/* Tab 4: Tactical Layers (Areas & Routes) */}
        <TabsContent value="layers" className="flex-1 overflow-y-auto p-3 space-y-3 mt-0">
          {/* Operational Area Divisions */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Operational Area Divisions</span>
              <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-300">{areas.length}</Badge>
            </div>

            {areas.length === 0 ? (
              <p className="text-[11px] text-slate-500 italic p-2 bg-slate-800/40 rounded border border-slate-800">
                No area divisions defined. Click "+ Area Division" in the header to draw on map.
              </p>
            ) : (
              <div className="space-y-1.5">
                {areas.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between p-2 rounded bg-slate-800/80 border border-slate-700 text-xs hover:border-slate-500 transition-colors"
                  >
                    <div 
                      onClick={() => onSelectArea && onSelectArea(a)}
                      className="flex items-center space-x-2 min-w-0 cursor-pointer flex-1"
                    >
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: a.color }} />
                      <span className="font-semibold text-slate-200 truncate">{a.name}</span>
                    </div>
                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={() => onSelectArea && onSelectArea(a)}
                        className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white"
                        title="Edit Area"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {onDeleteArea && (
                        <button
                          onClick={() => onDeleteArea(a.id)}
                          className="p-1 hover:bg-red-900/40 rounded text-slate-400 hover:text-red-300"
                          title="Delete Area"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tactical Routes */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Traffic & Tactical Routes</span>
              <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-300">{routes.length}</Badge>
            </div>

            {routes.length === 0 ? (
              <p className="text-[11px] text-slate-500 italic p-2 bg-slate-800/40 rounded border border-slate-800">
                No routes drawn. Click "+ Traffic Route" in the header to draw on map.
              </p>
            ) : (
              <div className="space-y-1.5">
                {routes.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between p-2 rounded bg-slate-800/80 border border-slate-700 text-xs hover:border-slate-500 transition-colors"
                  >
                    <div 
                      onClick={() => onSelectRoute && onSelectRoute(r)}
                      className="flex items-center space-x-2 min-w-0 cursor-pointer flex-1"
                    >
                      <Navigation className="w-3.5 h-3.5 shrink-0" style={{ color: r.color }} />
                      <div className="min-w-0">
                        <span className="font-semibold text-slate-200 truncate block">{r.name}</span>
                        <span className="text-[10px] text-slate-400 capitalize block">{r.type} Corridor</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={() => onSelectRoute && onSelectRoute(r)}
                        className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white"
                        title="Edit Route"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {onDeleteRoute && (
                        <button
                          onClick={() => onDeleteRoute(r.id)}
                          className="p-1 hover:bg-red-900/40 rounded text-slate-400 hover:text-red-300"
                          title="Delete Route"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Tab 5: Town Locator */}
        <TabsContent value="locations" className="flex-1 overflow-y-auto p-3 space-y-2 mt-0">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Map Municipalities</span>
            <span className="text-[10px] text-slate-500">12 Towns</span>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {MUNICIPALITIES.map((mun) => (
              <button
                key={mun.name}
                onClick={() => onMunicipalitySelect(mun.lat, mun.lng)}
                className="flex items-center justify-between p-2 rounded bg-slate-800/60 hover:bg-slate-700 text-left border border-slate-700/60 text-xs transition-colors group"
              >
                <div className="flex items-center space-x-2">
                  <Navigation className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-slate-200 group-hover:text-white">{mun.name}</span>
                </div>
                <span className="text-[10px] text-slate-400">{mun.population} pop.</span>
              </button>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Legend Footer */}
      <div className="p-3 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
        <div className="font-bold text-slate-300">FEMA / ICS Map Legend:</div>
        <div className="grid grid-cols-2 gap-1 text-[10px]">
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-600 border border-white inline-block"></span> ICP (Split Blue/White)</div>
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-white text-black font-extrabold text-[8px] flex items-center justify-center border border-slate-900">S</span> Staging Area</div>
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-white text-black font-extrabold text-[8px] flex items-center justify-center border border-slate-900">C</span> Camp</div>
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-white text-black font-extrabold text-[8px] flex items-center justify-center border border-slate-900">B</span> Base</div>
        </div>
      </div>
    </aside>
  );
};