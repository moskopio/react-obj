precision mediump float;

attribute vec3 aPosition;
attribute vec3 aNormal;
attribute float aCount;

struct Points {
  vec3 movement;
  vec2 size;
  bool useLight;
  float borderWeight;
  vec3 borderColor;
};

uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uModel;
uniform float uTime;

uniform Points uPoints;

varying vec3 vNormal; 
varying float vCount;
varying vec3 vPosition;


float random(in float seed) {
  return fract(sin(seed * 11.5645) * 36565.453535);
}

void main() {
  vec4 position = uProjection * uView * uModel * vec4(aPosition, 1);
  vec3 normal = normalize(mat3(uModel) * aNormal);
  
  float timeChange = sin(uTime / (200.0 + 500.0 * random(aCount)));
  
  vec3 movementLimits = uPoints.movement;
  
  vec3 randomMovement = vec3(
    -0.5 + random(aPosition.x + aCount),
    -0.5 + random(aPosition.y + aCount),
    -0.5 + random(aPosition.z + aCount));
  
  position.xyz += movementLimits * timeChange * randomMovement;
  
  vNormal = normal;
  vPosition = position.xyz;
  vCount = aCount;
  
  vec2 size = uPoints.size;
  gl_PointSize = size[0] + timeChange * size[1];
  
  gl_Position = position;
  
}
