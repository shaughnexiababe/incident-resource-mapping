import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Save, RotateCcw, Download, Layers, MapPin, Truck, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NavbarProps {
  planTitle: string;
  setPlanTitle: (title: string) => void;
  totalMarkers: number;
  totalPersonnel: number;
  totalVehicles: number;
  totalFacilities: number;
  onSavePlan: () => void;
  onResetPlan: () => void;
  onExportJSON: () => void;
  showHazards: boolean;
  setShowHazards: (val: boolean) => void;
  onToggleSummary: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  planTitle,
  setPlanTitle,
  totalMarkers,
  totalPersonnel,
  totalVehicles,
  totalFacilities,
  onSavePlan,
  onResetPlan,
  onExportJSON,
  showHazards,
  setShowHazards,
  onToggleSummary,
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
              Camarines Norte Disaster Prepositioning
            </h1>
            <Badge variant="outline" className="text-red-400 border-red-500/50 bg-red-950/40 text-[11px] font-mono">
              ICS Ready
            </Badge>
          </div>
          <div className="flex items-center space-x-2 mt-0.5">
            <Input
              value={planTitle}
              onChange={(e) => setPlanTitle(e.target.value)}
              className="h-7 w-64 bg-slate-800/80 border-slate-700 text-xs text-white focus-visible:ring-red-500 font-medium"
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
          <span className="text-slate-300">Total Placed:</span>
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
          <span>Facilities:</span>
          <span className="font-bold text-purple-300">{totalFacilities}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        <Button
          variant={showHazards ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowHazards(!showHazards)}
          className={`h-8 text-xs font-medium gap-1.5 ${
            showHazards 
              ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-600' 
              : 'border-slate-700 text-slate-300 hover:text-white bg-slate-800'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{showHazards ? 'Hide Hazard Overlay' : 'Show Hazard Overlay'}</span>
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
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
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