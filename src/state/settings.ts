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

export type SettingsAction = Partial<Settings>

export function settingsReducer(state: Settings, action: SettingsAction): Settings {
  return { ...state, ...action }
}
