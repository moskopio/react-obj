import { Primitive } from "src/geometry/primitives/types"
import { M4, Matrix4 } from "src/math/m4"
import { V3, Vec3 } from "src/math/v3"

export function transformPrimitive(primitive: Primitive, matrix: Matrix4): Primitive {
  const { uvs } = primitive
  const vertices: Vec3[] = []
  const normals:  Vec3[] = []
  
  const inverseMatrix = M4.inverse(matrix)
  
  primitive.vertices.forEach((v: Vec3) => vertices.push(V3.multiply(v, matrix)))
  primitive.normals.forEach((n: Vec3) => normals.push(V3.multiply(n, inverseMatrix)))
  
  return { vertices, normals, uvs }
}
