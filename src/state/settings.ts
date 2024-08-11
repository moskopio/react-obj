export interface Settings {
  showMesh:      boolean
  showWireframe: boolean
  showOutline:   boolean
  swapYZ:        boolean
  showNormals:   boolean
}

export function createDefaultSettings(): Settings {
  return {
    showMesh:      true,
    showWireframe: false,
    showOutline:   true,
    swapYZ:        false,
    showNormals:   false,
  }
}

const SETTING_ACTIONS = [
  'toggleMesh',
  'toggleOutline',
  'toggleSwapYZ',
  'toggleWireframe',
  'toggleNormals',
] as const

export interface SettingsAction extends Partial<Settings> {
  type: typeof SETTING_ACTIONS[number]
}

export function settingsReducer(state: Settings, action: SettingsAction): Settings {
  const newState = { ...state }
  
  switch (action.type) {
    case 'toggleMesh': 
      newState.showMesh = !newState.showMesh
      break

    case 'toggleOutline': 
      newState.showOutline = !newState.showOutline
      break
      
    case 'toggleWireframe': 
      newState.showWireframe = !newState.showWireframe
      break
    
    case 'toggleSwapYZ': 
      newState.swapYZ = !newState.swapYZ
      break
    
    case 'toggleNormals':
      newState.showNormals = !newState.showNormals
    break
  }
  
  return newState
}
