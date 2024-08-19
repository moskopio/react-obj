import { Camera } from "./state/camera"
import { Light } from "./state/light"
import { Obj } from "./state/obj"
import { Settings } from "./state/settings"

export type FileContent = string | ArrayBuffer | null | undefined

export interface Dict<T> {
  [key: string]: T | undefined;
}

export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>
} : T

export interface Program {
  cleanup:         () => void
  draw:            (time: number) => void
  updateObj?:      (obj: Obj) => void
  updateCamera?:   (camera: Camera) => void
  updateLight?:    (light: Light) => void
  updateSettings?: (settings: Settings) => void
}
