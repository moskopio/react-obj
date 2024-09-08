
uniform Light      uLight;
uniform LightColor uAmbient;
uniform Shading    uShading;
uniform vec3       uCameraPosition;
uniform float      uTime;

varying vec3  vNormal;
varying vec3  vPosition;
varying float vCount;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 cameraPosition = normalize(uCameraPosition);
  ShadingCommon common = ShadingCommon(normal, vPosition, cameraPosition, uAmbient);
  
  vec3 color = getLightShading(common, uShading, uLight);
  gl_FragColor = vec4(color, 1.0);
}
