precision mediump float;

uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;

varying vec3 vNormal;
uniform bool uUseLight;

vec3 lightShading(in float toCameraNormal, in float viewAngleNormal) {
  vec3 ambient = vec3(0.1);
  
  float diffuseStep = smoothstep(0.70, 0.71, toCameraNormal);
  float specularStep = smoothstep(0.00, 0.01, pow(viewAngleNormal, 50.0));
  
  vec3 color = ambient;
  color = mix(color, uColorB, diffuseStep);
  color = mix(color, uColorA, specularStep);
  
  return color;
}

vec3 flatShading() { 
  return gl_FrontFacing ? uColorC : uColorA;
}

void main() {
  vec3 normal = normalize(vNormal);
  vec3 cameraPosition = normalize(vec3(0, 0, 2));
  float toCameraNormal = dot(cameraPosition, normal);
  float viewAngleNormal = max(0.0, dot(cameraPosition, normal));
  
  vec3 lightColor = lightShading(toCameraNormal, viewAngleNormal);
  vec3 flatColor = flatShading(); 
    
  vec3 color = mix(lightColor, flatColor, float(uUseLight));
  
  gl_FragColor = vec4(color, 0.5);
}
