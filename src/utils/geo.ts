import { CITIES } from '@/data/routes';

export interface Coordinates {
  lat: number;
  lng: number;
}

const EARTH_RADIUS_KM = 6371;

export function getDistanceKm(from: Coordinates, to: Coordinates): number {
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((from.lat * Math.PI) / 180) *
      Math.cos((to.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

export function findNearestCity(coords: Coordinates): string {
  let nearest = CITIES[0];
  let minDistance = Infinity;

  for (const city of CITIES) {
    const distance = getDistanceKm(coords, { lat: city.lat, lng: city.lng });
    if (distance < minDistance) {
      minDistance = distance;
      nearest = city;
    }
  }

  return nearest.name;
}

export function getCityCoordinates(cityName: string): Coordinates | null {
  const city = CITIES.find((item) => item.name === cityName);
  if (!city) {
    return null;
  }

  return { lat: city.lat, lng: city.lng };
}
