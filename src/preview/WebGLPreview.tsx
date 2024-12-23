import { ReactElement, useLayoutEffect, useRef, useState } from "react"
import { useAdjustResolution } from "src/preview/hooks/adjust-resolution"
import { useRenderScene } from "src/preview/hooks/render-scene"
import { useWebGLContext } from "src/preview/hooks/webgl-context"
import './WebGLPreview.css'
import { useFileDrop } from "./hooks/file-drop"
import { useMouseCameraControls } from "./hooks/mouse-camera-controls"
import { useTouchCameraControls } from "./hooks/touch-camera-controls"

export function WebGLPreview(): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [resolution, setResolution] = useState({ width: window.innerWidth, height: window.innerHeight })
  
  const gl = useWebGLContext({ canvasRef })
  useAdjustResolution({gl, resolution })
  useRenderScene({gl, resolution })
  useMouseCameraControls()
  useTouchCameraControls({ canvasRef })
  useFileDrop()
  
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
