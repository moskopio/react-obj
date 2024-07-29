attribute vec3 aPos;

uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uWorld;

uniform mat4 mvp;

void main() {
  gl_Position = uProjection * uView * uWorld * vec4(aPos, 1);
}
