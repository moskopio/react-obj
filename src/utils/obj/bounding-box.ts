import { Vec3 } from "src/math/v3"

export function getBoundingBox(vertices: Vec3[]): [Vec3, Vec3] {
  const min: Vec3 = [...vertices[0] || [0, 0, 0]]
  const max: Vec3 = [...vertices[0] || [0, 0, 0]]
  
  vertices.forEach(v => {
    min[0] = Math.min(min[0], v[0])
    min[1] = Math.min(min[1], v[1])
    min[2] = Math.min(min[2], v[2])

    max[0] = Math.max(max[0], v[0])
    max[1] = Math.max(max[1], v[1])
    max[2] = Math.max(max[2], v[2])
  })
  
  return [min, max]
}
