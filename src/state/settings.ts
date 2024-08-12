export interface Settings {
  showGrid:           boolean
  showMesh:           boolean
  showNormals:        boolean
  showOutline:        boolean
  showReverseOutline: boolean
  showWireframe:      boolean
  swapYZ:             boolean
  cellShading:        boolean
  flatNormals:        boolean
}

export function createDefaultSettings(): Settings {
  return {
    showGrid:           true,
    showMesh:           true,
    showNormals:        false,
    showOutline:        true,
    showReverseOutline: false, 
    showWireframe:      false,
    swapYZ:             false,
    cellShading:        false,
    flatNormals:        false,
  }
}

const SETTING_ACTIONS = [
  'toggleGrid',
  'toggleMesh',
  'toggleNormals',
  'toggleOutline',
  'toggleReverseOutline',
  'toggleSwapYZ',
  'toggleWireframe',
  'toggleCellShading',
  'toggleFlatNormals',
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
      
    case 'toggleReverseOutline': 
      newState.showReverseOutline = !newState.showReverseOutline
      break
      
    case 'toggleWireframe': 
      newState.showWireframe = !newState.showWireframe
      break
    
    case 'toggleNormals':
      newState.showNormals = !newState.showNormals
      break
      
    case 'toggleGrid':
      newState.showGrid = !newState.showGrid
      break
    
    case 'toggleSwapYZ': 
      newState.swapYZ = !newState.swapYZ
      break
      
    case 'toggleCellShading': 
      newState.cellShading = !newState.cellShading
      break
      
    case 'toggleFlatNormals':
      newState.flatNormals = !newState.flatNormals
  }
  
  return newState
}
