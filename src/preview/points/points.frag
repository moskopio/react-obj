struct Points {
  vec3  movement;
  vec2  size;
  bool  useLight;
  float borderWeight;
  vec3  borderColor;
};

uniform Points       uPoints;
uniform Light        uLight;
uniform LightColor   uAmbient;
uniform LightIntense uFresnel;
uniform Shading      uShading;
uniform vec3         uCameraPosition;
uniform float        uTime;

varying vec3  vNormal;
varying vec3  vPosition;
varying float vCount;

vec3 getLightColor() {
  vec3 normal = normalize(vNormal);
  vec3 lightPosition = uLight.followsCamera 
    ? normalize(uCameraPosition)
    : normalize(uLight.position);
  vec3 cameraPosition = normalize(uCameraPosition);
  ShadingCommon common = ShadingCommon(normal, vPosition, cameraPosition, uAmbient, uFresnel);
  
  return getLightShading(common, uShading, uLight);
}

vec3 gradient(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d) {
  return a + b * cos(6.28318 * (c * t + d));
}

vec3 getGradientColor() {
  float changeGradient = (0.5 + sin(uTime / 1000.0) / 2.0);
  float changeShape = (vCount + sin((uTime) / 750.0) / 2.0) - (vCount + cos((uTime) / 750.0) / 2.0);

  vec3 gradientBase = mix(vec3(0.0, 0.1, 0.2), vec3(0.3, 0.2, 0.2), changeGradient);
  vec3 color = gradient(vCount, vec3(0.5), vec3(0.5), vec3(1.0), gradientBase);
  
  return gradient(vCount, vec3(0.5), vec3(0.5), vec3(1.0), gradientBase);;
}

void main() {
  float dist = distance(gl_PointCoord.st, vec2(0.5, 0.5));
  if(dist > 0.5) {
    discard;
  }
  
  vec3 color = getGradientColor();
  vec3 lightColor = getLightColor();
  color = mix(color, lightColor, float(uPoints.useLight));
  color = mix(color, uPoints.borderColor, float(dist > (0.5 - uPoints.borderWeight)));
  
  gl_FragColor = vec4(color, 1);
}
