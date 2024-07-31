import { createContext } from "react"
import { Obj } from "./types"
import { Vec3 } from "./utils/v3"

export const EMPTY_OBJ: Obj = {
  vertex:       [],
  normal:       [],
  texture:      [],
  vertexIndex:  [],
  normalIndex:  [],
  textureIndex: []
}

export const StateContext = createContext({
  obj:         EMPTY_OBJ,
  setObj:      (_: Obj) => {},
  rotation:    [0,0,0] as Vec3,
  setRotation: (_: Vec3) => {},
  distance:    5,
  setDistance: (_: number) => {}
})
