precision mediump float;

uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;

uniform vec3 uAmbientColor;
uniform vec3 uDiffuseColor;
uniform vec3 uSpecularColor;

varying vec3 vNormal;

uniform float uSpecularIntensity;

uniform bool uUseLight;
uniform bool uUseOutline;
uniform bool uSpecularEnabled;

vec3 lightShading(in float toCameraNormal, in float viewAngleNormal) {
  vec3 ambient = uAmbientColor;
  
  float diffuseStep = smoothstep(0.70, 0.71, toCameraNormal);
  float specularStep = smoothstep(0.00, 0.01, pow(viewAngleNormal, uSpecularIntensity / 5.0)) * float(uSpecularEnabled);
  
  vec3 color = ambient;
  color = mix(color, uDiffuseColor, diffuseStep);
  color = mix(color, uSpecularColor, specularStep);
  
  return color;
}

void main() {
  vec3 normal = normalize(vNormal);
  vec3 cameraPosition = normalize(vec3(0, 0, 2));
  float toCameraNormal = dot(cameraPosition, normal);
  float viewAngleNormal = max(0.0, dot(cameraPosition, normal));
  
  vec3 lightColor = lightShading(toCameraNormal, viewAngleNormal);
  vec3 flatColor = gl_FrontFacing ? uColorC : uColorA;
  vec3 outlineColor = vec3(1.0);
  
  vec3 color = mix(flatColor, lightColor, float(uUseLight));
  color = mix(color, outlineColor, float(uUseOutline));
  
  gl_FragColor = vec4(color, 0.5);
}
