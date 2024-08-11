precision mediump float;

uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;

void main() {
  float change = 0.5 + sin(uTime /750.0) / 2.0;
  vec3 color = mix(uColorA, uColorB, change);
  
  gl_FragColor = vec4(color, 1.0);
}
