precision mediump float;

#define AA 0.01
#define SPECULAR_MAX 2000.0
#define SPECULAR_STEP  0.01

struct LightColor {
  bool enabled;
  vec3 color;
};

struct Light {
  vec3       position;
  LightColor diffuse;
  LightColor specular;
  float      intensity;
  bool       followsCamera;
};

struct CellShading {
  bool  enabled;
  float segments;
  float aa;
};

struct GoochShading {
  bool enabled;
};

struct NormalShading {
  bool enabled;
  bool useAbs;
};

struct Shading {
  CellShading   cell;
  GoochShading  gooch;
  NormalShading normal;
};

uniform Light      uLight;
uniform LightColor uAmbient;
uniform Shading    uShading;

uniform vec3 uCameraPosition;

uniform float uTime;

varying vec3 vNormal;
varying float vCount;

float smoothCeil(in float x, in float aa) {
  return ceil(x) + float(1.0 - fract(x) < aa) * smoothstep(1.0 - aa, 1.0, fract(x));
}

vec3 lightShading(in float toLightNormal, in float viewAngleNormal, in Light light) {
  float adjustedIntensity = max(1.0, SPECULAR_MAX - light.intensity);
  float diffuseShade = toLightNormal;
  float specularShade = pow(viewAngleNormal, adjustedIntensity);
  
  vec3 ambient = uAmbient.color * float(uAmbient.enabled);
  vec3 diffuse = light.diffuse.color * diffuseShade * float(light.diffuse.enabled);
  vec3 specular = light.specular.color * diffuseShade * specularShade * float(light.specular.enabled);
  
  return ambient + diffuse + specular;
}

vec3 cellShading(in float toLightNormal, in float viewAngleNormal, in Light light, in CellShading cell) {
  float adjustedIntensity = max(1.0, SPECULAR_MAX - light.intensity);
  float diffuseShade = max(0.0, smoothCeil(toLightNormal * cell.segments, cell.aa) / cell.segments);
  float specularShade = smoothstep(SPECULAR_STEP, SPECULAR_STEP + cell.aa, pow(viewAngleNormal, adjustedIntensity));
  
  vec3 ambient = uAmbient.color * float(uAmbient.enabled);
  vec3 diffuse = diffuseShade * light.diffuse.color * float(light.diffuse.enabled);
  vec3 specular = diffuseShade * specularShade * light.specular.color * float(light.specular.enabled);
  vec3 color = ambient + diffuse + specular;

  return color;
}

vec3 goochShading(in vec3 normal, in vec3 lightPosition, in Light light) {
  float weight = 0.5 * (1.0 + dot(normal, lightPosition));
  return (1.0 - weight) * uAmbient.color + weight * light.diffuse.color;
}

void main() {
  vec3 normal = normalize(vNormal);
  
  vec3 lightPosition = uLight.followsCamera ? normalize(uCameraPosition):  normalize(uLight.position);
  vec3 cameraPosition = normalize(uCameraPosition);
  
  float toLightNormal = clamp(dot(lightPosition, normal), 0.0, 1.0);
  float viewAngleNormal = clamp(dot(cameraPosition, normal), 0.0, 1.0);
  
  vec3 color = lightShading(toLightNormal, viewAngleNormal, uLight);
  vec3 cellShadedColor = cellShading(toLightNormal, viewAngleNormal, uLight, uShading.cell);
  vec3 goochColor = goochShading(normal, lightPosition, uLight);
  
  color = mix(color, cellShadedColor, float(uShading.cell.enabled));
  color = mix(color, uShading.normal.useAbs ? abs(normal) : normal, float(uShading.normal.enabled));
  color = mix(color, goochColor, float(uShading.gooch.enabled));

  gl_FragColor = vec4(color, 1.0);
}
