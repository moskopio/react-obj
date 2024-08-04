import { degToRad } from "../math/angles"
import { V3, Vec3 } from "../math/v3"

export interface Camera { 
  aspectRatio: number
  fov:         number
  zNear:       number
  zFar:        number
  target:      Vec3
  rotation:    Vec3
  position:    Vec3
}

export function createDefaultCamera(): Camera {
  return {
    aspectRatio: 3 / 2,
    fov:         degToRad(60),
    zNear:       -10,
    zFar:        50,
    target:      [0, 0, 0] as Vec3,
    rotation:    [0, 0, 0] as Vec3,
    position:    [0, 0, 2.5] as Vec3,
  }
}

export interface CameraAction extends Partial<Camera> {
  type: 'updateRotation' | 'updatePosition' | 'setXRotation' | 'setYRotation' | 'setZPosition'
}

export function cameraReducer(state: Camera, action: CameraAction): Camera {
  const newState = { ...state }
  
  switch (action.type) { 
    case 'updateRotation': 
      newState.rotation = V3.add(state.rotation, action.rotation!)
      break
      
    case 'setXRotation': 
      newState.rotation = [action.rotation![0], newState.rotation[1], newState.rotation[2]]
      break
    
    case 'setYRotation': 
      newState.rotation = [newState.rotation[0], action.rotation![1], newState.rotation[2]]
      break
  
    case 'updatePosition': 
      newState.position = V3.add(newState.position, action.position!)
      break
      
    case 'setZPosition':
      newState.position = [newState.position[0], newState.position[1], action.position![2]]
  }
  
  newState.rotation = V3.limit(newState.rotation, -360, 360)
  newState.position = V3.limit(newState.position, 0, 10)
  
  return newState
}
