precision mediump float;

#define AA 0.01
#define SPECULAR_MAX 2000.0

#define SHADE0 0.90
#define SHADE1 0.70
#define SHADE2 0.50
#define SHADE3 0.30
#define SHADE4 0.15

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
  float shade0 = smoothstep(toLightNormal, toLightNormal + AA, SHADE0);
  float shade1 = smoothstep(toLightNormal, toLightNormal + AA, SHADE1);
  float shade2 = smoothstep(toLightNormal, toLightNormal + AA, SHADE2);
  float shade3 = smoothstep(toLightNormal, toLightNormal + AA, SHADE3);
  float shade4 = smoothstep(toLightNormal, toLightNormal + AA, SHADE4);
  
  float adjustedIntensity = max(1.0, SPECULAR_MAX - uSpecularIntensity);
  float specularShade = smoothstep(0.00, 0.00 + AA, pow(viewAngleNormal, adjustedIntensity));
  
  vec3 ambient = uAmbientColor * float(uAmbientEnabled);
  vec3 diffuse = uDiffuseColor * float(uDiffuseEnabled);
  vec3 specular = specularShade * uSpecularColor * float(uSpecularEnabled);

  vec3 color = ambient + diffuse;
  // this should rather gradually turn color into ambient!
  color = mix(color, ambient + diffuse * SHADE0, shade0) + specular * SHADE1;
  color = mix(color, ambient + diffuse * SHADE1, shade1) + specular * SHADE2;
  color = mix(color, ambient + diffuse * SHADE2, shade2) + specular * SHADE3;
  color = mix(color, ambient + diffuse * SHADE3, shade3) + specular * SHADE4;
  color = mix(color, ambient, shade4);

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
