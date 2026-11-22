export const materialVertex = `#version 300 es
precision highp float;
layout(location=0) in vec3 aPosition;
layout(location=1) in vec3 aNormal;
layout(location=2) in vec2 aUv;
uniform mat4 uViewProjection;
out vec3 vWorld;
out vec3 vNormal;
out vec2 vUv;
void main() {
  vWorld = aPosition;
  vNormal = aNormal;
  vUv = aUv;
  gl_Position = uViewProjection * vec4(aPosition, 1.0);
}`;

export const materialFragment = `#version 300 es
precision highp float;
in vec3 vWorld;
in vec3 vNormal;
in vec2 vUv;
uniform int uMaterial;
uniform int uSelected;
uniform float uTime;
uniform int uImpactCount;
uniform vec4 uImpacts[8];
uniform sampler2D uCheeseTexture;
uniform bool uHasCheeseTexture;
out vec4 outColor;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1,0)), f.x),
             mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y);
}
float fbm(vec2 p) {
  return noise(p) * 0.55 + noise(p * 2.13 + 8.1) * 0.28
       + noise(p * 4.37 - 2.8) * 0.17;
}

// Blend three world-space projections so detail retains its scale on
// both the horizontal crown and the steep inner/outer crust walls.
float crustNoise(vec3 p, vec3 weights) {
  return dot(vec3(noise(p.yz), noise(p.xz), noise(p.xy)), weights);
}

void main() {
  vec2 p = vWorld.xz;
  float broad = fbm(p * 2.3);
  float fine = fbm(p * 14.0);
  float tiny = noise(p * 42.0);
  vec3 color;
  if (uMaterial == 0) {
    float toast = smoothstep(0.53, 0.78, fbm(p * 5.5 + 2.0));
    color = mix(vec3(0.69, 0.36, 0.15), vec3(0.92, 0.67, 0.35), broad);
    color = mix(color, vec3(0.43, 0.20, 0.085), toast * 0.55);
    color += (fine - 0.5) * 0.13;
  } else if (uMaterial == 1) {
    vec3 weights = pow(abs(normalize(vNormal)), vec3(4.0));
    weights /= max(weights.x + weights.y + weights.z, 0.0001);
    vec3 bread = vWorld * 5.5;
    float bake = crustNoise(bread, weights) * 0.55
      + crustNoise(bread * 2.13 + 8.1, weights) * 0.28
      + crustNoise(bread * 4.37 - 2.8, weights) * 0.17;
    float blister = crustNoise(bread * 3.8, weights);
    float toast = smoothstep(0.46, 0.73, bake);
    float charSpot = smoothstep(0.73, 0.90, blister) * smoothstep(0.52, 0.70, bake);
    color = mix(vec3(1.0, 0.79, 0.46), vec3(0.77, 0.36, 0.10), toast);
    color = mix(color, vec3(0.29, 0.10, 0.025), charSpot * 0.80);
    color += (crustNoise(bread * 13.0, weights) - 0.5) * vec3(0.11, 0.075, 0.045);
    color += smoothstep(0.68, 0.89, crustNoise(bread * 7.0, weights)) * vec3(0.065, 0.045, 0.025);
  } else if (uMaterial == 2) {
    color = mix(vec3(0.49, 0.055, 0.025), vec3(0.80, 0.18, 0.055), broad);
    color += (fine - 0.5) * vec3(0.20, 0.07, 0.025);
  } else {
    float melted = fbm(p * 3.6 + 4.0);
    float bake = smoothstep(0.70, 0.86, noise(p * 7.5 + fbm(p * 2.0) * 2.0));
    float sauceLeak = smoothstep(0.75, 0.87, noise(p * 5.5 - 3.0));
    float oil = smoothstep(0.66, 0.79, noise(p * 18.0 + 9.0));
    float bubble = smoothstep(0.82, 0.92, noise(p * 22.0 - 5.0));
    color = mix(vec3(0.78, 0.67, 0.43), vec3(1.0, 0.93, 0.72), melted);
    color = mix(color, vec3(0.78, 0.46, 0.18), bake * 0.44);
    color = mix(color, vec3(0.62, 0.16, 0.055), sauceLeak * 0.26);
    color += oil * vec3(0.035, 0.027, 0.004) + bubble * 0.035 + (fine - 0.5) * 0.065;
    if (uHasCheeseTexture) {
      vec3 bakedDetail = texture(uCheeseTexture, vUv).rgb;
      color = mix(color, bakedDetail, 0.78);
    }
  }
  vec3 normal = normalize(vNormal);
  vec3 lightDir = normalize(vec3(-0.48, 0.82, 0.38));
  float diffuse = max(dot(normal, lightDir), 0.0);
  float soft = 0.63 + 0.38 * diffuse;
  float pores = 1.0 - smoothstep(0.87, 0.98, tiny) * 0.10;
  color *= soft * pores;
  if (uMaterial == 3 && uSelected >= 0) {
    float a = atan(p.y, p.x);
    if (a < 0.0) a += 6.2831853;
    float start = float(uSelected) * 1.5707963;
    float local = a - start;
    if (local >= 0.0 && local < 1.5707963) {
      float pulse = 0.5 + 0.5 * sin(uTime * 4.2);
      color = mix(color, vec3(1.0, 0.36, 0.08), 0.14 + pulse * 0.20);
      float edge = min(local, 1.5707963 - local);
      color += vec3(0.18, 0.09, 0.012) * (0.38 + pulse * 0.62)
        * (1.0 - smoothstep(0.0, 0.022, edge));
    }
  }
  if (uMaterial == 3) {
    for (int i = 0; i < 8; i++) {
      if (i >= uImpactCount) break;
      vec4 impact = uImpacts[i];
      float distanceFromImpact = length(p - impact.xy) / impact.z;
      if (distanceFromImpact < 1.0) {
        float lip = exp(-pow((distanceFromImpact - 0.43) * 5.3, 2.0));
        float centerShade = 1.0 - smoothstep(0.0, 0.35, distanceFromImpact);
        float boundary = 1.0 - smoothstep(0.76, 1.0, distanceFromImpact);
        color += vec3(0.17, 0.13, 0.055) * lip * impact.w * boundary;
        color -= vec3(0.09, 0.07, 0.035) * centerShade * impact.w;
      }
    }
  }
  outColor = vec4(color, 1.0);
}`;
