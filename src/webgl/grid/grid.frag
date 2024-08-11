precision mediump float;

uniform float uTime;
varying vec2 vPosition;

float grid(in vec2 st, vec2 size) {
  vec2 newSize = vec2(0.5)- size * 0.5;
  vec2 uv = smoothstep(newSize, newSize + vec2(1e-4), st);
  uv *= smoothstep(newSize,newSize + vec2(1e-4), vec2(1.0) - st);
  return 1.0 - uv.x * uv.y;
}

void main() {
  float colorChange = 0.5 + sin(uTime /750.0) / 2.0;
  vec3 color = mix(vec3(0.69, 0.78, 0.61), vec3(0.38, 0.5, 0.56), colorChange);
  
  float sizeChange = 0.5 + sin(uTime /1000.0) / 2.0;
  vec2 size = mix(vec2(0.8), vec2(0.95), sizeChange);
  
  vec2 st = fract(vPosition * 6.0);
  float alpha = grid(st, size);
  
  gl_FragColor = vec4(color, alpha);
}
