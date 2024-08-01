precision mediump float;

uniform vec3 uLightDirection;

varying vec3 vNormal;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 lightDirection = normalize(uLightDirection);
  float fakeLight = dot(lightDirection, normal) * 0.5 + 0.5;
    
  gl_FragColor = vec4(vec3(0.7, 0.7, 0.7) * fakeLight, 1.0);
}
