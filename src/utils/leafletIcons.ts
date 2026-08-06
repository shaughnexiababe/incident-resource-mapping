import L from 'leaflet';
import { RESOURCE_CATALOG } from '@/data/camarinesNorteData';
import { ResourceTypeId } from '@/types/disaster';

// SVG paths for custom generic resource icons
const ICON_SVGS: Record<string, string> = {
  Ambulance: `<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v7c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/><path d="M10 6h4v4h-4z"/><path d="M12 6v4"/><path d="M10 8h4"/>`,
  Flame: `<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>`,
  Truck: `<rect width="16" height="13" x="1" y="3" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>`,
  ShieldAlert: `<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/>`,
  Cross: `<path d="M11 2a1 1 0 0 1 2 0v7h7a1 1 0 0 1 0 2h-7v7a1 1 0 0 1-2 0v-7H4a1 1 0 0 1 0-2h7V2z"/>`,
  UserCheck: `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>`,
  Users: `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
  UserCog: `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><circle cx="19" cy="11" r="2"/><path d="M19 8v1"/><path d="M19 13v1"/>`,
  MapPin: `<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>`
};

export function createMarkerIcon(resourceTypeId: ResourceTypeId, title: string, quantity: number = 1): L.DivIcon {
  const resource = RESOURCE_CATALOG.find((r) => r.id === resourceTypeId) || RESOURCE_CATALOG[0];
  const color = resource.color;

  let markerContentHtml = '';

  // Standard ICS Facility Map Symbology
  if (resourceTypeId === 'icp') {
    // Incident Command Post: Circle divided horizontally (Top Blue, Bottom White with ICP text)
    markerContentHtml = `
      <div class="w-10 h-10 rounded-full border-2 border-slate-900 shadow-xl overflow-hidden bg-white flex flex-col items-center justify-center relative">
        <div class="w-full h-1/2 bg-blue-600"></div>
        <div class="w-full h-1/2 bg-white"></div>
        <span class="absolute text-[11px] font-extrabold text-slate-900 tracking-tighter">ICP</span>
      </div>
    `;
  } else if (resourceTypeId === 'staging_area') {
    // Staging Area: Circle with bold "S"
    markerContentHtml = `
      <div class="w-10 h-10 rounded-full border-2 border-slate-900 bg-yellow-400 text-slate-950 flex items-center justify-center font-black text-lg shadow-xl">
        S
      </div>
    `;
  } else if (resourceTypeId === 'camp') {
    // Camp Facility: Circle with bold "C"
    markerContentHtml = `
      <div class="w-10 h-10 rounded-full border-2 border-slate-900 bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-xl">
        C
      </div>
    `;
  } else if (resourceTypeId === 'base') {
    // Base Facility: Circle with bold "B"
    markerContentHtml = `
      <div class="w-10 h-10 rounded-full border-2 border-slate-900 bg-sky-700 text-white flex items-center justify-center font-black text-lg shadow-xl">
        B
      </div>
    `;
  } else {
    // Standard vehicle or personnel resource icon
    const svgPath = ICON_SVGS[resource.iconName] || ICON_SVGS['MapPin'];
    markerContentHtml = `
      <div 
        class="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white shadow-lg text-white font-bold"
        style="background-color: ${color}; box-shadow: 0 4px 14px rgba(0,0,0,0.35);"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${svgPath}
        </svg>
      </div>
    `;
  }

  const html = `
    <div class="relative group cursor-pointer transform hover:scale-110 transition-transform">
      ${markerContentHtml}

      ${quantity > 1 ? `
        <span class="absolute -top-1 -right-1 bg-slate-900 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full border border-white shadow z-10">
          x${quantity}
        </span>
      ` : ''}

      <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block z-50 pointer-events-none">
        <div class="bg-slate-900 text-white text-xs px-2.5 py-1 rounded shadow-lg whitespace-nowrap border border-slate-700">
          <span class="font-bold text-slate-100">${title}</span>
          <span class="block text-[10px] text-slate-300 font-normal">${resource.name}</span>
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