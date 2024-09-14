import { getModelMatrix } from 'src/geometry/model'
import { Matrix4 } from 'src/math/m4'
import { createDefaultSettings, Settings } from 'src/state/settings'
import { Geometry, Object3D } from 'src/types'
import { Obj } from 'src/utils/obj/types'

export function createOutlineObject(obj: Obj): Object3D {
  const { flat, boundingBox } = obj
  
  const vertices = [...flat.vertices].reverse()
  const normals = [...flat.smoothNormals].reverse()
  
  const geometry = {
    vertices: new Float32Array(vertices.flatMap(v => v)),
    normals:  new Float32Array(normals.flatMap(n => n)),
    count:    new Float32Array(vertices.map((_, i) => i)),
  }
  let settings = createDefaultSettings()
  
  return { updateSettings, getGeometry, getModel }
  
  
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
}
