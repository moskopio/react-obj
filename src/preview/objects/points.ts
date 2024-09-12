import { getModelMatrix } from 'src/geometry/model'
import { Matrix4 } from 'src/math/m4'
import { Vec3 } from 'src/math/v3'
import { createDefaultSettings, Settings } from 'src/state/settings'
import { Geometry, Program, Object3D } from 'src/types'
import { Obj } from 'src/utils/obj/types'

export function createPointsObject(program: Program): Object3D {
  const geometry = {
    vertices:    new Float32Array(),
    normals:     new Float32Array(),
    count:       new Float32Array(),
    boundingBox: [[0, 0, 0], [0, 0, 0]] as [Vec3, Vec3]
  }
  let settings = createDefaultSettings()
  
  return { updateObj, updateSettings, getGeometry, getModel, getProgram }
  
  function updateObj(obj: Obj): void {
    const { wireframe, boundingBox } = obj
    
    const vertices = wireframe.vertices.filter((_, i) => i % 2)
    const normals = wireframe.smoothNormals.filter((_, i) => i % 2)
    
    geometry.vertices = new Float32Array(vertices.flatMap(v => v))
    geometry.normals = new Float32Array(normals.flatMap(v => v))
    geometry.count = new Float32Array(vertices.map((_, i) => i))
    geometry.count = new Float32Array(vertices.map((_, i) => i))
    geometry.boundingBox = boundingBox
  }
  
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
    return getModelMatrix(geometry.boundingBox, settings)
  }
  
  function getProgram(): Program { 
    return program
  }
}
