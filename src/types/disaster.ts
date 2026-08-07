export type ResourceCategory = 'vehicle' | 'personnel' | 'facility' | 'hazard' | 'logistics';

export type ResourceTypeId = 
  // Vehicles & Heavy Equipment
  | 'ambulance' 
  | 'police_car' 
  | 'fire_truck' 
  | 'rescue_truck'
  | 'helicopter'
  | 'aircraft'
  | 'rubber_boat'
  | 'patrol_vessel'
  | 'heavy_equipment'
  | 'water_tanker'
  | 'comms_truck'
  // Personnel & Specialized Teams
  | 'pnp_personnel' 
  | 'bfp_personnel' 
  | 'afp_personnel' 
  | 'pcg_personnel'
  | 'paf_personnel'
  | 'medics'
  | 'comms_group'
  | 'volunteer_group'
  | 'k9_team'
  // ICS Facilities
  | 'icp' 
  | 'staging_area' 
  | 'camp' 
  | 'base'
  | 'helibase'
  | 'helispot'
  | 'eoc'
  | 'medical_post'
  // Event & Tactical Logistics
  | 'tent_large'
  | 'tent_small'
  | 'first_aid_post'
  | 'hydration_station'
  | 'security_checkpoint'
  | 'generator_power'
  | 'light_tower'
  | 'toilet_mobile'
  | 'barrier_crowd'
  | 'info_kiosk'
  | 'event_stage'
  | 'concession_stand'
  | 'vip_area'
  | 'media_center'
  | 'parade_marker'
  | 'lost_found'
  | 'evacuation_center'
  | 'triage_facility'
  | 'distribution_point'
  | 'morgue_temp'
  | 'decon_station';

export interface ResourceDefinition {
  id: ResourceTypeId;
  name: string;
  category: ResourceCategory;
  iconName: string;
  color: string;
  badgeBg: string;
  description: string;
  defaultCallsign: string;
  agency?: string;
}

export type AssetStatus = 'ready' | 'deployed' | 'en_route' | 'standby';

export interface PrepositionedMarker {
  id: string;
  resourceTypeId: ResourceTypeId;
  title: string;
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

export interface OperationalArea {
  id: string;
  name: string;
  color: string;
  opacity: number;
  points: [number, number][];
  notes?: string;
  updatedAt: string;
}

export type RouteType = 'evacuation' | 'rerouting' | 'emergency' | 'supply';

export interface TacticalRoute {
  id: string;
  name: string;
  type: RouteType;
  color: string;
  isDashed: boolean;
  points: [number, number][];
  notes?: string;
  updatedAt: string;
}

export interface HazardZone {
  id: string;
  name: string;
  type: 'flood' | 'landslide' | 'storm_surge';
  severity: 'high' | 'medium' | 'low';
  coordinates: [number, number][];
  description: string;
}

export interface PrepositionPlan {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  markers: PrepositionedMarker[];
  areas?: OperationalArea[];
  routes?: TacticalRoute[];
}