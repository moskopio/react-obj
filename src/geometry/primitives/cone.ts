import { Primitive } from "./types"
import { V3, Vec2, Vec3 } from "src/math/v3"

export function createCone(segments: number): Primitive {
  const vertices: Vec3[] = []
  const normals: Vec3[] = []
  const uvs: Vec2[] = []
  
  for (let i = 0; i <= segments; i++ ) {
    const a0 = 2 * Math.PI * i / segments
    const a1 = 2 * Math.PI * (i + 1) / segments
    const x0 = Math.cos(a0)
    const y0 = Math.sin(a0)
    const x1 = Math.cos(a1)
    const y1 = Math.sin(a1)
    
    vertices.push([x1, y1, -1])
    vertices.push([ 0,  0,  1])
    vertices.push([x0, y0, -1])
    
    normals.push(V3.normalize([x1, y1, 0]))
    normals.push(V3.normalize([ 0,  0, 1]))
    normals.push(V3.normalize([x0, y0, 0]))
    
    uvs.push([i / segments, 0])
    uvs.push([i / segments, 1])
  }
  
  return { vertices, normals, uvs }
}
