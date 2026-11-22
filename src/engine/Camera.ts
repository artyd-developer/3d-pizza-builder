import { cross, lookAt, multiply, normalize, perspective, type Vec3 } from './math.ts';

const FOV = 42 * Math.PI / 180;

export class Camera {
  eye: Vec3 = [0, 6.5, 7.75];
  viewProjection: Float32Array = new Float32Array(16);
  width = 1;
  height = 1;

  resize(width: number, height: number): void {
    this.width = Math.max(1, width);
    this.height = Math.max(1, height);
    const aspect = this.width / this.height;
    const distance = 6.5 * Math.max(1, 1.15 / aspect);
    const elevation = 40 * Math.PI / 180;
    this.eye = [0, distance * Math.sin(elevation), distance * Math.cos(elevation)];
    this.viewProjection = multiply(perspective(FOV, aspect, 0.1, 60), lookAt(this.eye, [0, -0.5, 0], [0, 1, 0]));
  }

  // Unprojects a CSS pixel into the pizza plane; the same camera matrices drive rendering.
  planePoint(px: number, py: number): { x: number; z: number } | null {
    const nx = px / this.width * 2 - 1;
    const ny = 1 - py / this.height * 2;
    const forward = normalize([-this.eye[0], -this.eye[1], -this.eye[2]]);
    const right = normalize(cross(forward, [0, 1, 0]));
    const up = cross(right, forward);
    const spread = Math.tan(FOV / 2);
    const aspect = this.width / this.height;
    const ray = normalize([
      forward[0] + right[0] * nx * spread * aspect + up[0] * ny * spread,
      forward[1] + right[1] * nx * spread * aspect + up[1] * ny * spread,
      forward[2] + right[2] * nx * spread * aspect + up[2] * ny * spread,
    ]);
    if (ray[1] >= -0.0001) return null;
    const distance = -this.eye[1] / ray[1];
    return { x: this.eye[0] + ray[0] * distance, z: this.eye[2] + ray[2] * distance };
  }

  screenPoint(x: number, y: number, z: number): { x: number; y: number } {
    const m = this.viewProjection;
    const w = m[3] * x + m[7] * y + m[11] * z + m[15];
    const nx = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
    const ny = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
    return { x: (nx + 1) * this.width / 2, y: (1 - ny) * this.height / 2 };
  }
}
