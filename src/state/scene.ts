import { DeepPartial, Rotation } from "src/types"
import { Color } from "src/utils/color"
import { deepSet, deepUpdate } from "src/utils/merge"
import { flipConstrain } from "src/utils/util"

export interface Scene {
  fresnel: LightColorAndIntense,
  ambient: LightColor,
  light:   Light
}

export interface Light {
  distance:         number
  rotation:         Rotation,
  diffuse:          LightColor,
  specular:         LightColorAndIntense,
  followsCamera:    boolean
  castObjectShadow: boolean
}

interface LightColor {
  enabled: boolean
  color:   Color
}

interface LightColorAndIntense extends LightColor {
  intensity: number
}


export function createDefaultScene(): Scene {
  return {
    ambient: { enabled: true, color: [25, 25, 25] },
    fresnel: { enabled: true, color: [255, 255, 255], intensity: 0.5 },
    light:   createDefaultLight()
  }
}

export function createDefaultLight(): Light {
  return {
    distance:         2.5,
    rotation:         { theta: 45, phi: 0 },
    diffuse:          { enabled: true, color: [128, 128, 128] },
    specular:         { enabled: true, color: [255, 255, 255], intensity: 1000 },
    followsCamera:    false,
    castObjectShadow: true,
  }
}

export interface SceneAction extends DeepPartial<Scene> {
  type: 'update' | 'set'
}

export function sceneReducer(state: Scene, action: SceneAction): Scene {
  const { type, ...actionState } = action
  
  const newState = type === 'update'
    ? deepUpdate<Scene>(state, actionState)
    : deepSet<Scene>(state, actionState)
    
  newState.light.rotation.phi = flipConstrain(newState.light.rotation.phi, - 180, 180)
  newState.light.rotation.theta = flipConstrain(newState.light.rotation.theta, -180, 180)
  
  return newState
}
