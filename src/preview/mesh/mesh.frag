precision mediump float;

#define AA 0.01

uniform vec3 uCameraPosition;
uniform vec3 uLightPosition;
uniform bool uShowNormals;
uniform bool uCellShading;

varying vec3 vNormal;

vec3 lightShading(in float toLightNormal) {
  vec3 ambient = vec3(0.1);
  vec3  diffuse = vec3(0.5) * toLightNormal;

  return ambient + diffuse;
}

vec3 cellShading(in float toLightNormal) {
  float shade0 = smoothstep(toLightNormal, toLightNormal + AA, 0.9);
  float shade1 = smoothstep(toLightNormal, toLightNormal + AA, 0.7);
  float shade2 = smoothstep(toLightNormal, toLightNormal + AA, 0.5);
  float shade3 = smoothstep(toLightNormal, toLightNormal + AA, 0.3);
  float shade4 = smoothstep(toLightNormal, toLightNormal + AA, 0.15);
  
  vec3 color = mix(vec3(0.6), vec3(0.55), shade0);
  color = mix(color, vec3(0.4), shade1);
  color = mix(color, vec3(0.3), shade2);
  color = mix(color, vec3(0.2), shade3);
  color = mix(color, vec3(0.1), shade4);
  
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
