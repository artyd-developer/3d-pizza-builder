import type { Camera } from './Camera';
import { createProgram } from './ShaderProgram';

const WISPS: ReadonlyArray<readonly [number, number, number, number]> = [
  [-1.18, -0.35, 0.34, 0.03], [-0.70, 0.22, 0.28, 0.19],
  [-0.20, -0.12, 0.38, 0.34], [0.28, 0.31, 0.30, 0.48],
  [0.74, -0.28, 0.35, 0.62], [1.16, 0.10, 0.27, 0.77],
  [0.05, 0.48, 0.25, 0.89],
];

const VERTEX = `#version 300 es
precision highp float;
layout(location=0) in vec2 aCorner;
layout(location=1) in vec4 aWisp;
uniform mat4 uViewProjection;
uniform float uTime;
out vec2 vUv;
out float vLife;
void main() {
  float life = fract(uTime * 0.18 + aWisp.w);
  float rise = life * 1.05;
  float sway = sin(life * 11.0 + aWisp.w * 26.0) * 0.07;
  vec3 center = vec3(aWisp.x + sway, 0.14 + rise, aWisp.y + sin(life * 8.0 + aWisp.w * 17.0) * 0.035);
  vec3 position = center + vec3(aCorner.x * aWisp.z * 0.85, aCorner.y * aWisp.z * 1.8, 0.0);
  gl_Position = uViewProjection * vec4(position, 1.0);
  vUv = aCorner * 0.5 + 0.5;
  vLife = life;
}`;

const FRAGMENT = `#version 300 es
precision highp float;
in vec2 vUv;
in float vLife;
out vec4 outColor;
void main() {
  vec2 p = vUv - 0.5;
  p.x += sin(vUv.y * 10.0 - vLife * 12.0) * 0.13;
  float plume = exp(-p.x * p.x * 38.0 - p.y * p.y * 7.0);
  plume *= smoothstep(0.0, 0.20, vUv.y) * (1.0 - smoothstep(0.65, 1.0, vUv.y));
  plume *= 1.0 - smoothstep(0.30, 0.49, abs(vUv.x - 0.5));
  float ripple = 0.76 + 0.24 * sin(vUv.y * 18.0 + vLife * 9.0 + vUv.x * 5.0);
  float fade = smoothstep(0.0, 0.16, vLife) * (1.0 - smoothstep(0.60, 1.0, vLife));
  float alpha = plume * ripple * fade * 0.72;
  if (alpha < 0.008) discard;
  outColor = vec4(0.98, 0.99, 1.0, alpha);
}`;

export class SteamRenderer {
  private readonly program: WebGLProgram;
  private readonly vao: WebGLVertexArrayObject;
  private readonly quad: WebGLBuffer;
  private readonly wisps: WebGLBuffer;
  private readonly viewProjectionLocation: WebGLUniformLocation | null;
  private readonly timeLocation: WebGLUniformLocation | null;

  constructor(private readonly gl: WebGL2RenderingContext) {
    this.program = createProgram(gl, VERTEX, FRAGMENT);
    const vao = gl.createVertexArray();
    const quad = gl.createBuffer();
    const wisps = gl.createBuffer();
    if (!vao || !quad || !wisps) throw new Error('Unable to allocate steam effect buffers.');
    this.vao = vao;
    this.quad = quad;
    this.wisps = wisps;
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, wisps);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(WISPS.flat()), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(1, 1);
    gl.bindVertexArray(null);
    this.viewProjectionLocation = gl.getUniformLocation(this.program, 'uViewProjection');
    this.timeLocation = gl.getUniformLocation(this.program, 'uTime');
  }

  render(camera: Camera, time: number): void {
    const gl = this.gl;
    gl.useProgram(this.program);
    gl.uniformMatrix4fv(this.viewProjectionLocation, false, camera.viewProjection);
    gl.uniform1f(this.timeLocation, time);
    gl.bindVertexArray(this.vao);
    gl.disable(gl.DEPTH_TEST);
    gl.depthMask(false);
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, WISPS.length);
    gl.disable(gl.BLEND);
    gl.depthMask(true);
    gl.enable(gl.DEPTH_TEST);
    gl.bindVertexArray(null);
  }

  destroy(): void {
    this.gl.deleteVertexArray(this.vao);
    this.gl.deleteBuffer(this.quad);
    this.gl.deleteBuffer(this.wisps);
    this.gl.deleteProgram(this.program);
  }
}
