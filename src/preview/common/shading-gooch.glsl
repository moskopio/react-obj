vec3 getGoochShading(in ShadingCommon common, in Light light, in GoochShading gooch) {
  vec3 normal = normalize(common.normal);
  vec3 lightPosition = light.followsCamera 
    ? normalize(common.cameraPosition) 
    : normalize(light.position);
  vec3 warmColor = gooch.useLight ? light.diffuse.color : gooch.warmColor;
  vec3 coolColor = gooch.useLight ? common.ambient.color : gooch.coolColor;
  
  float weight = 0.5 * (1.0 + dot(normal, lightPosition));
  return (1.0 - weight) * coolColor + weight * warmColor;
}

