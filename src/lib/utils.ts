import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Great-circle distance between two lat/lng points, in kilometers.
 *
 * Plain Math.hypot(latDiff, lngDiff) treats degrees of latitude and
 * longitude as equivalent distances, which is off by ~3% at Camarines
 * Norte's latitude (~14°N) and gets worse further from the equator or
 * across larger spans — enough to misassign a marker's nearest
 * municipality near a boundary. Haversine accounts for the Earth's
 * curvature and gives an accurate result regardless of latitude.
 */
export function haversineDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth radius in km
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
