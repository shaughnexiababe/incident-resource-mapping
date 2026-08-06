import React, { useState } from 'react';
import { RESOURCE_CATALOG, MUNICIPALITIES } from '@/data/camarinesNorteData';
import { ResourceCategory, ResourceDefinition } from '@/types/disaster';
import { 
  Ambulance, 
  Flame, 
  Truck, 
  ShieldAlert, 
  Cross, 
  UserCheck, 
  Users, 
  UserCog, 
  MapPin, 
  Info,
  GripVertical,
  Navigation
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Mapping Lucide icons dynamically
const LucideIconMap: Record<string, React.ElementType> = {
  Ambulance,
  Flame,
  Truck,
  ShieldAlert,
  Cross,
  UserCheck,
  Users,
  UserCog,
  MapPin,
};

interface SidebarProps {
  onMunicipalitySelect: (lat: number, lng: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onMunicipalitySelect }) => {
  const [activeTab, setActiveTab] = useState<string>('vehicles');

  const getResources = (category: ResourceCategory) => {
    return RESOURCE_CATALOG.filter((r) => r.category === category);
  };

  const handleDragStart = (e: React.DragEvent, resourceId: string) => {
    e.dataTransfer.setData('text/plain', resourceId);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const renderIconBadge = (item: ResourceDefinition) => {
    // Authentic ICS Symbols rendering
    if (item.id === 'icp') {
      return (
        <div className="w-9 h-9 rounded-full border-2 border-slate-900 bg-white flex flex-col items-center justify-center relative overflow-hidden shrink-0 shadow-sm">
          <div className="w-full h-1/2 bg-blue-600"></div>
          <div className="w-full h-1/2 bg-white"></div>
          <span className="absolute text-[10px] font-black text-slate-900 tracking-tight">ICP</span>
        </div>
      );
    }
    if (item.id === 'staging_area') {
      return (
        <div className="w-9 h-9 rounded-full border-2 border-slate-900 bg-yellow-400 text-slate-950 flex items-center justify-center font-black text-base shrink-0 shadow-sm">
          S
        </div>
      );
    }
    if (item.id === 'camp') {
      return (
        <div className="w-9 h-9 rounded-full border-2 border-slate-900 bg-emerald-600 text-white flex items-center justify-center font-black text-base shrink-0 shadow-sm">
          C
        </div>
      );
    }
    if (item.id === 'base') {
      return (
        <div className="w-9 h-9 rounded-full border-2 border-slate-900 bg-sky-700 text-white flex items-center justify-center font-black text-base shrink-0 shadow-sm">
          B
        </div>
      );
    }

    const IconComponent = LucideIconMap[item.iconName] || MapPin;
    return (
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm"
        style={{ backgroundColor: item.color }}
      >
        <IconComponent className="w-5 h-5" />
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
          <strong>Drag any icon</strong> below directly onto the Camarines Norte map to preposition assets and command facilities.
        </span>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <div className="p-2 bg-slate-900 border-b border-slate-800">
          <TabsList className="w-full bg-slate-800/90 p-1 text-slate-400 grid grid-cols-4 h-9">
            <TabsTrigger value="vehicles" className="text-[11px] py-1 data-[state=active]:bg-red-600 data-[state=active]:text-white font-semibold">
              Vehicles
            </TabsTrigger>
            <TabsTrigger value="personnel" className="text-[11px] py-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white font-semibold">
              Personnel
            </TabsTrigger>
            <TabsTrigger value="facilities" className="text-[11px] py-1 data-[state=active]:bg-purple-600 data-[state=active]:text-white font-semibold">
              ICS Standard
            </TabsTrigger>
            <TabsTrigger value="locations" className="text-[11px] py-1 data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-semibold">
              Towns
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content 1: Vehicles */}
        <TabsContent value="vehicles" className="flex-1 overflow-y-auto p-3 space-y-2 mt-0">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Emergency Vehicles
          </div>
          {getResources('vehicle').map(renderDraggableCard)}
        </TabsContent>

        {/* Tab Content 2: Personnel */}
        <TabsContent value="personnel" className="flex-1 overflow-y-auto p-3 space-y-2 mt-0">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Response Personnel & Teams
          </div>
          {getResources('personnel').map(renderDraggableCard)}
        </TabsContent>

        {/* Tab Content 3: ICS Facilities */}
        <TabsContent value="facilities" className="flex-1 overflow-y-auto p-3 space-y-2 mt-0">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Incident Command System (ICS)</span>
            <span className="text-[9px] bg-blue-900/60 text-blue-300 px-1.5 py-0.5 rounded border border-blue-700">FEMA Standard</span>
          </div>
          {getResources('facility').map(renderDraggableCard)}
        </TabsContent>

        {/* Tab Content 4: Quick Town Locator */}
        <TabsContent value="locations" className="flex-1 overflow-y-auto p-3 space-y-2 mt-0">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Camarines Norte Towns</span>
            <span className="text-[10px] text-slate-500">12 Municipalities</span>
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
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400 text-black font-bold text-[8px] flex items-center justify-center">S</span> Staging Area</div>
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600 text-white font-bold text-[8px] flex items-center justify-center">C</span> Camp</div>
          <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-sky-700 text-white font-bold text-[8px] flex items-center justify-center">B</span> Base</div>
        </div>
      </div>
    </aside>
  );
};