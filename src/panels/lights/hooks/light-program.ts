import { useContext, useEffect, useRef, useState } from "react"
import { AppContext } from "src/state/context"
import { createLightDrawer } from "../preview/light-drawer"
import { Program } from "src/types"

interface Props {
  gl:         WebGLRenderingContext | null
  resolution: { width: number, height: number }
}

export function useLightPreviewProgram(props: Props): void {
  const { gl, resolution } = props
  const [programs, setPrograms] = useState<Program[]>([])
  const requestId = useRef<number>()
  const { scene } = useContext(AppContext)
  
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
    programs.forEach(p => p.updateScene && p.updateScene(scene))
  }, [gl, programs, scene])
  
  useEffect(() => {
    return () => {
      programs.forEach(p => p.cleanup())
    }
  }, [])
  
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
