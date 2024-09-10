import { Vec3 } from "src/math/v3"
import { getVerticesIndices } from "./indices"
import { getNormals } from "./normals"
import { RawObj, ParsedObj } from "./types"


export function parseObj(obj: RawObj): ParsedObj {
  const vertices: Vec3[] = getAllVertices(obj)
  const indices: number[] = getVerticesIndices(obj)
  const { definedNormals, smoothNormals } = getNormals(obj)
  
  return { vertices, indices, definedNormals, smoothNormals }
}

function getAllVertices(obj: RawObj): Vec3[] {
  const vertices: Vec3[] = []
  const { groups } = obj
  groups.forEach(g => g.vertices.forEach(v => vertices.push(v)))
  return vertices
}
