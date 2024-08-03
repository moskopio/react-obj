precision mediump float;

uniform float uTime;

void main() {
  float change = 0.5 + sin(uTime /750.0) / 2.0;
  vec4 color = mix(vec4(0.69, 0.78, 0.61, 1), vec4(0.38, 0.5, 0.56, 1), change);
  
  gl_FragColor = color;
}
