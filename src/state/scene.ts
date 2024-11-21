import { DeepPartial, Rotation } from "src/types"
import { Color } from "src/utils/color"
import { deepSet, deepUpdate } from "src/utils/merge"
import { flipConstrain } from "src/utils/util"

export interface Scene {
  fresnel: LightColorAndIntense
  ambient: LightColor
  light:   Light
}

export interface Light {
  distance:         number
  rotation:         Rotation
  diffuse:          LightColor
  specular:         LightColorAndIntense
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
    ambient: { enabled: true, color: [25, 0, 25] },
    fresnel: { enabled: true, color: [255, 0, 0], intensity: 0.6 },
    light:   createDefaultLight()
  }
}

export function createDefaultLight(): Light {
  return {
    distance:         2.5,
    rotation:         { theta: 85, phi: -45 },
    diffuse:          { enabled: true, color: [0, 200, 200] },
    specular:         { enabled: true, color: [255, 255, 255], intensity: 1000 },
    followsCamera:    false,
    castObjectShadow: true,
  }
}

export interface SceneAction extends DeepPartial<Scene> {
  type: 'update' | 'set' |'reset'
}

export function sceneReducer(state: Scene, action: SceneAction): Scene {
  const newState = reduce(state, action)  
  return constrain(newState)
}

function reduce(state: Scene, action: SceneAction): Scene {
  const { type, ...actionState } = action
  
  switch (type) {
    case 'update':
      return deepUpdate<Scene>(state, actionState)
    case 'set': 
      return deepSet<Scene>(state, actionState)
    case 'reset':
      return createDefaultScene()
  }
}

function constrain(state: Scene): Scene {
  state.light.rotation.phi = flipConstrain(state.light.rotation.phi, - 180, 180)
  state.light.rotation.theta = flipConstrain(state.light.rotation.theta, -180, 180)
  
  return state
}
