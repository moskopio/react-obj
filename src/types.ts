import { Camera } from "src/state/camera"
import { Obj } from "src/state/obj"
import { Scene } from "src/state/scene"
import { Settings } from "src/state/settings"

export type FileContent = string | ArrayBuffer | null | undefined

export interface Dict<T> {
  [key: string]: T | undefined
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

export interface Program {
  cleanup:         () => void
  draw:            (time: number) => void
  updateObj?:      (obj: Obj) => void
  updateCamera?:   (camera: Camera) => void
  updateScene?:    (scene: Scene) => void
  updateSettings?: (settings: Settings) => void
}
