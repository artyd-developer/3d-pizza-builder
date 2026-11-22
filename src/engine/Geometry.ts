export interface MeshData {
  vertices: Float32Array;
  indices: Uint16Array;
}

const SEGMENTS = 120;

function seededIrregularity(angle: number): number {
  return 0.019 * Math.sin(angle * 7 + 0.4) + 0.014 * Math.sin(angle * 13 + 1.7)
    + 0.008 * Math.sin(angle * 29 + 0.6);
}

export function createDisk(radius: number, height: number, rings = 28): MeshData {
  const vertices: number[] = [];
  const indices: number[] = [];
  for (let ring = 0; ring <= rings; ring++) {
    const r = radius * ring / rings;
    for (let segment = 0; segment <= SEGMENTS; segment++) {
      const angle = segment / SEGMENTS * Math.PI * 2;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const uneven = ring > 0 ? 0.003 * Math.sin(x * 11 + z * 8) : 0;
      vertices.push(x, height + uneven, z, 0, 1, 0, x / 5.2 + 0.5, z / 5.2 + 0.5);
      if (ring < rings && segment < SEGMENTS) {
        const a = ring * (SEGMENTS + 1) + segment;
        const b = a + SEGMENTS + 1;
        indices.push(a, b, a + 1, a + 1, b, b + 1);
      }
    }
  }
  return { vertices: new Float32Array(vertices), indices: new Uint16Array(indices) };
}

export function createCrust(): MeshData {
  // A rounded cross-section creates real rim volume instead of a flat circle.
  const profile: Array<[number, number]> = [
    [2.00, 0.05], [2.10, 0.13], [2.18, 0.23], [2.29, 0.31],
    [2.42, 0.33], [2.51, 0.26], [2.56, 0.13], [2.55, -0.01],
    [2.49, -0.12], [2.36, -0.18], [2.18, -0.18], [2.04, -0.12],
  ];
  const vertices: number[] = [];
  const indices: number[] = [];
  for (let ring = 0; ring < profile.length; ring++) {
    const [radius, height] = profile[ring];
    const before = profile[Math.max(0, ring - 1)];
    const after = profile[Math.min(profile.length - 1, ring + 1)];
    const dr = after[0] - before[0];
    const dy = after[1] - before[1];
    const norm = Math.hypot(dr, dy) || 1;
    const nr = -dy / norm;
    const ny = dr / norm;
    for (let segment = 0; segment <= SEGMENTS; segment++) {
      const angle = segment / SEGMENTS * Math.PI * 2;
      const variation = seededIrregularity(angle);
      const r = radius + variation;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const bubble = 0.013 * Math.sin(angle * 37 + ring * 1.4);
      vertices.push(x, height + bubble, z, Math.cos(angle) * nr, ny, Math.sin(angle) * nr,
        segment / SEGMENTS, ring / (profile.length - 1));
      if (ring < profile.length - 1 && segment < SEGMENTS) {
        const a = ring * (SEGMENTS + 1) + segment;
        const b = a + SEGMENTS + 1;
        indices.push(a, a + 1, b, a + 1, b + 1, b);
      }
    }
  }
  return { vertices: new Float32Array(vertices), indices: new Uint16Array(indices) };
}
