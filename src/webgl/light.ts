import { Light } from "../state/light"
import { degToRad } from "../utils/math/angles"
import { M4 } from "../utils/math/m4"
import { Q } from "../utils/math/quaternion"
import { V3, Vec3 } from "../utils/math/v3"

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
