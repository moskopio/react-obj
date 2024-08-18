precision mediump float;

attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uModel;

varying vec3 vNormal;

void main() {
  vec4 position = uProjection * uView * uModel * vec4(aPosition, 1);
  
  vNormal = aNormal;
  gl_PointSize = 4.0;
  gl_Position = position;
}
