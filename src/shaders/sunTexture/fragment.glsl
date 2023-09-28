#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: snoise4 = require(glsl-noise/simplex/4d)

uniform float uTime;
uniform float uSpeed;
uniform float uScale;
uniform float uNoiseOffset;
uniform float uHotnessA;
uniform bool uUseColor;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;

varying vec2 vUv;
varying vec3 vPosition;

float fbm(vec4 p) {
  float sum = 0.;
  float amp = 1.;
  float scale = 1.;

  for (int i = 0; i < 6; i++) {
    sum += snoise4(p * scale) * amp;
    p.w += 100.;
    amp *= 0.9;
    scale *= 2.;
  }

  return sum;
}

vec3 brightnessToColor(float b) {
  b *= .25;
  return (vec3(b, b*b, b*b*b*b)/0.25)*0.8;
}

void main() {

  // FBM noise
  vec4 p = vec4(vPosition * 3., uTime * 0.05);
  float noise = fbm(p);

  // Simplex noise layer
  vec4 p2 = vec4(vPosition * 2., uTime * 0.02);
  float spots = max(snoise4(p2), 0.);

  noise = vec3(vec3(noise) * mix(1., spots, .7)).r + uNoiseOffset;

  vec3 color;

  if (!uUseColor) {
    color = brightnessToColor(noise) * uHotnessA;  
  } else {
    color = mix(uColor1, uColor2, clamp(noise * 3., 0., 1.));
    color = mix(color, uColor3, clamp(noise * 3. - 1., 0., 1.));
    color = mix(color, uColor4, clamp(noise * 3. - 2., 0., 1.));
  }

  gl_FragColor = vec4(color, 1.);
}