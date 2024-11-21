import { createPlane } from 'src/geometry/primitives/plane'
import { transformPrimitive } from 'src/geometry/primitives/transform'
import { M4, Matrix4 } from 'src/math/m4'
import { Geometry, Object3D } from 'src/types'

export function createGridObject(): Object3D {
  const plane = createPlane(1, 1)
  
  const translate = M4.translation([0, -1, 0])
  const scale = M4.scaling([4, 4, 4])
  const transformMatrix = M4.combine(translate, scale)
  
  const { vertices, normals, uvs } = transformPrimitive(plane, transformMatrix)
  
  const length = vertices.length
  const position = new Float32Array(vertices.flatMap(v => v))
  const normal = new Float32Array(normals.flatMap(n => n))
  const texture = new Float32Array(uvs.flatMap(uv => uv))
  
  const count = new Float32Array(vertices.map((_, i) => i / length))
 
  return { getGeometry, getModel, getName }
  
  function getGeometry(): Geometry {
    return { position, normal, count, texture }
  }
  
  function getModel(): Matrix4 {
    return M4.identity()
  }
  
  function getName(): string {
    return 'grid'
  }
}
