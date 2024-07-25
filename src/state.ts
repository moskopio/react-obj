import { createContext } from "react"
import { Obj } from "./types"

export const EMPTY_OBJ: Obj = {
  vertex:       [],
  normal:       [],
  texture:      [],
  vertexIndex:  [],
  normalIndex:  [],
  textureIndex: []
}

export const StateContext = createContext({
  obj:    EMPTY_OBJ,
  setObj: (_: Obj) => {}
})
