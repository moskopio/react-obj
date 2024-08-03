import { V3, Vec3 } from "../math/v3"
import { getNormalIndices, getVerticesIndices } from "./indices"
import { RawObj } from "./read"


interface Normals {
  definedNormals: Vec3[]
  smoothNormals:  Vec3[]
}

export function getNormals(obj: RawObj): Normals {
  const normalIndices = getNormalIndices(obj)
  const verticesIndices = getVerticesIndices(obj)
  const vertices = getVertices(obj)

  const definedNormals = normalIndices.length > 0 
    ? getIndexedNormals(obj, normalIndices)
    : []
  const smoothNormals = generateSmoothNormals(vertices, verticesIndices)
  
  return { definedNormals, smoothNormals } 
}

function getIndexedNormals(obj: RawObj, normalIndices: number[]): Vec3[] {
  const allNormals: Vec3[] = []
  const indexedNormals: Vec3[] = []
  const { groups } = obj
  
  groups.forEach(g => g.normals.forEach(v => allNormals.push(v)))
  normalIndices.forEach(i => indexedNormals.push(allNormals[i]))
  
  return indexedNormals
}


export function generateFlatNormals(vertices: Vec3[]): Vec3[] {
  const normals: Vec3[] = []
  
  for (let i = 0; i < vertices.length; i = i + 3) {
    const i0 = i
    const i1 = (i + 1) >= vertices.length ? i : i + 1
    const i2 = (i + 2) >= vertices.length ? i : i + 2
    const v0 = vertices[i0] || V3.normalize([0, 0, 0])
    const v1 = vertices[i1] || V3.normalize([0, 0, 0])
    const v2 = vertices[i2] || V3.normalize([0, 0, 0])
    
    const a = V3.subtract(v1, v0)
    const b = V3.subtract(v2, v0)
    const normal = V3.normalize(V3.cross(a, b))
    
    normals[i0] = normal
    normals[i1] = normal
    normals[i2] = normal
  }
  
  return normals.map(V3.normalize)
}

function generateSmoothNormals(vertices: Vec3[], indices: number[]): Vec3[] {
  const normals: Vec3[] = []
  
  for (let i = 0; i < indices.length; i = i + 3) {
    const i0 = indices[i]
    const i1 = indices[(i + 1) >= indices.length ? i : i + 1]
    const i2 = indices[(i + 2) >= indices.length ? i : i + 2]
    const v0 = vertices[i0] || V3.normalize([0, 0, 0])
    const v1 = vertices[i1] || V3.normalize([0, 0, 0])
    const v2 = vertices[i2] || V3.normalize([0, 0, 0])
    
    const a = V3.subtract(v1, v0)
    const b = V3.subtract(v2, v0)
    const normal = V3.normalize(V3.cross(a, b))
    
    normals[i0] = normals[i0] || [0, 0, 0]
    normals[i1] = normals[i1] || [0, 0, 0]
    normals[i2] = normals[i2] || [0, 0, 0]
    normals[i0] = V3.add(normal, normals[i0])
    normals[i1] = V3.add(normal, normals[i1])
    normals[i2] = V3.add(normal, normals[i2])
  }
  
  return normals.map(V3.normalize)
}

function getVertices(obj: RawObj): Vec3[] {
  const vertices: Vec3[] = []
  
  const { groups } = obj
  groups.forEach(g => g.vertices.forEach(v => vertices.push(v)))
  
  return vertices
}
