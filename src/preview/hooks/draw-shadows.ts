import { useCallback, useContext, useEffect, useRef } from "react"
import { getLightPosition } from "src/geometry/light"
import { Objects } from "src/preview/hooks/objects"
import { Programs } from "src/preview/hooks/programs"
import { createDepthProgram } from "src/preview/programs/depth"
import { AppContext } from "src/state/context"
import { ObjContext } from "src/state/obj"
import { Program } from "src/types"
import { createDepthFrameBuffer } from "src/webgl/framebuffer"

export const SHADOW_RESOLUTION = 2048

interface Args {
  gl:       WebGLRenderingContext | null
  objects:  Objects
  programs: Programs
}

export function useDrawShadows(args: Args): (time: number) => void {
  const { gl, objects, programs } = args
  const { scene } = useContext(AppContext)
  const { obj } = useContext(ObjContext)
  const framebufferRef = useRef<WebGLFramebuffer | null>(null)
  const depthProgramRef = useRef<Program | undefined>(undefined)
  
  useEffect(() => {
    if (gl) {
      framebufferRef.current = createDepthFrameBuffer(gl)
      depthProgramRef.current = createDepthProgram(gl)
    }
  }, [gl])
  
  useEffect(() => {
    const depthProgram = depthProgramRef.current
    const values = getLightPosition(scene.light)
    depthProgram?.updateCamera?.(values)
  }, [scene, obj])
  
  
  return useCallback((time: number) => {
    const framebuffer = framebufferRef.current
    const depthProgram = depthProgramRef.current
    
    if (!framebuffer || !depthProgram) return
    gl?.disable(gl.CULL_FACE)
    gl?.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
    gl?.viewport(0, 0, SHADOW_RESOLUTION, SHADOW_RESOLUTION)
    gl?.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    
    objects.mesh.forEach(mesh => depthProgram.draw(time, mesh))
  }, [gl, objects, programs])
}
