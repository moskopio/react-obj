import { flipConstrain } from "../components/utils/common"
import { DeepPartial } from "../types"
import { Color } from "../utils/color"
import { deepSet, deepUpdate } from "../utils/merge"

export interface Light {
  distance: number
  rotation: { theta: number, phi: number }
  ambient:  LightColor,
  diffuse:  LightColor,
  specular: SpecularColor
}

interface LightColor {
  enabled: boolean
  color:   Color
}

interface SpecularColor extends LightColor {
  intensity: number
}

export function createDefaultLight(): Light {
  return {
    distance: 2.5,
    rotation: { theta: 45, phi: 0 },
    ambient:  { enabled: true, color: [25, 25, 25] },
    diffuse:  { enabled: true, color: [128, 128, 128] },
    specular: { enabled: true, color: [255, 255, 255], intensity: 1000 }
  }
}

const LIGHT_ACTIONS = ['set', 'update']

export interface LightAction extends DeepPartial<Light> {
  type: typeof LIGHT_ACTIONS[number]
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
