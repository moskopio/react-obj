import { getModelMatrix } from 'src/geometry/model'
import { Matrix4 } from 'src/math/m4'
import { Vec3 } from 'src/math/v3'
import { createDefaultSettings, Settings } from 'src/state/settings'
import { Geometry, Program, Object3D } from 'src/types'
import { Obj } from 'src/utils/obj/types'

export function createMeshObject(program: Program): Object3D {
  const geometry = {
    vertices:       new Float32Array(),
    flatNormals:    new Float32Array(),
    definedNormals: new Float32Array(),
    smoothNormals:  new Float32Array(),
    count:          new Float32Array(),
    boundingBox:    [[0, 0, 0], [0, 0, 0]] as [Vec3, Vec3]
  }
  let settings = createDefaultSettings()
  
  return { updateObj, updateSettings, getGeometry, getModel, getProgram }
  
  function updateObj(obj: Obj): void {
    const { flat, boundingBox } = obj
    const { vertices, flatNormals, smoothNormals, definedNormals } = flat
    
    geometry.vertices = new Float32Array(vertices.flatMap(v => v))
    geometry.flatNormals = new Float32Array(flatNormals.flatMap(n => n))
    geometry.smoothNormals = new Float32Array(smoothNormals.flatMap(n => n))
    geometry.definedNormals = new Float32Array(definedNormals.flatMap(n => n))
    geometry.count = new Float32Array(vertices.map((_, i) => i))
    geometry.boundingBox = boundingBox
  }
  
  function updateSettings(newSettings: Settings): void {
    settings = newSettings
  }
  
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
    return getModelMatrix(geometry.boundingBox, settings)
  }
  
  function getProgram(): Program { 
    return program
  }
}
