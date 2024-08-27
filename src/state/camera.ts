import { flipConstrain } from "../components/utils/common"
import { degToRad } from "../utils/math/angles"
import { Vec3 } from "../utils/math/v3"

export interface Camera { 
  aspectRatio: number
  fov:         number
  zNear:       number
  zFar:        number
  target:      Vec3
  rotation:    { theta: number, phi: number }
  dolly:       number
  track:       { x: number, y: number } 
}

export function createDefaultCamera(): Camera {
  return {
    aspectRatio: 3 / 2,
    fov:         degToRad(60),
    zNear:       0,
    zFar:        50,
    target:      [0, 0, 0] as Vec3,
    rotation:    { theta: 0, phi: 0 },
    dolly:       2.5,
    track:       { x: 0, y : 0 }
  }
}

const CAMERA_ACTIONS = [
  'setDolly',
  'setPhiRotation',
  'setThetaRotation',
  'setAspectRatio',
  'setXTrack',
  'setYTrack',
  'updateDolly',
  'updateRotation',
  'updateTrack',
  'update',
  'set',
] as const

export interface CameraAction extends Partial<Camera> {
  type: typeof CAMERA_ACTIONS[number]
}

export function cameraReducer(state: Camera, action: CameraAction): Camera {
  const newState = { ...state }
  
  switch (action.type) {
    
    case 'updateRotation': 
      newState.rotation = { 
        theta: newState.rotation.theta + action.rotation!.theta, 
        phi: newState.rotation.phi + action.rotation!.phi
      }
      break
      
    case 'setThetaRotation': 
      newState.rotation = { ...newState.rotation, theta: action.rotation!.theta }
      break
    
    case 'setPhiRotation': 
      newState.rotation = { ...newState.rotation, phi: action.rotation!.phi }
      break
      
    case 'setAspectRatio': 
      newState.aspectRatio = action.aspectRatio ?? newState.aspectRatio
    break
  
    case 'updateTrack': 
      newState.track = { 
        x: newState.track.x + action.track!.x, 
        y: newState.track.y + action.track!.y 
      }
      break
    
    case 'setXTrack':
      newState.track = { ...newState.track, x: action.track!.x }
      break
    
    case 'setYTrack':
      newState.track = { ...newState.track, y: action.track!.y }
      break
    
    case 'updateDolly':
      newState.dolly += action.dolly!
    break
      
    case 'setDolly':
      newState.dolly = action.dolly!
      break
  }
  
  newState.rotation.phi = flipConstrain(newState.rotation.phi, -180, 180)
  newState.rotation.theta = flipConstrain(newState.rotation.theta, -180, 180)
  
  newState.track.x = Math.min(10, Math.max(-10, newState.track.x), newState.track.x)
  newState.track.y = Math.min(10, Math.max(-10, newState.track.y), newState.track.y)
  
  newState.dolly = Math.min(10, Math.max(0, newState.dolly), newState.dolly)
  
  return newState
}
