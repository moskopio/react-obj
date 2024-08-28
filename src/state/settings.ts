import { DeepPartial } from "../types"
import { Color } from "../utils/color"
import { merge } from "../utils/merge"

export interface Settings {
  showGrid:      boolean
  showMesh:      boolean
  showNormals:   boolean
  showWireframe: boolean
  swapYZ:        boolean
  cellShading:   boolean
  flatNormals:   boolean
  outline:       OutlineSettings
}


interface OutlineSettings {
  enabled:      boolean
  useReverse:   boolean
  useTwoValues: boolean
  colorA:       Color
  colorB:       Color
  weightA:      number
  weightB:      number
}

export function createDefaultSettings(): Settings {
  return {
    showGrid:           true,
    showMesh:           true,
    showNormals:        false,
    showWireframe:      false,
    swapYZ:             false,
    cellShading:        false,
    flatNormals:        false,
    outline: {
      enabled:     true,
      useReverse:  false,
      useTwoValues: false,
      colorA:      [176, 201, 158],
      colorB:      [98, 128, 144],
      weightA:     0.01,
      weightB:     0.02,
    }
  }
}

export type SettingsAction = DeepPartial<Settings>

export function settingsReducer(state: Settings, action: SettingsAction): Settings {
  return merge<Settings>(state, action)
}
