#define SHADOW_BIAS  0.01

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
  ShadingCommon common = ShadingCommon(normal, vPosition, cameraPosition, uAmbient, uFresnel);
  
  // TODO: too simple, could be integrated better!
  float inShadow = isInShadow(uShadowMap, vPosFromLightView);
  vec3 color = getLightShading(common, uShading, uLight);
  vec3 shadowColor = mix(vec3(1,0,0), uAmbient.color, float(uAmbient.enabled));
  color = mix(color, shadowColor, inShadow);
  
  gl_FragColor = vec4(color, 1.0);
}
