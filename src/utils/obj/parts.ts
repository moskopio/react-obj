import { Vec2, Vec3 } from "../v3"
import { Obj } from "./types"

export function getVertices(obj: Obj): Vec3[] {
  const vertices: Vec3[] = []
  const { groups } = obj
  groups.forEach(g => g.vertices.forEach(v => vertices.push(v)))
  return vertices
}

export function getNormals(obj: Obj): Vec3[] {
  const normals: Vec3[] = []
  const { groups } = obj
  groups.forEach(g => g.normals.forEach(v => normals.push(v)))
  return normals
}

export function getUVs(obj: Obj): Vec2[] {
  const uvs: Vec2[] = []
  const { groups } = obj
  groups.forEach(g => g.uvs.forEach(uv => uvs.push(uv)))
  return uvs
}


export function getVerticesIndices(obj: Obj): number[] {
  const vIndices: number[] = []
  const { groups } = obj
  groups.forEach(g => g.faces.forEach(f => {
    const trianglesCount = f.vIndices.length - 2
    
    for (let i = 0; i < trianglesCount; ++i) {
      vIndices.push(f.vIndices[0])
      vIndices.push(f.vIndices[i + 1])
      vIndices.push(f.vIndices[i + 2])
    }
  }))
  return vIndices
}

export function getUVsIndices(obj: Obj): number[] {
  const uvIndices: number[] = []
  const { groups } = obj
  groups.forEach(g => g.faces.forEach(f => {
    const trianglesCount = f.uvIndices.length - 2
    
    for (let i = 0; i < trianglesCount; ++i) {
      uvIndices.push(f.uvIndices[i])
      uvIndices.push(f.uvIndices[i + 1])
      uvIndices.push(f.uvIndices[i + 2])
    }
  }))
  return uvIndices
}

export function getNormalIndices(obj: Obj): number[] {
  const nIndices: number[] = []
  const { groups } = obj
  groups.forEach(g => g.faces.forEach(f => {
    const trianglesCount = f.nIndices.length - 2
    
    for (let i = 0; i < trianglesCount; ++i) {
      nIndices.push(f.nIndices[i])
      nIndices.push(f.nIndices[i + 1])
      nIndices.push(f.nIndices[i + 2])
    }
  }))
  return nIndices
}


export function getAllVerticesFromFaces(obj: Obj): Vec3[] {
  const faceVertices: Vec3[] = []
  const vertices = getVertices(obj)
  const vIndices = getVerticesIndices(obj)
  vIndices.forEach(i => faceVertices.push(vertices[i]))
  return faceVertices
}

export function getAllNormalsFromFaces(obj: Obj): Vec3[] {
  const faceNormals: Vec3[] = []
  const normals = getNormals(obj)
  const vIndices = getNormalIndices(obj)
  vIndices.forEach(i => faceNormals.push(normals[i]))
  return faceNormals
}


export function getAllUVsFromFaces(obj: Obj): Vec2[] {
  const faceUVs: Vec2[] = []
  const uvs = getUVs(obj)
  const vIndices = getUVsIndices(obj)
  vIndices.forEach(i => faceUVs.push(uvs[i]))
  return faceUVs
}
