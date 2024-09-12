import { useContext, useEffect, useRef, useState } from "react"
import { getLookAtMatrices } from "src/geometry/camera"
import { createGridProgram } from "src/preview/programs/grid"
import { createMeshProgram } from "src/preview/programs/mesh"
import { createOutlineProgram } from "src/preview/programs/outline"
import { createPointsProgram } from "src/preview/programs/points"
import { createWireframeProgram } from "src/preview/programs/wireframe"
import { AppContext } from "src/state/context"
import { ObjContext } from "src/state/obj"
import { Program, Object3D } from "src/types"
import { createGridObject } from "src/preview/objects/grid"
import { createMeshObject } from "src/preview/objects/mesh"
import { createPointsObject } from "src/preview/objects/points"
import { createWireframeObject } from "src/preview/objects/wireframe"

interface Props {
  gl: WebGLRenderingContext | null
}

interface Programs {
  mesh?:      Program
  outline?:   Program 
  grid?:      Program
  wireframe?: Program
  points?:    Program
}

export function usePrograms(props: Props): void {
  const { gl } = props
  
  const [programs, setPrograms] = useState<Programs>({})
  const [objects, setObjects] = useState<Object3D[]>([])
  
  const requestId = useRef<number>()
  const { camera, settings, scene } = useContext(AppContext)
  const { obj } = useContext(ObjContext)
  
  useEffect(() => {
    if (gl) {
      const newObjects = [...objects]
      
      const grid = createGridProgram(gl)
      const outline = createOutlineProgram(gl)
      const mesh = createMeshProgram(gl)
      const wireframe = createWireframeProgram(gl)
      const points = createPointsProgram(gl)
    
      grid && newObjects.push(createGridObject(grid))
      outline && newObjects.push(createMeshObject(outline))
      mesh && newObjects.push(createMeshObject(mesh))
      wireframe && newObjects.push(createWireframeObject(wireframe))
      points && newObjects.push(createPointsObject(points))
      
      setPrograms({ mesh, outline, grid, wireframe, points })
      setObjects(newObjects)
    }
  }, [gl])
  
  useEffect(() => {
    objects.forEach(p => p.updateObj?.(obj))
  }, [gl, obj, objects])
  
  useEffect(() => {
    const cameraValues = getLookAtMatrices(camera)
    Object.values(programs).forEach(p => p.updateCamera?.(cameraValues))
  }, [gl, programs, camera])
  
  useEffect(() => {
    Object.values(programs).forEach(p => p.updateSettings?.(settings))
  },[gl, programs, settings])
  
  useEffect(() => {
    Object.values(programs).forEach(p => p.updateScene?.(scene))
  },[gl, programs, scene])
  
  useEffect(() => {
    Object.values(programs).forEach(p => p.cleanup())
  }, [])
  
  useEffect(() => {
    draw(Date.now())
    
    return () => {
      requestId.current && cancelAnimationFrame(requestId.current)
    }
  }, [programs, draw])
  
  function draw(time: number): void {
    gl?.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    objects.forEach(o => {
      const program = o.getProgram()
      program.draw(time, o)
    })
    requestId.current = requestAnimationFrame(draw)
  }
}
