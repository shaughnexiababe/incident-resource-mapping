import React, { useState, useEffect } from 'react';
import { TacticalRoute, RouteType } from '@/types/disaster';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Trash2, Save, Navigation } from 'lucide-react';

interface RouteEditModalProps {
  route: TacticalRoute | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (route: TacticalRoute) => void;
  onDelete?: (id: string) => void;
}

export const RouteEditModal: React.FC<RouteEditModalProps> = ({
  route,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<RouteType>('evacuation');
  const [color, setColor] = useState('#10b981');
  const [isDashed, setIsDashed] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (route) {
      setName(route.name || '');
      setType(route.type || 'evacuation');
      setColor(route.color || '#10b981');
      setIsDashed(!!route.isDashed);
      setNotes(route.notes || '');
    }
  }, [route]);

  if (!route) return null;

  const handleTypeChange = (newType: RouteType) => {
    setType(newType);
    if (newType === 'evacuation') {
      setColor('#10b981'); // Emerald green
      setIsDashed(false);
    } else if (newType === 'rerouting') {
      setColor('#ef4444'); // Red
      setIsDashed(true);
    } else if (newType === 'emergency') {
      setColor('#3b82f6'); // Blue
      setIsDashed(false);
    } else if (newType === 'supply') {
      setColor('#f59e0b'); // Amber
      setIsDashed(true);
    }
  };

  const handleSave = () => {
    onSave({
      ...route,
      name: name.trim() || 'Tactical Route',
      type,
      color,
      isDashed,
      notes,
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-slate-100">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded bg-emerald-600/20 text-emerald-400">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-white">
                Tactical Route / Traffic Plan
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Set route purpose, traffic direction, and detour guidelines.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Route Name */}
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-300 font-medium">Route Callsign / Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Primary Evacuation Route 1"
              className="bg-slate-800 border-slate-700 text-xs text-white focus-visible:ring-emerald-500"
            />
          </div>

          {/* Route Type */}
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-300 font-medium">Route Classification</Label>
            <Select value={type} onValueChange={(val: RouteType) => handleTypeChange(val)}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-xs text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="evacuation">🟢 Evacuation Corridor / Traffic Flow</SelectItem>
                <SelectItem value="rerouting">🔴 Traffic Rerouting / Road Closure Detour</SelectItem>
                <SelectItem value="emergency">🔵 Medevac & Emergency Corridor</SelectItem>
                <SelectItem value="supply">🟡 Logistics Supply Corridor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dashed & Color Toggle */}
          <div className="flex items-center justify-between p-2 rounded bg-slate-800/80 border border-slate-700">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-200">Dashed Rerouting Line</span>
              <p className="text-[10px] text-slate-400">Reroutes and temporary detours use dashed line style.</p>
            </div>
            <Switch
              checked={isDashed}
              onCheckedChange={setIsDashed}
              className="data-[state=checked]:bg-emerald-600"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-300 font-medium">Traffic Directives & Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. One-way traffic northbound towards Daet evacuation center. PNP manned checkpoint at junction."
              rows={3}
              className="bg-slate-800 border-slate-700 text-xs text-white focus-visible:ring-emerald-500 resize-none"
            />
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between border-t border-slate-800 pt-3">
          {onDelete && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => {
                onDelete(route.id);
                onClose();
              }}
              className="text-xs bg-red-900/60 hover:bg-red-800 text-red-100 gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Route
            </Button>
          )}

          <div className="flex items-center space-x-2 ml-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="border-slate-700 text-slate-300 bg-slate-800 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5"
            >
              <Save className="w-3.5 h-3.5" /> Save Route
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};