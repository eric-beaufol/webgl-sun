varying vec3 vPosition; 

void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vec4 mvPosition = viewMatrix * worldPos;

  gl_PointSize = 15.0;
  gl_PointSize *= (1.0 / - mvPosition.z);

  gl_Position = projectionMatrix * mvPosition;

  vPosition = position;
}