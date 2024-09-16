import { useContext, useEffect, useRef } from "react"
import { createGridObject } from "src/preview/objects/grid"
import { createMeshObject } from "src/preview/objects/mesh"
import { createOutlineObject } from "src/preview/objects/outline"
import { createPointsObject } from "src/preview/objects/points"
import { createWireframeObject } from "src/preview/objects/wireframe"
import { AppContext } from "src/state/context"
import { ObjContext } from "src/state/obj"
import { Object3D } from "src/types"

export interface Objects {
  mesh:      Object3D[]
  outline:   Object3D[]
  grid:      Object3D[]
  wireframe: Object3D[]
  points:    Object3D[]
}

interface Props { 
  gl: WebGLRenderingContext | null
}

export function useObjects(props: Props): Objects {
  const { gl } = props
  const objectsRef = useRef<Objects>(createEmptyObjects())
  const { obj } = useContext(ObjContext)
  const { settings } = useContext(AppContext)
  
  useEffect(() => {
    if (gl) {
      const objects = objectsRef.current
      objects.grid = [...objects.grid, createGridObject()]
    }
  }, [gl])
  
  useEffect(() => {
    const objects = objectsRef.current
    
    objects.mesh = [createMeshObject(obj)]
    objects.wireframe = [createWireframeObject(obj)]
    objects.outline = [createOutlineObject(obj)]
    objects.points = [createPointsObject(obj)]
  }, [gl, obj])
  
  useEffect(() => {
    const objects = objectsRef.current
    
    objects.mesh.forEach(o => o.updateSettings?.(settings))
    objects.wireframe.forEach(o => o.updateSettings?.(settings))
    objects.outline.forEach(o => o.updateSettings?.(settings))
    objects.points.forEach(o => o.updateSettings?.(settings))
  }, [obj, settings])
  
  return objectsRef.current
}

function createEmptyObjects() {
  return { mesh: [], outline: [], grid: [], wireframe: [], points: [] }
}
