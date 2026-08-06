import L from 'leaflet';
import { RESOURCE_CATALOG } from '@/data/camarinesNorteData';
import { ResourceTypeId } from '@/types/disaster';

// Detailed SVG miniature figures for vehicles and personnel
export const ENHANCED_ICON_SVGS: Record<string, string> = {
  // Ambulance - Medical vehicle silhouette with lightbar and cross
  ambulance: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <!-- Emergency Light Flashers -->
      <rect x="7" y="2" width="4" height="2" fill="#ef4444" rx="0.5"/>
      <rect x="13" y="2" width="4" height="2" fill="#3b82f6" rx="0.5"/>
      <!-- Van Body -->
      <path d="M3 8 C3 6.5, 4.5 5, 6 5 L18 5 C19.5 5, 21 6.5, 21 8 L21 16 L3 16 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="0.8"/>
      <path d="M15 5 L20 9 L21 16 L15 16 Z" fill="#e2e8f0"/>
      <!-- Red Cross Badge -->
      <rect x="8" y="8" width="5" height="5" fill="#ef4444" rx="1"/>
      <path d="M10.5 9 L10.5 12 M9 10.5 L12 10.5" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round"/>
      <!-- Wheels & Undercarriage -->
      <rect x="2" y="15" width="20" height="2" fill="#1e293b"/>
      <circle cx="7" cy="16" r="2.5" fill="#0f172a" stroke="#94a3b8" stroke-width="1"/>
      <circle cx="17" cy="16" r="2.5" fill="#0f172a" stroke="#94a3b8" stroke-width="1"/>
    </g>
  `,

  // Police Car - Patrol cruiser with lightbar, police star badge & siren
  police_car: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <!-- Strobe Lightbar -->
      <path d="M8 2 L12 2 L12 4 L8 4 Z" fill="#ef4444"/>
      <path d="M12 2 L16 2 L16 4 L12 4 Z" fill="#2563eb"/>
      <!-- Sedan Roof & Windows -->
      <path d="M5 10 L8 5 L16 5 L19 10 Z" fill="#1e293b"/>
      <path d="M9 6 L12 6 L12 9 L7 9 Z" fill="#38bdf8" opacity="0.8"/>
      <path d="M13 6 L15 6 L17 9 L13 9 Z" fill="#38bdf8" opacity="0.8"/>
      <!-- Cruiser Body -->
      <path d="M2 10 L22 10 Q23 10 23 12 L22 15 L2 15 Z" fill="#2563eb"/>
      <!-- Police Star Badge -->
      <polygon points="12,10 13,12 15,12 13.5,13 14,15 12,14 10,15 10.5,13 9,12 11,12" fill="#fbbf24"/>
      <!-- Wheels -->
      <circle cx="6" cy="15" r="2.5" fill="#0f172a" stroke="#94a3b8" stroke-width="1"/>
      <circle cx="18" cy="15" r="2.5" fill="#0f172a" stroke="#94a3b8" stroke-width="1"/>
    </g>
  `,

  // Fire Truck - Heavy pumper truck with ladder and siren
  fire_truck: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <!-- Top Ladder -->
      <rect x="4" y="2" width="16" height="3" fill="#cbd5e1" stroke="#475569" stroke-width="0.5"/>
      <line x1="7" y1="2" x2="7" y2="5" stroke="#475569" stroke-width="0.8"/>
      <line x1="11" y1="2" x2="11" y2="5" stroke="#475569" stroke-width="0.8"/>
      <line x1="15" y1="2" x2="15" y2="5" stroke="#475569" stroke-width="0.8"/>
      <!-- Truck Body -->
      <rect x="2" y="6" width="14" height="10" fill="#dc2626" rx="1"/>
      <path d="M16 8 L22 8 L22 16 L16 16 Z" fill="#ef4444"/>
      <!-- Cab Window -->
      <rect x="17" y="9" width="4" height="3" fill="#38bdf8" rx="0.5"/>
      <!-- Equipment Doors -->
      <rect x="4" y="8" width="4" height="6" fill="#b91c1c" stroke="#fca5a5" stroke-width="0.5"/>
      <rect x="9" y="8" width="4" height="6" fill="#b91c1c" stroke="#fca5a5" stroke-width="0.5"/>
      <!-- Wheels -->
      <circle cx="6" cy="16" r="2.5" fill="#0f172a" stroke="#94a3b8" stroke-width="1"/>
      <circle cx="13" cy="16" r="2.5" fill="#0f172a" stroke="#94a3b8" stroke-width="1"/>
      <circle cx="19" cy="16" r="2.5" fill="#0f172a" stroke="#94a3b8" stroke-width="1"/>
    </g>
  `,

  // Rescue Truck - Heavy extrication truck with crane/winch boom
  rescue_truck: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <!-- Crane Arm Boom -->
      <path d="M3 9 L12 3 L14 5 L6 10 Z" fill="#f59e0b"/>
      <line x1="12" y1="3" x2="12" y2="9" stroke="#334155" stroke-width="1" stroke-dasharray="1,1"/>
      <polygon points="11,9 13,9 12,12" fill="#0284c7"/>
      <!-- Heavy Truck Body -->
      <rect x="2" y="9" width="14" height="7" fill="#0891b2" rx="1"/>
      <path d="M16 10 L22 10 L22 16 L16 16 Z" fill="#06b6d4"/>
      <!-- Hazard Stripes -->
      <path d="M3 14 L5 16 M6 14 L8 16 M9 14 L11 16" stroke="#fef08a" stroke-width="1.2"/>
      <!-- Cab Window -->
      <rect x="17" y="11" width="4" height="3" fill="#38bdf8"/>
      <!-- Offroad Wheels -->
      <circle cx="6" cy="16" r="2.8" fill="#0f172a" stroke="#06b6d4" stroke-width="1"/>
      <circle cx="18" cy="16" r="2.8" fill="#0f172a" stroke="#06b6d4" stroke-width="1"/>
    </g>
  `,

  // Medical Team - Triage cross & ECG pulse line
  medics: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <!-- Outer Medical Shield -->
      <path d="M12 2 L20 5 L20 12 C20 17 12 21 12 21 C12 21 4 17 4 12 L4 5 Z" fill="#be185d" stroke="#fbcfe8" stroke-width="1"/>
      <!-- White Emergency Cross -->
      <rect x="10" y="6" width="4" height="10" fill="#ffffff" rx="1"/>
      <rect x="7" y="9" width="10" height="4" fill="#ffffff" rx="1"/>
      <!-- ECG Pulse Line overlay -->
      <path d="M5 14 L8 14 L9.5 10 L11 17 L12.5 12 L14 15 L15.5 14 L19 14" fill="none" stroke="#f43f5e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  `,

  // PNP Personnel - Philippine National Police officer badge with gold star
  pnp_personnel: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <!-- Police Officer Star Badge -->
      <path d="M12 1 L15 5 L20 5 L16.5 9 L18 14 L12 11 L6 14 L7.5 9 L4 5 L9 5 Z" fill="#1e3a8a" stroke="#fbbf24" stroke-width="1.2"/>
      <!-- Gold Center Shield -->
      <path d="M12 6 C10 6 8.5 7.5 8.5 10 C8.5 13.5 12 16 12 16 C12 16 15.5 13.5 15.5 10 C15.5 7.5 14 6 12 6 Z" fill="#f59e0b"/>
      <!-- Center Eagle Wing / Star -->
      <circle cx="12" cy="10" r="2" fill="#ffffff"/>
      <polygon points="12,8.5 12.6,9.6 13.8,9.6 12.8,10.3 13.2,11.5 12,10.7 10.8,11.5 11.2,10.3 10.2,9.6 11.4,9.6" fill="#1d4ed8"/>
    </g>
  `,

  // BFP Personnel - Bureau of Fire Protection helmet & flame emblem
  bfp_personnel: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <!-- Fire Shield Outer Crest -->
      <path d="M12 2 L20 6 L18 17 C18 17 12 21 12 21 C12 21 6 17 6 17 L4 6 Z" fill="#c2410c" stroke="#fde047" stroke-width="1"/>
      <!-- Fire Helmet Graphic -->
      <path d="M7 11 C7 7 17 7 17 11 L19 12 L5 12 Z" fill="#f97316"/>
      <path d="M10 7 C10 5 14 5 14 7 Z" fill="#fef08a"/>
      <!-- Flame Motif -->
      <path d="M12 12 C10 14 10 16 12 18 C14 16 14 14 12 12 Z" fill="#facc15"/>
      <path d="M12 14 C11 15 11 16 12 17 C13 16 13 15 12 14 Z" fill="#ef4444"/>
    </g>
  `,

  // AFP Personnel - Armed Forces HADR platoon chevrons & tactical star
  afp_personnel: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <!-- Tactical Shield Background -->
      <path d="M12 2 L21 6 L21 13 C21 18 12 22 12 22 C12 22 3 18 3 13 L3 6 Z" fill="#14532d" stroke="#4ade80" stroke-width="1"/>
      <!-- Rank Chevrons -->
      <path d="M7 8 L12 12 L17 8" fill="none" stroke="#facc15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M7 11 L12 15 L17 11" fill="none" stroke="#facc15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Tactical Star Insignia -->
      <polygon points="12,15 12.8,16.5 14.5,16.5 13.1,17.5 13.6,19 12,18 10.4,19 10.9,17.5 9.5,16.5 11.2,16.5" fill="#ffffff"/>
    </g>
  `
};

export function createMarkerIcon(resourceTypeId: ResourceTypeId, title: string, quantity: number = 1): L.DivIcon {
  const resource = RESOURCE_CATALOG.find((r) => r.id === resourceTypeId) || RESOURCE_CATALOG[0];
  const color = resource.color;

  let markerContentHtml = '';

  // Standard ICS Facility Map Symbology
  if (resourceTypeId === 'icp') {
    // Incident Command Post: Circle divided horizontally (Top Blue, Bottom White with ICP text)
    markerContentHtml = `
      <div class="w-10 h-10 rounded-full border-2 border-slate-900 shadow-2xl overflow-hidden bg-white flex flex-col items-center justify-center relative">
        <div class="w-full h-1/2 bg-blue-600"></div>
        <div class="w-full h-1/2 bg-white"></div>
        <span class="absolute text-[11px] font-extrabold text-slate-900 tracking-tighter">ICP</span>
      </div>
    `;
  } else if (resourceTypeId === 'staging_area') {
    // Staging Area: Circle with bold "S"
    markerContentHtml = `
      <div class="w-10 h-10 rounded-full border-2 border-slate-900 bg-yellow-400 text-slate-950 flex items-center justify-center font-black text-lg shadow-2xl">
        S
      </div>
    `;
  } else if (resourceTypeId === 'camp') {
    // Camp Facility: Circle with bold "C"
    markerContentHtml = `
      <div class="w-10 h-10 rounded-full border-2 border-slate-900 bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-2xl">
        C
      </div>
    `;
  } else if (resourceTypeId === 'base') {
    // Base Facility: Circle with bold "B"
    markerContentHtml = `
      <div class="w-10 h-10 rounded-full border-2 border-slate-900 bg-sky-700 text-white flex items-center justify-center font-black text-lg shadow-2xl">
        B
      </div>
    `;
  } else {
    // Pure icon without circle background
    const enhancedSvg = ENHANCED_ICON_SVGS[resourceTypeId];

    markerContentHtml = `
      <div class="w-10 h-10 flex items-center justify-center relative filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.85)] hover:scale-115 transition-transform duration-200">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24">
          <g fill="none">${enhancedSvg}</g>
        </svg>
      </div>
    `;
  }

  const html = `
    <div class="relative group cursor-pointer transform hover:scale-110 transition-transform">
      ${markerContentHtml}

      ${quantity > 1 ? `
        <span class="absolute -top-1 -right-1 bg-slate-900 text-amber-300 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full border border-amber-400 shadow-md z-10 font-mono">
          x${quantity}
        </span>
      ` : ''}

      <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1.5 hidden group-hover:block z-50 pointer-events-none">
        <div class="bg-slate-900/95 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-2xl whitespace-nowrap border border-slate-700 backdrop-blur-sm">
          <div class="font-bold text-slate-100 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full" style="background-color: ${color}"></span>
            ${title}
          </div>
          <span class="block text-[10px] text-slate-300 font-normal mt-0.5">${resource.name}</span>
        </div>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
}