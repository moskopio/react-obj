precision mediump float;

uniform vec3 uCameraPosition;
uniform vec3 uLightPosition;
uniform bool uShowNormals;
uniform bool uCellShading;

varying vec3 vNormal;

vec3 lightShading(in float toLightNormal) {
  float diffuse = toLightNormal * 0.5 + 0.5;
  vec3 ambient = vec3(0.5, 0.5, 0.5);

  return ambient * diffuse;
}

vec3 cellShading(in float toLightNormal) {
  float shade0 = step(toLightNormal, 0.5);
  float shade1 = step(toLightNormal, 0.2);
  float shade2 = step(toLightNormal, 0.15);
  
  vec3 color = mix(vec3(1.0), vec3(0.7), shade0);
  color = mix(color, vec3(0.5), shade1);
  color = mix(color, vec3(0.1), shade2);
  
  return color;
}

void main() {
  vec3 normal = normalize(vNormal);
  vec3 lightPosition = normalize(uLightPosition);
  float toLightNormal = dot(lightPosition, normal);
  
  vec3 color = lightShading(toLightNormal);
  vec3 cellShadedColor = cellShading(toLightNormal);
  
  color = mix(color, cellShadedColor, float(uCellShading));
  color = mix(color, abs(normal), float(uShowNormals));

  gl_FragColor = vec4(color, 1.0);
}
