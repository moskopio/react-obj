import { Vec3 } from "src/math/v3"
import { generateFlatNormals } from "./normals"
import { FlattenObj, ParsedObj } from "./types"

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
