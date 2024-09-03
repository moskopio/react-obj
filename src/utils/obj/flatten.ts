import { Vec3 } from "../math/v3"
import { generateFlatNormals } from "./normals"
import { ParsedObj } from "./parse"

export interface FlattenObj {
  vertices:       Vec3[]
  definedNormals: Vec3[]
  flatNormals:    Vec3[]
  smoothNormals:  Vec3[]
}

export function flattenParsedObj(obj: ParsedObj): FlattenObj {
  const { vertices, definedNormals, smoothNormals, indices } = obj
  const flattenVertices:       Vec3[] = []
  const flattenSmoothNormals:  Vec3[] = []
  
  indices.forEach(i => { 
    flattenVertices.push(vertices[i])
    smoothNormals[i] && flattenSmoothNormals.push(smoothNormals[i])
  })
  
  const flatNormals = generateFlatNormals(flattenVertices)
  
  return { 
    vertices:       flattenVertices, 
    definedNormals,
    flatNormals,
    smoothNormals:  flattenSmoothNormals
  }
}
