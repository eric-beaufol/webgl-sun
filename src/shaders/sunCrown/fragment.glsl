uniform float uFresnelPower;

varying vec3 eyeVector;
varying vec3 worldNormal;

float fresnel(vec3 eyeVector, vec3 worldNormal, float power) {
  float fresnelFactor = abs(dot(eyeVector, worldNormal));
  float inverseFresnelFactor = 1.0 - fresnelFactor;

  return pow(inverseFresnelFactor, power);
}

void main() {
  vec3 normal = worldNormal;
  vec3 color = vec3(1., 0., 0.);

  vec4 color1 = vec4(1., 0., 0., 1.);
  vec4 color2 = vec4(1., 0., 0., 0.);

  // Fresnel
  float fresnel = fresnel(eyeVector, normal, uFresnelPower);

  vec4 finalColor = mix(color1, color2, fresnel);

  gl_FragColor = finalColor;
}