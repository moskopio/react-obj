precision mediump float;

uniform vec3 uCameraPosition;

varying vec3 vNormal;
uniform float uTime;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 cameraPosition = normalize(uCameraPosition);
  float diffuse = dot(cameraPosition, normal) * 0.5 + 0.5;
  vec3 ambient = vec3(0.7, 0.7, 0.7);
  
  vec4 color = vec4(ambient * diffuse, 1.0);
  gl_FragColor = color;
}
