import { createContext, Dispatch, Reducer, useMemo, useReducer } from "react"
import { Camera, CameraAction, cameraReducer, createDefaultCamera } from "./camera"
import { createDefaultScene, Scene, SceneAction, sceneReducer } from "./scene"
import { createDefaultSettings, Settings, SettingsAction, settingsReducer } from "./settings"

interface AppState {
  camera:           Camera,
  cameraDispatch:   Dispatch<CameraAction>
  settings:         Settings,
  settingsDispatch: Dispatch<SettingsAction>,
  scene:            Scene,
  sceneDispatch:    Dispatch<SceneAction>,
}

export const AppContext = createContext<AppState>({
  camera:           createDefaultCamera(),
  cameraDispatch:   () => {},
  settings:         createDefaultSettings(),
  settingsDispatch: () => {},
  scene:            createDefaultScene(),
  sceneDispatch:    () => {},
})

export function useAppState(): AppState {

  const [camera, cameraDispatch] = useReducer<Reducer<Camera, CameraAction>>(cameraReducer, createDefaultCamera())
  const [settings, settingsDispatch] = useReducer<Reducer<Settings, SettingsAction>>(settingsReducer, createDefaultSettings())
  const [scene, sceneDispatch] = useReducer<Reducer<Scene, SceneAction>>(sceneReducer, createDefaultScene())
  
  return useMemo(() => ({
    camera, cameraDispatch,
    settings, settingsDispatch,
    scene, sceneDispatch
  }),[camera, cameraDispatch, settings, settingsDispatch, scene, sceneDispatch])
}
