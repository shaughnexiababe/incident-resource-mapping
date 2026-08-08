import * as L from 'leaflet';
import { RESOURCE_CATALOG } from '@/data/camarinesNorteData';
import { ResourceTypeId } from '@/types/disaster';

// Detailed SVG miniature figures for vehicles, aircraft, boats and personnel
export const ENHANCED_ICON_SVGS: Record<string, string> = {
  // Ambulance
  ambulance: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <rect x="7" y="2" width="4" height="2" fill="#ef4444" rx="0.5"/>
      <rect x="13" y="2" width="4" height="2" fill="#3b82f6" rx="0.5"/>
      <path d="M3 8 C3 6.5, 4.5 5, 6 5 L18 5 C19.5 5, 21 6.5, 21 8 L21 16 L3 16 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="0.8"/>
      <path d="M15 5 L20 9 L21 16 L15 16 Z" fill="#e2e8f0"/>
      <rect x="8" y="8" width="5" height="5" fill="#ef4444" rx="1"/>
      <path d="M10.5 9 L10.5 12 M9 10.5 L12 10.5" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round"/>
      <rect x="2" y="15" width="20" height="2" fill="#1e293b"/>
      <circle cx="7" cy="16" r="2.5" fill="#0f172a" stroke="#94a3b8" stroke-width="1"/>
      <circle cx="17" cy="16" r="2.5" fill="#0f172a" stroke="#94a3b8" stroke-width="1"/>
    </g>
  `,

  // Police Car
  police_car: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <path d="M8 2 L12 2 L12 4 L8 4 Z" fill="#ef4444"/>
      <path d="M12 2 L16 2 L16 4 L12 4 Z" fill="#2563eb"/>
      <path d="M5 10 L8 5 L16 5 L19 10 Z" fill="#1e293b"/>
      <path d="M9 6 L12 6 L12 9 L7 9 Z" fill="#38bdf8" opacity="0.8"/>
      <path d="M13 6 L15 6 L17 9 L13 9 Z" fill="#38bdf8" opacity="0.8"/>
      <path d="M2 10 L22 10 Q23 10 23 12 L22 15 L2 15 Z" fill="#2563eb"/>
      <polygon points="12,10 13,12 15,12 13.5,13 14,15 12,14 10,15 10.5,13 9,12 11,12" fill="#fbbf24"/>
      <circle cx="6" cy="15" r="2.5" fill="#0f172a" stroke="#94a3b8" stroke-width="1"/>
      <circle cx="18" cy="15" r="2.5" fill="#0f172a" stroke="#94a3b8" stroke-width="1"/>
    </g>
  `,

  // Fire Truck
  fire_truck: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <rect x="4" y="2" width="16" height="3" fill="#cbd5e1" stroke="#475569" stroke-width="0.5"/>
      <line x1="7" y1="2" x2="7" y2="5" stroke="#475569" stroke-width="0.8"/>
      <line x1="11" y1="2" x2="11" y2="5" stroke="#475569" stroke-width="0.8"/>
      <line x1="15" y1="2" x2="15" y2="5" stroke="#475569" stroke-width="0.8"/>
      <rect x="2" y="6" width="14" height="10" fill="#dc2626" rx="1"/>
      <path d="M16 8 L22 8 L22 16 L16 16 Z" fill="#ef4444"/>
      <rect x="17" y="9" width="4" height="3" fill="#38bdf8" rx="0.5"/>
      <rect x="4" y="8" width="4" height="6" fill="#b91c1c" stroke="#fca5a5" stroke-width="0.5"/>
      <rect x="9" y="8" width="4" height="6" fill="#b91c1c" stroke="#fca5a5" stroke-width="0.5"/>
      <circle cx="6" cy="16" r="2.5" fill="#0f172a" stroke="#94a3b8" stroke-width="1"/>
      <circle cx="13" cy="16" r="2.5" fill="#0f172a" stroke="#94a3b8" stroke-width="1"/>
      <circle cx="19" cy="16" r="2.5" fill="#0f172a" stroke="#94a3b8" stroke-width="1"/>
    </g>
  `,

  // Rescue Truck
  rescue_truck: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <path d="M3 9 L12 3 L14 5 L6 10 Z" fill="#f59e0b"/>
      <line x1="12" y1="3" x2="12" y2="9" stroke="#334155" stroke-width="1" stroke-dasharray="1,1"/>
      <polygon points="11,9 13,9 12,12" fill="#0284c7"/>
      <rect x="2" y="9" width="14" height="7" fill="#0891b2" rx="1"/>
      <path d="M16 10 L22 10 L22 16 L16 16 Z" fill="#06b6d4"/>
      <path d="M3 14 L5 16 M6 14 L8 16 M9 14 L11 16" stroke="#fef08a" stroke-width="1.2"/>
      <rect x="17" y="11" width="4" height="3" fill="#38bdf8"/>
      <circle cx="6" cy="16" r="2.8" fill="#0f172a" stroke="#06b6d4" stroke-width="1"/>
      <circle cx="18" cy="16" r="2.8" fill="#0f172a" stroke="#06b6d4" stroke-width="1"/>
    </g>
  `,

  // Air Asset: Helicopter
  helicopter: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <!-- Main Rotor Blade -->
      <line x1="2" y1="4" x2="22" y2="4" stroke="#93c5fd" stroke-width="2" stroke-linecap="round"/>
      <line x1="12" y1="4" x2="12" y2="7" stroke="#3b82f6" stroke-width="1.5"/>
      <!-- Fuselage -->
      <ellipse cx="10" cy="12" rx="7" ry="5" fill="#2563eb" stroke="#bfdbfe" stroke-width="0.8"/>
      <path d="M8 9 C11 9 13 10 13 12 C13 14 11 15 8 15 Z" fill="#93c5fd"/>
      <!-- Tail Boom -->
      <path d="M15 11 L22 10 L22 12 L15 13 Z" fill="#1d4ed8"/>
      <line x1="21" y1="7" x2="21" y2="15" stroke="#f43f5e" stroke-width="1.5"/>
      <!-- Landing Skids -->
      <line x1="5" y1="18" x2="15" y2="18" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="7" y1="17" x2="7" y2="18" stroke="#cbd5e1" stroke-width="1"/>
      <line x1="13" y1="17" x2="13" y2="18" stroke="#cbd5e1" stroke-width="1"/>
    </g>
  `,

  // Air Asset: Aircraft
  aircraft: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <!-- Fuselage -->
      <path d="M12 2 C10 6, 10 16, 10 20 L14 20 C14 16, 14 6, 12 2 Z" fill="#0284c7" stroke="#bae6fd" stroke-width="0.8"/>
      <!-- Main Wings -->
      <polygon points="12,8 2,14 4,16 12,12 20,16 22,14" fill="#0369a1"/>
      <!-- Tail Wings -->
      <polygon points="12,17 7,21 8,22 12,19 16,22 17,21" fill="#075985"/>
      <!-- Cockpit Window -->
      <ellipse cx="12" cy="6" rx="1.5" ry="2" fill="#7dd3fc"/>
    </g>
  `,

  // Water Asset: Rubber Boat / IRB
  rubber_boat: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <!-- Inflatable Tubes -->
      <path d="M3 10 C3 6 8 5 12 5 C16 5 21 6 21 10 C21 15 18 18 12 18 C6 18 3 15 3 10 Z" fill="#15803d" stroke="#86efac" stroke-width="1"/>
      <path d="M6 10 C6 8 9 7 12 7 C15 7 18 8 18 10 C18 13 15 15 12 15 C9 15 6 13 6 10 Z" fill="#166534"/>
      <!-- Outboard Motor -->
      <rect x="11" y="17" width="2" height="5" fill="#1e293b"/>
      <polygon points="10,21 14,21 12,23" fill="#f59e0b"/>
      <!-- Rescuers / Paddles -->
      <circle cx="9" cy="10" r="1.5" fill="#facc15"/>
      <circle cx="15" cy="10" r="1.5" fill="#facc15"/>
    </g>
  `,

  // Water Asset: Coast Guard Vessel
  patrol_vessel: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <!-- Hull -->
      <path d="M2 14 L5 8 L18 8 L22 14 L18 18 L5 18 Z" fill="#1e3a8a" stroke="#bfdbfe" stroke-width="0.8"/>
      <!-- Coast Guard Diagonal Orange Stripe -->
      <polygon points="7,8 10,8 8,18 5,18" fill="#ea580c"/>
      <!-- Superstructure / Cabin -->
      <rect x="10" y="4" width="7" height="4" fill="#ffffff" rx="0.5"/>
      <rect x="12" y="5" width="2" height="2" fill="#38bdf8"/>
      <!-- Radar Mast -->
      <line x1="13" y1="1" x2="13" y2="4" stroke="#facc15" stroke-width="1"/>
      <line x1="11" y1="2" x2="15" y2="2" stroke="#facc15" stroke-width="1"/>
    </g>
  `,

  // Heavy Equipment / Excavator
  heavy_equipment: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <!-- Continuous Tracks -->
      <rect x="3" y="14" width="16" height="5" fill="#1e293b" rx="2" stroke="#f59e0b" stroke-width="0.8"/>
      <circle cx="6" cy="16.5" r="1" fill="#cbd5e1"/>
      <circle cx="11" cy="16.5" r="1" fill="#cbd5e1"/>
      <circle cx="16" cy="16.5" r="1" fill="#cbd5e1"/>
      <!-- Cab -->
      <rect x="6" y="8" width="7" height="6" fill="#d97706" rx="1"/>
      <rect x="7" y="9" width="3" height="3" fill="#bae6fd"/>
      <!-- Boom Arm & Bucket -->
      <path d="M12 10 L18 4 L22 8 L20 13 Z" fill="#b45309"/>
      <path d="M20 13 L23 15 L21 18 Z" fill="#f59e0b"/>
    </g>
  `,

  // Water Tanker Lorry
  water_tanker: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <!-- Cylindrical Water Tank -->
      <rect x="2" y="5" width="13" height="10" fill="#0284c7" rx="4" stroke="#e0f2fe" stroke-width="0.8"/>
      <path d="M4 10 Q8 12 13 10" stroke="#bae6fd" stroke-width="1.2" fill="none"/>
      <!-- Truck Cab -->
      <rect x="15" y="8" width="7" height="7" fill="#0369a1" rx="1"/>
      <rect x="17" y="9" width="4" height="3" fill="#7dd3fc"/>
      <!-- Wheels -->
      <circle cx="5" cy="16" r="2.5" fill="#0f172a" stroke="#94a3b8" stroke-width="1"/>
      <circle cx="11" cy="16" r="2.5" fill="#0f172a" stroke="#94a3b8" stroke-width="1"/>
      <circle cx="18" cy="16" r="2.5" fill="#0f172a" stroke="#94a3b8" stroke-width="1"/>
    </g>
  `,

  // Mobile Comms Command Truck
  comms_truck: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <!-- Satellite Dish Mast -->
      <line x1="8" y1="1" x2="8" y2="7" stroke="#a855f7" stroke-width="1.5"/>
      <path d="M5 2 C5 4 11 4 11 2 Z" fill="#d8b4fe"/>
      <!-- Van Body -->
      <rect x="2" y="7" width="14" height="9" fill="#6b21a8" rx="1"/>
      <rect x="16" y="9" width="6" height="7" fill="#7e22ce" rx="1"/>
      <rect x="17" y="10" width="3" height="3" fill="#e9d5ff"/>
      <!-- Wheels -->
      <circle cx="6" cy="16" r="2.5" fill="#0f172a" stroke="#c084fc" stroke-width="1"/>
      <circle cx="18" cy="16" r="2.5" fill="#0f172a" stroke="#c084fc" stroke-width="1"/>
    </g>
  `,

  // Medical Team
  medics: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <path d="M12 2 L20 5 L20 12 C20 17 12 21 12 21 C12 21 4 17 4 12 L4 5 Z" fill="#be185d" stroke="#fbcfe8" stroke-width="1"/>
      <rect x="10" y="6" width="4" height="10" fill="#ffffff" rx="1"/>
      <rect x="7" y="9" width="10" height="4" fill="#ffffff" rx="1"/>
      <path d="M5 14 L8 14 L9.5 10 L11 17 L12.5 12 L14 15 L15.5 14 L19 14" fill="none" stroke="#f43f5e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  `,

  // PNP Personnel
  pnp_personnel: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <path d="M12 1 L15 5 L20 5 L16.5 9 L18 14 L12 11 L6 14 L7.5 9 L4 5 L9 5 Z" fill="#1e3a8a" stroke="#fbbf24" stroke-width="1.2"/>
      <path d="M12 6 C10 6 8.5 7.5 8.5 10 C8.5 13.5 12 16 12 16 C12 16 15.5 13.5 15.5 10 C15.5 7.5 14 6 12 6 Z" fill="#f59e0b"/>
      <circle cx="12" cy="10" r="2" fill="#ffffff"/>
      <polygon points="12,8.5 12.6,9.6 13.8,9.6 12.8,10.3 13.2,11.5 12,10.7 10.8,11.5 11.2,10.3 10.2,9.6 11.4,9.6" fill="#1d4ed8"/>
    </g>
  `,

  // BFP Personnel
  bfp_personnel: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <path d="M12 2 L20 6 L18 17 C18 17 12 21 12 21 C12 21 6 17 6 17 L4 6 Z" fill="#c2410c" stroke="#fde047" stroke-width="1"/>
      <path d="M7 11 C7 7 17 7 17 11 L19 12 L5 12 Z" fill="#f97316"/>
      <path d="M10 7 C10 5 14 5 14 7 Z" fill="#fef08a"/>
      <path d="M12 12 C10 14 10 16 12 18 C14 16 14 14 12 12 Z" fill="#facc15"/>
      <path d="M12 14 C11 15 11 16 12 17 C13 16 13 15 12 14 Z" fill="#ef4444"/>
    </g>
  `,

  // AFP Personnel
  afp_personnel: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <path d="M12 2 L21 6 L21 13 C21 18 12 22 12 22 C12 22 3 18 3 13 L3 6 Z" fill="#14532d" stroke="#4ade80" stroke-width="1"/>
      <path d="M7 8 L12 12 L17 8" fill="none" stroke="#facc15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M7 11 L12 15 L17 11" fill="none" stroke="#facc15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <polygon points="12,15 12.8,16.5 14.5,16.5 13.1,17.5 13.6,19 12,18 10.4,19 10.9,17.5 9.5,16.5 11.2,16.5" fill="#ffffff"/>
    </g>
  `,

  // Philippine Coast Guard Personnel
  pcg_personnel: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <path d="M12 2 L21 6 L21 13 C21 18 12 22 12 22 C12 22 3 18 3 13 L3 6 Z" fill="#1d4ed8" stroke="#93c5fd" stroke-width="1"/>
      <path d="M12 6 C9 6 7 8 7 11 C7 14 12 17 12 17 C12 17 17 14 17 11 C17 8 15 6 12 6 Z" fill="#ea580c"/>
      <circle cx="12" cy="11" r="2.5" fill="#ffffff"/>
      <path d="M12 9.5 L12 12.5 M10.5 11 L13.5 11" stroke="#1d4ed8" stroke-width="1.2"/>
    </g>
  `,

  // Philippine Air Force Personnel
  paf_personnel: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <path d="M12 2 L21 6 L21 13 C21 18 12 22 12 22 C12 22 3 18 3 13 L3 6 Z" fill="#0284c7" stroke="#bae6fd" stroke-width="1"/>
      <!-- Aviator Wings Insignia -->
      <polygon points="12,8 5,12 8,13 12,10 16,13 19,12" fill="#facc15"/>
      <circle cx="12" cy="14" r="2" fill="#ffffff"/>
      <circle cx="12" cy="14" r="1" fill="#dc2626"/>
    </g>
  `,

  // Emergency Comms & Radio Group
  comms_group: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <path d="M12 2 L20 6 L20 18 L12 22 L4 18 L4 6 Z" fill="#7e22ce" stroke="#f3e8ff" stroke-width="1"/>
      <!-- Antenna Radio Waves -->
      <line x1="12" y1="6" x2="12" y2="15" stroke="#fde047" stroke-width="1.8"/>
      <circle cx="12" cy="5" r="1" fill="#fde047"/>
      <path d="M8 8 C10 6 14 6 16 8" stroke="#fde047" stroke-width="1.2" fill="none"/>
      <path d="M6 11 C9 8 15 8 18 11" stroke="#fde047" stroke-width="1.2" fill="none"/>
    </g>
  `,

  // Volunteer & NGO Group
  volunteer_group: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <path d="M12 2 C7 2 3 6 3 11 C3 16 12 22 12 22 C12 22 21 16 21 11 C21 6 17 2 12 2 Z" fill="#0d9488" stroke="#99f6e4" stroke-width="1"/>
      <!-- Helping Hands Heart -->
      <path d="M12 8 C10 6 7 7 7 10 C7 13 12 16 12 16 C12 16 17 13 17 10 C17 7 14 6 12 8 Z" fill="#f43f5e"/>
    </g>
  `,

  // K9 Search & Rescue Team
  k9_team: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <path d="M12 2 L20 6 L20 18 L12 22 L4 18 L4 6 Z" fill="#b45309" stroke="#fef3c7" stroke-width="1"/>
      <!-- Dog Paw Print -->
      <ellipse cx="12" cy="14" rx="2.5" ry="2" fill="#ffffff"/>
      <circle cx="8.5" cy="10" r="1" fill="#ffffff"/>
      <circle cx="11" cy="8.5" r="1" fill="#ffffff"/>
      <circle cx="13" cy="8.5" r="1" fill="#ffffff"/>
      <circle cx="15.5" cy="10" r="1" fill="#ffffff"/>
    </g>
  `,

  // --- Logistics & Event Assets ---

  tent_large: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <path d="M2 18 L12 4 L22 18 Z" fill="#475569" stroke="#cbd5e1" stroke-width="1"/>
      <path d="M12 4 L12 18" stroke="#334155" stroke-width="1.5"/>
      <path d="M7 11 L17 11" stroke="#334155" stroke-width="1"/>
      <path d="M12 4 L7 18 M12 4 L17 18" stroke="#334155" stroke-width="0.8"/>
      <rect x="10" y="14" width="4" height="4" fill="#1e293b"/>
    </g>
  `,

  tent_small: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <path d="M4 18 L12 8 L20 18 Z" fill="#64748b" stroke="#cbd5e1" stroke-width="1"/>
      <path d="M12 8 L12 18" stroke="#334155" stroke-width="1"/>
      <rect x="11" y="15" width="2" height="3" fill="#1e293b"/>
    </g>
  `,

  first_aid_post: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <rect x="3" y="3" width="18" height="18" rx="2" fill="#ef4444" stroke="#fee2e2" stroke-width="1"/>
      <rect x="10" y="7" width="4" height="10" fill="#ffffff" rx="0.5"/>
      <rect x="7" y="10" width="10" height="4" fill="#ffffff" rx="0.5"/>
    </g>
  `,

  hydration_station: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <path d="M12 4 C12 4 6 10 6 14 C6 17.3 8.7 20 12 20 C15.3 20 18 17.3 18 14 C18 10 12 4 12 4Z" fill="#0ea5e9" stroke="#e0f2fe" stroke-width="1"/>
      <path d="M10 14 Q12 16 14 14" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" fill="none"/>
      <rect x="7" y="2" width="10" height="2" fill="#334155" rx="0.5"/>
    </g>
  `,

  security_checkpoint: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <path d="M12 2 L4 5 V11 C4 16.5 7.5 20.2 12 22 C16.5 20.2 20 16.5 20 11 V5 L12 2Z" fill="#1e3a8a" stroke="#bfdbfe" stroke-width="1"/>
      <path d="M9 12 L11 14 L15 10" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </g>
  `,

  generator_power: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <rect x="3" y="6" width="18" height="12" rx="1" fill="#eab308" stroke="#422006" stroke-width="1"/>
      <path d="M13 2 L8 10 L11 10 L6 18" stroke="#422006" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="6" cy="18" r="2" fill="#1e293b"/>
      <circle cx="18" cy="18" r="2" fill="#1e293b"/>
    </g>
  `,

  light_tower: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <rect x="11" y="8" width="2" height="12" fill="#94a3b8"/>
      <path d="M6 8 L18 8 L15 4 L9 4 Z" fill="#facc15" stroke="#422006" stroke-width="0.8"/>
      <circle cx="12" cy="6" r="2" fill="#ffffff" opacity="0.8"/>
      <rect x="8" y="18" width="8" height="4" fill="#334155" rx="1"/>
    </g>
  `,

  toilet_mobile: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <rect x="6" y="4" width="12" height="16" rx="1" fill="#10b981" stroke="#064e3b" stroke-width="1"/>
      <rect x="8" y="7" width="2" height="1" fill="#ffffff" opacity="0.5"/>
      <line x1="12" y1="4" x2="12" y2="20" stroke="#064e3b" stroke-width="0.5"/>
      <circle cx="13.5" cy="12" r="0.8" fill="#064e3b"/>
    </g>
  `,

  barrier_crowd: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <rect x="2" y="8" width="20" height="8" rx="1" fill="none" stroke="#334155" stroke-width="1.5"/>
      <line x1="6" y1="8" x2="6" y2="16" stroke="#334155" stroke-width="1"/>
      <line x1="10" y1="8" x2="10" y2="16" stroke="#334155" stroke-width="1"/>
      <line x1="14" y1="8" x2="14" y2="16" stroke="#334155" stroke-width="1"/>
      <line x1="18" y1="8" x2="18" y2="16" stroke="#334155" stroke-width="1"/>
      <line x1="4" y1="16" x2="4" y2="21" stroke="#334155" stroke-width="1.5"/>
      <line x1="20" y1="16" x2="20" y2="21" stroke="#334155" stroke-width="1.5"/>
    </g>
  `,

  info_kiosk: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <circle cx="12" cy="12" r="10" fill="#8b5cf6" stroke="#ede9fe" stroke-width="1"/>
      <rect x="11" y="9" width="2" height="7" fill="#ffffff" rx="0.5"/>
      <circle cx="12" cy="6.5" r="1.5" fill="#ffffff"/>
    </g>
  `,

  event_stage: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <rect x="2" y="14" width="20" height="6" fill="#f43f5e" rx="1"/>
      <path d="M4 14 L4 4 L20 4 L20 14" fill="none" stroke="#f43f5e" stroke-width="1.5"/>
      <rect x="8" y="2" width="8" height="3" fill="#334155"/>
      <circle cx="6" cy="10" r="1.5" fill="#facc15"/>
      <circle cx="18" cy="10" r="1.5" fill="#facc15"/>
    </g>
  `,

  concession_stand: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <rect x="4" y="10" width="16" height="10" fill="#d97706" rx="1"/>
      <path d="M3 10 L12 4 L21 10 Z" fill="#b45309"/>
      <rect x="7" y="13" width="10" height="4" fill="#fef3c7"/>
      <path d="M9 13 V17 M12 13 V17 M15 13 V17" stroke="#b45309" stroke-width="0.5"/>
    </g>
  `,

  vip_area: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <polygon points="12,2 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8" fill="#eab308" stroke="#78350f" stroke-width="1"/>
      <circle cx="12" cy="12" r="3" fill="#ffffff" opacity="0.5"/>
    </g>
  `,

  media_center: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <rect x="4" y="6" width="12" height="10" rx="1" fill="#7c3aed"/>
      <circle cx="18" cy="11" r="4" fill="#7c3aed"/>
      <rect x="7" y="8" width="6" height="4" fill="#ffffff" opacity="0.3"/>
      <path d="M18 9 L22 7 V15 L18 13 Z" fill="#6d28d9"/>
    </g>
  `,

  parade_marker: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <line x1="6" y1="2" x2="6" y2="22" stroke="#334155" stroke-width="2"/>
      <path d="M6 4 L20 9 L6 14 Z" fill="#10b981" stroke="#064e3b" stroke-width="1"/>
      <circle cx="6" cy="4" r="1.5" fill="#334155"/>
    </g>
  `,

  lost_found: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <circle cx="10" cy="10" r="7" fill="none" stroke="#6366f1" stroke-width="2.5"/>
      <line x1="15" y1="15" x2="21" y2="21" stroke="#6366f1" stroke-width="3" stroke-linecap="round"/>
      <text x="7" y="13" font-family="Arial" font-size="8" fill="#6366f1" font-weight="bold">?</text>
    </g>
  `,

  evacuation_center: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <path d="M3 10 L12 2 L21 10 V20 H3 Z" fill="#16a34a" stroke="#dcfce7" stroke-width="1"/>
      <rect x="10" y="14" width="4" height="6" fill="#dcfce7"/>
      <path d="M12 7 L15 10 H9 Z" fill="#ffffff"/>
    </g>
  `,

  triage_facility: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <rect x="2" y="6" width="20" height="14" rx="2" fill="#ef4444" stroke="#fee2e2" stroke-width="1"/>
      <path d="M6 13 H18" stroke="#ffffff" stroke-width="2"/>
      <path d="M12 9 V17" stroke="#ffffff" stroke-width="2"/>
      <path d="M4 6 L8 2 H16 L20 6" fill="none" stroke="#ef4444" stroke-width="1.5"/>
    </g>
  `,

  distribution_point: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <path d="M4 8 L12 4 L20 8 V18 L12 22 L4 18 Z" fill="#0ea5e9" stroke="#e0f2fe" stroke-width="1"/>
      <path d="M4 8 L12 12 L20 8 M12 12 V22" stroke="#e0f2fe" stroke-width="1"/>
      <path d="M8 6 L16 10" stroke="#ffffff" stroke-width="0.5" opacity="0.5"/>
    </g>
  `,

  morgue_temp: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <rect x="4" y="4" width="16" height="16" rx="2" fill="#475569" stroke="#94a3b8" stroke-width="1"/>
      <path d="M12 8 C10 8 8 10 8 12 C8 14 10 16 12 16 C14 16 16 14 16 12 C16 10 14 8 12 8 Z" fill="#94a3b8"/>
      <circle cx="10.5" cy="11.5" r="1.5" fill="#334155"/>
      <circle cx="13.5" cy="11.5" r="1.5" fill="#334155"/>
      <path d="M10 14.5 Q12 15.5 14 14.5" stroke="#334155" stroke-width="1" fill="none"/>
    </g>
  `,

  decon_station: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <rect x="4" y="4" width="16" height="14" fill="#06b6d4" opacity="0.3"/>
      <path d="M4 4 V18 M20 4 V18" stroke="#06b6d4" stroke-width="2"/>
      <path d="M4 4 H20" stroke="#06b6d4" stroke-width="2"/>
      <path d="M7 8 Q12 10 17 8 M7 12 Q12 14 17 12 M7 16 Q12 18 17 16" stroke="#ffffff" stroke-width="1" fill="none"/>
      <circle cx="12" cy="2" r="1" fill="#06b6d4"/>
    </g>
  `,

  // Map Text Label
  map_label: `
    <g transform="translate(1.5, 1.5) scale(0.88)">
      <path d="M4 7 V17 M4 7 H12 M4 12 H10 M20 7 V17 M15 7 H20" stroke="#334155" stroke-width="2.5" stroke-linecap="round"/>
    </g>
  `
};

export function createMarkerIcon(
  resourceTypeId: ResourceTypeId, 
  title: string, 
  quantity: number = 1,
  size: number = 40
): L.DivIcon {
  const resource = RESOURCE_CATALOG.find((r) => r.id === resourceTypeId) || RESOURCE_CATALOG[0];
  const color = resource.color;

  let markerContentHtml = '';

  const fontSize = Math.max(10, Math.round(size * 0.35));

  // Standard ICS Cartographic Facility Symbology
  if (resourceTypeId === 'icp') {
    markerContentHtml = `
      <div style="width:${size}px; height:${size}px;" class="rounded-full border-2 border-slate-900 shadow-2xl overflow-hidden bg-white flex flex-col items-center justify-center relative">
        <div class="w-full h-1/2 bg-blue-600"></div>
        <div class="w-full h-1/2 bg-white"></div>
        <span style="font-size:${fontSize}px;" class="absolute font-extrabold text-slate-950 tracking-tighter">ICP</span>
      </div>
    `;
  } else if (resourceTypeId === 'staging_area') {
    markerContentHtml = `
      <div style="width:${size}px; height:${size}px; font-size:${Math.round(size * 0.45)}px;" class="rounded-full border-2 border-slate-900 bg-white text-slate-950 flex items-center justify-center font-black shadow-2xl">
        S
      </div>
    `;
  } else if (resourceTypeId === 'camp') {
    markerContentHtml = `
      <div style="width:${size}px; height:${size}px; font-size:${Math.round(size * 0.45)}px;" class="rounded-full border-2 border-slate-900 bg-white text-slate-950 flex items-center justify-center font-black shadow-2xl">
        C
      </div>
    `;
  } else if (resourceTypeId === 'base') {
    markerContentHtml = `
      <div style="width:${size}px; height:${size}px; font-size:${Math.round(size * 0.45)}px;" class="rounded-full border-2 border-slate-900 bg-white text-slate-950 flex items-center justify-center font-black shadow-2xl">
        B
      </div>
    `;
  } else if (resourceTypeId === 'helibase') {
    markerContentHtml = `
      <div style="width:${size}px; height:${size}px;" class="rounded-full border-2 border-slate-900 bg-white text-slate-950 flex items-center justify-center relative shadow-2xl overflow-visible">
        <div class="absolute -top-1 w-0.5 h-3 bg-slate-900"></div>
        <div class="absolute -bottom-1 -left-0.5 w-3 h-0.5 bg-slate-900 transform -rotate-30"></div>
        <div class="absolute -bottom-1 -right-0.5 w-3 h-0.5 bg-slate-900 transform rotate-30"></div>
        <span style="font-size:${Math.round(size * 0.45)}px;" class="font-black text-slate-950 z-10">H</span>
      </div>
    `;
  } else if (resourceTypeId === 'helispot') {
    markerContentHtml = `
      <div style="width:${size}px; height:${size}px; font-size:${Math.round(size * 0.38)}px;" class="rounded-full border-2 border-slate-900 bg-white text-slate-950 flex items-center justify-center font-black shadow-2xl">
        H1
      </div>
    `;
  } else if (resourceTypeId === 'medical_post') {
    markerContentHtml = `
      <div style="width:${size}px; height:${size}px; font-size:${Math.round(size * 0.4)}px;" class="rounded-full border-2 border-slate-900 bg-white text-slate-950 flex items-center justify-center font-black relative shadow-2xl">
        <span>M</span>
        <span class="absolute top-0.5 right-1 w-2 h-2 rounded-full bg-red-600"></span>
      </div>
    `;
  } else if (resourceTypeId === 'eoc') {
    markerContentHtml = `
      <div style="width:${size}px; height:${size}px; font-size:${Math.round(size * 0.28)}px;" class="rounded-full border-2 border-slate-900 bg-white text-slate-950 flex items-center justify-center font-black tracking-tight shadow-2xl">
        EOC
      </div>
    `;
  } else if (resourceTypeId === 'map_label') {
    markerContentHtml = `
      <div class="bg-white/90 border-2 border-slate-800 rounded px-2 py-1 shadow-xl whitespace-nowrap min-w-max flex items-center justify-center group-hover:scale-105 transition-transform">
        <span class="text-slate-900 font-bold text-sm tracking-tight">${title}</span>
      </div>
    `;
  } else {
    // Pure icon without circle background for vehicles and personnel
    const enhancedSvg = ENHANCED_ICON_SVGS[resourceTypeId] || '';

    markerContentHtml = `
      <div style="width:${size}px; height:${size}px;" class="flex items-center justify-center relative filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.85)] hover:scale-115 transition-transform duration-200">
        <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
          <g fill="none">${enhancedSvg}</g>
        </svg>
      </div>
    `;
  }

  const html = `
    <div class="relative group cursor-pointer transform hover:scale-110 transition-transform">
      ${markerContentHtml}

      ${quantity > 1 && resourceTypeId !== 'map_label' ? `
        <span class="absolute -top-1 -right-1 bg-slate-900 text-amber-300 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full border border-amber-400 shadow-md z-10 font-mono">
          x${quantity}
        </span>
      ` : ''}

      ${resourceTypeId !== 'map_label' ? `
      <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1.5 hidden group-hover:block z-50 pointer-events-none">
        <div class="bg-slate-900/95 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-2xl whitespace-nowrap border border-slate-700 backdrop-blur-sm">
          <div class="font-bold text-slate-100 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full" style="background-color: ${color}"></span>
            ${title}
          </div>
          <span class="block text-[10px] text-slate-300 font-normal mt-0.5">${resource.name}</span>
        </div>
      </div>
      ` : ''}
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}