import { MutableRefObject, useEffect, useState } from "react"

interface Props {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>
}

export function useWebGLContext(props: Props): WebGLRenderingContext | null {
  const { canvasRef } = props 
  const [context, setContext] = useState<WebGLRenderingContext | null>(null)
  
  useEffect(() => {
    const gl = canvasRef.current?.getContext("webgl", {antialias: true, depth: true })
    const depthTexture = gl?.getExtension('WEBGL_depth_texture')
    
    !gl && console.error('failed to create gl context')
    !depthTexture && console.error('failed to get WEBGL_depth_texture plugin')
    
    gl && depthTexture && setContext(gl)
  }, [canvasRef])
  
  return context
}
