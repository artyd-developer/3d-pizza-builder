import assert from 'node:assert/strict';
import test from 'node:test';
import { compileShader } from '../src/engine/ShaderProgram.ts';

test('shader compilation exposes the driver error', () => {
  let deleted = false;
  const gl = {
    VERTEX_SHADER: 35633,
    COMPILE_STATUS: 35713,
    createShader: () => ({}),
    shaderSource: () => {},
    compileShader: () => {},
    getShaderParameter: () => false,
    getShaderInfoLog: () => 'bad vertex syntax',
    deleteShader: () => { deleted = true; },
  } as unknown as WebGL2RenderingContext;
  assert.throws(() => compileShader(gl, gl.VERTEX_SHADER, 'invalid'), /bad vertex syntax/);
  assert.equal(deleted, true);
});
