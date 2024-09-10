import { Matrix4 } from "./m4"
import { degToRad } from "./angles"
import { V3, Vec3 } from "./v3"
import { Vec4 } from "./v4"

export const Q = {
  fromAngle,
  fromAxisAngle,
  multiply,
  toMatrix
}


function fromAngle(angles: Vec3): Vec4 {
  // Abbreviations for the various angular functions
  const roll = degToRad(angles[0])
  const pitch = degToRad(angles[1])
  const yaw = degToRad(angles[2])
  
  const cr = Math.cos(roll * 0.5)
  const sr = Math.sin(roll * 0.5)
  const cp = Math.cos(pitch * 0.5)
  const sp = Math.sin(pitch * 0.5)
  const cy = Math.cos(yaw * 0.5)
  const sy = Math.sin(yaw * 0.5)
  
  return [
  sr * cp * cy - cr * sp * sy,
  cr * sp * cy + sr * cp * sy,
  cr * cp * sy - sr * sp * cy,
  cr * cp * cy + sr * sp * sy,
  ]
}

function fromAxisAngle(axis: Vec3, angle: number): Vec4 {
  const v = V3.scale(axis, Math.sin(angle /2))
  const w = Math.cos(angle / 2)
  return [...v, w]
}

function multiply(a: Vec4, b: Vec4): Vec4 {
  const x = a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]
  const y = a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1]
  const z = a[3] * b[1] + a[1] * b[3] + a[2] * b[0] - a[0] * b[2]
  const w = a[3] * b[2] + a[2] * b[3] + a[0] * b[1] - a[1] * b[0]
  
  return [x, y, z, w]
}

function toMatrix(quaternion: Vec4): Matrix4 {
  const [x, y, z, w] = quaternion
  
  const m00 = 1 - 2 * (y * y + z * z)
  const m01 = 2 * (x * y - w * z)
  const m02 = 2 * (w * y + x * z)
  
  const m10 = 2 * (x * y + w * z)
  const m11 = 1 - 2 * (x * x + z * z)
  const m12 = 2 * (y * z - w * x)
  
  const m20 = 2 * (x * z - w * y)
  const m21 = 2 * (w * x + y * z)
  const m22 = 1 - 2 * (x * x + y * y)

  
  return [
    m00, m10, m20, 0,
    m01, m11, m21, 0,
    m02, m12, m22, 0,
      0,   0,   0, 1
  ]
}
