import { Primitive } from "src/geometry/primitives/types"
import { Vec2, Vec3 } from "src/math/v3"

export function createPlane(xCount: number, zCount: number): Primitive {
  const vertices: Vec3[] = []
  const uvs:      Vec2[] = []
  const normals:  Vec3[] = []

  
  const points = createPointsPlane(xCount, zCount)
  
  const rowLength = xCount + 1
  for (let z = 0; z < xCount; z++) {
    for (let x = 0; x < zCount; x++) {
      // Vertices
      // 1 triangle
      vertices.push(points.vertices[z * rowLength + x])
      vertices.push(points.vertices[(z + 1) * rowLength + x])
      vertices.push(points.vertices[z * rowLength + x + 1])
      // 2 triangle
      vertices.push(points.vertices[(z + 1) * rowLength + x])
      vertices.push(points.vertices[(z + 1) * rowLength + x +1])
      vertices.push(points.vertices[z * rowLength + x + 1])
      
      // normals
      normals.push(points.normals[z * rowLength + x])
      normals.push(points.normals[z * rowLength + x])
      normals.push(points.normals[z * rowLength + x])
      normals.push(points.normals[z * rowLength + x])
      normals.push(points.normals[z * rowLength + x])
      normals.push(points.normals[z * rowLength + x])
      
      // uvs
      // 1 triangle
      uvs.push(points.uvs[z * rowLength + x])
      uvs.push(points.uvs[(z + 1) * rowLength + x])
      uvs.push(points.uvs[z * rowLength + x + 1])
      // 2 triangle
      uvs.push(points.uvs[(z + 1) * rowLength + x])
      uvs.push(points.uvs[(z + 1) * rowLength + x +1])
      uvs.push(points.uvs[z * rowLength + x + 1])
    }
  }
  
  return { vertices, uvs, normals }
}

function createPointsPlane(xCount: number, yCount: number) {
  const vertices: Vec3[] = []
  const uvs:      Vec2[] = []
  const normals:  Vec3[] = []
  
  for (let z = 0; z <= xCount; z++) {
    for (let x = 0; x <= yCount; x++) {
      const u = x / yCount
      const v = z / xCount
      vertices.push([u - 0.5, 0, v - 0.5])
      normals.push([0, 1, 0])
      uvs.push([u, v])
    }
  }
  
  return { vertices, uvs, normals }
}
