import { MutableRefObject, useEffect, useState } from "react"

interface Props {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>
}

export function useWebGLContext(props: Props): WebGLRenderingContext | null {
  const { canvasRef } = props 
  const [context, setContext] = useState<WebGLRenderingContext | null>(null)
  
  useEffect(() => {
    const gl = canvasRef.current?.getContext("webgl", {antialias: false, depth: true })
    gl && setContext(gl)
  }, [canvasRef])
  
  return context
}
