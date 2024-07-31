precision mediump float;

void main() {
  gl_FragColor = vec4(1, gl_FragCoord.z / 1.5, 0, 1);
}
