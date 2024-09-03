import { DeepPartial } from "../types"
import { Color } from "../utils/color"
import { deepSet } from "../utils/merge"

export interface Settings {
  showMesh:      boolean
  swapYZ:        boolean
  grid:          GridSettings
  outline:       OutlineSettings
  normals:       NormalsSettings
  shading:       ShadingSettings
  wireframe:     WireframeSettings
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

interface WireframeSettings {
  enabled:    boolean
  color:      Color
  useShading: boolean
}

interface NormalsSettings {
  useFlat:    boolean
  useDefined: boolean
}

interface ShadingSettings {
  cell: {
    enabled:  boolean
    segments: number
    aa:       number
  }
  gooch: {
    enabled: boolean
  },
  normal: {
    enabled: boolean
    useAbs:  boolean
  }
}

export function createDefaultSettings(): Settings {
  return {
    showMesh:      true,
    swapYZ:        false,
    grid:          createDefaultGrid(),
    outline:       createDefaultOutline(),
    normals:       createDefaultNormalsSettings(),
    shading:       createDefaultShadingSettings(),
    wireframe:     createDefaultWireframe(),
  }
}

function createDefaultGrid(): GridSettings {
  return {
    enabled:      true,
    useTwoValues: true,
    divisions:    4,
    colorA:       [176, 201, 158],
    colorB:       [98, 128, 144],
    weightA:      0.1,
    weightB:      0.03,
  }
} 

function createDefaultOutline(): OutlineSettings {
  return {
    enabled:     true,
    useReverse:  false,
    useTwoValues: false,
    colorA:      [176, 201, 158],
    colorB:      [98, 128, 144],
    weightA:     0.01,
    weightB:     0.02,
  }
}

function createDefaultWireframe(): WireframeSettings {
  return {
    enabled:  false,
    color:    [255, 255, 255],
    useShading: true,
  }
}

function createDefaultNormalsSettings(): NormalsSettings {
  return {
    useFlat:    false,
    useDefined: false,
  }
}

function createDefaultShadingSettings(): ShadingSettings {
  return {
    cell: {
      enabled:  false,
      segments: 5,
      aa:       0.01
    },
    gooch: {
      enabled: false,
    },
    normal: {
      enabled: false,
      useAbs:  true,
    }
  }
}

export type SettingsAction = DeepPartial<Settings>

export function settingsReducer(state: Settings, action: SettingsAction): Settings {
  const newState = deepSet<Settings>(state, action)
  return newState
}
