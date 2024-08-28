import { ReactElement, useRef } from "react"
import { useWebGLContext } from "../../webgl/use-context"
import { useLightControls } from "./hooks/light-controls"
import { useLightPreviewProgram } from "./hooks/light-program"
import './LightComponent.css'

export function LightComponent(): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const gl = useWebGLContext({ canvasRef })
  useLightControls({ canvasRef })
  useLightPreviewProgram({ gl, resolution: { width: 200, height: 200 } })
  
  return (
    <canvas
      className='light-component'
      ref={canvasRef}
      width={200}
      height={200}
    />
  )
}
