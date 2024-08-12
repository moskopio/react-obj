precision mediump float;

attribute vec3 aPosition;

uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uModel;

varying vec2 vPosition;
varying float vFogDepth;

void main() {
  vec4 position = uProjection * uView * uModel * vec4(aPosition, 1);
  
  vPosition = aPosition.xz / 4.0 + 0.5;
  vFogDepth = -(uView * vec4(aPosition, 1)).z;
  
  gl_Position = position;
}
