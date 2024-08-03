import { Vec3 } from "./math/v3"
import { RawObj } from "./obj/read"

export type FileContent = string | ArrayBuffer | null | undefined

export interface Dict<T> {
  [key: string]: T | undefined;
}


export interface Program {
  setObj:       (obj: RawObj) => void
  updateCamera: (rotation: Vec3, position: Vec3) => void
  draw:         (time: number) => void
}
