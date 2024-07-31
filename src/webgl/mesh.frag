precision mediump float;

varying vec3 vNormal;

void main() {
  // gl_FragColor = vec4(1, gl_FragCoord.z / 1.5, 0, 1);
  gl_FragColor = vec4(vNormal, 1);
}
