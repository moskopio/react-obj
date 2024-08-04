import { useContext, useEffect, useRef, useState } from "react"
import { AppContext } from "../state/context"
import { createMeshDrawer } from "../webgl/mesh/mesh"
import { Program } from "../types"
import { createOutlineDrawer } from "../webgl/outline/outline"
import { createWireframeDrawer } from "../webgl/wireframe/wireframe"
import { ObjContext } from "../state/obj"

interface Props {
  gl:         WebGLRenderingContext | null
  resolution: { width: number, height: number }
}

export function usePrograms(props: Props): void {
  const { gl, resolution } = props
  const [programs, setPrograms] = useState<Program[]>([])
  const requestId = useRef<number>()
  const { camera, settings } = useContext(AppContext)
  const { obj } = useContext(ObjContext)
  
  useEffect(() => {
    if (gl) {
      const meshDrawer = createMeshDrawer(gl)
      const outlineDrawer = createOutlineDrawer(gl)
      const wireframeDrawer = createWireframeDrawer(gl)

      const newPrograms = [...programs]
      outlineDrawer && newPrograms.push(outlineDrawer)
      wireframeDrawer && newPrograms.push(wireframeDrawer)
      meshDrawer && newPrograms.push(meshDrawer)
      
      setPrograms(newPrograms)
    }
  }, [gl])
  
  useEffect(() => {
    gl?.viewport(0, 0, resolution.width, resolution.height)
    gl?.enable(gl.DEPTH_TEST)
    gl?.enable(gl.CULL_FACE)
  }, [gl, resolution])
  
  useEffect(() => { 
    programs.forEach(p => p.setObj(obj))
  }, [gl, obj, programs])
  
  useEffect(() => { 
    programs.forEach(p => p.updateCamera(camera))
  }, [gl, programs, camera])
  
  useEffect(() => { 
    programs.forEach(p => p.updateSettings(settings))
  }, [gl, programs, settings])
  
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

