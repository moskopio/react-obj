import { ReactElement, useLayoutEffect, useRef, useState } from "react"
import { useWebGLContext } from "src/webgl/hooks/use-context"
import './WebGLPreview.css'
import { useCameraControls } from "./hooks/camera-controls"
import { useAdjustResolution } from "src/preview/hooks/adjust-resolution"
import { usePrograms } from "src/preview/hooks/programs"

export function WebGLPreview(): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [resolution, setResolution] = useState({ width: window.innerWidth, height: window.innerHeight })
  
  const gl = useWebGLContext({ canvasRef })
  useAdjustResolution({gl, resolution })
  
  usePrograms({gl, resolution })
  
  useCameraControls()
  
  useLayoutEffect(() => {  
    window.addEventListener('resize', updateResolution)
    return () => window.removeEventListener('resize', updateResolution)
    
    function updateResolution(): void {
      const dpr = window.devicePixelRatio
      const displayWidth  = Math.round(window.innerWidth * dpr)
      const displayHeight = Math.round(window.innerHeight * dpr)
    
      setResolution({ width: displayWidth, height: displayHeight })
    }
  }, [gl, setResolution])
  
  return (
    <canvas 
      ref={canvasRef}
      className="webgl-canvas"
      width={resolution.width}
      height={resolution.height}
    />
  )
}
