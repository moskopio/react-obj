import { useContext, useEffect, useRef, useState } from "react"
import { Program } from "../../types"
import { createLightDrawer } from "./light-drawer"
import { AppContext } from "../../state/context"

interface Props {
  gl:         WebGLRenderingContext | null
  resolution: { width: number, height: number }
}

export function useLightPreviewProgram(props: Props): void {
  const { gl, resolution } = props
  const [programs, setPrograms] = useState<Program[]>([])
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
    programs.forEach(p => p.updateLight && p.updateLight(light))
  }, [gl, programs, light])
  
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
