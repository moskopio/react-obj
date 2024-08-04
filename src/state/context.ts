import { createContext, Dispatch, Reducer, useMemo, useReducer } from "react"
import { Camera, CameraAction, cameraReducer, createDefaultCamera } from "./camera"
import { createDefaultSettings, Settings, SettingsAction, settingsReducer } from "./settings"

interface AppState {
  camera:           Camera,
  cameraDispatch:   Dispatch<CameraAction>
  settings:         Settings,
  settingsDispatch: Dispatch<SettingsAction>
}

export const AppContext = createContext<AppState>({
  camera:           createDefaultCamera(),
  cameraDispatch:   () => {},
  settings:         createDefaultSettings(),
  settingsDispatch: () => {},
})

export function useAppState(): AppState {

  const [camera, cameraDispatch] = useReducer<Reducer<Camera, CameraAction>>(cameraReducer, createDefaultCamera())
  const [settings, settingsDispatch] = useReducer<Reducer<Settings, SettingsAction>>(settingsReducer, createDefaultSettings())
  
  return useMemo(() => ({
    camera, cameraDispatch,
    settings, settingsDispatch
  }),[camera, cameraDispatch, settings, settingsDispatch])
}
