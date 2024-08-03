import { Vec2 } from "./math/v3"

export type FileContent = string | ArrayBuffer | null | undefined

export interface Settings {
  swapXZ:                 boolean
  forceCalculatedNormals: boolean
  viewPort:               Vec2
}

export interface Dict<T> {
  [key: string]: T | undefined;
}
