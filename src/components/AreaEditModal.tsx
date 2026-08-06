import React, { useState, useEffect } from 'react';
import { OperationalArea } from '@/types/disaster';
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
import { Trash2, Save, Layers } from 'lucide-react';

interface AreaEditModalProps {
  area: OperationalArea | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (area: OperationalArea) => void;
  onDelete?: (id: string) => void;
}

const PRESET_COLORS = [
  { name: 'Red Division', value: '#ef4444' },
  { name: 'Amber Division', value: '#f59e0b' },
  { name: 'Emerald Division', value: '#10b981' },
  { name: 'Blue Division', value: '#3b82f6' },
  { name: 'Purple Division', value: '#a855f7' },
  { name: 'Cyan Sector', value: '#06b6d4' },
];

export const AreaEditModal: React.FC<AreaEditModalProps> = ({
  area,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (area) {
      setName(area.name || 'Division Alpha');
      setColor(area.color || '#3b82f6');
      setNotes(area.notes || '');
    }
  }, [area]);

  if (!area) return null;

  const handleSave = () => {
    onSave({
      ...area,
      name: name.trim() || 'Operational Division',
      color,
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
            <div className="p-2 rounded bg-blue-600/20 text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-white">
                Operational Area / Division
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Assign division designation and fill color for tactical mapping.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Division Name */}
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-300 font-medium">Division / Sector Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Division Alpha - Coastal Sector"
              className="bg-slate-800 border-slate-700 text-xs text-white focus-visible:ring-blue-500"
            />
          </div>

          {/* Color Selector */}
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-300 font-medium">Highlight Color</Label>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`flex items-center space-x-2 p-1.5 rounded border text-xs font-medium transition-all ${
                    color === c.value
                      ? 'border-white bg-slate-800 text-white shadow'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: c.value }}
                  />
                  <span className="truncate text-[11px]">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-300 font-medium">Division Notes & Directives</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Under PNP Sector Command. Priority evacuation zone for coastal flooding."
              rows={3}
              className="bg-slate-800 border-slate-700 text-xs text-white focus-visible:ring-blue-500 resize-none"
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
                onDelete(area.id);
                onClose();
              }}
              className="text-xs bg-red-900/60 hover:bg-red-800 text-red-100 gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Division
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
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-1.5"
            >
              <Save className="w-3.5 h-3.5" /> Save Area
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};