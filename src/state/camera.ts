import { flipConstrain } from "src/utils/util"
import { DeepPartial } from "src/types"
import { Vec3 } from "src/math/v3"
import { deepSet, deepUpdate } from "src/utils/merge"

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
    fov:         60,
    zNear:       0,
    zFar:        50,
    target:      [0, 0, 0] as Vec3,
    rotation:    { theta: 0, phi: 0 },
    dolly:       2.5,
    track:       { x: 0, y : 0 }
  }
}

export interface CameraAction extends DeepPartial<Camera> {
  type: 'update' | 'set'
}

export function cameraReducer(state: Camera, action: CameraAction): Camera {
  const { type, ...actionState } = action
  
  const newState = type === 'update'
    ? deepUpdate<Camera>(state, actionState)
    : deepSet<Camera>(state, actionState)
  
  newState.rotation.phi = flipConstrain(newState.rotation.phi, -180, 180)
  newState.rotation.theta = flipConstrain(newState.rotation.theta, -180, 180)
  
  newState.track.x = Math.min(10, Math.max(-10, newState.track.x), newState.track.x)
  newState.track.y = Math.min(10, Math.max(-10, newState.track.y), newState.track.y)
  
  newState.dolly = Math.min(10, Math.max(0, newState.dolly), newState.dolly)
  
  return newState
}
