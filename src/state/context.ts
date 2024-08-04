import { createContext, Dispatch, Reducer, SetStateAction, useMemo, useReducer, useState } from "react"
import { RawObj } from "../obj/read"
import { Camera, CameraAction, cameraReducer, createDefaultCamera } from "./camera"
import { createDefaultSettings, Settings, SettingsAction, settingsReducer } from "./settings"

const EMPTY_OBJ: RawObj = {
  groups: []
}

interface AppState {
  obj:              RawObj
  setObj:           Dispatch<SetStateAction<RawObj>>
  camera:           Camera,
  cameraDispatch:   Dispatch<CameraAction>
  settings:         Settings,
  settingsDispatch: Dispatch<SettingsAction>
}

export const AppContext = createContext<AppState>({
  obj:              EMPTY_OBJ,
  setObj:           () => {},
  camera:           createDefaultCamera(),
  cameraDispatch:   () => {},
  settings:         createDefaultSettings(),
  settingsDispatch: () => {},
})

export function useAppState(): AppState {
  const [obj, setObj] = useState<RawObj>(EMPTY_OBJ)
  const [camera, cameraDispatch] = useReducer<Reducer<Camera, CameraAction>>(cameraReducer, createDefaultCamera())
  const [settings, settingsDispatch] = useReducer<Reducer<Settings, SettingsAction>>(settingsReducer, createDefaultSettings())
  
  return useMemo(() => ({
    obj, setObj,
    camera, cameraDispatch,
    settings, settingsDispatch
  }),[obj, setObj, camera, cameraDispatch, settings, settingsDispatch])
}
