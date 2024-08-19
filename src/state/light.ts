import { DeepPartial } from "../types"

export interface Light {
  distance: number
  rotation: { theta: number, phi: number }
  specular: { intensity: number, enabled: boolean }
}

export function createDefaultLight(): Light {
  return {
    distance: 10,
    rotation: { theta: 45, phi: 0 },
    specular: { intensity: 1000, enabled: true }
  }
}

const LIGHT_ACTIONS = [
  'updateRotation',
  'setThetaRotation',
  'setPhiRotation',
  'setSpecularIntensity',
  'toggleSpecular',
]

export interface LightAction extends DeepPartial<Light> {
  type: typeof LIGHT_ACTIONS[number]
}

export function lightReducer(state: Light, action: LightAction): Light {
  const newState = { ...state }
  
  switch (action.type) {
    case 'updateRotation': 
      newState.rotation = { 
        theta: newState.rotation.theta + action.rotation!.theta!, 
        phi: newState.rotation.phi + action.rotation!.phi!
      }
      break
    
    case 'setThetaRotation': 
      newState.rotation = { ...newState.rotation, theta: action.rotation!.theta! }
      break
  
    case 'setPhiRotation': 
      newState.rotation = { ...newState.rotation, phi: action.rotation!.phi! }
      break
      
    case 'setSpecularIntensity':
        newState.specular.intensity = action.specular!.intensity!
        break
      
    case 'toggleSpecular': 
        newState.specular.enabled = action.specular!.enabled!
        break
  }
  
  newState.rotation.phi = limitAngle(newState.rotation.phi)
  newState.rotation.theta = limitAngle(newState.rotation.theta)
  
  return newState
}

function limitAngle(angle: number): number {
  return angle > -360
    ? angle < 360
      ? angle
      : angle - 720
    : 720 - angle
}
