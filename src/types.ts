import { Matrix4 } from "src/math/m4"
import { Vec3 } from "src/math/v3"
import { Scene } from "src/state/scene"
import { Settings } from "src/state/settings"

export type FileContent = string | ArrayBuffer | null | undefined

export interface Dict<T> {
  [key: string]: T | undefined
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

export interface Geometry extends Dict<Float32Array> {
  count: Float32Array
}

export interface Object3D {
  getGeometry:     () => Geometry
  getModel:        () => number[]
  updateSettings?: (settings: Settings) => void
}

export type ViewMatrices = Dict<Matrix4 | Vec3>

export interface Program {
  cleanup:         () => void
  draw:            (time: number, object: Object3D) => void
  updateViews?:    (views: ViewMatrices) => void
  updateScene?:    (scene: Scene) => void
  updateSettings?: (settings: Settings) => void 
  updateTextures?: (textures: Dict<WebGLTexture>) => void
}

export interface Resolution {
  width:  number
  height: number
}
