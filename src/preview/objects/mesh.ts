import { getModelMatrix } from 'src/geometry/model'
import { Matrix4 } from 'src/math/m4'
import { createDefaultSettings, Settings } from 'src/state/settings'
import { Geometry, Object3D } from 'src/types'
import { Obj } from 'src/utils/obj/types'

export function createMeshObject(obj: Obj): Object3D {
  const { flat, boundingBox } = obj
  const { vertices, flatNormals, smoothNormals, definedNormals } = flat
  
  const geometry = {
    vertices:       new Float32Array(vertices.flatMap(v => v)),
    flatNormals:    new Float32Array(flatNormals.flatMap(n => n)),
    definedNormals: new Float32Array(definedNormals.flatMap(n => n)),
    smoothNormals:  new Float32Array(smoothNormals.flatMap(n => n)),
    count:          new Float32Array(vertices.map((_, i) => i)),
  }
  let settings = createDefaultSettings()
  
  return { getGeometry, getModel, getName, updateSettings }
    
  function getGeometry(): Geometry {
    const { useFlat, useDefined } = settings.normals
    const { vertices, smoothNormals, definedNormals, flatNormals, count } = geometry
    
    const hasDefinedNormals = geometry.definedNormals.length === vertices.length
    
    const normals = useFlat
      ? flatNormals
      : useDefined && hasDefinedNormals
        ? definedNormals
        : smoothNormals
    
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
    return obj.name + `${useFlat ? '-flat': '-smooth'}-${useDefined ? '-defined': ''}`
  }
  
  function updateSettings(newSettings: Settings): void {
    settings = newSettings
  }
}
