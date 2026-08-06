import { ResourceDefinition, HazardZone } from '@/types/disaster';

export const CAMARINES_NORTE_CENTER: [number, number] = [14.1122, 122.9553];
export const DEFAULT_ZOOM = 11;

export const MUNICIPALITIES = [
  { name: 'Daet (Capital)', lat: 14.1122, lng: 122.9553, population: '111,700' },
  { name: 'Labo', lat: 14.1539, lng: 122.8310, population: '109,200' },
  { name: 'Jose Panganiban', lat: 14.2889, lng: 122.6869, population: '63,600' },
  { name: 'Basud', lat: 13.9833, lng: 122.9667, population: '45,000' },
  { name: 'Mercedes', lat: 14.1083, lng: 123.0125, population: '50,800' },
  { name: 'Capalonga', lat: 14.3167, lng: 122.5000, population: '36,200' },
  { name: 'Santa Elena', lat: 14.1722, lng: 122.3833, population: '43,000' },
  { name: 'Paracale', lat: 14.2819, lng: 122.7878, population: '60,100' },
  { name: 'Vinzons', lat: 14.1750, lng: 122.8667, population: '49,600' },
  { name: 'San Lorenzo Ruiz', lat: 14.0333, lng: 122.8667, population: '15,700' },
  { name: 'San Vicente', lat: 14.0833, lng: 122.8667, population: '11,000' },
  { name: 'Talisay', lat: 14.1430, lng: 122.9360, population: '27,200' },
];

