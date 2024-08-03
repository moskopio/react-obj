precision mediump float;

uniform vec3 uLightDirection;

varying vec3 vNormal;
uniform float uTime;

uniform bool uOutline;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 lightDirection = normalize(uLightDirection);
  float diffuse = dot(lightDirection, normal) * 0.5 + 0.5;
  
  float change = 0.5 + sin(uTime /750.0) / 2.0;
  vec3 ambient = vec3(0.7, 0.7, 0.7);
  
  vec4 color = uOutline 
    ? mix(vec4(0.69, 0.78, 0.61, 1), vec4(0.38, 0.5, 0.56, 1), change)
    : vec4(ambient * diffuse, 1.0);
  
  
  gl_FragColor = color;
}
