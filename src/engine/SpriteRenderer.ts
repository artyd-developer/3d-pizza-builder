import type { Camera } from './Camera';
import type { Ingredient, IngredientType } from './PizzaModel';
import { createProgram } from './ShaderProgram';

const types: IngredientType[] = ['pepperoni', 'mushroom', 'pineapple'];
const VERTEX = `#version 300 es
precision highp float;
layout(location=0) in vec2 aCorner;
layout(location=1) in vec3 iCenter;
layout(location=2) in vec4 iParams;
uniform mat4 uViewProjection;
uniform bool uShadow;
out vec2 vUv;
out float vOpacity;
out float vHeight;
void main() {
  float c = cos(iParams.y), s = sin(iParams.y);
  vec2 rotated = vec2(c * aCorner.x - s * aCorner.y, s * aCorner.x + c * aCorner.y);
  float height = max(0.0, iCenter.y - iParams.w);
  float scale = iParams.x * 1.40 * (uShadow ? (1.0 + height * 0.25) : 1.0);
  vec3 position = iCenter + vec3(rotated.x * scale, 0.0, rotated.y * scale);
  if (uShadow) position.y = iParams.w;
  gl_Position = uViewProjection * vec4(position, 1.0);
  vUv = aCorner * 0.5 + 0.5;
  vOpacity = iParams.z;
  vHeight = height;
}`;
const FRAGMENT = `#version 300 es
precision highp float;
in vec2 vUv;
in float vOpacity;
in float vHeight;
uniform sampler2D uTexture;
uniform bool uShadow;
out vec4 outColor;
void main() {
  if (uShadow) {
    float radius = length((vUv - 0.5) * vec2(1.0, 1.12));
    float alpha = (1.0 - smoothstep(0.10, 0.47, radius)) * 0.24 * (1.0 - min(vHeight, 1.0) * 0.42);
    if (alpha < 0.005) discard;
    outColor = vec4(0.10, 0.045, 0.01, alpha);
  } else {
    vec4 texel = texture(uTexture, vUv);
    float alpha = smoothstep(0.10, 0.82, texel.a) * vOpacity;
    if (alpha < 0.02) discard;
    outColor = vec4(texel.rgb, alpha);
  }
}`;

function fallbackPixels(type: IngredientType): Uint8Array {
  const width = 64;
  const pixels = new Uint8Array(width * width * 4);
  for (let y = 0; y < width; y++) for (let x = 0; x < width; x++) {
    const nx = (x - 32) / 28;
    const ny = (y - 32) / 28;
    const r = Math.hypot(nx, ny);
    let inside = false;
    let color: [number, number, number] = [240, 220, 170];
    if (type === 'pepperoni') {
      inside = r < 0.83 + 0.035 * Math.sin(x * 0.45) * Math.cos(y * 0.3);
      const browned = Math.sin(x * 0.47 + y * 0.23) * Math.sin(y * 0.53 - x * 0.16);
      color = [175 + browned * 22, 52 + browned * 15, 36 + browned * 11];
    } else if (type === 'mushroom') {
      inside = (ny < 0.08 && nx * nx + (ny + 0.04) ** 2 < 0.86 ** 2) || (Math.abs(nx) < 0.22 && ny > -0.1 && ny < 0.83);
      color = ny < 0.08 ? [150 - y * 0.5, 99 - y * 0.3, 58] : [224, 190, 143];
    } else {
      inside = nx > -0.76 && nx < 0.77 && ny > -0.78 && ny < 0.66
        && ny < 0.65 - 0.35 * nx && ny > -0.78 + 0.16 * nx;
      color = [252, 191 - y * 0.18, 40];
    }
    const index = (y * width + x) * 4;
    pixels[index] = Math.max(0, color[0]);
    pixels[index + 1] = Math.max(0, color[1]);
    pixels[index + 2] = Math.max(0, color[2]);
    pixels[index + 3] = inside ? 255 : 0;
  }
  return pixels;
}

export class SpriteRenderer {
  private program: WebGLProgram;
  private vao: WebGLVertexArrayObject;
  private quad: WebGLBuffer;
  private instances: WebGLBuffer;
  private textures = new Map<IngredientType, WebGLTexture>();
  private capacity = 128;
  private alive = true;
  private viewLocation: WebGLUniformLocation | null;
  private shadowLocation: WebGLUniformLocation | null;
  private textureLocation: WebGLUniformLocation | null;

