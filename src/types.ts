export type FileContent = string | ArrayBuffer | null | undefined

export interface Obj {
  vertex:       number[]
  normal:       number[]
  texture:      number[]
  vertexIndex:  number[]
  normalIndex:  number[]
  textureIndex: number[]
}
