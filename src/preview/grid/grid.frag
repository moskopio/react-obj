precision mediump float;

#define COLOR_UPDATE 750.0
#define SIZE_UPDATE  1000.0

uniform float uTime;
uniform float uDivisions;
uniform bool uUseTwoValues;
uniform vec3 uCameraPosition;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uWeightA;
uniform float uWeightB;

varying vec3 vNormal;
varying vec3 vPosition;
varying float vFogDepth;

float grid(in vec2 st, vec2 size) {
  vec2 newSize = vec2(0.5)- size * 0.5;
  vec2 uv = smoothstep(newSize, newSize + vec2(1e-4), st);
  uv *= smoothstep(newSize,newSize + vec2(1e-4), vec2(1.0) - st);
  return 1.0 - uv.x * uv.y;
}

void main() {
  float change = float(uUseTwoValues);
  float colorChange = change * (0.5 + sin(uTime / COLOR_UPDATE) / 2.0);
  float sizeChange = change * (0.5 + sin(uTime / SIZE_UPDATE) / 2.0);
  
  vec2 size = mix(vec2(1.0 - uWeightA), vec2(1.0 - uWeightB), sizeChange);
  vec3 color = mix(uColorA, uColorB, colorChange);
  
  float extra = mod(uDivisions, 2.0) < 1.0 ? 0.0 : 0.5;
  vec2 st = fract(vPosition.xz / 4.0 * uDivisions + extra);
  float alpha = grid(st, size);
  
  float fogAmount = smoothstep(0.0, 20.0, vFogDepth);
  
  vec3 normal = normalize(vNormal);
  vec3 cameraPosition = uCameraPosition;
  vec3 position = vPosition;
  vec3 cameraToVertex = normalize(position - cameraPosition);
  float toCameraNormal = abs(dot(cameraToVertex, normal));
  alpha = alpha * smoothstep(0.1, 0.3, toCameraNormal);
  
  gl_FragColor = mix(vec4(color * alpha, alpha), vec4(0), fogAmount);
}
