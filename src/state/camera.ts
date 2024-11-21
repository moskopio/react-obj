import { flipConstrain } from "src/utils/util"
import { DeepPartial, Rotation, Track } from "src/types"
import { Vec3 } from "src/math/v3"
import { deepSet, deepUpdate } from "src/utils/merge"

export interface Camera { 
  aspectRatio: number
  fov:         number
  zNear:       number
  zFar:        number
  target:      Vec3
  rotation:    Rotation
  dolly:       number
  track:       Track
}

export function createDefaultCamera(): Camera {
  return {
    aspectRatio: 3 / 2,
    fov:         60,
    zNear:       0,
    zFar:        50,
    target:      [0, 0, 0] as Vec3,
    rotation:    { theta: -20, phi: 0 },
    dolly:       2.5,
    track:       { x: 0, y : 0 }
  }
}

export interface CameraAction extends DeepPartial<Camera> {
  type: 'update' | 'set' | 'reset'
}

export function cameraReducer(state: Camera, action: CameraAction): Camera {
  const newState = reduce(state, action)
  return constrain(newState)
}

function reduce(state: Camera, action: CameraAction): Camera {
  const { type, ...actionState } = action
  
  switch (type) {
    case 'update':
      return deepUpdate<Camera>(state, actionState)
    case 'set': 
      return deepSet<Camera>(state, actionState)
    case 'reset':
      return { ...createDefaultCamera(), aspectRatio: state.aspectRatio }
  }
}

function constrain(state: Camera): Camera {
  state.rotation.phi = flipConstrain(state.rotation.phi, -180, 180)
  state.rotation.theta = flipConstrain(state.rotation.theta, -180, 180)
  
  state.track.x = Math.min(10, Math.max(-10, state.track.x), state.track.x)
  state.track.y = Math.min(10, Math.max(-10, state.track.y), state.track.y)
  
  state.dolly = Math.min(10, Math.max(0, state.dolly), state.dolly)
  
  return state
}
