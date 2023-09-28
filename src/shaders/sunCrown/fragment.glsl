uniform float uFresnelPower;
uniform vec3 uColor;

uniform float uA;
uniform float uB;
uniform float uHotnessA;

varying vec3 vPosition;
varying vec3 vEyeVector;
varying vec3 vWorldNormal;

float fresnel(vec3 eyeVector, vec3 worldNormal, float power) {
  float fresnelFactor = abs(dot(eyeVector, worldNormal));
  float inverseFresnelFactor = 1.0 - fresnelFactor;

  return pow(inverseFresnelFactor, power);
}

vec3 brightnessToColor(float b) {
  b *= .25;
  return (vec3(b, b*b, b*b*b*b)/0.25)*0.8;
}

void main() {
  float f = 1. - fresnel(vEyeVector, vWorldNormal, uFresnelPower);
  f = pow(f, uA) * uB;

  vec3 color = brightnessToColor(f) * (uHotnessA - 1.);

  gl_FragColor = vec4(color, f);
}