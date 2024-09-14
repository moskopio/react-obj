vec3 getLambertShading(in ShadingCommon common, in Light light) {
  vec3 normal = normalize(common.normal);
  vec3 cameraPosition = normalize(common.cameraPosition);
  vec3 lightPosition = light.followsCamera 
    ? normalize(common.cameraPosition) 
    : normalize(light.position);
  
  float toLightNormal = clamp(dot(lightPosition, normal), 0.0, 1.0);
  float viewAngleNormal = clamp(dot(cameraPosition, normal), 0.0, 1.0);

  float adjustedSpecularIntensity = max(1.0, SPECULAR_MAX - light.specular.intensity);
  float diffuseShade = mix(toLightNormal, 0.0, common.inShadow);
  float specularShade = pow(viewAngleNormal, adjustedSpecularIntensity);
  float fresnelShade = max(0.0, common.fresnel.intensity - viewAngleNormal);
  
  vec3 ambient = common.ambient.color * float(common.ambient.enabled);
  vec3 diffuse = light.diffuse.color * diffuseShade * float(light.diffuse.enabled);
  vec3 specular = light.specular.color * diffuseShade * specularShade * float(light.specular.enabled);
  vec3 fresnel = common.fresnel.color * fresnelShade * float(common.fresnel.enabled) * (1.0 - diffuseShade);
  
  return ambient + diffuse + specular + fresnel;
}

