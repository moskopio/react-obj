precision mediump float;

attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uModel;
uniform float uTime;

varying vec3 vNormal;

void main() {
  vec3 position = aPosition;
  
  vNormal = normalize(mat3(uModel) * aNormal);
  gl_Position = uProjection * uView * uModel * vec4(position, 1);
}
