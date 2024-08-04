import { lookAt, perspective } from "../math/projections"
import { M4, Matrix4 } from "../math/m4"
import { degToQuaternion, quaternionToRotationMatrix } from "../math/quaternion"
import { Vec3 } from "../math/v3"


const UP = [0, 1, 0] as Vec3

interface Camera {
  aspectRatio: number
  fov:         number
  zNear:       number
  zFar:        number
  target:      Vec3
  rotation:    Vec3
  position:    Vec3
}

interface CameraOutput {
  projection:     Matrix4
  view:           Matrix4
  world:          Matrix4
  cameraPosition: Vec3
}

// TODO: how come camera.rotation at lookAt is just working fine, without using any quaternians?!
// How to then apply translation?!
export function getLookAtMatrices(camera: Camera): CameraOutput {
  const quaternion = degToQuaternion(camera.rotation)
  
  // // const position = [0, 0, camera.position[2]]
  const cameraMatrix = M4.translate(quaternionToRotationMatrix(quaternion), [0, 0, camera.position[2]])
  const cameraPosition = [ cameraMatrix[12], cameraMatrix[13], cameraMatrix[14] ] as Vec3
  
  // this is interesting! but not exactly what I need!
  const lookAtMatrix = lookAt(cameraPosition, camera.target, UP)
  // const lookAtMatrix = lookAt([0, 0, 5], cameraPosition, UP)
  const projection = perspective(camera.fov, camera.aspectRatio, camera.zNear, camera.zFar)

  const view = M4.inverse(lookAtMatrix)
  const world = M4.identity()
  
  return { projection, view, world, cameraPosition }
}
