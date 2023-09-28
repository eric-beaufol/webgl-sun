#define PI 3.1415926535897932384626433832795
#pragma glslify: snoise4 = require(glsl-noise/simplex/4d)

uniform float uTime;

varying vec3 vPosition;

void main() {
  float noise = snoise4(vec4(position, uTime * 0.2)) * 0.2 * (cos(abs(position.y * 2.) * PI / 2.));

  vec3 pos = vec3(position);
  pos.z = cos(abs(position.y * 2.) * PI / 2.) * 0.4;
  pos.x *= cos(abs(position.y * 2.) * PI / 2.) * 2. + .2;

  pos += noise;

  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vec4 mvPosition = viewMatrix * worldPos;

  gl_Position = projectionMatrix * mvPosition;

  vPosition = position;
}