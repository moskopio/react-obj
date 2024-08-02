import { Vec2 } from "./utils/v3"

export type FileContent = string | ArrayBuffer | null | undefined

export interface Settings {
  swapXZ:                 boolean
  forceCalculatedNormals: boolean
  viewPort:               Vec2
}

