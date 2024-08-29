import { DeepPartial } from "../types"
import { Color } from "../utils/color"
import { mergeSet } from "../utils/merge"

export interface Settings {
  showMesh:      boolean
  showNormals:   boolean
  showWireframe: boolean
  swapYZ:        boolean
  cellShading:   boolean
  flatNormals:   boolean
  grid:          GridSettings
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

interface GridSettings {
  enabled:      boolean
  useTwoValues: boolean
  divisions:    number
  colorA:       Color
  colorB:       Color
  weightA:      number
  weightB:      number
}

export function createDefaultSettings(): Settings {
  return {
    showMesh:      true,
    showNormals:   false,
    showWireframe: false,
    swapYZ:        false,
    cellShading:   false,
    flatNormals:   false,
    grid: {
      enabled:      true,
      useTwoValues: true,
      divisions:    4,
      colorA:       [176, 201, 158],
      colorB:       [98, 128, 144],
      weightA:      0.1,
      weightB:      0.03,
    },
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
  return mergeSet<Settings>(state, action)
}
