import { Vec2, Vec3 } from "../v3"

export interface RawObj {
  groups: Group[]
}

export interface Group { 
  name:     string
  faces:    Face[]
  vertices: Vec3[]
  normals:  Vec3[]
  uvs:      Vec2[]
}

export interface Face {
  vIndices:  number[]
  nIndices:  number[]
  uvIndices: number[]
}
