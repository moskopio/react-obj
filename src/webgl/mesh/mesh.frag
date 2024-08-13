precision mediump float;

uniform vec3 uCameraPosition;
uniform bool uShowNormals;
uniform bool uCellShading;

varying vec3 vNormal;

vec3 lightShading(in float toCameraNormal) {
  float diffuse = toCameraNormal * 0.5 + 0.5;
  vec3 ambient = vec3(0.5, 0.5, 0.5);

  return ambient * diffuse;
}

vec3 cellShading(in float toCameraNormal) {
  float shade0 = step(toCameraNormal, 0.5);
  float shade1 = step(toCameraNormal, 0.2);
  float shade2 = step(toCameraNormal, 0.15);
  
  vec3 color = mix(vec3(1.0), vec3(0.7), shade0);
  color = mix(color, vec3(0.5), shade1);
  color = mix(color, vec3(0.1), shade2);
  
  return color;
}

void main() {
  vec3 normal = normalize(vNormal);
  vec3 cameraPosition = normalize(uCameraPosition);
  float toCameraNormal = abs(dot(cameraPosition, normal));
  
  vec3 color = lightShading(toCameraNormal);
  vec3 cellShadedColor = cellShading(toCameraNormal);
  
  color = mix(color, cellShadedColor, float(uCellShading));
  color = mix(color, abs(normal), float(uShowNormals));

  gl_FragColor = vec4(color, 1.0);
}
