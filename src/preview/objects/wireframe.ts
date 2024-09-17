import { getModelMatrix } from 'src/geometry/model'
import { Matrix4 } from 'src/math/m4'
import { createDefaultSettings, Settings } from 'src/state/settings'
import { Geometry, Object3D } from 'src/types'
import { Obj } from 'src/utils/obj/types'

export function createWireframeObject(obj: Obj): Object3D {
  const { wireframe, boundingBox } = obj
  const { vertices, smoothNormals } = wireframe
  
  const geometry = {
    vertices: new Float32Array(vertices.flatMap(v => v)),
    normals:  new Float32Array(smoothNormals.flatMap(n => n)),
    count:    new Float32Array(vertices.map((_, i) => i)),
  }
  let settings = createDefaultSettings()
  
  return { updateSettings, getGeometry, getModel, getName }
  
  function updateSettings(newSettings: Settings): void {
    settings = newSettings
  }
  
  function getGeometry(): Geometry {
    const { vertices, normals, count } = geometry
    
    return {
      position: vertices,
      normal:   normals,
      count
    }
  }
  
  function getModel(): Matrix4 {
    return getModelMatrix(boundingBox, settings)
  }
  
  function getName(): string {
    return obj.name
  }
}
