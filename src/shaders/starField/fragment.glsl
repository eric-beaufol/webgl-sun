varying vec3 vPosition;

void main() {
  float strength = distance(gl_PointCoord, vec2(0.5));
  strength = smoothstep(0.4, 0.5, strength);
  strength = 1.0 - strength;

  vec3 color = vec3(1., .9, .9);

  gl_FragColor = vec4(color, strength);
}