import { Camera } from './Camera';
import { createCrust, createDisk, type MeshData } from './Geometry';
import { materialFragment, materialVertex } from './materialShaders';
import type { PizzaModel } from './PizzaModel';
import { createProgram } from './ShaderProgram';
import { SpriteRenderer } from './SpriteRenderer';
import { CheesePhysics } from './CheesePhysics';
import { SteamRenderer } from './SteamRenderer';

interface GpuMesh {
  vao: WebGLVertexArrayObject;
  buffer: WebGLBuffer;
  index: WebGLBuffer;
  count: number;
  material: number;
  data: MeshData;
}

function baseCheeseHeight(x: number, z: number): number {
  const edge = Math.min(1, Math.hypot(x, z) / 2.025);
  return 0.13 - 0.042 * Math.pow(edge, 4)
    + 0.004 * Math.sin(x * 7.1 + z * 3.8) * Math.cos(z * 5.3);
}

export class PizzaRenderer {
  readonly ready: Promise<void>;
  readonly gl: WebGL2RenderingContext;
  readonly camera = new Camera();
  private program: WebGLProgram;
  private meshes: GpuMesh[];
  private viewProjectionLocation: WebGLUniformLocation | null;
  private materialLocation: WebGLUniformLocation | null;
  private selectedLocation: WebGLUniformLocation | null;
  private timeLocation: WebGLUniformLocation | null;
  private impactCountLocation: WebGLUniformLocation | null;
  private impactsLocation: WebGLUniformLocation | null;
  private cheeseTextureLocation: WebGLUniformLocation | null;
  private hasCheeseTextureLocation: WebGLUniformLocation | null;
  private cheeseTexture: WebGLTexture;
  private cheeseImageLoaded = false;
  private alive = true;
  private sprites: SpriteRenderer;
  private steam: SteamRenderer;
  private cheeseWasActive = false;
  private dirtyCheeseVertices = new Set<number>();

