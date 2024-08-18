import { ReactElement, useContext, useEffect, useRef, useState } from "react"
import { Panel } from "../components/Panel"
import { AppContext } from "../state/context"
import { PASTEL_COLORS } from "../utils/color"
import { useWebGLContext } from "../webgl/use-context"
import { useLightControls } from "./light/light-controls"
import { createLightDrawer, LightProgram } from "./light/light-drawer"
import './LightPanel.css'

export function LightPanel(): ReactElement {
  return (
    <Panel icon='light' color={PASTEL_COLORS.rainee}>
      <LightController />
    </Panel>
  )
}

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

interface Props {
  gl:         WebGLRenderingContext | null
  resolution: { width: number, height: number }
}

export function useLightPreviewProgram(props: Props): void {
  const { gl, resolution } = props
  const [programs, setPrograms] = useState<LightProgram[]>([])
  const requestId = useRef<number>()
  const { light } = useContext(AppContext)
  
  useEffect(() => {
    if (gl) {
      const lightDrawer = createLightDrawer(gl)

      const newPrograms = [...programs]
      lightDrawer && newPrograms.push(lightDrawer)
      
      setPrograms(newPrograms)
    }
  }, [gl])
  
  useEffect(() => {
    gl?.viewport(0, 0, resolution.width, resolution.height)
    gl?.enable(gl.DEPTH_TEST)
  }, [gl, resolution])
  
  useEffect(() => {
    programs.forEach(p => p.updateLight(light))
  }, [gl, programs, light])
  
  
  useEffect(() => {
    draw(Date.now())
    
    return () => {
      requestId.current && cancelAnimationFrame(requestId.current)
    }
  }, [programs, draw])
  
  function draw(time: number): void {
    gl?.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    programs.forEach(p => p.draw(time))
    requestId.current = requestAnimationFrame(draw)
  }
}
