import { createContext, Dispatch, SetStateAction, useMemo, useState } from "react"
import { RawObj } from "./utils/obj/types"
import { Vec2, Vec3 } from "./utils/v3"
import { Settings } from "./types"

export const EMPTY_OBJ: RawObj = {
  groups: []
}

export const DEFAULT_SETTINGS = {
  swapXZ: false,
  forceCalculatedNormals: false,
  viewPort: [600, 400] as Vec2
}

interface AppState {
  obj:         RawObj
  setObj:      Dispatch<SetStateAction<RawObj>>
  rotation:    Vec3
  setRotation: Dispatch<SetStateAction<Vec3>>
  distance:    number
  setDistance: Dispatch<SetStateAction<number>>
  settings:    Partial<Settings>
  setSettings: Dispatch<SetStateAction<Partial<Settings>>>
}

export const AppContext = createContext<AppState>({
  obj:         EMPTY_OBJ,
  setObj:      () => {},
  rotation:    [0,0,0] as Vec3,
  setRotation: () => {},
  distance:    5,
  setDistance: () => {},
  settings:    {},
  setSettings: () => {}
})

export function useAppState(): AppState {
  const [obj, setObj] = useState<RawObj>(EMPTY_OBJ)
  const [rotation, setRotation] = useState<Vec3>([0, 0, 0])
  const [distance, setDistance] = useState(2)
  const [settings, setSettings] = useState<Partial<Settings>>(DEFAULT_SETTINGS)
  
  return useMemo(() => ({
    obj, setObj,
    rotation, setRotation,
    distance, setDistance,
    settings, setSettings
  }),[obj, setObj, rotation, setRotation, distance, setDistance, settings, setSettings])
}

