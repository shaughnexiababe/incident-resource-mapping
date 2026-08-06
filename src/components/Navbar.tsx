import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Save, RotateCcw, Download, Layers, MapPin, Truck, AlertTriangle, ZoomIn, Navigation, Spline } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NavbarProps {
  planTitle: string;
  setPlanTitle: (title: string) => void;
  totalMarkers: number;
  totalPersonnel: number;
  totalVehicles: number;
  totalFacilities: number;
  totalAreas: number;
  totalRoutes: number;
  onSavePlan: () => void;
  onResetPlan: () => void;
  onExportJSON: () => void;
  showHazards: boolean;
  setShowHazards: (val: boolean) => void;
  onToggleSummary: () => void;
  iconSize: number;
  setIconSize: (size: number) => void;
  drawMode: 'none' | 'area' | 'route';
  onStartDrawArea: () => void;
  onStartDrawRoute: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  planTitle,
  setPlanTitle,
  totalMarkers,
  totalPersonnel,
  totalVehicles,
  totalFacilities,
  totalAreas,
  totalRoutes,
  onSavePlan,
  onResetPlan,
  onExportJSON,
  showHazards,
  setShowHazards,
  onToggleSummary,
  iconSize,
  setIconSize,
  drawMode,
  onStartDrawArea,
  onStartDrawRoute,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md z-20">
      {/* App Brand & Plan Title */}
      <div className="flex items-center space-x-3">
        <div className="bg-red-600 p-2 rounded-lg flex items-center justify-center shadow-lg shadow-red-600/30">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-extrabold text-lg tracking-wide text-slate-100 flex items-center">
              Incident Resource & Prepositioning Planner
            </h1>
            <Badge variant="outline" className="text-red-400 border-red-500/50 bg-red-950/40 text-[11px] font-mono">
              ICS Ready
            </Badge>
          </div>
          <div className="flex items-center space-x-2 mt-0.5">
            <Input
              value={planTitle}
              onChange={(e) => setPlanTitle(e.target.value)}
              className="h-7 w-72 bg-slate-800/80 border-slate-700 text-xs text-white focus-visible:ring-red-500 font-medium"
              placeholder="Enter Plan Name..."
            />
          </div>
        </div>
      </div>

      {/* Deploy Metrics Badges */}
      <div className="hidden lg:flex items-center space-x-3 bg-slate-800/60 p-1.5 rounded-lg border border-slate-700/60">
        <button 
          onClick={onToggleSummary}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-700/50 hover:bg-slate-700 text-xs transition-colors"
          title="Click to view full resource breakdown"
        >
          <MapPin className="w-3.5 h-3.5 text-red-400" />
          <span className="text-slate-300">Placed:</span>
          <span className="font-bold text-white">{totalMarkers}</span>
        </button>

        <div className="flex items-center space-x-1 text-xs px-2 py-1 text-slate-300">
          <Truck className="w-3.5 h-3.5 text-amber-400" />
          <span>Vehicles:</span>
          <span className="font-bold text-amber-300">{totalVehicles}</span>
        </div>

        <div className="flex items-center space-x-1 text-xs px-2 py-1 text-slate-300">
          <Shield className="w-3.5 h-3.5 text-blue-400" />
          <span>Personnel:</span>
          <span className="font-bold text-blue-300">{totalPersonnel}</span>
        </div>

        <div className="flex items-center space-x-1 text-xs px-2 py-1 text-slate-300">
          <Layers className="w-3.5 h-3.5 text-purple-400" />
          <span>Divisions:</span>
          <span className="font-bold text-purple-300">{totalAreas}</span>
        </div>

        <div className="flex items-center space-x-1 text-xs px-2 py-1 text-slate-300">
          <Navigation className="w-3.5 h-3.5 text-emerald-400" />
          <span>Routes:</span>
          <span className="font-bold text-emerald-300">{totalRoutes}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        {/* Draw Area Division Button */}
        <Button
          variant={drawMode === 'area' ? 'default' : 'outline'}
          size="sm"
          onClick={onStartDrawArea}
          className={`h-8 text-xs font-semibold gap-1.5 ${
            drawMode === 'area'
              ? 'bg-blue-600 text-white border-blue-500'
              : 'border-slate-700 text-slate-300 bg-slate-800 hover:text-white'
          }`}
          title="Highlight operational area division sector"
        >
          <Spline className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden xl:inline">+ Area Division</span>
        </Button>

        {/* Draw Route Button */}
        <Button
          variant={drawMode === 'route' ? 'default' : 'outline'}
          size="sm"
          onClick={onStartDrawRoute}
          className={`h-8 text-xs font-semibold gap-1.5 ${
            drawMode === 'route'
              ? 'bg-emerald-600 text-white border-emerald-500'
              : 'border-slate-700 text-slate-300 bg-slate-800 hover:text-white'
          }`}
          title="Draw evacuation or traffic rerouting lines"
        >
          <Navigation className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden xl:inline">+ Traffic Route</span>
        </Button>

        {/* Icon Size Selector */}
        <div className="flex items-center space-x-1.5 bg-slate-800/90 px-2 py-1 rounded border border-slate-700 text-xs">
          <ZoomIn className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-300 hidden sm:inline text-[11px]">Icon Size:</span>
          <Select value={iconSize.toString()} onValueChange={(val) => setIconSize(parseInt(val))}>
            <SelectTrigger className="h-6 w-20 text-[11px] bg-slate-900 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-white text-xs">
              <SelectItem value="30">Small (30px)</SelectItem>
              <SelectItem value="40">Medium (40px)</SelectItem>
              <SelectItem value="52">Large (52px)</SelectItem>
              <SelectItem value="64">X-Large (64px)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant={showHazards ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowHazards(!showHazards)}
          className={`h-8 text-xs font-medium gap-1.5 ${
            showHazards 
              ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-600' 
              : 'border-slate-700 text-slate-300 hover:text-white bg-slate-800'
          }`}
          title="Toggle Hazard Overlay Polygons"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{showHazards ? 'Hide Hazards' : 'Show Hazards'}</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onExportJSON}
          className="h-8 text-xs font-medium gap-1.5 border-slate-700 text-slate-300 hover:text-white bg-slate-800"
          title="Download plan configuration as JSON"
        >
          <Download className="w-3.5 h-3.5 text-slate-300" />
          <span className="hidden sm:inline">Export</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onResetPlan}
          className="h-8 text-xs font-medium gap-1.5 border-slate-700 text-slate-300 hover:bg-red-900/40 hover:text-red-300 bg-slate-800"
          title="Clear all prepositioned markers to start blank"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Map</span>
        </Button>

        <Button
          onClick={onSavePlan}
          size="sm"
          className="h-8 text-xs font-bold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Plan</span>
        </Button>
      </div>
    </header>
  );
};