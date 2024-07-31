import { createContext } from "react"
import { Vec3 } from "./utils/v3"
import { Obj } from "./utils/obj/types"

export const EMPTY_OBJ: Obj = {
  groups: []
}

export const StateContext = createContext({
  obj:         EMPTY_OBJ,
  setObj:      (_: Obj) => {},
  rotation:    [0,0,0] as Vec3,
  setRotation: (_: Vec3) => {},
  distance:    5,
  setDistance: (_: number) => {}
})
