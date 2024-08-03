import { useContext, useEffect, useRef, useState } from "react"
import { AppContext } from "../state"
import { createMeshDrawer } from "../webgl/mesh/mesh"
import { Program } from "../types"
import { createOutlineDrawer } from "../webgl/outline/outline"

interface Props {
  gl:     WebGLRenderingContext | null
}

export function usePrograms(props: Props): void {
  const { gl } = props
  const [programs, setPrograms] = useState<Program[]>([])
  const requestId = useRef<number>()
  
  const {obj, rotation, position } = useContext(AppContext)
  
  useEffect(() => {
    if (gl) {
      const meshDrawer = createMeshDrawer(gl)
      const outlineDrawer = createOutlineDrawer(gl)

      const newPrograms = [...programs]
      outlineDrawer && newPrograms.push(outlineDrawer)
      meshDrawer && newPrograms.push(meshDrawer)
      
      setPrograms(newPrograms)
    }
  }, [gl])
  
  useEffect(() => { 
    programs.forEach(p => p.setObj(obj))
  }, [gl, obj, programs])
  
  
  useEffect(() => { 
    programs.forEach(p => p.updateCamera(rotation, position))
  }, [gl, rotation, position, programs])
  
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

