import { degToRad } from "../math/angles"
import { M4, Matrix4 } from "../math/m4"
import { perspective } from "../math/projections"
import { quaternionToRotationMatrix, setAxisAngle } from "../math/quaternion"
import { V3, Vec3 } from "../math/v3"

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
  const { position, rotation, target } = camera 
  // 1. Tumble - rotating around Theta and Phi
  // TODO: rotation angles to theta and phi!
  const qTheta = setAxisAngle([1, 0, 0], degToRad(rotation[0]))
  const qPhi = setAxisAngle([0, 1, 0], degToRad(rotation[1]))  
  const thetaRotation = quaternionToRotationMatrix(qTheta)
  const phiRotation = quaternionToRotationMatrix(qPhi)
  const rotationMatrix = M4.multiply(thetaRotation, phiRotation)
  
  // 2. Track - move around X/Y
  const lookAt = V3.multiply(V3.add(target, [position[0], position[1], 0]), rotationMatrix)
  
  
  // 3. Dolly - move closer/further
  // todo - should be not stored in position!
  const cameraOrientation = V3.multiply([0, 0, 1], rotationMatrix)
  const cameraPosition = V3.add(lookAt, V3.scale(cameraOrientation, position[2]))
  
  const cameraToWorld = [...rotationMatrix]
  cameraToWorld[12] = cameraPosition[0]
  cameraToWorld[13] = cameraPosition[1]
  cameraToWorld[14] = cameraPosition[2]
  
  
  const projection = perspective(camera.fov, camera.aspectRatio, camera.zNear, camera.zFar)
  const view = M4.inverse(cameraToWorld)
  const world = M4.identity()
  
  return { projection, view, world, cameraPosition }
}
