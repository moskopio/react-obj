precision mediump float;

attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uWorld;
uniform float uTime;

varying vec3 vNormal;

void main() {
  vec3 position = aPosition;
  
  vNormal = normalize(mat3(uWorld) * aNormal);  
  gl_Position = uProjection * uView * uWorld * vec4(position, 1);
}
