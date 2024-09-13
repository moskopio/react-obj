import { degToRad } from "src/math/angles"
import { M4 } from "src/math/m4"
import { perspective } from "src/math/projections"
import { Q } from "src/math/quaternion"
import { V3 } from "src/math/v3"
import { Camera } from "src/state/camera"
import { ViewMatrices } from "src/types"

export function getLookAtMatrices(camera: Camera): ViewMatrices {
  const { fov, aspectRatio, zNear, zFar, track, dolly, rotation, target } = camera 
  
  // 1. Tumble - rotating around Theta and Phi
  const qTheta = Q.fromAxisAngle([1, 0, 0], degToRad(rotation.theta))
  const qPhi = Q.fromAxisAngle([0, 1, 0], degToRad(-rotation.phi))
  const thetaRotation = Q.toMatrix(qTheta)
  const phiRotation = Q.toMatrix(qPhi)
  const rotationMatrix = M4.multiply(thetaRotation, phiRotation)
  
  // 2. Track - move around X/Y
  const lookAt = V3.multiply(V3.add(target, [-track.x, -track.y, 0]), rotationMatrix)
  
  // 3. Dolly - move closer/further
  const cameraOrientation = V3.multiply([0, 0, 1], rotationMatrix)
  const cameraPosition = V3.add(lookAt, V3.scale(cameraOrientation, dolly))
  
  const cameraToWorld = [...rotationMatrix]
  cameraToWorld[12] = cameraPosition[0]
  cameraToWorld[13] = cameraPosition[1]
  cameraToWorld[14] = cameraPosition[2]
  
  const projection = perspective(degToRad(fov), aspectRatio, zNear, zFar)
  const view = M4.inverse(cameraToWorld)
  
  return { projection, view, position: cameraPosition }
}
