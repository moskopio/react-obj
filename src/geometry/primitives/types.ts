import { Vec2, Vec3 } from "src/math/v3"

export interface Primitive {
  vertices: Vec3[]
  normals:  Vec3[]
  uvs:      Vec2[]
}
