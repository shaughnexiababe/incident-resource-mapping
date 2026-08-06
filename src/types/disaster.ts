export type ResourceCategory = 'vehicle' | 'personnel' | 'facility' | 'hazard';

export type ResourceTypeId = 
  | 'ambulance' 
  | 'police_car' 
  | 'fire_truck' 
  | 'rescue_truck'
  | 'pnp_personnel' 
  | 'bfp_personnel' 
  | 'afp_personnel' 
  | 'medics'
  | 'icp' 
  | 'staging_area' 
  | 'camp' 
  | 'base';

export interface ResourceDefinition {
  id: ResourceTypeId;
  name: string;
  category: ResourceCategory;
  iconName: string;
  color: string; // Tailwind border/bg color or hex
  badgeBg: string;
  description: string;
  defaultCallsign: string;
  agency?: string;
}

export type AssetStatus = 'ready' | 'deployed' | 'en_route' | 'standby';

export interface PrepositionedMarker {
  id: string;
  resourceTypeId: ResourceTypeId;
  title: string; // e.g. "Team Alpha"
  notes: string;
  lat: number;
  lng: number;
  status: AssetStatus;
  quantity: number;
  contactPerson?: string;
  contactNumber?: string;
  municipality?: string;
  updatedAt: string;
}

export interface HazardZone {
  id: string;
  name: string;
  type: 'flood' | 'landslide' | 'storm_surge';
  severity: 'high' | 'medium' | 'low';
  coordinates: [number, number][]; // Lat, Lng polygon
  description: string;
}

export interface PrepositionPlan {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  markers: PrepositionedMarker[];
}