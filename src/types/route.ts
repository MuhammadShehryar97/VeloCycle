export type LatLng = { latitude: number; longitude: number };

export type RoutePoint = {
  id: string;
  type: 'START' | 'CHECKPOINT' | 'END';
  polygon: LatLng[];
  hitsRequired: number;
  order?: number;
};

export type RunPhase = 'idle' | 'running' | 'completed';