#pragma glslify: snoise4 = require(glsl-noise/simplex/4d)

uniform float uTime;

varying vec3 vPosition;

void main() {
  float posXL = vPosition.x * -30.;
  // posXL += snoise4(vec4(vPosition, uTime * 0.01)) * 5.;

  float alpha = fract(posXL);

  // vec3 color = vec3(vPosition.x * 5. + 0.5);
  vec3 color = vec3(1., 1., 0.2);

  gl_FragColor = vec4(color, alpha);
}