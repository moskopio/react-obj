#define SHADOW_BIAS  0.01

float isInShadow(in sampler2D shadowMap, in vec4 posFromLightView) {
  vec3 toLight = posFromLightView.xyz / posFromLightView.w;
  toLight = toLight * 0.5 + 0.5;
  float distance = texture2D(shadowMap, toLight.xy).r;
  return float((toLight.z - SHADOW_BIAS) >= distance);
}
