import { degToRad } from "src/math/angles"
import { M4 } from "src/math/m4"
import { perspective } from "src/math/projections"
import { Q } from "src/math/quaternion"
import { V3 } from "src/math/v3"
import { Light } from "src/state/scene"
import { ViewMatrices } from "src/types"

export function getLightPosition(light: Light): ViewMatrices {
  const { rotation, distance } = light 
  
  // Rotating light around origin
  const qTheta = Q.fromAxisAngle([-1, 0, 0], degToRad(rotation.theta))
  const qPhi = Q.fromAxisAngle([0, -1, 0], degToRad(-rotation.phi))
  const thetaRotation = Q.toMatrix(qTheta)
  const phiRotation = Q.toMatrix(qPhi)
  const rotationMatrix = M4.multiply(thetaRotation, phiRotation)
  
  // Distancing light
  const lightOrientation = V3.multiply([0, 0, 1], rotationMatrix)
  const lightPosition = V3.scale(lightOrientation, distance * 2)
  
  const lightToWorld = [...rotationMatrix]
  lightToWorld[12] = lightPosition[0]
  lightToWorld[13] = lightPosition[1]
  lightToWorld[14] = lightPosition[2]
  
  const projection = perspective(degToRad(90), 1, 0, 100)
  const view = M4.inverse(lightToWorld)
  
  return { projection, view, position: lightPosition }
}
