import { createContext, Dispatch, useMemo, useState } from "react"
import { Vec3 } from "./utils/v3"
import { Obj } from "./utils/obj/types"

export const EMPTY_OBJ: Obj = {
  groups: []
}

type SetStateAction<S> = S | ((prevState: S) => S)

interface StateContextType {
  obj:         Obj
  setObj:      Dispatch<SetStateAction<Obj>>
  rotation:    Vec3
  setRotation: Dispatch<SetStateAction<Vec3>>
  distance:    number
  setDistance: Dispatch<SetStateAction<number>>
}

export const StateContext = createContext<StateContextType>({
  obj:         EMPTY_OBJ,
  setObj:      () => {},
  rotation:    [0,0,0] as Vec3,
  setRotation: () => {},
  distance:    5,
  setDistance: () => {}
})

export function useAppState(): StateContextType {
  const [obj, setObj] = useState<Obj>(EMPTY_OBJ)
  const [rotation, setRotation] = useState<Vec3>([0, 0, 0])
  const [distance, setDistance] = useState(2)
  
  return useMemo(() => ({
    obj, setObj,
    rotation, setRotation,
    distance, setDistance
  }),[obj, setObj, rotation, setRotation, distance, setDistance])
}
