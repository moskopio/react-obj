precision mediump float;

uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;

varying vec2 vPosition;
varying float vFogDepth;

float grid(in vec2 st, vec2 size) {
  vec2 newSize = vec2(0.5)- size * 0.5;
  vec2 uv = smoothstep(newSize, newSize + vec2(1e-4), st);
  uv *= smoothstep(newSize,newSize + vec2(1e-4), vec2(1.0) - st);
  return 1.0 - uv.x * uv.y;
}

void main() {
  float colorChange = 0.5 + sin(uTime /750.0) / 2.0;
  vec3 color = mix(uColorA, uColorB, colorChange);
  
  float sizeChange = 0.5 + sin(uTime /1000.0) / 2.0;
  vec2 size = mix(vec2(0.9), vec2(0.97), sizeChange);
  
  vec2 st = fract(vPosition * 5.0);
  float alpha = grid(st, size);
  
  float fogAmount = smoothstep(0.0, 15.0, vFogDepth);
  
  gl_FragColor = mix(vec4(color, alpha), vec4(0), fogAmount);
}
