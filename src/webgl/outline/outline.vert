precision mediump float;

attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uWorld;

uniform float uOutline;
uniform float uTime;

void main() {
  vec3 position = aPosition;
  vec3 normal =  aNormal;
  
  float change = 0.5 + sin(uTime / 1000.0) / 2.0;
  float outline = (0.01 + change * 0.01) * uOutline;
  position.x += normal.x * outline;
  position.y += normal.y * outline;
  position.z += normal.z * outline;
  
  gl_Position = uProjection * uView * uWorld * vec4(position, 1);
}
