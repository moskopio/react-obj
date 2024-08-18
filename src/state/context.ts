import { createContext, Dispatch, Reducer, useMemo, useReducer } from "react"
import { Camera, CameraAction, cameraReducer, createDefaultCamera } from "./camera"
import { createDefaultSettings, Settings, SettingsAction, settingsReducer } from "./settings"
import { createDefaultLight, Light, LightAction, lightReducer } from "./light"

interface AppState {
  camera:           Camera,
  cameraDispatch:   Dispatch<CameraAction>
  settings:         Settings,
  settingsDispatch: Dispatch<SettingsAction>,
  light:            Light,
  lightDispatch:    Dispatch<LightAction>,
}

export const AppContext = createContext<AppState>({
  camera:           createDefaultCamera(),
  cameraDispatch:   () => {},
  settings:         createDefaultSettings(),
  settingsDispatch: () => {},
  light:            createDefaultLight(),
  lightDispatch:    () => {},
})

export function useAppState(): AppState {

  const [camera, cameraDispatch] = useReducer<Reducer<Camera, CameraAction>>(cameraReducer, createDefaultCamera())
  const [settings, settingsDispatch] = useReducer<Reducer<Settings, SettingsAction>>(settingsReducer, createDefaultSettings())
  const [light, lightDispatch] = useReducer<Reducer<Light, LightAction>>(lightReducer, createDefaultLight())
  
  return useMemo(() => ({
    camera, cameraDispatch,
    settings, settingsDispatch,
    light, lightDispatch
  }),[camera, cameraDispatch, settings, settingsDispatch, light, lightDispatch])
}
