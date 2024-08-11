import { Matrix4 } from "./m4"

export type Vec4 = [number, number, number, number]

export const V4 = { dot, quatFromRotationMatrix }

function dot(a: Vec4, b: Vec4): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]
}

function quatFromRotationMatrix(m: Matrix4): Vec4 {
  // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
  
  const dst: Vec4 = [0, 0, 0, 0]

  // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
  const m11 = m[0]
  const m12 = m[4]
  const m13 = m[8]
  const m21 = m[1]
  const m22 = m[5]
  const m23 = m[9]
  const m31 = m[2]
  const m32 = m[6]
  const m33 = m[10]

  const trace = m11 + m22 + m33

  if (trace > 0) {
    const s = 0.5 / Math.sqrt(trace + 1)
    dst[3] = 0.25 / s
    dst[0] = (m32 - m23) * s
    dst[1] = (m13 - m31) * s
    dst[2] = (m21 - m12) * s
  } else if (m11 > m22 && m11 > m33) {
    const s = 2 * Math.sqrt(1 + m11 - m22 - m33)
    dst[3] = (m32 - m23) / s
    dst[0] = 0.25 * s
    dst[1] = (m12 + m21) / s
    dst[2] = (m13 + m31) / s
  } else if (m22 > m33) {
    const s = 2 * Math.sqrt(1 + m22 - m11 - m33)
    dst[3] = (m13 - m31) / s
    dst[0] = (m12 + m21) / s
    dst[1] = 0.25 * s
    dst[2] = (m23 + m32) / s
  } else {
    const s = 2 * Math.sqrt(1 + m33 - m11 - m22)
    dst[3] = (m21 - m12) / s
    dst[0] = (m13 + m31) / s
    dst[1] = (m23 + m32) / s
    dst[2] = 0.25 * s
  }
  
  return dst
}
