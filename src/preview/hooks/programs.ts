import { useMemo } from "react"
import { createGridProgram } from "src/preview/programs/grid"
import { createMeshProgram } from "src/preview/programs/mesh"
import { createOutlineProgram } from "src/preview/programs/outline"
import { createPointsProgram } from "src/preview/programs/points"
import { createWireframeProgram } from "src/preview/programs/wireframe"
import { Program } from "src/types"

export interface Programs {
  mesh?:      Program
  outline?:   Program 
  grid?:      Program
  wireframe?: Program
  points?:    Program
}

interface Props {
  gl: WebGLRenderingContext | null
}

export function usePrograms(props: Props): Programs {
  const { gl } = props
  
  return useMemo(() => {
    const programs: Programs = {}
    if (gl) {
      programs.grid = createGridProgram(gl)
      programs.outline = createOutlineProgram(gl)
      programs.mesh = createMeshProgram(gl)
      programs.wireframe = createWireframeProgram(gl)
      programs.points = createPointsProgram(gl)
    }
    return programs
  }, [gl])
}
