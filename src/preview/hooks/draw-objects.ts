import { useCallback, useContext } from "react"
import { getLookAtMatrices } from "src/geometry/camera"
import { Programs } from "src/preview/hooks/draw-programs"
import { Objects } from "src/preview/hooks/objects"
import { AppContext } from "src/state/context"
import { Resolution } from "src/types"

interface Args {
  gl:         WebGLRenderingContext | null
  objects:    Objects
  programs:   Programs
  resolution: Resolution
}

export function useDrawObjects(args: Args) { 
  const { gl, objects, programs, resolution } = args
  const { camera } = useContext(AppContext)
  
  return useCallback((time: number) => {
    gl?.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl?.viewport(0, 0, resolution.width, resolution.height)
    gl?.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    
    const { projection, view, position } = getLookAtMatrices(camera)
    const cameraValues = { projection, view, cameraPosition: position }
    Object.values(programs).forEach(p => p?.updateViews?.(cameraValues))
    
    objects.grid.forEach(grid => programs.grid?.draw(time, grid))
    objects.outline.forEach(outline => programs.outline?.draw(time, outline))
    objects.mesh.forEach(mesh => programs.mesh?.draw(time, mesh))
    objects.wireframe.forEach(wireframe => programs.wireframe?.draw(time, wireframe))
    objects.points.forEach(points => programs.points?.draw(time, points))
}, [gl, objects, programs, resolution, camera])
}
