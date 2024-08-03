import { V3, Vec3 } from "../math/v3"
import { getVerticesIndices } from "./indices"
import { getNormals } from "./normals"
import { RawObj } from "./read"

export interface ParsedObj {
  vertices:       Vec3[]
  indices:        number[]
  definedNormals: Vec3[]
  smoothNormals:  Vec3[]
}

export function parseObj(obj: RawObj): ParsedObj {
  const vertices: Vec3[] = prepareVertices(obj)
  const indices: number[] = getVerticesIndices(obj)
  const { definedNormals, smoothNormals } = getNormals(obj)
  
  return { vertices, indices, definedNormals, smoothNormals }
}

function prepareVertices(obj: RawObj): Vec3[] {
  const vertices: Vec3[] = getAllVertices(obj)
  return vertices.length > 0 ? scaleVertices(vertices): vertices
}

function scaleVertices(vertices: Vec3[]): Vec3[] {
  const { min, max } = getExtents(vertices)
  const range = V3.subtract(max, min)
  const offset = V3.scale(V3.add(min, V3.scale(range, 0.5)), -1)
  const scaling = Math.max(...range)
  const scale = 2 / scaling
  
  return vertices.map(v => V3.scale(V3.add(v, offset), scale))
}

function getAllVertices(obj: RawObj): Vec3[] {
  const vertices: Vec3[] = []
  const { groups } = obj
  groups.forEach(g => g.vertices.forEach(v => vertices.push(v)))
  return vertices
}

interface Size {
  min: Vec3
  max: Vec3
}

function getExtents(vertices: Vec3[]): Size {
  const min: Vec3 = [0, 0, 0]
  const max: Vec3 = [0, 0, 0]
  
  vertices.forEach(v => {
    min[0] = Math.min(min[0], v[0])
    min[1] = Math.min(min[1], v[1])
    min[2] = Math.min(min[2], v[2])

    max[0] = Math.max(max[0], v[0])
    max[1] = Math.max(max[1], v[1])
    max[2] = Math.max(max[2], v[2])
  })
  
  return { min, max }
}
