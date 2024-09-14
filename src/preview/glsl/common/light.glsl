#define AA 0.01
#define SPECULAR_MAX 2000.0
#define SPECULAR_STEP  0.01


struct LightColor {
  bool enabled;
  vec3 color;
};

struct LightIntense {
  bool  enabled;
  vec3  color;
  float intensity;
};

struct Light {
  vec3         position;
  LightColor   diffuse;
  LightIntense specular;
  bool         followsCamera;
  bool         castObjectShadow;
};
