import { Vec2, Vec3 } from "src/math/v3"

export interface Obj {
  raw:         RawObj
  parsed:      ParsedObj
  flat:        FlattenObj
  wireframe:   FlattenObj
  parsingTime: number
  name:        string
}

export interface FlattenObj {
  vertices:       Vec3[]
  definedNormals: Vec3[]
  flatNormals:    Vec3[]
  smoothNormals:  Vec3[]
}

export interface ParsedObj {
  vertices:       Vec3[]
  indices:        number[]
  definedNormals: Vec3[]
  smoothNormals:  Vec3[]
  boundingBox:    [Vec3, Vec3]
}

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
