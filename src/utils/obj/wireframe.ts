import { Vec3 } from "src/math/v3"
import { FlattenObj } from "./flatten"


export function wireframeFlattenObj(obj: FlattenObj): FlattenObj {
  const { vertices, definedNormals, smoothNormals, flatNormals } = obj
  const wireframeVertices:       Vec3[] = []
  const wireframeDefinedNormals: Vec3[] = []
  const wireframeSmoothNormals:  Vec3[] = []
  const wireframeFlatNormals:    Vec3[] = []
  
  for (let i = 0; i < vertices.length; i = i + 3) {
    wireframeVertices.push(vertices[i])
    wireframeVertices.push(vertices[i + 1])
    wireframeVertices.push(vertices[i + 1])
    wireframeVertices.push(vertices[i + 2])
    wireframeVertices.push(vertices[i + 2])
    wireframeVertices.push(vertices[i])
    
    wireframeDefinedNormals.push(definedNormals[i])
    wireframeDefinedNormals.push(definedNormals[i + 1])
    wireframeDefinedNormals.push(definedNormals[i + 1])
    wireframeDefinedNormals.push(definedNormals[i + 2])
    wireframeDefinedNormals.push(definedNormals[i + 2])
    wireframeDefinedNormals.push(definedNormals[i])
    
    wireframeSmoothNormals.push(smoothNormals[i])
    wireframeSmoothNormals.push(smoothNormals[i + 1])
    wireframeSmoothNormals.push(smoothNormals[i + 1])
    wireframeSmoothNormals.push(smoothNormals[i + 2])
    wireframeSmoothNormals.push(smoothNormals[i + 2])
    wireframeSmoothNormals.push(smoothNormals[i])
    
    wireframeFlatNormals.push(flatNormals[i])
    wireframeFlatNormals.push(flatNormals[i + 1])
    wireframeFlatNormals.push(flatNormals[i + 1])
    wireframeFlatNormals.push(flatNormals[i + 2])
    wireframeFlatNormals.push(flatNormals[i + 2])
    wireframeFlatNormals.push(flatNormals[i])
  }
  
  return { 
    vertices:       wireframeVertices, 
    definedNormals: wireframeDefinedNormals,
    flatNormals:    wireframeSmoothNormals,
    smoothNormals:  wireframeFlatNormals
  }
}
