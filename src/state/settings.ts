import { Vec2, Vec3 } from "src/math/v3"
import { DeepPartial } from "src/types"
import { Color } from "src/utils/color"
import { deepSet } from "src/utils/merge"

export interface Settings {
  showMesh:  boolean
  swapYZ:    boolean
  grid:      GridSettings
  outline:   OutlineSettings
  normals:   NormalsSettings
  shading:   ShadingSettings
  wireframe: WireframeSettings
  points:    PointsSettings
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
    enabled:   boolean
    useLight:  boolean 
    coolColor: Color
    warmColor: Color
  },
  normal: {
    enabled: boolean
    useAbs:  boolean
  }
}

interface PointsSettings {
  enabled:      boolean
  movement:     Vec3
  size:         Vec2
  useLight:     boolean
  borderWeight: number
  borderColor:  Color
}

export function createDefaultSettings(): Settings {
  return {
    showMesh:  true,
    swapYZ:    false,
    grid:      createDefaultGrid(),
    outline:   createDefaultOutline(),
    normals:   createDefaultNormals(),
    shading:   createDefaultShading(),
    wireframe: createDefaultWireframe(),
    points:    createDefaultPoints(),
  }
}

function createDefaultGrid(): GridSettings {
  return {
    enabled:      true,
    useTwoValues: true,
    divisions:    8,
    colorA:       [176, 201, 158],
    colorB:       [98, 128, 144],
    weightA:      0.1,
    weightB:      0.03,
  }
} 

function createDefaultOutline(): OutlineSettings {
  return {
    enabled:      true,
    useReverse:   false,
    useTwoValues: false,
    colorA:       [255, 255, 255],
    colorB:       [98, 128, 144],
    weightA:      0.02,
    weightB:      0.02,
  }
}

function createDefaultWireframe(): WireframeSettings {
  return {
    enabled:  false,
    color:    [255, 255, 255],
    useShading: true,
  }
}

function createDefaultPoints(): PointsSettings {
  return {
    enabled:      false,
    movement:     [0.05, 0.05, 0.0],
    size:         [5.0, 5.0],
    useLight:     true,
    borderWeight: 0,
    borderColor:  [0, 0, 0]
  }
}

function createDefaultNormals(): NormalsSettings {
  return {
    useFlat:    false,
    useDefined: false,
  }
}

function createDefaultShading(): ShadingSettings {
  return {
    cell: {
    enabled:  false,
      segments: 5,
      aa:       0.01
    },
    gooch: {
      enabled:   false,
      useLight:  false,
      coolColor: [0, 0, 200],
      warmColor: [220, 180, 20],
    },
    normal: {
      enabled: false,
      useAbs:  true,
    }
  }
}

export interface SettingsAction extends DeepPartial<Settings> {
  type?: 'set' | 'reset'
}

export function settingsReducer(state: Settings, action: SettingsAction): Settings {
  const { type, ...actionState } = action
  
  switch (type) {
    case 'reset':
      return createDefaultSettings()
    case 'set': 
    default:
      return deepSet<Settings>(state, actionState)
  }
}
