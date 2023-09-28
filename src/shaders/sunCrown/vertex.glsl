varying vec3 eyeVector;
varying vec3 worldNormal;

void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vec4 mvPosition = viewMatrix * worldPos;

  gl_Position = projectionMatrix * mvPosition;

  // vec3 transformedNormal = normalMatrix * normal;
  // worldNormal = normalize(transformedNormal);
  worldNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;

  eyeVector = normalize(worldPos.xyz - cameraPosition);
}