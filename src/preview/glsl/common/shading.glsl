struct CellShading {
  bool  enabled;
  float segments;
  float aa;
};

struct GoochShading {
  bool enabled;
  bool useLight;
  vec3 warmColor;
  vec3 coolColor;
};

struct NormalShading {
  bool enabled;
  bool useAbs;
};

struct Shading {
  CellShading   cell;
  GoochShading  gooch;
  NormalShading normal;
};

struct ShadingCommon {
  vec3         normal;
  vec3         position;
  vec3         cameraPosition;
  LightColor   ambient;
  LightIntense fresnel;
};

