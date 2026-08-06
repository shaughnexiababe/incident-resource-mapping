import React, { useState, useEffect } from 'react';
import { PrepositionedMarker, AssetStatus } from '@/types/disaster';
import { RESOURCE_CATALOG, MUNICIPALITIES } from '@/data/camarinesNorteData';
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
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Save, MapPin, User, Phone, FileText, Hash } from 'lucide-react';

interface MarkerEditModalProps {
  marker: PrepositionedMarker | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedMarker: PrepositionedMarker) => void;
  onDelete: (markerId: string) => void;
}

export const MarkerEditModal: React.FC<MarkerEditModalProps> = ({
  marker,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<AssetStatus>('ready');
  const [quantity, setQuantity] = useState(1);
  const [contactPerson, setContactPerson] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [municipality, setMunicipality] = useState('');

  useEffect(() => {
    if (marker) {
      setTitle(marker.title || '');
      setNotes(marker.notes || '');
      setStatus(marker.status || 'ready');
      setQuantity(marker.quantity || 1);
      setContactPerson(marker.contactPerson || '');
      setContactNumber(marker.contactNumber || '');
      setMunicipality(marker.municipality || 'Daet (Capital)');
    }
  }, [marker]);

  if (!marker) return null;

  const resource = RESOURCE_CATALOG.find((r) => r.id === marker.resourceTypeId) || RESOURCE_CATALOG[0];

  const handleSave = () => {
    onSave({
      ...marker,
      title: title.trim() || resource.defaultCallsign,
      notes,
      status,
      quantity,
      contactPerson,
      contactNumber,
      municipality,
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  const handleDelete = () => {
    onDelete(marker.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg bg-slate-900 border-slate-800 text-slate-100">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 font-bold"
              style={{ backgroundColor: resource.color }}
            >
              <Hash className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
                {resource.name}
                <Badge variant="outline" className={`${resource.badgeBg} text-[10px]`}>
                  {resource.category.toUpperCase()}
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-xs">
                Edit operational callsign, unit quantity, notes, and contact person.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Callsign Title & Quantity */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs text-slate-300 font-medium">Unit Callsign / Name</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Team Alpha"
                className="bg-slate-800 border-slate-700 text-sm text-white focus-visible:ring-red-500"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-300 font-medium">Quantity</Label>
              <Input
                type="number"
                min="1"
                max="50"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="bg-slate-800 border-slate-700 text-sm text-white focus-visible:ring-red-500"
              />
            </div>
          </div>

          {/* Status & Municipality */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-300 font-medium">Deployment Status</Label>
              <Select value={status} onValueChange={(val: AssetStatus) => setStatus(val)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-xs text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="ready">🟢 Ready / On Standby</SelectItem>
                  <SelectItem value="deployed">🔵 Actively Deployed</SelectItem>
                  <SelectItem value="en_route">🟡 En Route / In Transit</SelectItem>
                  <SelectItem value="standby">⚪ Reserve / Base Camp</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-300 font-medium">Assigned Municipality</Label>
              <Select value={municipality} onValueChange={setMunicipality}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-xs text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white max-h-48">
                  {MUNICIPALITIES.map((mun) => (
                    <SelectItem key={mun.name} value={mun.name}>
                      {mun.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-300 font-medium flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" /> Lead Contact Person
              </Label>
              <Input
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="e.g. Capt. Santos"
                className="bg-slate-800 border-slate-700 text-xs text-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-300 font-medium flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" /> Phone / Radio Frequency
              </Label>
              <Input
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="e.g. +63 917 ... / Ch. 4"
                className="bg-slate-800 border-slate-700 text-xs text-white"
              />
            </div>
          </div>

          {/* Operational Notes */}
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-300 font-medium flex items-center gap-1">
              <FileText className="w-3 h-3 text-slate-400" /> Operational Notes & Instructions
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Team Alpha equipped with 2 inflatable rubber boats. Staging near municipal hall."
              rows={3}
              className="bg-slate-800 border-slate-700 text-xs text-white focus-visible:ring-red-500 resize-none"
            />
          </div>

          {/* Coordinates Display */}
          <div className="bg-slate-950/80 p-2 rounded text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-red-400" /> Coordinates:
            </span>
            <span>
              {marker.lat.toFixed(5)}, {marker.lng.toFixed(5)}
            </span>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between gap-2 border-t border-slate-800 pt-3">
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="text-xs font-semibold gap-1.5 bg-red-900/60 hover:bg-red-800 text-red-100"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Asset
          </Button>

          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="border-slate-700 text-slate-300 hover:text-white bg-slate-800 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              Save Note & Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};