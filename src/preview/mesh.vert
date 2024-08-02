attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uWorld;

varying vec3 vNormal;

void main() {  
  vNormal = mat3(uWorld) * aNormal;
  gl_Position = uProjection * uView * uWorld * vec4(aPosition, 1);
}
