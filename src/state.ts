import { createContext, Dispatch, SetStateAction, useMemo, useState } from "react"
import { RawObj } from "./obj/read"
import { Vec2, Vec3 } from "./math/v3"

export const EMPTY_OBJ: RawObj = {
  groups: []
}

interface AppState {
  obj:         RawObj
  setObj:      Dispatch<SetStateAction<RawObj>>
  rotation:    Vec3
  setRotation: Dispatch<SetStateAction<Vec3>>
  position:    Vec3
  setPosition: Dispatch<SetStateAction<Vec3>>
}

export const AppContext = createContext<AppState>({
  obj:         EMPTY_OBJ,
  setObj:      () => {},
  rotation:    [0,0,0] as Vec3,
  setRotation: () => {},
  position:    [0,0,0] as Vec3,
  setPosition:  () => {},
})

export function useAppState(): AppState {
  const [obj, setObj] = useState<RawObj>(EMPTY_OBJ)
  const [rotation, setRotation] = useState<Vec3>([0, 0, 0])
  const [position, setPosition] = useState<Vec3>([0, 0, 2])
  
  return useMemo(() => ({
    obj, setObj,
    rotation, setRotation,
    position, setPosition,
  }),[obj, setObj, rotation, setRotation, position, setPosition])
}

