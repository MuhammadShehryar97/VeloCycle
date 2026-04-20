import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point, polygon } from '@turf/turf';

import { LatLng } from '../types/route';

const isInsidePolygon = (userLoc: LatLng | null, polygonCoords?: LatLng[]): boolean => {
  if (!userLoc || !polygonCoords?.length) return false;
  let coords = polygonCoords.map(c => [c.longitude, c.latitude] as [number, number]);
  if (
    coords[0][0] !== coords[coords.length - 1][0] ||
    coords[0][1] !== coords[coords.length - 1][1]
  ) {
    coords.push(coords[0]);
  }
  if (coords.length < 4) return false;
  try {
    const pt = point([userLoc.longitude, userLoc.latitude]);
    const poly = polygon([coords]);
    return booleanPointInPolygon(pt, poly);
  } catch {
    return false;
  }
}

export default isInsidePolygon;