uniform Light        uLight;
uniform LightColor   uAmbient;
uniform LightIntense uFresnel;
uniform Shading      uShading;
uniform vec3         uCameraPosition;
uniform float        uTime;
uniform sampler2D    uShadowMap;

varying vec3  vNormal;
varying vec3  vPosition;
varying float vCount;
varying vec4  vPosFromLightView;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 cameraPosition = normalize(uCameraPosition);
  float inShadow = isInShadow(uShadowMap, vPosFromLightView);
  float useShadow = mix(0.0, inShadow, float(uLight.castObjectShadow));
  
  ShadingCommon common = ShadingCommon(normal, vPosition, cameraPosition, uAmbient, uFresnel, useShadow);
  
  vec3 color = getLightShading(common, uShading, uLight);
  
  gl_FragColor = vec4(color, 1.0);
}
