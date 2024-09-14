precision mediump float;

attribute vec3 aPosition;
attribute vec3 aNormal;
attribute float aCount;

uniform float uTime;
uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uModel;

uniform mat4 uLightProjection;
uniform mat4 uLightView;

varying vec3 vNormal;
varying vec3 vPosition;
varying float vCount;
varying vec4  vPosFromLightView;

void main() {
  vec4 position = uProjection * uView * uModel * vec4(aPosition, 1);
  vec3 normal = normalize(mat3(uModel) * aNormal);
  vNormal = normal;
  vPosition = position.xyz;
  vCount = aCount;
  vPosFromLightView = uLightProjection * uLightView * uModel * vec4(aPosition, 1);
  
  gl_Position = position;
}
