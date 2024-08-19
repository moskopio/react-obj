import { ReactElement, useRef } from "react"
import { useWebGLContext } from "../../webgl/use-context"
import { useLightControls } from "./light-controls"
import { useLightPreviewProgram } from "./light-program"
import './LightController.css'

export function LightController(): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const gl = useWebGLContext({ canvasRef })
  useLightControls({ canvasRef })
  useLightPreviewProgram({ gl, resolution: { width: 200, height: 200 } })
  
  return (
    <canvas
      className='light-controller-canvas'
      ref={canvasRef}
      width={200}
      height={200}
    />
  )
}
