import { Vec3 } from "../utils/math/v3"
import { getVerticesIndices } from "./indices"
import { getNormals } from "./normals"
import { RawObj } from "./read"

export interface ParsedObj {
  vertices:       Vec3[]
  indices:        number[]
  definedNormals: Vec3[]
  smoothNormals:  Vec3[]
  boundingBox:    [Vec3, Vec3]
}

export function parseObj(obj: RawObj): ParsedObj {
  const vertices: Vec3[] = getAllVertices(obj)
  const indices: number[] = getVerticesIndices(obj)
  const { definedNormals, smoothNormals } = getNormals(obj)
  const boundingBox = getBoundingBox(vertices)
  
  return { vertices, indices, definedNormals, smoothNormals, boundingBox }
}

function getAllVertices(obj: RawObj): Vec3[] {
  const vertices: Vec3[] = []
  const { groups } = obj
  groups.forEach(g => g.vertices.forEach(v => vertices.push(v)))
  return vertices
}

function getBoundingBox(vertices: Vec3[]): [Vec3, Vec3] {
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

