precision mediump float;

#define AA 0.01

#define SPECULAR_MAX   2000.0
#define SPECULAR_MULTI 5.0
#define DIFFUSE_STEP   0.70
#define SPECULAR_STEP  0.00

const vec3 cameraPosition = normalize(vec3(0, 0, 2));
const vec3 outlineColor = vec3(1.0);

const vec3 lampLightColor = vec3(0.69, 0.78, 0.61);
const vec3 lampConeColor =  vec3(0.74, 0.36, 0.21);

uniform vec3 uAmbientColor;
uniform vec3 uDiffuseColor;
uniform vec3 uSpecularColor;

uniform bool uAmbientEnabled;
uniform bool uDiffuseEnabled;
uniform bool uSpecularEnabled;

varying vec3 vNormal;

uniform float uSpecularIntensity;

uniform bool uUseLight;
uniform bool uUseOutline;

vec3 lightShading(in float toCameraNormal, in float viewAngleNormal) {
  vec3 ambient = float(uAmbientEnabled) * uAmbientColor;
  
  float adjustedIntensity = max(1.0, SPECULAR_MAX - uSpecularIntensity);
  float specularShade = pow(viewAngleNormal, adjustedIntensity / SPECULAR_MULTI);
  
  float diffuseStep = smoothstep(DIFFUSE_STEP, DIFFUSE_STEP + AA, toCameraNormal) * float(uDiffuseEnabled);
  float specularStep = smoothstep(SPECULAR_STEP, SPECULAR_STEP + AA, specularShade) * float(uSpecularEnabled);
  
  vec3 color = ambient;
  color = mix(color, uDiffuseColor, diffuseStep);
  color = mix(color, uSpecularColor, specularStep);
  
  return color;
}

void main() {
  vec3 normal = normalize(vNormal);
  float toCameraNormal = dot(cameraPosition, normal);
  float viewAngleNormal = max(0.0, dot(cameraPosition, normal));
  
  vec3 lightColor = lightShading(toCameraNormal, viewAngleNormal);
  vec3 flatColor = gl_FrontFacing ? lampConeColor : lampLightColor;
  
  vec3 color = mix(flatColor, lightColor, float(uUseLight));
  color = mix(color, outlineColor, float(uUseOutline));
  
  gl_FragColor = vec4(color, 0.5);
}
