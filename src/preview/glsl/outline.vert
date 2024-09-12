precision mediump float;

attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uModel;

uniform bool uUseTwoValues;
uniform float uWeightA;
uniform float uWeightB;

uniform float uTime;

void main() {
  vec4 position = uProjection * uView * uModel * vec4(aPosition, 1);
  vec3 outlineNormal = normalize(mat3(uProjection) * mat3(uView) * mat3(uModel) * aNormal);
  
  float change = float(uUseTwoValues) * (0.5 + sin(uTime /750.0) / 2.0);
  float outline = mix(uWeightA, uWeightB, change);
  position.xyz += outlineNormal * outline;
  
  gl_Position = position;
}