export const RESOURCE_CATALOG: ResourceDefinition[] = [
  // Vehicles, Machinery & Craft
  {
    id: 'ambulance',
    name: 'Ambulance Unit',
    category: 'vehicle',
    iconName: 'Ambulance',
    color: '#ef4444',
    badgeBg: 'bg-red-100 text-red-800 border-red-300',
    description: 'Emergency Medical Service Response Unit',
    defaultCallsign: 'MEDEVAC-1'
  },
  {
    id: 'fire_truck',
    name: 'Fire Truck / Pumper',
    category: 'vehicle',
    iconName: 'Flame',
    color: '#f97316',
    badgeBg: 'bg-orange-100 text-orange-800 border-orange-300',
    description: 'BFP / Local Suppression & Rescue Pumper',
    defaultCallsign: 'ENGINE-1'
  },
  {
    id: 'rescue_truck',
    name: 'Rescue Truck',
    category: 'vehicle',
    iconName: 'Truck',
    color: '#06b6d4',
    badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    description: 'Heavy Rescue & Extrication Vehicle',
    defaultCallsign: 'RESCUE-ALPHA'
  },
  {
    id: 'police_car',
    name: 'Police Mobile',
    category: 'vehicle',
    iconName: 'ShieldAlert',
    color: '#2563eb',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'PNP Security & Patrol Vehicle',
    defaultCallsign: 'PATROL-1'
  },
  {
    id: 'helicopter',
    name: 'Rescue Helicopter',
    category: 'vehicle',
    iconName: 'Helicopter',
    color: '#2563eb',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'Air SAR & Medevac Chopper',
    defaultCallsign: 'AIR-SAR-1',
    agency: 'PAF / PCG'
  },
  {
    id: 'aircraft',
    name: 'Cargo / Recon Aircraft',
    category: 'vehicle',
    iconName: 'Plane',
    color: '#0284c7',
    badgeBg: 'bg-sky-100 text-sky-800 border-sky-300',
    description: 'Aerial Survey & Supply Transport Plane',
    defaultCallsign: 'AIR-LOG-1'
  },
  {
    id: 'rubber_boat',
    name: 'Inflatable Rubber Boat (IRB)',
    category: 'vehicle',
    iconName: 'Ship',
    color: '#16a34a',
    badgeBg: 'bg-green-100 text-green-800 border-green-300',
    description: 'Flood Water Rescue Rubber Boat',
    defaultCallsign: 'WATER-RESCUE-1'
  },
  {
    id: 'patrol_vessel',
    name: 'Coast Guard Patrol Craft',
    category: 'vehicle',
    iconName: 'Anchor',
    color: '#1e3a8a',
    badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    description: 'Maritime SAR & Coastal Vessel',
    defaultCallsign: 'PCG-VESSEL-1',
    agency: 'PCG'
  },
  {
    id: 'heavy_equipment',
    name: 'Excavator / Backhoe',
    category: 'vehicle',
    iconName: 'HardHat',
    color: '#d97706',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Debris Clearing & Engineering Machinery',
    defaultCallsign: 'ENGINEER-EQ-1'
  },
  {
    id: 'water_tanker',
    name: 'Water Tanker Lorry',
    category: 'vehicle',
    iconName: 'Droplets',
    color: '#0284c7',
    badgeBg: 'bg-sky-100 text-sky-800 border-sky-300',
    description: 'Potable Water Distribution Tanker',
    defaultCallsign: 'WATER-TANK-1'
  },
  {
    id: 'comms_truck',
    name: 'Mobile Comms Van',
    category: 'vehicle',
    iconName: 'Radio',
    color: '#7e22ce',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'Emergency Radio & Satellite Command Vehicle',
    defaultCallsign: 'COMMS-MOBILE-1'
  },

  // Personnel & Specialized Teams
  {
    id: 'medics',
    name: 'Medical / Triage Team',
    category: 'personnel',
    iconName: 'Cross',
    color: '#ec4899',
    badgeBg: 'bg-pink-100 text-pink-800 border-pink-300',
    description: 'Doctors, Nurses & EMS Responders',
    defaultCallsign: 'TRIAGE-TEAM'
  },
  {
    id: 'pnp_personnel',
    name: 'PNP Personnel',
    category: 'personnel',
    iconName: 'UserCheck',
    color: '#1d4ed8',
    badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    description: 'Philippine National Police Contingent',
    defaultCallsign: 'PNP-SQUAD-1',
    agency: 'PNP'
  },
  {
    id: 'bfp_personnel',
    name: 'BFP Search & Rescue',
    category: 'personnel',
    iconName: 'Users',
    color: '#ea580c',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Bureau of Fire Protection Rescue Squad',
    defaultCallsign: 'BFP-CREW-1',
    agency: 'BFP'
  },
  {
    id: 'afp_personnel',
    name: 'AFP HADR Contingent',
    category: 'personnel',
    iconName: 'UserCog',
    color: '#15803d',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Armed Forces Disaster Response Platoon',
    defaultCallsign: 'AFP-DRU-1',
    agency: 'AFP'
  },
  {
    id: 'pcg_personnel',
    name: 'Coast Guard SAR Team',
    category: 'personnel',
    iconName: 'Shield',
    color: '#1d4ed8',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'Philippine Coast Guard Water Rescuers',
    defaultCallsign: 'PCG-SAR-1',
    agency: 'PCG'
  },
  {
    id: 'paf_personnel',
    name: 'Air Force HADR Team',
    category: 'personnel',
    iconName: 'Zap',
    color: '#0284c7',
    badgeBg: 'bg-sky-100 text-sky-800 border-sky-300',
    description: 'Air Force Rescue & Reconnaissance Crew',
    defaultCallsign: 'PAF-SQUAD-1',
    agency: 'PAF'
  },
  {
    id: 'comms_group',
    name: 'Emergency Radio Comms',
    category: 'personnel',
    iconName: 'Radio',
    color: '#7e22ce',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'Ham Radio & Emergency Comms Operators',
    defaultCallsign: 'RADIO-NET-1'
  },
  {
    id: 'k9_team',
    name: 'K9 Search & Rescue',
    category: 'personnel',
    iconName: 'Dog',
    color: '#b45309',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Search Dog Canine Unit for Collapsed Structure SAR',
    defaultCallsign: 'K9-UNIT-1'
  },
  {
    id: 'volunteer_group',
    name: 'Volunteer / NGO Rescuers',
    category: 'personnel',
    iconName: 'HeartHandshake',
    color: '#0d9488',
    badgeBg: 'bg-teal-100 text-teal-800 border-teal-300',
    description: 'Civil Defense Volunteers & Red Cross Responders',
    defaultCallsign: 'VOLUNTEER-SQUAD'
  },

  // ICS Standard Facilities
  {
    id: 'icp',
    name: 'Incident Command Post (ICP)',
    category: 'facility',
    iconName: 'ICS_ICP',
    color: '#2563eb',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'FEMA ICS Standard: Split Circle with ICP designation',
    defaultCallsign: 'INCIDENT-ICP'
  },
  {
    id: 'staging_area',
    name: 'Staging Area (S)',
    category: 'facility',
    iconName: 'ICS_S',
    color: '#eab308',
    badgeBg: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    description: 'FEMA ICS Standard: White circle with black letter S',
    defaultCallsign: 'STAGING-NORTH'
  },
  {
    id: 'camp',
    name: 'Camp Facility (C)',
    category: 'facility',
    iconName: 'ICS_C',
    color: '#16a34a',
    badgeBg: 'bg-green-100 text-green-800 border-green-300',
    description: 'FEMA ICS Standard: White circle with black letter C',
    defaultCallsign: 'BASE-CAMP-1'
  },
  {
    id: 'base',
    name: 'Base Facility (B)',
    category: 'facility',
    iconName: 'ICS_B',
    color: '#0284c7',
    badgeBg: 'bg-sky-100 text-sky-800 border-sky-300',
    description: 'FEMA ICS Standard: White circle with black letter B',
    defaultCallsign: 'LOGISTICS-BASE'
  },
  {
    id: 'helibase',
    name: 'Helibase (H)',
    category: 'facility',
    iconName: 'ICS_H',
    color: '#8b5cf6',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'FEMA ICS Standard: White circle with black letter H and rotor blades',
    defaultCallsign: 'MAIN-HELIBASE'
  },
  {
    id: 'helispot',
    name: 'Helispot (H1)',
    category: 'facility',
    iconName: 'ICS_H1',
    color: '#a855f7',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'FEMA ICS Standard: White circle with black letter H1',
    defaultCallsign: 'HELISPOT-ALPHA'
  },
  {
    id: 'medical_post',
    name: 'Medical Post (M)',
    category: 'facility',
    iconName: 'ICS_M',
    color: '#ec4899',
    badgeBg: 'bg-pink-100 text-pink-800 border-pink-300',
    description: 'FEMA ICS Standard: White circle with black letter M & cross',
    defaultCallsign: 'FIELD-MEDICAL-1'
  },
  {
    id: 'eoc',
    name: 'Emergency Operations Center (EOC)',
    category: 'facility',
    iconName: 'ICS_EOC',
    color: '#0f172a',
    badgeBg: 'bg-slate-200 text-slate-800 border-slate-400',
    description: 'Multi-agency regional coordination center',
    defaultCallsign: 'EOC-MAIN'
  }
];

