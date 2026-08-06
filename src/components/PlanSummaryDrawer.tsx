import React from 'react';
import { PrepositionedMarker } from '@/types/disaster';
import { RESOURCE_CATALOG } from '@/data/camarinesNorteData';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, User, CheckCircle2, Navigation } from 'lucide-react';

interface PlanSummaryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  markers: PrepositionedMarker[];
  onSelectMarker: (marker: PrepositionedMarker) => void;
}

export const PlanSummaryDrawer: React.FC<PlanSummaryDrawerProps> = ({
  isOpen,
  onClose,
  markers,
  onSelectMarker,
}) => {
  // Group markers by municipality
  const groupedByTown: Record<string, PrepositionedMarker[]> = {};

  markers.forEach((m) => {
    const town = m.municipality || 'Unassigned / General';
    if (!groupedByTown[town]) groupedByTown[town] = [];
    groupedByTown[town].push(m);
  });

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-slate-900 border-slate-800 text-slate-100 p-4 overflow-y-auto">
        <SheetHeader className="border-b border-slate-800 pb-3 mb-4">
          <SheetTitle className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Prepositioned Resource Inventory
          </SheetTitle>
          <SheetDescription className="text-xs text-slate-400">
            Overview of deployed units and facilities grouped by Camarines Norte town.
          </SheetDescription>
        </SheetHeader>

        {Object.keys(groupedByTown).length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs">
            No assets prepositioned yet. Drag items from the left sidebar onto the map.
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedByTown).map(([townName, townMarkers]) => (
              <div key={townName} className="space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-emerald-400" /> {townName}
                  </span>
                  <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-300">
                    {townMarkers.reduce((acc, curr) => acc + curr.quantity, 0)} Units Total
                  </Badge>
                </div>

                <div className="space-y-2">
                  {townMarkers.map((marker) => {
                    const res = RESOURCE_CATALOG.find((r) => r.id === marker.resourceTypeId);
                    return (
                      <div
                        key={marker.id}
                        onClick={() => {
                          onSelectMarker(marker);
                          onClose();
                        }}
                        className="bg-slate-800/80 hover:bg-slate-700 border border-slate-700 p-2.5 rounded-lg cursor-pointer transition-colors space-y-1.5 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-100 group-hover:text-white flex items-center gap-1.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full inline-block"
                              style={{ backgroundColor: res?.color || '#3b82f6' }}
                            />
                            {marker.title}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                            x{marker.quantity}
                          </span>
                        </div>

                        {marker.notes && (
                          <p className="text-[11px] text-slate-300 bg-slate-900/60 p-1.5 rounded italic">
                            "{marker.notes}"
                          </p>
                        )}

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                          {marker.contactPerson ? (
                            <span className="flex items-center gap-1 text-slate-300">
                              <User className="w-3 h-3 text-slate-400" /> {marker.contactPerson}
                            </span>
                          ) : (
                            <span className="text-slate-500">No contact listed</span>
                          )}

                          <span className="flex items-center gap-1 font-mono text-slate-400">
                            <MapPin className="w-3 h-3 text-red-400" /> {marker.lat.toFixed(3)}, {marker.lng.toFixed(3)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};