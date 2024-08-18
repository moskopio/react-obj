
export interface Light {
  distance: number
  rotation: { theta: number, phi: number }
}

export function createDefaultLight(): Light {
  return {
    distance: 2.5,
    rotation: { theta: 0, phi: 0 },
  }
}


const LIGHT_ACTIONS = [
  'updateRotation'
]

export interface LightAction extends Partial<Light> {
  type: typeof LIGHT_ACTIONS[number]
}

export function lightReducer(state: Light, action: LightAction): Light {
  const newState = { ...state }

  switch (action.type) {
  case 'updateRotation': 
    newState.rotation = { 
      theta: newState.rotation.theta + action.rotation!.theta, 
      phi: newState.rotation.phi + action.rotation!.phi
    }
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