  constructor(private gl: WebGL2RenderingContext) {
    this.program = createProgram(gl, VERTEX, FRAGMENT);
    const vao = gl.createVertexArray();
    const quad = gl.createBuffer();
    const instances = gl.createBuffer();
    if (!vao || !quad || !instances) throw new Error('Unable to allocate ingredient sprite buffers.');
    this.vao = vao;
    this.quad = quad;
    this.instances = instances;
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, instances);
    gl.bufferData(gl.ARRAY_BUFFER, this.capacity * 7 * 4, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 7 * 4, 0);
    gl.vertexAttribDivisor(1, 1);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 4, gl.FLOAT, false, 7 * 4, 3 * 4);
    gl.vertexAttribDivisor(2, 1);
    gl.bindVertexArray(null);
    this.viewLocation = gl.getUniformLocation(this.program, 'uViewProjection');
    this.shadowLocation = gl.getUniformLocation(this.program, 'uShadow');
    this.textureLocation = gl.getUniformLocation(this.program, 'uTexture');
    for (const type of types) this.loadTexture(type);
  }

  private createTexture(pixels: TexImageSource | Uint8Array): WebGLTexture {
    const gl = this.gl;
    const texture = gl.createTexture();
    if (!texture) throw new Error('Unable to allocate an ingredient texture.');
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    if (pixels instanceof Uint8Array) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 64, 64, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    } else {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    }
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.generateMipmap(gl.TEXTURE_2D);
    return texture;
  }

  private loadTexture(type: IngredientType): void {
    this.textures.set(type, this.createTexture(fallbackPixels(type)));
    const image = new Image();
    image.onload = () => {
      if (!this.alive) return;
      const replacement = this.createTexture(image);
      const old = this.textures.get(type);
      if (old) this.gl.deleteTexture(old);
      this.textures.set(type, replacement);
    };
    image.onerror = () => { /* Keep the generated fallback texture. */ };
    image.src = `/ingredients/${type}.png`;
  }

  render(camera: Camera, ingredients: readonly Ingredient[], surfaceHeight: (x: number, z: number) => number): void {
    if (!ingredients.length) return;
    const gl = this.gl;
    gl.useProgram(this.program);
    gl.uniformMatrix4fv(this.viewLocation, false, camera.viewProjection);
    gl.uniform1i(this.textureLocation, 0);
    gl.bindVertexArray(this.vao);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(false);
    for (const shadow of [true, false]) {
      gl.uniform1i(this.shadowLocation, shadow ? 1 : 0);
      for (const type of types) {
        const selected = ingredients.filter((item) => item.type === type);
        if (!selected.length) continue;
        if (selected.length > this.capacity) {
          this.capacity = Math.max(selected.length, this.capacity * 2);
          gl.bindBuffer(gl.ARRAY_BUFFER, this.instances);
          gl.bufferData(gl.ARRAY_BUFFER, this.capacity * 7 * 4, gl.DYNAMIC_DRAW);
        }
        const data = new Float32Array(selected.length * 7);
        selected.forEach((item, i) => {
          const ground = surfaceHeight(item.x, item.z);
          const opacity = item.state === 'SPAWNING' ? Math.min(1, item.age / 0.08) : 1;
          data.set([item.x, ground + item.height + 0.035, item.z, item.size, item.rotation, opacity, ground + 0.008], i * 7);
        });
        gl.bindBuffer(gl.ARRAY_BUFFER, this.instances);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.textures.get(type) ?? null);
        gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, selected.length);
      }
    }
    gl.depthMask(true);
    gl.disable(gl.BLEND);
    gl.bindVertexArray(null);
  }

  destroy(): void {
    this.alive = false;
    const gl = this.gl;
    for (const texture of this.textures.values()) gl.deleteTexture(texture);
    gl.deleteVertexArray(this.vao);
    gl.deleteBuffer(this.quad);
    gl.deleteBuffer(this.instances);
    gl.deleteProgram(this.program);
  }
}
