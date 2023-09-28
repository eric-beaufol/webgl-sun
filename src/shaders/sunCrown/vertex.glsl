varying vec3 vPosition;
varying vec3 vEyeVector;
varying vec3 vWorldNormal;

void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vec4 mvPosition = viewMatrix * worldPos;

  gl_Position = projectionMatrix * mvPosition;

  vPosition = position;
  vWorldNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;
  vEyeVector = normalize(worldPos.xyz - cameraPosition);
}