import { useCallback } from "react"
import { Objects } from "src/preview/hooks/objects"
import { Programs } from "src/preview/hooks/programs"
import { Resolution } from "src/types"

interface Args {
  gl:         WebGLRenderingContext | null
  objects:    Objects
  programs:   Programs
  resolution: Resolution
}

export function useDrawObjects(args: Args) { 
  const { gl, objects, programs, resolution } = args
  
  return useCallback((time: number) => {
    gl?.viewport(0, 0, resolution.width, resolution.height)
    gl?.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl?.enable(gl.CULL_FACE)
    gl?.enable(gl.DEPTH_TEST)
    gl?.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    
    objects.grid.forEach(grid => programs.grid?.draw(time, grid))
    objects.outline.forEach(outline => programs.outline?.draw(time, outline))
    objects.mesh.forEach(mesh => programs.mesh?.draw(time, mesh))
    objects.wireframe.forEach(wireframe => programs.wireframe?.draw(time, wireframe))
    objects.points.forEach(points => programs.points?.draw(time, points))
}, [gl, objects, programs, resolution])
}
