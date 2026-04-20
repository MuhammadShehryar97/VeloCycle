import { RoutePoint } from '../types/route';

const buildSequence = (points: RoutePoint[]): string[] => {
  const seq: string[] = ['SP'];

  const cps = [...points.filter(p => p.type === 'CHECKPOINT')].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  // Find max hits across all CPs
  const maxHits = Math.max(...cps.map(cp => cp.hitsRequired), 0);

  for (let hit = 0; hit < maxHits; hit++) {
    for (const cp of cps) {
      if (hit < cp.hitsRequired) {
        seq.push(cp.id);
      }
    }
  }

  seq.push('EP');
  return seq;
}

export default buildSequence;