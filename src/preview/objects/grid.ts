import { M4, Matrix4 } from 'src/math/m4'
import { Geometry, Object3D } from 'src/types'

export function createGridObject(): Object3D {
  const position = new Float32Array([
    2, -1,  2,
    2, -1, -2,
   -2, -1, -2,
   -2, -1, -2,
   -2, -1,  2,
    2, -1,  2,
  ])
  const normal = new Float32Array([
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
  ])
  const count = new Float32Array([1/6, 2/6, 3/6, 4/6, 5/6, 6/6])
  
  const texture = new Float32Array([
    0, 1,
    0, 0,
    1, 0,
    0, 1,
    1, 1,
    1, 0
  ])
 
  return { getGeometry, getModel: getModelMatrix }
  
  function getGeometry(): Geometry {
    return { position, normal, count, texture }
  }
  
  function getModelMatrix(): Matrix4 {
    return M4.identity()
  }
}