  constructor(readonly canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl2', { alpha: true, antialias: true });
    if (!gl) throw new Error('WebGL 2.0 is unavailable in this browser.');
    this.gl = gl;
    this.program = createProgram(gl, materialVertex, materialFragment);
    this.viewProjectionLocation = gl.getUniformLocation(this.program, 'uViewProjection');
    this.materialLocation = gl.getUniformLocation(this.program, 'uMaterial');
    this.selectedLocation = gl.getUniformLocation(this.program, 'uSelected');
    this.timeLocation = gl.getUniformLocation(this.program, 'uTime');
    this.impactCountLocation = gl.getUniformLocation(this.program, 'uImpactCount');
    this.impactsLocation = gl.getUniformLocation(this.program, 'uImpacts[0]');
    this.cheeseTextureLocation = gl.getUniformLocation(this.program, 'uCheeseTexture');
    this.hasCheeseTextureLocation = gl.getUniformLocation(this.program, 'uHasCheeseTexture');
    const cheeseTexture = gl.createTexture();
    if (!cheeseTexture) throw new Error('Unable to allocate the cheese material texture.');
    this.cheeseTexture = cheeseTexture;
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, cheeseTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    const cheeseImage = new Image();
    const cheeseReady = new Promise<void>((resolve) => {
    cheeseImage.onload = () => {
      if (!this.alive) return;
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, cheeseTexture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cheeseImage);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.generateMipmap(gl.TEXTURE_2D);
      this.cheeseImageLoaded = true;
      resolve();
    };
    cheeseImage.onerror = () => resolve();
    });
    cheeseImage.src = `${import.meta.env.BASE_URL}materials/cheese.png`;
    this.meshes = [
      this.makeMesh(createDisk(2.35, -0.15), 0),
      this.makeMesh(createDisk(2.20, 0.015), 0),
      this.makeMesh(createDisk(2.12, 0.042), 2),
      this.makeMesh(createDisk(2.025, 0.13), 3),
      this.makeMesh(createCrust(), 1),
    ];
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    this.updateCheese(new CheesePhysics(), true);
    this.sprites = new SpriteRenderer(gl);
    this.ready = Promise.all([cheeseReady, this.sprites.ready]).then(() => {});
    this.steam = new SteamRenderer(gl);
  }

  private makeMesh(data: MeshData, material: number): GpuMesh {
    const gl = this.gl;
    const vao = gl.createVertexArray();
    const buffer = gl.createBuffer();
    const index = gl.createBuffer();
    if (!vao || !buffer || !index) throw new Error('Unable to allocate WebGL geometry.');
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data.vertices, material === 3 ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data.indices, gl.STATIC_DRAW);
    const stride = 8 * Float32Array.BYTES_PER_ELEMENT;
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, stride, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, stride, 3 * 4);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, false, stride, 6 * 4);
    gl.bindVertexArray(null);
    return { vao, buffer, index, count: data.indices.length, material, data };
  }

  private resize(): void {
    const gl = this.gl;
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
      this.camera.resize(rect.width, rect.height);
    }
    gl.viewport(0, 0, width, height);
  }

  private updateCheese(cheese: CheesePhysics, initialize = false): void {
    const mesh = this.meshes[3];
    const vertices = mesh.data.vertices;
    const normalStep = 0.045;
    const nextDirty = new Set<number>();
    for (let i = 0; i < vertices.length; i += 8) {
      const x = vertices[i];
      const z = vertices[i + 2];
      if (!initialize && !cheese.affects(x, z)) continue;
      nextDirty.add(i);
    }
    const toUpdate = new Set([...this.dirtyCheeseVertices, ...nextDirty]);
    for (const i of toUpdate) {
      const x = vertices[i];
      const z = vertices[i + 2];
      vertices[i + 1] = baseCheeseHeight(x, z) + cheese.sample(x, z);
      const slopeX = (baseCheeseHeight(x + normalStep, z) + cheese.sample(x + normalStep, z)
        - baseCheeseHeight(x - normalStep, z) - cheese.sample(x - normalStep, z)) / (2 * normalStep);
      const slopeZ = (baseCheeseHeight(x, z + normalStep) + cheese.sample(x, z + normalStep)
        - baseCheeseHeight(x, z - normalStep) - cheese.sample(x, z - normalStep)) / (2 * normalStep);
      const length = Math.hypot(slopeX, 1, slopeZ);
      vertices[i + 3] = -slopeX / length;
      vertices[i + 4] = 1 / length;
      vertices[i + 5] = -slopeZ / length;
    }
    this.dirtyCheeseVertices = initialize ? new Set() : nextDirty;
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.buffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
  }

  render(model: PizzaModel, cheese: CheesePhysics): void {
    const gl = this.gl;
    this.resize();
    if (cheese.activeCount > 0 || this.cheeseWasActive) this.updateCheese(cheese);
    this.cheeseWasActive = cheese.activeCount > 0;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(this.program);
    gl.uniformMatrix4fv(this.viewProjectionLocation, false, this.camera.viewProjection);
    gl.uniform1i(this.selectedLocation, model.selectedQuarter ?? -1);
    gl.uniform1f(this.timeLocation, performance.now() * 0.001);
    gl.uniform1i(this.impactCountLocation, Math.min(8, cheese.activeCount));
    gl.uniform4fv(this.impactsLocation, cheese.visualImpacts());
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.cheeseTexture);
    gl.uniform1i(this.cheeseTextureLocation, 1);
    gl.uniform1i(this.hasCheeseTextureLocation, this.cheeseImageLoaded ? 1 : 0);
    for (const mesh of this.meshes) {
      gl.uniform1i(this.materialLocation, mesh.material);
      gl.bindVertexArray(mesh.vao);
      gl.drawElements(gl.TRIANGLES, mesh.count, gl.UNSIGNED_SHORT, 0);
    }
    gl.bindVertexArray(null);
    this.sprites.render(this.camera, model.ingredients, (x, z) => baseCheeseHeight(x, z) + cheese.sample(x, z));
    this.steam.render(this.camera, performance.now() * 0.001);
  }

  destroy(): void {
    this.alive = false;
    const gl = this.gl;
    for (const mesh of this.meshes) {
      gl.deleteVertexArray(mesh.vao);
      gl.deleteBuffer(mesh.buffer);
      gl.deleteBuffer(mesh.index);
    }
    gl.deleteProgram(this.program);
    gl.deleteTexture(this.cheeseTexture);
    this.sprites.destroy();
    this.steam.destroy();
  }
}
