import { Light } from "../../state/light"
import { degToRad } from "../../utils/math/angles"
import { M4, Matrix4 } from "../../utils/math/m4"
import { perspective } from "../../utils/math/projections"
import { Q } from "../../utils/math/quaternion"
import { V3 } from "../../utils/math/v3"

interface LightMatrices {
  projection: Matrix4
  view:       Matrix4
}

export function getLightMatrices(light: Light): LightMatrices {
  const { rotation, distance } = light 
  
  const qTheta = Q.fromAxisAngle([1, 0, 0], degToRad(rotation.theta))
  const qPhi = Q.fromAxisAngle([0, 1, 0], degToRad(-rotation.phi))
  const thetaRotation = Q.toMatrix(qTheta)
  const phiRotation = Q.toMatrix(qPhi)
  const rotationMatrix = M4.multiply(thetaRotation, phiRotation)
  
  const cameraOrientation = V3.multiply([0, 0, 1], rotationMatrix)
  const cameraPosition = V3.scale(cameraOrientation, distance)
  
  const cameraToWorld = [...rotationMatrix]
  cameraToWorld[12] = cameraPosition[0]
  cameraToWorld[13] = cameraPosition[1]
  cameraToWorld[14] = cameraPosition[2]
  
  
  const fov = degToRad(60)
  const aspectRatio = 1
  const zNear = 0
  const zFar = 3
  const projection = perspective(fov, aspectRatio, zNear, zFar)
  const view = M4.inverse(cameraToWorld)
  
  return { projection, view }
}
