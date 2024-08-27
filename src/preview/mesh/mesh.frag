precision mediump float;

#define AA 0.01

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
uniform float uSpecularIntensity;

uniform bool uShowNormals;
uniform bool uCellShading;
uniform bool uSpecularEnabled;
uniform float uTime;

varying vec3 vNormal;
varying float vCount;

vec3 lightShading(in float toLightNormal, in float viewAngleNormal) {
  float diffuseStep = toLightNormal;
  float specularStep = pow(viewAngleNormal, uSpecularIntensity);
  
  vec3 ambient = uAmbientColor;
  vec3 diffuse = uDiffuseColor * diffuseStep;
  // vec3 specular = uSpecularColor * diffuseStep * specularStep * float(uSpecularEnabled);
  vec3 specular = uSpecularColor * specularStep * float(uSpecularEnabled);
  
  return ambient + diffuse + specular;
}

vec3 cellShading(in float toLightNormal, in float viewAngleNormal) {
  float shade0 = smoothstep(toLightNormal, toLightNormal + AA, SHADE0);
  float shade1 = smoothstep(toLightNormal, toLightNormal + AA, SHADE1);
  float shade2 = smoothstep(toLightNormal, toLightNormal + AA, SHADE2);
  float shade3 = smoothstep(toLightNormal, toLightNormal + AA, SHADE3);
  float shade4 = smoothstep(toLightNormal, toLightNormal + AA, SHADE4);
  float specularShade = smoothstep(0.00, 0.00 + AA, pow(viewAngleNormal, uSpecularIntensity));
  
  vec3 specular = specularShade * uSpecularColor * float(uSpecularEnabled);
  
  vec3 objectColor = uAmbientColor + uDiffuseColor;
  vec3 color = objectColor;
  // this should rather gradually turn color into ambient!
  color = mix(color, objectColor * SHADE0, shade0) + specular * SHADE1;
  color = mix(color, objectColor * SHADE1, shade1) + specular * SHADE2;
  color = mix(color, objectColor * SHADE2, shade2) + specular * SHADE3;
  color = mix(color, objectColor * SHADE3, shade3) + specular * SHADE4;
  color = mix(color, uAmbientColor, shade4);

  return color;
}

void main() {
  vec3 normal = normalize(vNormal);
  
  vec3 lightPosition = normalize(uLightPosition);
  vec3 cameraPosition = normalize(uCameraPosition);
  
  float toLightNormal = dot(lightPosition, normal);
  float viewAngleNormal = max(0.0, dot(cameraPosition, normal));
  
  vec3 color = lightShading(toLightNormal, viewAngleNormal);
  vec3 cellShadedColor = cellShading(toLightNormal, viewAngleNormal);
  
  color = mix(color, cellShadedColor, float(uCellShading));
  color = mix(color, abs(normal), float(uShowNormals));

  gl_FragColor = vec4(color, 1.0);
}
