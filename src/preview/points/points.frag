precision mediump float;

#define SPECULAR_MAX 2000.0

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

struct Points {
  vec3  movement;
  vec2  size;
  bool  useLight;
  float borderWeight;
  vec3  borderColor;
};

uniform Points uPoints;

uniform Light      uLight;
uniform LightColor uAmbient;
uniform vec3 uCameraPosition;

varying vec3 vNormal; 
varying float vCount;
varying vec3 vPosition;

uniform float uTime;

vec3 lightShading() {
  vec3 normal = normalize(vNormal);
  vec3 lightPosition = uLight.followsCamera ? normalize(uCameraPosition):  normalize(uLight.position);
  vec3 cameraPosition = normalize(uCameraPosition);
  Light light = uLight;
  
  float toLightNormal = clamp(dot(lightPosition, normal), 0.0, 1.0);
  float viewAngleNormal = clamp(dot(cameraPosition, normal), 0.0, 1.0);
  
  float adjustedIntensity = max(1.0, SPECULAR_MAX - light.intensity);
  float diffuseShade = toLightNormal;
  float specularShade = pow(viewAngleNormal, adjustedIntensity);
  
  vec3 ambient = uAmbient.color * float(uAmbient.enabled);
  vec3 diffuse = light.diffuse.color * diffuseShade * float(light.diffuse.enabled);
  vec3 specular = light.specular.color * diffuseShade * specularShade * float(light.specular.enabled);
  
  return ambient + diffuse + specular;
}

vec3 gradient(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d) {
  return a + b * cos(6.28318 * (c * t + d));
}

void main() {
  float dist = distance(gl_PointCoord.st, vec2(0.5,0.5));
  
  float changeGradient = (0.5 + sin(uTime / 1000.0) / 2.0);
  float changeShape = (vCount + sin((uTime) / 750.0) / 2.0) - (vCount + cos((uTime) / 750.0) / 2.0);

  vec3 gradientBase = mix(vec3(0.0, 0.1, 0.2), vec3(0.3, 0.2, 0.2), changeGradient);
  vec3 color = gradient(vCount, vec3(0.5), vec3(0.5), vec3(1.0), gradientBase);
  color = uPoints.useLight ? lightShading(): color;
  
  if(dist > 0.5) {
    if (dist < (0.5 + uPoints.borderWeight)) {
    color = uPoints.borderColor;
    } else {
      discard;
    }
  }

  gl_FragColor = vec4(color, 1);
}
