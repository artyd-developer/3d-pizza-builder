import type { Ingredient } from './PizzaModel.ts';

const GRID = 17;
const LAST = GRID - 1;

interface Patch {
  ingredientId: number;
  x: number;
  z: number;
  radius: number;
  age: number;
  height: Float32Array;
  velocity: Float32Array;
}

function smoothEdge(value: number): number {
  const x = Math.max(0, Math.min(1, value));
  return x * x * (3 - 2 * x);
}

export class CheesePhysics {
  private patches: Patch[] = [];

  get activeCount(): number { return this.patches.length; }

  affects(x: number, z: number): boolean {
    return this.patches.some((patch) => (x - patch.x) ** 2 + (z - patch.z) ** 2 < (patch.radius + 0.05) ** 2);
  }

  addImpact(item: Ingredient): void {
    const patch: Patch = {
      ingredientId: item.id, x: item.x, z: item.z,
      radius: Math.max(0.52, item.size * 2.8), age: 0,
      height: new Float32Array(GRID * GRID),
      velocity: new Float32Array(GRID * GRID),
    };
    for (let row = 1; row < LAST; row++) for (let col = 1; col < LAST; col++) {
      const nx = (col / LAST - 0.5) * 2;
      const nz = (row / LAST - 0.5) * 2;
      const radial = Math.hypot(nx, nz);
      if (radial >= 1) continue;
      const impulse = Math.exp(-radial * radial * 12);
      const index = row * GRID + col;
      patch.height[index] = -0.064 * impulse;
      patch.velocity[index] = -0.68 * impulse;
    }
    this.patches.push(patch);
    if (this.patches.length > 18) this.patches.shift();
  }

  step(dt: number): void {
    for (const patch of this.patches) {
      patch.age += dt;
      const nextHeight = patch.height.slice();
      const nextVelocity = patch.velocity.slice();
      for (let row = 1; row < LAST; row++) for (let col = 1; col < LAST; col++) {
        const nx = (col / LAST - 0.5) * 2;
        const nz = (row / LAST - 0.5) * 2;
        if (nx * nx + nz * nz >= 1) continue;
        const i = row * GRID + col;
        const height = patch.height[i];
        const laplacian = patch.height[i - 1] + patch.height[i + 1]
          + patch.height[i - GRID] + patch.height[i + GRID] - 4 * height;
        const acceleration = 115 * laplacian - 26 * height - 7.5 * patch.velocity[i];
        nextVelocity[i] += acceleration * dt;
        nextHeight[i] = Math.max(-0.082, Math.min(0.070, height + nextVelocity[i] * dt));
      }
      patch.height = nextHeight;
      patch.velocity = nextVelocity;
    }
    this.patches = this.patches.filter((patch) => {
      if (patch.age > 2.1) return false;
      if (patch.age < 0.45) return true;
      let energy = 0;
      for (let i = 0; i < patch.height.length; i++) {
        energy = Math.max(energy, Math.abs(patch.height[i]), Math.abs(patch.velocity[i]) * 0.03);
      }
      return energy > 0.001;
    });
  }

  sample(x: number, z: number): number {
    let result = 0;
    for (const patch of this.patches) {
      const nx = (x - patch.x) / patch.radius;
      const nz = (z - patch.z) / patch.radius;
      const radius = Math.hypot(nx, nz);
      if (radius >= 1) continue;
      const u = (nx * 0.5 + 0.5) * LAST;
      const v = (nz * 0.5 + 0.5) * LAST;
      const col = Math.min(LAST - 1, Math.floor(u));
      const row = Math.min(LAST - 1, Math.floor(v));
      const fx = u - col;
      const fz = v - row;
      const i = row * GRID + col;
      const h = patch.height;
      const top = h[i] * (1 - fx) + h[i + 1] * fx;
      const bottom = h[i + GRID] * (1 - fx) + h[i + GRID + 1] * fx;
      result += (top * (1 - fz) + bottom * fz) * smoothEdge((1 - radius) * 5);
    }
    return Math.max(-0.082, Math.min(0.070, result));
  }

  visualImpacts(limit = 8): Float32Array {
    const data = new Float32Array(limit * 4);
    this.patches.slice(0, limit).forEach((patch, index) => {
      let motion = 0;
      for (let i = 0; i < patch.height.length; i++) motion = Math.max(motion, Math.abs(patch.height[i]));
      data.set([patch.x, patch.z, patch.radius, Math.min(1, motion * 15)], index * 4);
    });
    return data;
  }

  removeImpact(ingredientId: number): void {
    this.patches = this.patches.filter((patch) => patch.ingredientId !== ingredientId);
  }

  clear(): void { this.patches = []; }
}
