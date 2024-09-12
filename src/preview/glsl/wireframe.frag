precision mediump float;

struct Wireframe {
  bool enabled;
  vec3 color;
  bool useShading;
};

uniform Wireframe uWireframe;

uniform vec3 uCameraPosition;

varying vec3 vNormal;
uniform float uTime;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 cameraPosition = normalize(uCameraPosition);
  float diffuse = dot(cameraPosition, normal) * 0.5 + 0.5;
  
  vec3 color = uWireframe.useShading ? uWireframe.color * diffuse : uWireframe.color;
  gl_FragColor = vec4(color, 1.0);
}
