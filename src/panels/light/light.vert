precision mediump float;

attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uModel;
uniform bool uUseOutline;

varying vec3 vNormal;

void main() {
  vec4 position = uProjection * uView * uModel * vec4(aPosition, 1);
  vec3 outlineNormal = normalize(mat3(uProjection) * mat3(uView) * mat3(uModel) * aNormal);
  vNormal = aNormal;

  vec3 outline = mix(vec3(0.0), 0.03 * outlineNormal, float(uUseOutline));
  position.xyz += outline;
  
  gl_Position = position;
}
