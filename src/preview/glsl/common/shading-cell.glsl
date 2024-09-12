float smoothCeil(in float x, in float aa) {
  return ceil(x) - float(aa > fract(x)) * smoothstep(aa, 0.0, fract(x));
}

vec3 getCellShading(in ShadingCommon common, in Light light, in CellShading cell) {
  vec3 normal = normalize(common.normal);
  vec3 cameraPosition = normalize(common.cameraPosition);
  vec3 lightPosition = light.followsCamera 
    ? normalize(common.cameraPosition) 
    : normalize(light.position);
  float segments = cell.segments;
  float aa = cell.aa;
  
  float toLightNormal = clamp(dot(lightPosition, normal), 0.0, 1.0);
  float viewAngleNormal = clamp(dot(cameraPosition, normal), 0.0, 1.0);
  
  float adjustedSpecularIntensity = max(1.0, SPECULAR_MAX - light.specular.intensity);
  float diffuseShade = clamp(smoothCeil(toLightNormal * segments, aa) / segments, 0.0, 1.0);
  float specularShade = smoothstep(SPECULAR_STEP, SPECULAR_STEP + aa, pow(viewAngleNormal, adjustedSpecularIntensity));
  float fresnelShade = max(0.0, common.fresnel.intensity - smoothCeil(viewAngleNormal * segments, aa) / segments);

  vec3 ambient = common.ambient.color * float(common.ambient.enabled);
  vec3 diffuse = diffuseShade * light.diffuse.color * float(light.diffuse.enabled);
  vec3 specular = diffuseShade * specularShade * light.specular.color * float(light.specular.enabled);
  vec3 fresnel = fresnelShade * common.fresnel.color * float(common.fresnel.enabled);
  
  return ambient + diffuse + specular + fresnel;
}

