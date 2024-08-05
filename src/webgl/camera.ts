import { degToRad } from "../math/angles"
import { M4, Matrix4 } from "../math/m4"
import { lookAt, perspective } from "../math/projections"
import { V3, Vec3 } from "../math/v3"


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


export function getLookAtMatrices(camera: Camera): CameraOutput {
  const cameraPosition = V3.add([0, 0, 1], camera.position)
  const cameraTarget = camera.position

  const lookAtMatrix = lookAt(cameraPosition, cameraTarget, UP)
  const projection = perspective(camera.fov, camera.aspectRatio, camera.zNear, camera.zFar)
  const view = M4.inverse(lookAtMatrix)
  
  
  // this is nor really correct! as the rotation will not take camera into the consideration!
  // const cameraMatrix = M4.translate(quaternionToRotationMatrix(quaternion), [0, 0, camera.position[2]])
  // const cameraPosition = [ cameraMatrix[12], cameraMatrix[13], cameraMatrix[14] ] as Vec3

  const yRotation = M4.axisRotation([0, 1, 0], degToRad(camera.rotation[1]))
  const xRotation = M4.axisRotation([1, 0, 0], degToRad(camera.rotation[0]))
  const world = M4.combine(xRotation, yRotation)
  
  return { projection, view, world, cameraPosition }
}
