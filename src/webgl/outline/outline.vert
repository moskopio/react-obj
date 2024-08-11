precision mediump float;

attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uModel;

uniform float uOutline;
uniform float uTime;

void main() {
  vec4 position = uProjection * uView * uModel * vec4(aPosition, 1);
  vec3 outlineNormal = normalize(mat3(uProjection) * mat3(uView) * mat3(uModel) * aNormal);
  
  float change = 0.5 + sin(uTime / 1000.0) / 2.0;
  float outline = (0.01 + change * 0.01) * uOutline;
  position.xyz += outlineNormal * outline;

  gl_Position = position;
}
