import { flipConstrain } from "../components/utils/common"
import { DeepPartial } from "../types"
import { Vec3 } from "../utils/math/v3"

export interface Light {
  distance: number
  rotation: { theta: number, phi: number }
  ambient:  { color: Vec3 },
  diffuse:  { color: Vec3 },
  specular: { color: Vec3, intensity: number, enabled: boolean }
}

export function createDefaultLight(): Light {
  return {
    distance: 2.5,
    rotation: { theta: 45, phi: 0 },
    ambient:  { color: [25, 25, 25] },
    diffuse:  { color: [128, 128, 128] },
    specular: { color: [255, 255, 255], intensity: 1000, enabled: true }
  }
}

const LIGHT_ACTIONS = [
  'updateRotation',
  'setThetaRotation',
  'setPhiRotation',
  'setSpecularIntensity',
  'toggleSpecular',
  'updateAmbientColor',
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
    
    case 'updateAmbientColor': 
      newState.ambient.color = action.ambient!.color! as Vec3
      break
      
    case 'updateDiffuseColor': 
      newState.diffuse.color = action.diffuse!.color! as Vec3
      break
    
    case 'updateSpecularColor': 
      newState.specular.color = action.specular!.color! as Vec3
      break
  }
  
  newState.rotation.phi = flipConstrain(newState.rotation.phi, - 180, 180)
  newState.rotation.theta = flipConstrain(newState.rotation.theta, -180, 180)
  
  return newState
}
