import { Camera } from "./state/camera"
import { Light } from "./state/light"
import { Obj } from "./state/obj"
import { Settings } from "./state/settings"

export type FileContent = string | ArrayBuffer | null | undefined

export interface Dict<T> {
  [key: string]: T | undefined;
}


export interface Program {
  cleanup:         () => void
  draw:            (time: number) => void
  setObj?:         (obj: Obj) => void
  updateCamera?:   (camera: Camera) => void
  updateLight?:    (light: Light) => void
  updateSettings?: (settings: Settings) => void
}
