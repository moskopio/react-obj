import { ReactElement, useRef } from "react"
import './WebGLPreview.css'
import { useCameraControls } from "./camera-controls"
import { useMeshDrawer } from "./use-mesh-drawer"
import { useWebGLContext } from "../webgl/use-context"

const PREVIEW_WIDTH = 600
const PREVIEW_HEIGHT = 400


export function WebGLPreview(): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gl = useWebGLContext({ canvasRef })
  useMeshDrawer({ gl, width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT } )
  useCameraControls({ canvasRef })
  
  return (
    <canvas 
      ref={canvasRef} 
      className="webgl-canvas" 
      width={PREVIEW_WIDTH} 
      height={PREVIEW_HEIGHT} 
    />
  )
}
