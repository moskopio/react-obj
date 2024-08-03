import { Matrix4 } from "./m4"
import { degToRad } from "./angles"
import { Vec3 } from "./v3"
import { Vec4 } from "./v4"

export function degToQuaternion(angles: Vec3): Vec4 {
  // Abbreviations for the various angular functions
  const roll = degToRad(angles[0])
  const pitch = degToRad(angles[1])
  const yaw = degToRad(angles[2])
  
  const cr = Math.cos(roll * 0.5);
  const sr = Math.sin(roll * 0.5);
  const cp = Math.cos(pitch * 0.5);
  const sp = Math.sin(pitch * 0.5);
  const cy = Math.cos(yaw * 0.5);
  const sy = Math.sin(yaw * 0.5);
  
  return [
  sr * cp * cy - cr * sp * sy,
  cr * sp * cy + sr * cp * sy,
  cr * cp * sy - sr * sp * cy,
  cr * cp * cy + sr * sp * sy,
  ]
}

export function quaternionToRotationMatrix(quaternion: Vec4): Matrix4 {
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
  
  
  // return [
  //   m00, m01, m02, 0,
  //   m10, m11, m12, 0,
  //   m20, m21, m22, 0,
  //     0,   0,   0, 1
  // ]
  
  // return [
  //   1 - 2 * (y * y + z * z),     2 * (x * y + w * z),     2 * (x * z - w * y), 0,
  //       2 * (x * y - w * z), 1 - 2 * (x * x + z * z),     2 * (w * x + y * z), 0,
  //       2 * (w * y + x * z),     2 * (y * z - w * x), 1 - 2 * (x * x + y * y), 0,
  //                         0,                       0,                       0, 1
  // ]
}
