import { degToRad } from "src/math/angles"
import { M4 } from "src/math/m4"
import { Q } from "src/math/quaternion"
import { V3, Vec3 } from "src/math/v3"
import { Light } from "src/state/scene"

export function getLightPosition(light: Light): Vec3 {
  const { rotation, distance } = light 
  
  // Rotating light around origin
  const qTheta = Q.fromAxisAngle([-1, 0, 0], degToRad(rotation.theta))
  const qPhi = Q.fromAxisAngle([0, -1, 0], degToRad(-rotation.phi))
  
  const thetaRotation = Q.toMatrix(qTheta)
  const phiRotation = Q.toMatrix(qPhi)
  
  const rotationMatrix = M4.multiply(thetaRotation, phiRotation)
  
  // Distancing light
  const lightOrientation = V3.multiply([0, 0, 1], rotationMatrix)
  const lightPosition = V3.scale(lightOrientation, distance)
  
  return lightPosition
}
