uniform samplerCube uCubemap;
uniform float uTime;
uniform float uFresnelPower;

varying vec3 vPosition;
varying vec3 vEyeVector;
varying vec3 vWorldNormal;

float fresnel(vec3 eyeVector, vec3 worldNormal, float power) {
  float fresnelFactor = abs(dot(eyeVector, worldNormal));
  float inverseFresnelFactor = 1.0 - fresnelFactor;

  return pow(inverseFresnelFactor, power);
}

vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, s, -s, c);
	return m * v;
}

void main() {

  // rotation around x
  vec3 position3 = vec3(rotate(vPosition.yz, uTime * 0.007 + 10.), vPosition.x);
  vec3 layer3 = textureCube(uCubemap, position3).rgb; 

  // rotation around y
  vec3 position2 = vec3(rotate(vPosition.xz, uTime * 0.002 + 5.), vPosition.y);
  vec3 layer2 = textureCube(uCubemap, position2).rgb;

  // rotation around z
  vec3 position1 = vec3(rotate(vPosition.xy, uTime * 0.01 + 50.), vPosition.z);
  vec3 layer1 = textureCube(uCubemap, position1).rgb;

  vec3 color = (layer1 + layer2 + layer3) / 3.;

  float f = fresnel(vEyeVector, vWorldNormal, uFresnelPower);

  color += f;

  // without layers
  // color = textureCube(uCubemap, vPosition).rgb;

  gl_FragColor = vec4(color, 1.);
}