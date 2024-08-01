import { createContext, Dispatch, SetStateAction, useMemo, useState } from "react"
import { Obj } from "./utils/obj/types"
import { Vec3 } from "./utils/v3"

export const EMPTY_OBJ: Obj = {
  groups: []
}

interface AppState {
  obj:         Obj
  setObj:      Dispatch<SetStateAction<Obj>>
  rotation:    Vec3
  setRotation: Dispatch<SetStateAction<Vec3>>
  distance:    number
  setDistance: Dispatch<SetStateAction<number>>
}

export const AppContext = createContext<AppState>({
  obj:         EMPTY_OBJ,
  setObj:      () => {},
  rotation:    [0,0,0] as Vec3,
  setRotation: () => {},
  distance:    5,
  setDistance: () => {}
})

export function useAppState(): AppState {
  const [obj, setObj] = useState<Obj>(EMPTY_OBJ)
  const [rotation, setRotation] = useState<Vec3>([0, 0, 0])
  const [distance, setDistance] = useState(2)
  
  return useMemo(() => ({
    obj, setObj,
    rotation, setRotation,
    distance, setDistance
  }),[obj, setObj, rotation, setRotation, distance, setDistance])
}
