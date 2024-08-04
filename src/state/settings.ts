export interface Settings {
  showMesh:      boolean
  showWireframe: boolean
  showOutline:   boolean
}

export function createDefaultSettings(): Settings {
  return {
    showMesh:      true,
    showWireframe: false,
    showOutline:   true
  }
}

export interface SettingsAction extends Partial<Settings> {
  type: 'toggleMesh' | 'toggleWireframe' | 'toggleOutline'
}

export function settingsReducer(state: Settings, action: SettingsAction): Settings {
  const newState = { ...state }
  
  console.log(newState)
    
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
  }
  
  return newState
}
