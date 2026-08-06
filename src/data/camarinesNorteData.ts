import { ResourceDefinition, HazardZone } from '@/types/disaster';

// Camarines Norte Center (Daet / Central region)
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
  // Vehicles
  {
    id: 'ambulance',
    name: 'Ambulance Unit',
    category: 'vehicle',
    iconName: 'Ambulance',
    color: '#ef4444', // Red
    badgeBg: 'bg-red-100 text-red-800 border-red-300',
    description: 'Emergency Medical Service Response Unit',
    defaultCallsign: 'MEDEVAC-1'
  },
  {
    id: 'fire_truck',
    name: 'Fire Truck',
    category: 'vehicle',
    iconName: 'Flame',
    color: '#f97316', // Orange
    badgeBg: 'bg-orange-100 text-orange-800 border-orange-300',
    description: 'BFP / Local Suppression & Rescue Pumper',
    defaultCallsign: 'ENGINE-1'
  },
  {
    id: 'rescue_truck',
    name: 'Rescue Truck',
    category: 'vehicle',
    iconName: 'Truck',
    color: '#06b6d4', // Cyan
    badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    description: 'Heavy Rescue & Extrication Vehicle',
    defaultCallsign: 'RESCUE-ALPHA'
  },
  {
    id: 'police_car',
    name: 'Police Mobile',
    category: 'vehicle',
    iconName: 'ShieldAlert',
    color: '#2563eb', // Blue
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'PNP Security & Patrol Vehicle',
    defaultCallsign: 'PATROL-1'
  },

  // Personnel
  {
    id: 'medics',
    name: 'Medical Team',
    category: 'personnel',
    iconName: 'Cross',
    color: '#ec4899', // Pink/Red cross
    badgeBg: 'bg-pink-100 text-pink-800 border-pink-300',
    description: 'Doctors, Nurses & First Responders Squad',
    defaultCallsign: 'TRIAGE-TEAM'
  },
  {
    id: 'pnp_personnel',
    name: 'PNP Personnel',
    category: 'personnel',
    iconName: 'UserCheck',
    color: '#1d4ed8', // Dark Blue
    badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    description: 'Philippine National Police Force Unit',
    defaultCallsign: 'PNP-SQUAD-1',
    agency: 'PNP'
  },
  {
    id: 'bfp_personnel',
    name: 'BFP Personnel',
    category: 'personnel',
    iconName: 'Users',
    color: '#ea580c', // Dark Orange
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Bureau of Fire Protection Search & Rescue',
    defaultCallsign: 'BFP-CREW-1',
    agency: 'BFP'
  },
  {
    id: 'afp_personnel',
    name: 'AFP Personnel',
    category: 'personnel',
    iconName: 'UserCog',
    color: '#15803d', // Dark Green
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Armed Forces HADR Response Platoon',
    defaultCallsign: 'AFP-DRU-1',
    agency: 'AFP'
  },

  // ICS Standard Facilities
  {
    id: 'icp',
    name: 'Incident Command Post',
    category: 'facility',
    iconName: 'Radio',
    color: '#7c3aed', // Purple
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'Primary location for incident tactical operations',
    defaultCallsign: 'CAM-NORTE-ICP'
  },
  {
    id: 'staging_area',
    name: 'Staging Area',
    category: 'facility',
    iconName: 'MapPin',
    color: '#0284c7', // Sky Blue
    badgeBg: 'bg-sky-100 text-sky-800 border-sky-300',
    description: 'Location where resources await tactical assignments',
    defaultCallsign: 'STAGING-NORTH'
  },
  {
    id: 'camp',
    name: 'Camp Facility',
    category: 'facility',
    iconName: 'Tent',
    color: '#059669', // Emerald
    badgeBg: 'bg-green-100 text-green-800 border-green-300',
    description: 'Accommodations and support services for personnel',
    defaultCallsign: 'BASE-CAMP-1'
  },
  {
    id: 'base',
    name: 'Base Facility',
    category: 'facility',
    iconName: 'Building2',
    color: '#475569', // Slate
    badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
    description: 'Primary logistics and administrative facility hub',
    defaultCallsign: 'LOGISTICS-BASE'
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
    description: 'Coastal exposure to Category 3+ typhoon storm surges',
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
    description: 'Steep terrain prone to debris flows during rainfall',
    coordinates: [
      [14.180, 122.780],
      [14.210, 122.820],
      [14.160, 122.850],
      [14.140, 122.800]
    ]
  }
];

// Initial default deployment markers for quick demonstration
export const INITIAL_MARKERS = [
  {
    id: 'init-1',
    resourceTypeId: 'icp' as const,
    title: 'PDRRMO Central Command',
    notes: 'Primary Command Center setup at Provincial Capitol Grounds',
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
    title: 'Labo North Staging',
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
    resourceTypeId: 'rescue_truck' as const,
    title: 'Mercedes Flood Rescue Alpha',
    notes: 'Equipped with 2 inflatable rubber boats (IRB) and life vests',
    lat: 14.1050,
    lng: 123.0150,
    status: 'deployed' as const,
    quantity: 1,
    contactPerson: 'Sgt. J. Reyes',
    contactNumber: '+63 999 222 3344',
    municipality: 'Mercedes',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'init-5',
    resourceTypeId: 'pnp_personnel' as const,
    title: 'PNP Security Platoon',
    notes: 'Maintaining order & traffic flow along Maharlika Highway',
    lat: 14.1450,
    lng: 122.9300,
    status: 'ready' as const,
    quantity: 15,
    contactPerson: 'Maj. E. Ramos',
    contactNumber: '+63 915 888 7766',
    municipality: 'Talisay',
    updatedAt: new Date().toISOString()
  }
];