precision mediump float;

attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uWorld;
uniform float uTime;

uniform bool uOutline;

varying vec3 vNormal;

void main() {
  vec3 position = aPosition;
  
  vNormal = normalize(mat3(uWorld) * aNormal);
    if (uOutline) {
    float change = 0.5 + sin(uTime / 1000.0) / 2.0;
    float outline = (0.02 + change * 0.01);
    position.x += vNormal.x * outline;
    position.y += vNormal.y * outline;
    position.z += vNormal.z * outline;
  }
  
  gl_Position = uProjection * uView * uWorld * vec4(position, 1);
}
