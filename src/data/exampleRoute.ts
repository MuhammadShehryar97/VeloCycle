export const exampleRoute = {
  id: 'route-001',
  name: 'Night Patrol Alpha',
  startPoint: {
    id: 'sp-1',
    name: 'Base Office',
    order: 1,
    hits: 1,
    polygon: [
      { latitude: 51.5008, longitude: -0.1425 },
      { latitude: 51.5012, longitude: -0.1425 },
      { latitude: 51.5012, longitude: -0.1418 },
      { latitude: 51.5008, longitude: -0.1418 },
    ],
  },
  checkpoints: [
    {
      id: 'cp-1',
      name: 'Front Gate',
      order: 2,
      hits: 2,
      polygon: [
        { latitude: 51.5015, longitude: -0.1415 },
        { latitude: 51.5018, longitude: -0.1415 },
        { latitude: 51.5018, longitude: -0.1412 },
        { latitude: 51.5015, longitude: -0.1412 },
      ],
    },
    {
      id: 'cp-2',
      name: 'Loading Bay',
      order: 3,
      hits: 2,
      polygon: [
        { latitude: 51.5025, longitude: -0.1405 },
        { latitude: 51.5028, longitude: -0.1405 },
        { latitude: 51.5028, longitude: -0.14 },
        { latitude: 51.5025, longitude: -0.14 },
      ],
    },
  ],
  endPoint: {
    id: 'ep-1',
    name: 'Base Office',
    order: 4,
    hits: 1,
    polygon: [
      { latitude: 51.5008, longitude: -0.1425 },
      { latitude: 51.5012, longitude: -0.1425 },
      { latitude: 51.5012, longitude: -0.1418 },
      { latitude: 51.5008, longitude: -0.1418 },
    ],
  },
};


// 📍 ROUTE DATA
export const ROUTE_POINTS = [
  {
    id: 'SP',
    type: 'START',
    hitsRequired: 1,
    polygon: [
      { latitude: 33.6430, longitude: 73.0210 },
      { latitude: 33.6432, longitude: 73.0212 },
      { latitude: 33.6429, longitude: 73.0212 },
    ],
  },
  {
    id: 'CP1',
    type: 'CHECKPOINT',
    hitsRequired: 2,
    polygon: [
      { latitude: 33.7390, longitude: 73.0830 },
      { latitude: 33.7392, longitude: 73.0835 },
      { latitude: 33.7388, longitude: 73.0835 },
    ],
  },
  {
    id: 'CP2',
    type: 'CHECKPOINT',
    hitsRequired: 2,
    polygon: [
      { latitude: 33.7370, longitude: 73.0860 },
      { latitude: 33.7372, longitude: 73.0865 },
      { latitude: 33.7368, longitude: 73.0865 },
    ],
  },
  {
    id: 'EP',
    type: 'END',
    hitsRequired: 1,
    polygon: [
      { latitude: 33.7385, longitude: 73.0880 },
      { latitude: 33.7387, longitude: 73.0885 },
      { latitude: 33.7383, longitude: 73.0885 },
    ],
  },
];