export const HAZARD_ZONES: HazardZone[] = [
  {
    id: 'flood_daet_basin',
    name: 'Daet River Basin Flood Zone',
    type: 'flood',
    severity: 'high',
    description: 'High inundation risk area along Daet & Basud river delta',
    coordinates: [
      [14.135, 122.940],
      [14.140, 122.970],
      [14.110, 123.010],
      [14.085, 122.980],
      [14.095, 122.935]
    ]
  },
  {
    id: 'surge_mercedes_coastal',
    name: 'Mercedes Coastal Storm Surge Zone',
    type: 'storm_surge',
    severity: 'high',
    description: 'Coastal exposure to Category 3+ storm surges',
    coordinates: [
      [14.120, 123.000],
      [14.160, 123.030],
      [14.120, 123.080],
      [14.070, 123.050]
    ]
  },
  {
    id: 'landslide_labo_slopes',
    name: 'Labo Mountainous Landslide Area',
    type: 'landslide',
    severity: 'medium',
    description: 'Steep terrain prone to debris flows during heavy rainfall',
    coordinates: [
      [14.180, 122.780],
      [14.210, 122.820],
      [14.160, 122.850],
      [14.140, 122.800]
    ]
  }
];

export const INITIAL_MARKERS = [
  {
    id: 'init-1',
    resourceTypeId: 'icp' as const,
    title: 'Central Command Post',
    notes: 'Incident Command Post setup at Provincial Capitol Grounds',
    lat: 14.1150,
    lng: 122.9560,
    status: 'ready' as const,
    quantity: 1,
    contactPerson: 'Director R. Santos',
    contactNumber: '+63 917 555 0192',
    municipality: 'Daet (Capital)',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'init-2',
    resourceTypeId: 'staging_area' as const,
    title: 'North Staging Area',
    notes: 'Heavy equipment and rescue teams ready for dispatch',
    lat: 14.1550,
    lng: 122.8350,
    status: 'ready' as const,
    quantity: 1,
    contactPerson: 'Capt. M. Cruz',
    contactNumber: '+63 918 444 8821',
    municipality: 'Labo',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'init-3',
    resourceTypeId: 'ambulance' as const,
    title: 'Medic Squad Alpha',
    notes: 'Advanced Life Support Ambulance prepositioned near highway junction',
    lat: 14.1100,
    lng: 122.9450,
    status: 'ready' as const,
    quantity: 2,
    contactPerson: 'Dr. A. Villanueva',
    contactNumber: '+63 920 333 1199',
    municipality: 'Daet (Capital)',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'init-4',
    resourceTypeId: 'rubber_boat' as const,
    title: 'Flood Rescue IRB Alpha',
    notes: 'Equipped with 2 inflatable rubber boats (IRB) and life vests',
    lat: 14.1050,
    lng: 123.0150,
    status: 'deployed' as const,
    quantity: 2,
    contactPerson: 'Sgt. J. Reyes',
    contactNumber: '+63 999 222 3344',
    municipality: 'Mercedes',
    updatedAt: new Date().toISOString()
  }
];