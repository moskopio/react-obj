import { getModelMatrix } from 'src/geometry/model'
import { Matrix4 } from 'src/math/m4'
import { createDefaultSettings, Settings } from 'src/state/settings'
import { Geometry, Object3D } from 'src/types'
import { Obj } from 'src/utils/obj/types'

export function createPointsObject(obj: Obj): Object3D {
  const { wireframe, boundingBox } = obj
  
  const vertices = wireframe.vertices.filter((_, i) => i % 2)
  const normals = wireframe.smoothNormals.filter((_, i) => i % 2)
  const length = vertices.length
  
  const geometry = {
    vertices: new Float32Array(vertices.flatMap(v => v)),
    normals:  new Float32Array(normals.flatMap(v => v)),
    count:    new Float32Array(vertices.map((_, i) => i / length)),
  }
  let settings = createDefaultSettings()
  
  return {getGeometry, getModel, getName, updateSettings }
  
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
    const { useFlat, useDefined } = settings.normals
    return obj.name + `${useFlat ? 'flat': 'smooth'}-${useDefined ? 'defined': ''}` 
  }
  
  function updateSettings(newSettings: Settings): void {
    settings = newSettings
  }
}
