#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: snoise4 = require(glsl-noise/simplex/4d)

uniform float uTime;
uniform float uSpeed;
uniform float uScale;
uniform float uNoiseOffset;

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

void main() {

  // noise value
  // float noise = clamp(0., 1., snoise4(vec4(vPosition * uScale, uTime * uSpeed)));

  // noise = clamp(0., 1., noise + snoise4(vec4(vPosition * uScale * .33, uTime * .1)));
  // noise = clamp(0., 1., noise + snoise4(vec4(vPosition * uScale * .66, uTime * .02)));
  // noise = clamp(0., 1., noise + uNoiseOffset);

  // FBM noise
  vec4 p = vec4(vPosition * 3., uTime * 0.05);
  float noise = fbm(p);

  // Simplex noise layer
  vec4 p2 = vec4(vPosition * 2., uTime * 0.05);
  float spots = max(snoise4(p2), 0.);

  noise = vec3(vec3(noise) * mix(1., spots, .7)).r + uNoiseOffset;

  vec3 finalColor = mix(uColor1, uColor2, clamp(noise * 3., 0., 1.));
  finalColor = mix(finalColor, uColor3, clamp(noise * 3. - 1., 0., 1.));
  finalColor = mix(finalColor, uColor4, clamp(noise * 3. - 2., 0., 1.));

  gl_FragColor = vec4(finalColor, 1.);
}