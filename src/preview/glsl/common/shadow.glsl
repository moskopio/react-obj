#define SHADOW_BIAS    0.01
#define SHADOW_SAMPLES 6
#define SHADOW_SPREAD  0.0005

float isInShadow(in sampler2D shadowMap, in vec4 posFromLightView) {
  vec3 toLight = posFromLightView.xyz / posFromLightView.w;
  toLight = toLight * 0.5 + 0.5;
  
  float distance = 0.0;
  float sampleDistance = float(SHADOW_SAMPLES);
  float shadowAdjustment = float(SHADOW_SAMPLES) * 0.5 * SHADOW_SPREAD;
  
  for (int x = 0; x < SHADOW_SAMPLES; x++) {
    for (int y = 0; y < SHADOW_SAMPLES; y++) {
      float xAdjust = float(x) * SHADOW_SPREAD - shadowAdjustment;
      float yAdjust = float(y) * SHADOW_SPREAD - shadowAdjustment;
      distance += texture2D(shadowMap, toLight.xy + vec2(xAdjust, yAdjust)).r;
    }
  }
  distance = distance / (float(SHADOW_SAMPLES) * float(SHADOW_SAMPLES));
  
  return smoothstep(distance, distance + SHADOW_BIAS, toLight.z);
}
