import { Camera } from "./state/camera"
import { Obj } from "./state/obj"
import { Settings } from "./state/settings"

export type FileContent = string | ArrayBuffer | null | undefined

export interface Dict<T> {
  [key: string]: T | undefined;
}


export interface Program {
  setObj:         (obj: Obj) => void
  updateSettings: (settings: Settings) => void
  updateCamera:   (camera: Camera) => void
  draw:           (time: number) => void
}
