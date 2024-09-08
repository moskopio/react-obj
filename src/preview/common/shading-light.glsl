vec3 getLightShading(in ShadingCommon common, in Shading shading, in Light light) {
  vec3 lambertColor = getLambertShading(common, light);
  vec3 cellColor = getCellShading(common, light, shading.cell);
  vec3 goochColor = getGoochShading(common, light, shading.gooch);
  vec3 normalColor = shading.normal.useAbs ? abs(common.normal) : common.normal;
  
  vec3 color = lambertColor;
  color = mix(color, cellColor,   float(shading.cell.enabled));
  color = mix(color, goochColor,  float(shading.gooch.enabled));
  color = mix(color, normalColor, float(shading.normal.enabled));
  
  return color;
}

