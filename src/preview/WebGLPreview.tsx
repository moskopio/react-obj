import { ReactElement, useLayoutEffect, useRef, useState } from "react"
import './WebGLPreview.css'
import { useCameraControls } from "./hooks/camera-controls"
import { usePrograms } from "./hooks/programs"
import { useWebGLContext } from "../webgl/hooks/use-context"

export function WebGLPreview(): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [resolution, setResolution] = useState({ width: window.innerWidth, height: window.innerHeight })
  
  const gl = useWebGLContext({ canvasRef })
  usePrograms({ gl, resolution })
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
