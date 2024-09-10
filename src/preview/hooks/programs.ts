import { useContext, useEffect, useRef, useState } from "react"
import { AppContext } from "src/state/context"
import { ObjContext } from "src/state/obj"
import { Program } from "src/types"
import { createGridDrawer } from "../grid/grid"
import { createMeshDrawer } from "../mesh/mesh"
import { createOutlineDrawer } from "../outline/outline"
import { createPointsDrawer } from "../points/points"
import { createWireframeDrawer } from "../wireframe/wireframe"

interface Props {
  gl:         WebGLRenderingContext | null
  resolution: { width: number, height: number }
}

export function usePrograms(props: Props): void {
  const { gl, resolution } = props
  const [programs, setPrograms] = useState<Program[]>([])
  const requestId = useRef<number>()
  const { camera, settings, scene, cameraDispatch } = useContext(AppContext)
  const { obj } = useContext(ObjContext)
  
  useEffect(() => {
    if (gl) {
      const meshDrawer = createMeshDrawer(gl)
      const outlineDrawer = createOutlineDrawer(gl)
      const wireframeDrawer = createWireframeDrawer(gl)
      const pointDrawer = createPointsDrawer(gl)
      const gridDrawer = createGridDrawer(gl)

      
      const newPrograms = [...programs]
      gridDrawer && newPrograms.push(gridDrawer)
      outlineDrawer && newPrograms.push(outlineDrawer)
      wireframeDrawer && newPrograms.push(wireframeDrawer)
      meshDrawer && newPrograms.push(meshDrawer)
      pointDrawer && newPrograms.push(pointDrawer)
      
      setPrograms(newPrograms)
    }
  }, [gl])
  
  useEffect(() => {
    gl?.viewport(0, 0, resolution.width, resolution.height)
    gl?.enable(gl.DEPTH_TEST)
    gl?.enable(gl.CULL_FACE)
    cameraDispatch({ type: 'set', aspectRatio: resolution.width / resolution.height })
  }, [gl, resolution])
  
  useEffect(() => {
    programs.forEach(p => p.updateObj && p.updateObj(obj))
  }, [gl, obj, programs])
  
  useEffect(() => {
    programs.forEach(p => p.updateCamera && p.updateCamera(camera))
  }, [gl, programs, camera])
  
  useEffect(() => programs.forEach(p => p.updateSettings && p.updateSettings(settings)) ,[gl, programs, settings])
  
  useEffect(() => programs.forEach(p => p.updateScene && p.updateScene(scene))
, [gl, programs, scene])
  
  useEffect(() => {
    return () => programs.forEach(p => p.cleanup())
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
