import { LatLng } from '../types/route';

const centroid = (coords: LatLng[]): LatLng => {
  if (!coords?.length) return { latitude: 0, longitude: 0 };
  const lat = coords.reduce((s, c) => s + c.latitude, 0) / coords.length;
  const lng = coords.reduce((s, c) => s + c.longitude, 0) / coords.length;
  return { latitude: lat, longitude: lng };
}

export default centroid;