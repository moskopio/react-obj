import { useCallback, useContext, useEffect, useRef } from "react"
import { getLightPosition } from "src/geometry/light"
import { Programs } from "src/preview/hooks/draw-programs"
import { Objects } from "src/preview/hooks/objects"
import { AppContext } from "src/state/context"
import { Dict } from "src/types"
import { createDepthFrameBuffer, createDepthTexture } from "src/webgl/framebuffer"

export const SHADOW_RESOLUTION = 2048

interface Args {
  gl:       WebGLRenderingContext | null
  objects:  Objects
  programs: Programs
}

export function useDrawShadows(args: Args) {
  const { gl, objects, programs } = args
  const { scene } = useContext(AppContext)
  
  const texturesRef = useRef<Dict<WebGLTexture | null>>({})
  const framebufferRef = useRef<WebGLFramebuffer | null>(null)
  
  useEffect(() => {
    if (gl) {
      const textures = texturesRef.current
      textures.shadowMap = createDepthTexture(gl, SHADOW_RESOLUTION)
      framebufferRef.current = createDepthFrameBuffer(gl, textures.shadowMap!)
    }
  }, [gl])
  
  
  return useCallback((time: number) => {
    const framebuffer = framebufferRef.current
    const textures = texturesRef.current
    
    if (!framebuffer) return
    
    gl?.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
    gl?.viewport(0, 0, SHADOW_RESOLUTION, SHADOW_RESOLUTION)
    gl?.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    
    const { projection, view, position } = getLightPosition(scene.light)
    const lightValues = {
      projection, 
      view,
      cameraPosition:  position,
      lightProjection: projection,
      lightView:       view,
    }
    Object.values(programs).forEach(p => p?.updateViews?.(lightValues))
    objects.mesh.forEach(mesh => programs.mesh?.draw(time, mesh))
    Object.values(programs).forEach(p => p?.updateTextures?.(textures))
    
  }, [gl, objects, programs, scene])
}
