import { DeepPartial } from "src/types"
import { Color } from "src/utils/color"
import { deepSet, deepUpdate } from "src/utils/merge"
import { flipConstrain } from "src/utils/util"

export interface Light {
  distance: number
  rotation:     { theta: number, phi: number }
  ambient:      LightColor,
  diffuse:      LightColor,
  specular:     LightColorAndIntense,
  fresnel:      LightColorAndIntense,
  followsCamera: boolean
}

interface LightColor {
  enabled: boolean
  color:   Color
}

interface LightColorAndIntense extends LightColor {
  intensity: number
}

export function createDefaultLight(): Light {
  return {
    distance:     2.5,
    rotation:     { theta: 45, phi: 0 },
    ambient:      { enabled: true, color: [25, 25, 25] },
    diffuse:      { enabled: true, color: [128, 128, 128] },
    specular:     { enabled: true, color: [255, 255, 255], intensity: 1000 },
    fresnel:      { enabled: true, color: [255, 255, 255], intensity: 0.5 },
    followsCamera: false
  }
}

export interface LightAction extends DeepPartial<Light> {
  type: 'update' | 'set'
}

export function lightReducer(state: Light, action: LightAction): Light {
  const { type, ...actionState } = action
  
  const newState = type === 'update'
    ? deepUpdate<Light>(state, actionState)
    : deepSet<Light>(state, actionState)
    
  newState.rotation.phi = flipConstrain(newState.rotation.phi, - 180, 180)
  newState.rotation.theta = flipConstrain(newState.rotation.theta, -180, 180)
  
  return newState
}
