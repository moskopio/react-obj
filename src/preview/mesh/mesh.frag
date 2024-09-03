precision mediump float;

#define AA 0.01
#define SPECULAR_MAX 2000.0
#define SPECULAR_STEP  0.01

uniform vec3 uCameraPosition;
uniform vec3 uLightPosition;

uniform vec3 uAmbientColor;
uniform vec3 uDiffuseColor;
uniform vec3 uSpecularColor;

uniform bool uAmbientEnabled;
uniform bool uDiffuseEnabled;
uniform bool uSpecularEnabled;

uniform float uSpecularIntensity;

uniform bool uShowNormals;
uniform bool uCellShading;
uniform float uTime;

varying vec3 vNormal;
varying float vCount;

float smoothCeil(in float x, in float aa) {
  return ceil(x) + float(1.0 - fract(x) < aa) * smoothstep(1.0 - aa, 1.0, fract(x));
}

vec3 lightShading(in float toLightNormal, in float viewAngleNormal) {
  float adjustedIntensity = max(1.0, SPECULAR_MAX - uSpecularIntensity);
  float diffuseShade = toLightNormal;
  float specularShade = pow(viewAngleNormal, adjustedIntensity);
  
  vec3 ambient = uAmbientColor * float(uAmbientEnabled);
  vec3 diffuse = uDiffuseColor * diffuseShade * float(uDiffuseEnabled);
  vec3 specular = uSpecularColor * diffuseShade * specularShade * float(uSpecularEnabled);
  
  return ambient + diffuse + specular;
}

vec3 cellShading(in float toLightNormal, in float viewAngleNormal) {
  float adjustedIntensity = max(1.0, SPECULAR_MAX - uSpecularIntensity);
  float diffuseShade = max(0.0, smoothCeil(toLightNormal * 4.0, AA) / 4.0);
  float specularShade = smoothstep(SPECULAR_STEP, SPECULAR_STEP + AA, pow(viewAngleNormal, adjustedIntensity));
  
  vec3 ambient = uAmbientColor * float(uAmbientEnabled);
  vec3 diffuse = diffuseShade * uDiffuseColor * float(uDiffuseEnabled);
  vec3 specular = diffuseShade * specularShade * uSpecularColor * float(uSpecularEnabled);
  vec3 color = ambient + diffuse + specular;

  return color;
}

void main() {
  vec3 normal = normalize(vNormal);
  
  vec3 lightPosition = normalize(uLightPosition);
  vec3 cameraPosition = normalize(uCameraPosition);
  
  float toLightNormal = clamp(dot(lightPosition, normal), 0.0, 1.0);
  float viewAngleNormal = clamp(dot(cameraPosition, normal), 0.0, 1.0);
  
  vec3 color = lightShading(toLightNormal, viewAngleNormal);
  vec3 cellShadedColor = cellShading(toLightNormal, viewAngleNormal);
  
  color = mix(color, cellShadedColor, float(uCellShading));
  color = mix(color, abs(normal), float(uShowNormals));

  gl_FragColor = vec4(color, 1.0);
}
