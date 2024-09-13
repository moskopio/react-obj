precision mediump float;

attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexture;

uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uModel;

uniform mat4 uLightProjection;
uniform mat4 uLightView;

varying vec3  vPosition;
varying vec4  vPosFromLightView;
varying float vFogDepth;
varying vec3  vNormal;
varying vec2 vTexture;

void main() {
  vec4 position = uProjection * uView * uModel * vec4(aPosition, 1);
  vPosition = aPosition.xyz;
  vFogDepth = -(uView * vec4(aPosition, 1)).z;
  vNormal = normalize(mat3(uModel) * aNormal);
  
  vPosFromLightView = uLightProjection * uLightView * uModel * vec4(aPosition, 1);
  vTexture = aTexture;
  
  gl_Position = position;
}
